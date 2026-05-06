package mqttoutput

import (
	"encoding/json"
	"fmt"
	"testing"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"

	"github.com/RCooLeR/ugos-exporter/exporter/internal/model"
)

type publishedMessage struct {
	topic    string
	qos      byte
	retained bool
	payload  string
}

type recordingClient struct {
	publishes []publishedMessage
}

func (c *recordingClient) IsConnected() bool { return true }

func (c *recordingClient) IsConnectionOpen() bool { return true }

func (c *recordingClient) Connect() mqtt.Token { return stubToken{} }

func (c *recordingClient) Disconnect(quiesce uint) {}

func (c *recordingClient) Publish(topic string, qos byte, retained bool, payload interface{}) mqtt.Token {
	c.publishes = append(c.publishes, publishedMessage{
		topic:    topic,
		qos:      qos,
		retained: retained,
		payload:  payloadString(payload),
	})
	return stubToken{}
}

func (c *recordingClient) Subscribe(topic string, qos byte, callback mqtt.MessageHandler) mqtt.Token {
	return stubToken{}
}

func (c *recordingClient) SubscribeMultiple(filters map[string]byte, callback mqtt.MessageHandler) mqtt.Token {
	return stubToken{}
}

func (c *recordingClient) Unsubscribe(topics ...string) mqtt.Token { return stubToken{} }

func (c *recordingClient) AddRoute(topic string, callback mqtt.MessageHandler) {}

func (c *recordingClient) OptionsReader() mqtt.ClientOptionsReader {
	return mqtt.NewOptionsReader(mqtt.NewClientOptions())
}

type stubToken struct{}

func (stubToken) Wait() bool { return true }

func (stubToken) WaitTimeout(time.Duration) bool { return true }

func (stubToken) Done() <-chan struct{} {
	done := make(chan struct{})
	close(done)
	return done
}

func (stubToken) Error() error { return nil }

func TestPublishSnapshotClearsDiscoveryWithoutClearingState(t *testing.T) {
	client := &recordingClient{}
	publisher := &MQTTPublisher{
		client: client,
		cfg: MQTTConfig{
			QoS:    1,
			Retain: true,
		},
		discoveredEntities: map[string]publishedEntity{
			"process:python:cpu": {
				discoveryTopic: "homeassistant/sensor/ugos_exporter_process_python/cpu_usage_percent/config",
				stateTopic:     "ugos_exporter/host/processes/python/state",
			},
		},
	}

	if err := publisher.PublishSnapshot(model.Snapshot{}); err != nil {
		t.Fatalf("PublishSnapshot returned error: %v", err)
	}

	if got := len(client.publishes); got != 1 {
		t.Fatalf("expected 1 publish, got %d", got)
	}

	msg := client.publishes[0]
	if msg.topic != "homeassistant/sensor/ugos_exporter_process_python/cpu_usage_percent/config" {
		t.Fatalf("unexpected discovery topic: %s", msg.topic)
	}
	if msg.payload != "" {
		t.Fatalf("expected empty discovery payload, got %q", msg.payload)
	}
}

func TestHealthSensorsUseUniqueEntityIDsPerSensor(t *testing.T) {
	client := &recordingClient{}
	publisher := &MQTTPublisher{
		client:             client,
		cfg:                MQTTConfig{TopicPrefix: "ugos_exporter", DiscoveryPrefix: "homeassistant"},
		availabilityTopic:  "ugos_exporter/status",
		discoveredEntities: map[string]publishedEntity{},
	}

	snapshot := model.Snapshot{
		CollectedAt: time.Date(2026, 4, 27, 23, 30, 0, 0, time.UTC),
		Host: &model.HostSnapshot{
			Name: "dxp6800_pro",
			Sensors: []model.SensorSnapshot{
				{Source: "hwmon", Chip: "coretemp", Name: "core_0", Label: "Core 0", Kind: "temperature", Value: 50},
				{Source: "hwmon", Chip: "coretemp", Name: "core_1", Label: "Core 1", Kind: "temperature", Value: 51},
			},
		},
	}

	if err := publisher.publishHost(snapshot, map[string]publishedEntity{}); err != nil {
		t.Fatalf("publishHost returned error: %v", err)
	}

	first := configPayload(t, client, publisher.discoveryTopic("sensor", "hwmon_coretemp_core_0", "temperature_celsius"))
	second := configPayload(t, client, publisher.discoveryTopic("sensor", "hwmon_coretemp_core_1", "temperature_celsius"))

	if first["unique_id"] == second["unique_id"] {
		t.Fatalf("expected unique IDs to differ, got %v", first["unique_id"])
	}
	if first["object_id"] == second["object_id"] {
		t.Fatalf("expected object IDs to differ, got %v", first["object_id"])
	}
}

func TestBondSlaveEntitiesDoNotReuseNetworkEntityIDs(t *testing.T) {
	client := &recordingClient{}
	publisher := &MQTTPublisher{
		client:             client,
		cfg:                MQTTConfig{TopicPrefix: "ugos_exporter", DiscoveryPrefix: "homeassistant"},
		availabilityTopic:  "ugos_exporter/status",
		discoveredEntities: map[string]publishedEntity{},
	}

	snapshot := model.Snapshot{
		CollectedAt: time.Date(2026, 4, 27, 23, 30, 0, 0, time.UTC),
		Host: &model.HostSnapshot{
			Name: "dxp6800_pro",
			Networks: []model.NetworkSnapshot{
				{Name: "eth0", Master: "bond0", Carrier: true, SpeedMbps: 1000},
			},
			Bonds: []model.BondSnapshot{
				{
					Name:      "bond0",
					Carrier:   true,
					SpeedMbps: 2000,
					Slaves: []model.BondSlaveSnapshot{
						{Name: "eth0", Carrier: true, SpeedMbps: 1000, Active: true},
					},
				},
			},
		},
	}

	if err := publisher.publishHost(snapshot, map[string]publishedEntity{}); err != nil {
		t.Fatalf("publishHost returned error: %v", err)
	}

	networkSpeed := configPayload(t, client, publisher.discoveryTopic("sensor", "network_eth0", "speed_mbps"))
	slaveSpeed := configPayload(t, client, publisher.discoveryTopic("sensor", "bond_bond0_slave_eth0", "speed_mbps"))
	if networkSpeed["unique_id"] == slaveSpeed["unique_id"] {
		t.Fatalf("expected network and bond slave speed unique IDs to differ, got %v", networkSpeed["unique_id"])
	}

	networkCarrier := configPayload(t, client, publisher.discoveryTopic("binary_sensor", "network_eth0", "carrier"))
	slaveCarrier := configPayload(t, client, publisher.discoveryTopic("binary_sensor", "bond_bond0_slave_eth0", "carrier"))
	if networkCarrier["unique_id"] == slaveCarrier["unique_id"] {
		t.Fatalf("expected network and bond slave carrier unique IDs to differ, got %v", networkCarrier["unique_id"])
	}
}

func configPayload(t *testing.T, client *recordingClient, topic string) map[string]any {
	t.Helper()

	for _, msg := range client.publishes {
		if msg.topic != topic {
			continue
		}

		var payload map[string]any
		if err := json.Unmarshal([]byte(msg.payload), &payload); err != nil {
			t.Fatalf("unmarshal payload for %s: %v", topic, err)
		}
		return payload
	}

	t.Fatalf("topic %s was not published", topic)
	return nil
}

func payloadString(payload interface{}) string {
	switch value := payload.(type) {
	case string:
		return value
	case []byte:
		return string(value)
	default:
		return fmt.Sprint(value)
	}
}
