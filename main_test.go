package main

import "testing"

func TestPreferredHostName(t *testing.T) {
	t.Run("uses override when configured", func(t *testing.T) {
		got := preferredHostName("cf9daa96a680", "ugreen-nas")
		if got != "ugreen-nas" {
			t.Fatalf("preferredHostName() = %q, want %q", got, "ugreen-nas")
		}
	})

	t.Run("keeps collected hostname when override is empty", func(t *testing.T) {
		got := preferredHostName("ugreen-nas", "   ")
		if got != "ugreen-nas" {
			t.Fatalf("preferredHostName() = %q, want %q", got, "ugreen-nas")
		}
	})
}
