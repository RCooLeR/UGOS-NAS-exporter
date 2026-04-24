import {
  mdiArrowDownThin,
  mdiArrowUpThin,
  mdiChip,
  mdiClockOutline,
  mdiDatabase,
  mdiEthernet,
  mdiHarddisk,
  mdiHomeOutline,
  mdiLan,
  mdiMemory,
  mdiNetworkStrength4,
  mdiServerNetwork,
  mdiSineWave,
  mdiVideo,
  mdiViewGridOutline
} from '@mdi/js';
import { html, LitElement, svg, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { buildLiveDashboardModel, emptyMetricHistoryState, type MetricHistoryState } from './live-model';
import { createEmptyDashboardModel, fakeDashboardModel } from './model';
import {
  clamp,
  formatBitsPerSecond,
  formatBytes,
  formatBytesPerSecond,
  formatPercent,
  formatProjectPercent,
  formatStorage,
  formatTemperature,
  formatUptime,
  formatUsageOfTotal,
  toPercent
} from './formatters';
import { fallbackProjectLogo, projectLogos, type ProjectLogo } from './project-logos';
import { cardStyles } from './styles';
import { THEME_COLORS } from './theme';
import type {
  CardConfig,
  DockerProject,
  DriveInfo,
  HardwareMetricCard,
  HardwareSummaryCard,
  HomeAssistantLike,
  NasDashboardModel,
  StoragePool,
  TotalStorageSummaryCard
} from './types';

const CUSTOM_CARD_TYPE = 'ugreen-nas-card';

const svgIcon = (path: string, color = 'currentColor', viewBox = '0 0 24 24') => svg`
  <svg viewBox=${viewBox} width="1em" height="1em" aria-hidden="true" focusable="false">
    <path d=${path} fill=${color}></path>
  </svg>
`;

export class UgreenNasCard extends LitElement {
  public static styles = cardStyles;

  @state() private _config?: CardConfig;
  @state() private _model: NasDashboardModel = fakeDashboardModel;
  @state() private _history: MetricHistoryState = emptyMetricHistoryState();
  @state() private _dataMode: 'preview' | 'missing' | 'live' = 'preview';

  private _hass?: HomeAssistantLike;
  private _watchEntityIds: string[] = [];
  private _watchPrefixes: string[] = [];

  public set hass(value: HomeAssistantLike | undefined) {
    const previousValue = this._hass;
    if (!this.shouldRefreshForHassUpdate(previousValue, value)) {
      this._hass = value;
      return;
    }

    this._hass = value;
    this.requestUpdate('hass', previousValue);
    this.refreshModel();
  }

  public get hass(): HomeAssistantLike | undefined {
    return this._hass;
  }

  public setConfig(config: CardConfig): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration');
    }

    this._config = {
      title: 'UGREEN DXP6800 Pro',
      accentGlow: true,
      ...config
    };

    this.refreshModel();
  }

  public getCardSize(): number {
    return 12;
  }

  public getGridOptions(): { columns: number; min_rows: number; rows: number } {
    return { columns: 12, min_rows: 8, rows: 8 };
  }

  protected render(): TemplateResult {
    return html`
      <ha-card>
        <div class="shell">
          <section class="sidebar">
            ${this.renderDeviceInfo()} ${this.renderSummaryCards()} ${this.renderSidebarNetworkInterfaces()}
          </section>
          <div class="main-column">
            ${this.renderHardwareSection()} ${this.renderStorageSection()}
          </div>
          ${this.renderDockerProjects()}
        </div>
      </ha-card>
    `;
  }

  private renderDeviceInfo(): TemplateResult {
    const { deviceInfo } = this._model;

    return html`
      <div class="panel">
        <div class="device-head">
          <div class="device-title">${this._config?.title ?? 'UGREEN DXP6800 Pro'}</div>
          <div class="info-list">
            ${this.renderInfoRow(mdiHomeOutline, 'Model', deviceInfo.model)}
            ${this.renderInfoRow(mdiClockOutline, 'Uptime', formatUptime(deviceInfo.uptimeSeconds))}
            ${this.renderInfoRow(mdiServerNetwork, 'Hostname', deviceInfo.hostname)}
            ${this.renderInfoRow(mdiClockOutline, 'Time', deviceInfo.lastUpdated)}
          </div>
        </div>
      </div>
    `;
  }

  private renderSummaryCards(): TemplateResult {
    const summaries = this._model.hardwareSummary.filter((summary) => summary.kind === 'system-load');
    if (summaries.length === 0) {
      return html``;
    }

    return html`
      <div class="sidebar-grid">
        ${summaries.map((summary) => this.renderSummaryCard(summary))}
      </div>
    `;
  }

  private renderSummaryCard(summary: HardwareSummaryCard): TemplateResult {
    const cardClass = summary.kind === 'total-storage' || summary.kind === 'network' ? 'mini-card full' : 'mini-card';

    switch (summary.kind) {
      case 'cpu':
      case 'gpu':
        return html`
          <div class=${cardClass}>
            <div class="mini-top">
              ${svgIcon(this.summaryIcon(summary.kind), summary.accent)}
              <span>${summary.title}</span>
            </div>
            <div class="mini-value">${formatPercent(summary.valuePercent)}</div>
            ${this.renderLineIndicator(summary.valuePercent, summary.accent)}
            <div class="mini-footer positive">${formatTemperature(summary.temperatureCelsius)}</div>
          </div>
        `;
      case 'ram':
        return html`
          <div class=${cardClass}>
            <div class="mini-top">
              ${svgIcon(this.summaryIcon(summary.kind), summary.accent)}
              <span>${summary.title}</span>
            </div>
            <div class="mini-value">${formatPercent(summary.valuePercent)}</div>
            ${this.renderLineIndicator(summary.valuePercent, summary.accent)}
            <div class="mini-footer">${formatUsageOfTotal(summary.usedBytes, summary.totalBytes)}</div>
          </div>
        `;
      case 'system-load':
        return html`
          <div class=${cardClass}>
            <div class="mini-top">
              ${svgIcon(this.summaryIcon(summary.kind), summary.accent)}
              <span>${summary.title}</span>
            </div>
            <div class="mini-value">${summary.value.toFixed(2)}</div>
            ${this.renderLineIndicator(this.loadIndicatorPercent(summary.value), summary.accent)}
            <div class="mini-footer positive">${summary.statusText}</div>
          </div>
        `;
      case 'total-storage':
        return html`
          <div class=${cardClass}>
            <div class="mini-top">
              ${svgIcon(this.summaryIcon(summary.kind), summary.accent)}
              <span>${summary.title}</span>
            </div>
            <div class="mini-value">${formatStorage(summary.totalBytes)}</div>
            ${this.renderStorageSummaryMeta(summary)}
          </div>
        `;
      case 'network': {
        const primaryInterface = this._model.networkInterfaces[0];
        return html`
          <div class=${cardClass}>
            <div class="mini-top">
              ${svgIcon(this.summaryIcon(summary.kind), summary.accent)}
              <span>${primaryInterface?.name ?? summary.title}</span>
            </div>
            <div class="mini-network-meta">
              <div class="mini-network-stat down">
                ${svgIcon(mdiArrowDownThin, THEME_COLORS.good)}
                <strong>${formatBitsPerSecond(primaryInterface?.downloadBps ?? summary.downloadBps)}</strong>
              </div>
              <div class="mini-network-stat up">
                ${svgIcon(mdiArrowUpThin, THEME_COLORS.purple)}
                <strong>${formatBitsPerSecond(primaryInterface?.uploadBps ?? summary.uploadBps)}</strong>
              </div>
            </div>
          </div>
        `;
      }
    }
  }

  private renderStorageSummaryMeta(summary: TotalStorageSummaryCard): TemplateResult {
    const usagePercent = toPercent(summary.usedBytes, summary.totalBytes);

    return html`
      <div class="mini-storage-meta">
        <div class="mini-footer">
          Used: ${formatStorage(summary.usedBytes)} (${formatPercent(usagePercent)})
        </div>
        <div class="mini-storage-bar">
          <span style=${`width:${usagePercent}%;`}></span>
        </div>
      </div>
    `;
  }

  private renderHardwareSection(): TemplateResult {
    return html`
      <section class="panel hardware">
        <div class="panel-title">${svgIcon(mdiChip, '#8fc1ff')} <span>Hardware</span></div>
        <div class="hardware-grid">
          ${this._model.hardwareDetails.map((metric) => this.renderHardwareCard(metric))}
        </div>
      </section>
    `;
  }

  private renderHardwareCard(metric: HardwareMetricCard): TemplateResult {
    return html`
      <div class="hardware-card">
        <div class="card-head">
          <div>
            <div class="metric-title" style=${`color:${metric.accent}`}>${metric.title}</div>
            <div class="metric-subtitle">${metric.subtitle}</div>
          </div>
          <div class="metric-value">${formatPercent(metric.utilizationPercent)}</div>
        </div>
        ${this.renderLineIndicator(metric.utilizationPercent, metric.accent)}
        <div class="detail-grid">
          ${metric.detailRows.map(
            (row) => html`<div class="detail-row"><span>${row.label}</span><strong>${row.value}</strong></div>`
          )}
        </div>
      </div>
    `;
  }

  private renderStorageSection(): TemplateResult {
    return html`
      <section class="storage">
        ${this.renderStoragePoolsSection()} ${this.renderDrivesSection()}
      </section>
    `;
  }

  private renderDrivesSection(): TemplateResult {
    return html`
      <div class="panel table-card">
        <div class="panel-title">${svgIcon(mdiHarddisk, '#8fc1ff')} <span>Drives</span></div>
        <div class="table-wrap">
          ${this._model.drives.length === 0
            ? html`<div class="empty-state">No live disk entities matched this host.</div>`
            : html`<table>
            <thead>
              <tr>
                <th>Drive</th>
                <th>Capacity</th>
                <th>I/O</th>
                <th>Temp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${this._model.drives.map((drive) => this.renderDriveRow(drive))}
            </tbody>
          </table>`}
        </div>
      </div>
    `;
  }

  private renderDriveRow(drive: DriveInfo): TemplateResult {
    return html`
      <tr>
        <td>${drive.name}</td>
        <td>${formatStorage(drive.capacityBytes)}</td>
        <td>${formatBytesPerSecond((drive.readBytesPerSecond ?? 0) + (drive.writeBytesPerSecond ?? 0))}</td>
        <td>${drive.temperatureCelsius !== undefined ? formatTemperature(drive.temperatureCelsius) : 'N/A'}</td>
        <td>${this.renderHealthChip(drive.status)}</td>
      </tr>
    `;
  }

  private renderStoragePoolsSection(): TemplateResult {
    return html`
      <div class="panel">
        <div class="panel-title">${svgIcon(mdiDatabase, '#8fc1ff')} <span>Storage Pools</span></div>
        <div class="pool-list">
          ${this._model.storagePools.length === 0
            ? html`<div class="storage-card empty-state">No live filesystem entities matched this host.</div>`
            : html`${this._model.storagePools.map((pool) => this.renderStoragePool(pool))}`}
        </div>
      </div>
    `;
  }

  private renderStoragePool(pool: StoragePool): TemplateResult {
    const usagePercent = toPercent(pool.usedBytes, pool.totalBytes);
    const statusClass = pool.status === 'healthy' ? 'health' : `health ${pool.status}`;

    return html`
      <div class="storage-card">
        <div class="pool-head">
          <div>
            <div class="pool-title">${pool.name}</div>
            <div class="pool-subtitle">${pool.layout}</div>
          </div>
          <div class=${statusClass}><span class="dot"></span>${this.statusLabel(pool.status)}</div>
        </div>
        <div class="bar">
          <span
            style=${`width:${usagePercent}%; background: linear-gradient(90deg, ${pool.accent}, ${usagePercent > 60 ? THEME_COLORS.purple : THEME_COLORS.green});`}
          ></span>
        </div>
        <div class="pool-stats">
          <div>
            <span class="label">Drives</span>
            <strong class="pool-drives-value"
              ><span class="pool-drives-dot"></span>${this.renderDriveCountValue(pool.driveCountText)}</strong
            >
          </div>
          <div><span class="label">Total</span><strong>${formatStorage(pool.totalBytes)}</strong></div>
          <div><span class="label">Free</span><strong>${formatStorage(pool.totalBytes - pool.usedBytes)}</strong></div>
          <div><span class="label">Used</span><strong>${formatStorage(pool.usedBytes)}</strong></div>
          <div><span class="label">Usage</span><strong>${formatPercent(usagePercent)}</strong></div>
        </div>
      </div>
    `;
  }

  private renderDockerProjects(): TemplateResult {
    const memoryMax = Math.max(...this._model.dockerProjects.map((item) => item.memoryBytes), 0);

    return html`
      <section class="panel docker">
        <div class="panel-title">${svgIcon(mdiViewGridOutline, '#8fc1ff')} <span>Docker Projects</span></div>
        <div class="docker-list">
          ${this._model.dockerProjects.length === 0
            ? html`<div class="empty-state">No live Docker project entities were found.</div>`
            : this._model.dockerProjects.map((project) => this.renderDockerProject(project, memoryMax))}
        </div>
      </section>
    `;
  }

  private renderDockerProject(project: DockerProject, memoryMax: number): TemplateResult {
    const cpuBarWidth = clamp(project.cpuPercent * 14, 6, 100);
    const memoryBarWidth = clamp((project.memoryBytes / Math.max(memoryMax, 1)) * 100, 8, 100);
    const statusClass = `docker-status status ${project.status}`;
    const logo = this.resolveProjectLogo(project.key);

    return html`
      <div class="docker-item">
        <div class="logo-chip" style=${`background:${logo.background ?? 'rgba(255, 255, 255, 0.04)'};`}>
          ${this.renderLogo(logo)}
        </div>
          <div>
            <div class="docker-name">${project.title}</div>
          <div class=${statusClass}>
            <span class="dot"></span>
            <span>${this.statusLabel(project.status)} ${project.runningContainers}/${project.totalContainers}</span>
          </div>
        </div>
        <div class="docker-metrics">
          <div class="metric-line">
            <span>CPU</span>
            <strong>${formatProjectPercent(project.cpuPercent)}</strong>
            <span class="metric-bar"><span style=${`width:${cpuBarWidth}%;`}></span></span>
          </div>
          <div class="metric-line">
            <span>RAM</span>
            <strong>${formatBytes(project.memoryBytes, 0)}</strong>
            <span class="metric-bar"><span style=${`width:${memoryBarWidth}%;`}></span></span>
          </div>
        </div>
      </div>
    `;
  }

  private renderSidebarNetworkInterfaces(): TemplateResult {
    return html`
      <section class="panel">
        <div class="panel-title">${svgIcon(mdiLan, '#8fc1ff')} <span>Network Interfaces</span></div>
        <div class="network-panel-body network-panel-scroll">
          ${this._model.networkInterfaces.length === 0
            ? html`<div class="empty-state">No live network interface entities were found.</div>`
            : this._model.networkInterfaces.map(
                (iface) => this.renderInterfaceCard(iface)
              )}
        </div>
      </section>
    `;
  }

  private renderInterfaceIdentity(name: string): TemplateResult {
    return html`
      <span class="health"><span class="dot"></span>${name}</span>
    `;
  }

  private renderInterfaceCard(iface: NasDashboardModel['networkInterfaces'][number]): TemplateResult {
    return html`
      <div class="iface-card">
        <div class="iface-main">
          <div class="iface-meta-block">
            <div class="iface-heading">
              <div class="iface-name">${this.renderInterfaceIdentity(iface.name)}</div>
              <strong class=${`iface-status ${iface.status}`}>${this.statusLabel(iface.status)}</strong>
            </div>
          </div>
          ${this.renderInterfaceStat('Link', this.formatLinkSpeed(iface.linkSpeedMbps))}
          ${this.renderInterfaceStat(
            'Temp',
            iface.temperatureCelsius !== undefined ? formatTemperature(iface.temperatureCelsius) : 'N/A'
          )}
          ${this.renderInterfaceStat('RX', formatBitsPerSecond(iface.downloadBps), 'down')}
          ${this.renderInterfaceStat('TX', formatBitsPerSecond(iface.uploadBps), 'up')}
        </div>
      </div>
    `;
  }

  private renderInterfaceStat(label: string, value: string, tone?: 'down' | 'up'): TemplateResult {
    return html`
      <div class=${tone ? `iface-stat ${tone}` : 'iface-stat'}>
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `;
  }

  private formatLinkSpeed(linkSpeedMbps: number | undefined): string {
    return linkSpeedMbps !== undefined ? formatBitsPerSecond(linkSpeedMbps * 1_000_000, 1) : 'N/A';
  }

  private renderLineIndicator(percent: number, accent: string): TemplateResult {
    const width = clamp(percent, 0, 100);
    return html`
      <div class="metric-indicator" aria-hidden="true">
        <span style=${`width:${width}%; background:${accent}; box-shadow:0 0 14px ${accent}55;`}></span>
      </div>
    `;
  }

  private loadIndicatorPercent(loadValue: number): number {
    return clamp(loadValue * 100, 0, 100);
  }

  private renderLogo(logo: ProjectLogo): TemplateResult {
    if (logo.kind === 'image') {
      if (logo.src) {
        return html`<img src=${logo.src} alt=${logo.alt} />`;
      }

      return logo.fallback ? this.renderLogo(logo.fallback) : this.renderLogo(fallbackProjectLogo);
    }

    if (logo.kind === 'inline-svg') {
      return html`${unsafeSVG(logo.svg)}`;
    }

    return svgIcon(logo.path, logo.color, logo.viewBox);
  }

  private renderHealthChip(status: DriveInfo['status'] | StoragePool['status']): TemplateResult {
    const statusClass = status === 'healthy' ? 'health' : `health ${status}`;
    return html`<span class=${statusClass}><span class="dot"></span>${this.statusLabel(status)}</span>`;
  }

  private renderInfoRow(icon: string, label: string, value: string): TemplateResult {
    return html`<div class="info-row">${svgIcon(icon, '#8fb9ff')} <span>${label}</span> <strong>${value}</strong></div>`;
  }

  private renderDriveCountValue(value: string | undefined): string {
    if (!value) {
      return 'N/A';
    }

    return value.replace(/^Drives\s+/i, '');
  }

  private resolveProjectLogo(projectKey: DockerProject['key']): ProjectLogo {
    const rawKey = String(projectKey).trim().toLowerCase();
    const normalizedKey = rawKey.replace(/[\s_-]+/g, '-').replace(/-+/g, '-');
    const candidates = Array.from(
      new Set([
        rawKey,
        rawKey.replace(/\s+/g, '-'),
        rawKey.replace(/\s+/g, '_'),
        rawKey.replace(/-/g, '_'),
        rawKey.replace(/_/g, '-'),
        normalizedKey,
        normalizedKey.replace(/-/g, '_')
      ])
    );

    for (const candidate of candidates) {
      const logo = projectLogos[candidate];
      if (logo) {
        return logo;
      }
    }

    const aliases: Array<[string, string]> = [
      ['grafana', 'grafana'],
      ['jellyfin', 'jellyfin'],
      ['uptime-kuma', 'uptime-kuma'],
      ['uptime_kuma', 'uptime_kuma'],
      ['kuma', 'kuma'],
      ['home-assistant', 'home-assistant'],
      ['home_assistant', 'home_assistant'],
      ['gitea', 'gitea'],
      ['qbittorrent', 'torrent'],
      ['torrent', 'torrent'],
      ['nginx', 'webserver'],
      ['mysql', 'go_back_db'],
      ['gorent', 'gorent'],
      ['nas', 'nas']
    ];

    for (const [needle, logoKey] of aliases) {
      if (candidates.some((candidate) => candidate.includes(needle))) {
        return projectLogos[logoKey] ?? fallbackProjectLogo;
      }
    }

    return fallbackProjectLogo;
  }

  private summaryIcon(kind: HardwareSummaryCard['kind']): string {
    switch (kind) {
      case 'cpu':
        return mdiChip;
      case 'ram':
        return mdiMemory;
      case 'gpu':
        return mdiVideo;
      case 'system-load':
        return mdiSineWave;
      case 'total-storage':
        return mdiDatabase;
      case 'network':
        return mdiNetworkStrength4;
      default:
        return mdiEthernet;
    }
  }

  private statusLabel(status: string): string {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'warning':
        return 'Warning';
      case 'degraded':
        return 'Degraded';
      case 'up':
        return 'Up';
      case 'partial':
        return 'Partial';
      case 'down':
        return 'Down';
      default:
        return status;
    }
  }

  private refreshModel(): void {
    const liveModel = buildLiveDashboardModel(this._hass, this._config, this._history);
    if (!liveModel) {
      if (this._hass?.states) {
        const emptyModel = createEmptyDashboardModel();
        emptyModel.deviceInfo = {
          ...emptyModel.deviceInfo,
          model: this._config?.deviceModel ?? emptyModel.deviceInfo.model,
          ugosVersion: this._config?.ugosVersion ?? emptyModel.deviceInfo.ugosVersion,
          ipAddress: this._config?.ipAddress ?? emptyModel.deviceInfo.ipAddress
        };
        this._model = emptyModel;
        this._dataMode = 'missing';
      } else {
        this._model = fakeDashboardModel;
        this._dataMode = 'preview';
      }
      this._history = emptyMetricHistoryState();
      this._watchEntityIds = [];
      this._watchPrefixes = [];
      return;
    }

    this._history = liveModel.history;
    this._watchEntityIds = liveModel.watchEntityIds;
    this._watchPrefixes = liveModel.watchPrefixes;
    this._model = liveModel.model;
    this._dataMode = 'live';
  }

  private shouldRefreshForHassUpdate(
    previousHass: HomeAssistantLike | undefined,
    nextHass: HomeAssistantLike | undefined
  ): boolean {
    const previousStates = previousHass?.states;
    const nextStates = nextHass?.states;

    if (!previousStates || !nextStates) {
      return true;
    }

    if (this._watchEntityIds.length === 0 && this._watchPrefixes.length === 0) {
      return true;
    }

    if (this.countWatchedEntities(previousStates) !== this.countWatchedEntities(nextStates)) {
      return true;
    }

    return this._watchEntityIds.some((entityId) => previousStates[entityId] !== nextStates[entityId]);
  }

  private countWatchedEntities(states: Record<string, unknown>): number {
    let count = 0;
    for (const entityId of Object.keys(states)) {
      if (this._watchPrefixes.some((prefix) => entityId.startsWith(prefix))) {
        count += 1;
      }
    }
    return count;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'ugreen-nas-card': UgreenNasCard;
  }

  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview: boolean;
      documentationURL?: string;
    }>;
  }
}

if (!customElements.get(CUSTOM_CARD_TYPE)) {
  customElements.define(CUSTOM_CARD_TYPE, UgreenNasCard);
}

window.customCards = window.customCards || [];

if (!window.customCards.some((card) => card.type === CUSTOM_CARD_TYPE)) {
  window.customCards.push({
    type: CUSTOM_CARD_TYPE,
    name: 'UGREEN NAS Card',
    description: 'Large UGREEN DXP6800 Pro monitoring card with hardware, storage, docker, and network sections.',
    preview: true,
    documentationURL: 'https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card'
  });
}
