import { THEME_COLORS } from './theme';
import type {
  DockerProject,
  DockerTotals,
  DriveInfo,
  HardwareMetricCard,
  HardwareSummaryCard,
  NasDashboardModel,
  StoragePool,
  TrafficPoint
} from './types';

const gib = (value: number): number => value * 1024 ** 3;
const tib = (value: number): number => value * 1024 ** 4;
const mbit = (value: number): number => value * 1_000_000;
const gbit = (value: number): number => value * 1_000_000_000;

const series = (base: number, deltas: number[]): number[] =>
  deltas.map((delta) => Math.max(0, Number((base + delta).toFixed(3))));

const dockerProjects: DockerProject[] = [
  { key: 'gitea', title: 'Gitea', cpuPercent: 0.3925496609109711, memoryBytes: 324 * 1024 ** 2, runningContainers: 2, totalContainers: 2, status: 'up' },
  { key: 'go_back_db', title: 'Go Back DB', cpuPercent: 0, memoryBytes: 768 * 1024 ** 2, runningContainers: 3, totalContainers: 3, status: 'up' },
  { key: 'gorent', title: 'GoRent', cpuPercent: 0, memoryBytes: 412 * 1024 ** 2, runningContainers: 3, totalContainers: 3, status: 'up' },
  { key: 'home-assistant', title: 'Home Assistant', cpuPercent: 0.10272887844115354, memoryBytes: 612 * 1024 ** 2, runningContainers: 4, totalContainers: 4, status: 'up' },
  { key: 'jellyfin', title: 'Jellyfin', cpuPercent: 0.009448818897637795, memoryBytes: 256 * 1024 ** 2, runningContainers: 1, totalContainers: 1, status: 'up' },
  { key: 'kuma_monitoring', title: 'Kuma Monitoring', cpuPercent: 2.976829051619071, memoryBytes: 430 * 1024 ** 2, runningContainers: 3, totalContainers: 3, status: 'up' },
  { key: 'monitoring', title: 'Monitoring', cpuPercent: 1.8076912575738409, memoryBytes: gib(1.2), runningContainers: 9, totalContainers: 9, status: 'up' },
  { key: 'nas', title: 'NAS', cpuPercent: 0.8259763328145205, memoryBytes: 508 * 1024 ** 2, runningContainers: 3, totalContainers: 3, status: 'up' },
  { key: 'torrent', title: 'Torrent', cpuPercent: 0.07306297825467073, memoryBytes: 184 * 1024 ** 2, runningContainers: 2, totalContainers: 2, status: 'up' },
  { key: 'webserver', title: 'Webserver', cpuPercent: 1.123501622902011, memoryBytes: 736 * 1024 ** 2, runningContainers: 7, totalContainers: 7, status: 'up' }
];

const dockerTotals = (projects: DockerProject[]): DockerTotals => ({
  totalContainers: projects.reduce((total, project) => total + project.totalContainers, 0),
  runningContainers: projects.reduce((total, project) => total + project.runningContainers, 0),
  totalProjects: projects.length,
  onlineProjects: projects.filter((project) => project.status === 'up').length
});

const storagePools: StoragePool[] = [
  { name: 'Pool 1', layout: 'RAID 6 | 6 Drives', status: 'healthy', usedBytes: tib(10.2), totalBytes: tib(40.5), accent: THEME_COLORS.green },
  { name: 'Pool 2', layout: 'RAID 1 | 2 Drives (M.2)', status: 'healthy', usedBytes: tib(6.1), totalBytes: tib(8.2), accent: THEME_COLORS.purple }
];

const totalStorageBytes = storagePools.reduce((total, pool) => total + pool.totalBytes, 0);
const usedStorageBytes = storagePools.reduce((total, pool) => total + pool.usedBytes, 0);

const hardwareSummary: HardwareSummaryCard[] = [
  { kind: 'cpu', title: 'CPU', accent: THEME_COLORS.blue, valuePercent: 18, temperatureCelsius: 45, series: series(18, [-2.2, -1.8, 0.3, -0.4, 1.7, -0.9, 2.8, -2.1, 1.2, 0.4]) },
  { kind: 'ram', title: 'RAM', accent: THEME_COLORS.purple, valuePercent: 46, usedBytes: gib(14.6), totalBytes: gib(32), series: series(46, [-2.1, -0.5, 1.1, -1.4, -2.2, 1.8, 1.4, 0.2, -1.1, 1.0]) },
  { kind: 'gpu', title: 'GPU', accent: THEME_COLORS.green, valuePercent: 32, temperatureCelsius: 48, series: series(32, [-1.5, -1.1, 0.2, 2.0, 1.3, 0.4, -0.8, 1.1, 0.2, -1.9]) },
  { kind: 'system-load', title: 'System Load', accent: THEME_COLORS.softBlue, value: 0.78, statusText: 'Good', series: series(0.78, [-0.12, -0.08, 0.04, -0.03, 0.06, 0.09, -0.04, 0.05, -0.02, 0.07]) },
  { kind: 'total-storage', title: 'Total Storage', accent: THEME_COLORS.cyan, totalBytes: totalStorageBytes, usedBytes: usedStorageBytes },
  { kind: 'network', title: 'Network', accent: THEME_COLORS.green, downloadBps: gbit(1.2), uploadBps: mbit(123) }
];

const hardwareDetails: HardwareMetricCard[] = [
  {
    key: 'cpu',
    title: 'CPU',
    subtitle: 'Intel Core i5-1235U',
    accent: THEME_COLORS.blue,
    utilizationPercent: 18,
    detailRows: [
      { label: 'Cores / Threads', value: '10 / 12' },
      { label: 'Base / Boost', value: '1.3 / 4.4 GHz' },
      { label: 'Temperature', value: '45\u00B0C' },
      { label: 'Power Usage', value: '18 W' }
    ],
    series: series(18, [-2.5, -1.8, 0.1, -0.6, 1.9, 0.4, 2.8, -1.9, 1.2, 3.3, -0.8, -1.6, 0.7, -0.9, 0, 1.9, -2.4, 0.9, 0.1, 1.8, -0.7])
  },
  {
    key: 'ram',
    title: 'RAM',
    subtitle: '32 GB DDR5',
    accent: THEME_COLORS.purple,
    utilizationPercent: 46,
    detailRows: [
      { label: 'Used', value: '14.6 GB' },
      { label: 'Total', value: '32 GB' },
      { label: 'Type', value: 'DDR5' },
      { label: 'Speed', value: '4800 MT/s' }
    ],
    series: series(46, [-2.1, -1.1, 0.9, 0.1, -1.1, -2.1, -1.2, 2.1, 0.3, 1.2, 2.9, 1.1, 2.1, -1.0, 0.2, 1.0, 2.0, -1.9, -1.1, 0.2, 1.0])
  },
  {
    key: 'gpu',
    title: 'GPU',
    subtitle: 'Intel Iris Xe',
    accent: THEME_COLORS.green,
    utilizationPercent: 32,
    detailRows: [
      { label: 'VRAM Used', value: '1.6 GB' },
      { label: 'VRAM Total', value: '8.0 GB' },
      { label: 'Temperature', value: '48\u00B0C' },
      { label: 'Power Usage', value: '15 W' }
    ],
    series: series(32, [-3.8, -2.0, -1.0, 1.1, -1.0, -2.0, 2.1, 3.8, 1.0, 0.2, 2.0, -1.0, -3.0, -2.0, 1.2, 3.1, 2.0, 0.1, -1.0, 1.0, -2.0])
  }
];

const drives: DriveInfo[] = [
  { name: 'M.2 1', model: 'Lexar NM790 1TB SSD', capacityBytes: gib(931), temperatureCelsius: 40, status: 'healthy' },
  { name: 'M.2 2', model: 'Lexar NM790 1TB SSD', capacityBytes: gib(931), temperatureCelsius: 41, status: 'healthy' },
  { name: 'HDD 1', model: 'Seagate IronWolf 12TB', capacityBytes: tib(10.9), temperatureCelsius: 36, status: 'healthy' },
  { name: 'HDD 2', model: 'Seagate IronWolf 12TB', capacityBytes: tib(10.9), temperatureCelsius: 37, status: 'healthy' },
  { name: 'HDD 3', model: 'Seagate IronWolf 12TB', capacityBytes: tib(10.9), temperatureCelsius: 36, status: 'healthy' },
  { name: 'HDD 4', model: 'Seagate IronWolf 12TB', capacityBytes: tib(10.9), temperatureCelsius: 37, status: 'healthy' },
  { name: 'HDD 5', model: 'Seagate IronWolf 12TB', capacityBytes: tib(10.9), temperatureCelsius: 36, status: 'healthy' },
  { name: 'HDD 6', model: 'Seagate IronWolf 12TB', capacityBytes: tib(10.9), temperatureCelsius: 37, status: 'healthy' }
];

const networkTrafficHistory: TrafficPoint[] = [
  { timestampLabel: '14:25', totalsByInterface: { bond0: gbit(1.20), eth0: mbit(430), eth1: mbit(780) } },
  { timestampLabel: '14:25', totalsByInterface: { bond0: gbit(1.24), eth0: mbit(440), eth1: mbit(800) } },
  { timestampLabel: '14:25', totalsByInterface: { bond0: gbit(1.18), eth0: mbit(410), eth1: mbit(770) } },
  { timestampLabel: '14:26', totalsByInterface: { bond0: gbit(1.28), eth0: mbit(455), eth1: mbit(825) } },
  { timestampLabel: '14:26', totalsByInterface: { bond0: gbit(1.31), eth0: mbit(468), eth1: mbit(840) } },
  { timestampLabel: '14:26', totalsByInterface: { bond0: gbit(1.27), eth0: mbit(452), eth1: mbit(818) } },
  { timestampLabel: '14:27', totalsByInterface: { bond0: gbit(1.35), eth0: mbit(489), eth1: mbit(861) } },
  { timestampLabel: '14:27', totalsByInterface: { bond0: gbit(1.33), eth0: mbit(474), eth1: mbit(852) } },
  { timestampLabel: '14:27', totalsByInterface: { bond0: gbit(1.39), eth0: mbit(495), eth1: mbit(890) } },
  { timestampLabel: '14:28', totalsByInterface: { bond0: gbit(1.30), eth0: mbit(462), eth1: mbit(834) } },
  { timestampLabel: '14:28', totalsByInterface: { bond0: gbit(1.26), eth0: mbit(448), eth1: mbit(805) } },
  { timestampLabel: '14:29', totalsByInterface: { bond0: gbit(1.41), eth0: mbit(508), eth1: mbit(902) } },
  { timestampLabel: '14:29', totalsByInterface: { bond0: gbit(1.44), eth0: mbit(516), eth1: mbit(925) } },
  { timestampLabel: '14:30', totalsByInterface: { bond0: gbit(1.37), eth0: mbit(492), eth1: mbit(876) } },
  { timestampLabel: '14:30', totalsByInterface: { bond0: gbit(1.46), eth0: mbit(521), eth1: mbit(938) } }
];

export const fakeDashboardModel: NasDashboardModel = {
  deviceInfo: {
    model: 'DXP6800 Pro',
    ugosVersion: '1.2.0',
    hostname: 'DXP6800PRO',
    ipAddress: '192.168.1.100',
    uptimeSeconds: 12 * 24 * 3600 + 18 * 3600 + 42 * 60,
    lastUpdated: '2026-04-23 20:30'
  },
  hardwareSummary,
  hardwareDetails,
  drives,
  storagePools,
  dockerProjects,
  dockerTotals: dockerTotals(dockerProjects),
  networkInterfaces: [
    { name: 'bond0', status: 'up', linkSpeedMbps: 5000, temperatureCelsius: 38, downloadBps: mbit(620), uploadBps: mbit(580) },
    { name: 'eth0', status: 'up', linkSpeedMbps: 2500, temperatureCelsius: 37, downloadBps: mbit(240), uploadBps: mbit(190) },
    { name: 'eth1', status: 'up', linkSpeedMbps: 2500, temperatureCelsius: 39, downloadBps: mbit(380), uploadBps: mbit(400) }
  ],
  networkTrafficHistory,
  networkTrafficLines: [
    { key: 'bond0', label: 'bond0', color: THEME_COLORS.cyan, currentBps: gbit(1.46), series: networkTrafficHistory.map((point) => point.totalsByInterface.bond0) },
    { key: 'eth0', label: 'eth0', color: THEME_COLORS.good, currentBps: mbit(521), series: networkTrafficHistory.map((point) => point.totalsByInterface.eth0) },
    { key: 'eth1', label: 'eth1', color: THEME_COLORS.purple, currentBps: mbit(938), series: networkTrafficHistory.map((point) => point.totalsByInterface.eth1) }
  ]
};

export const createEmptyDashboardModel = (): NasDashboardModel => ({
  deviceInfo: {
    model: 'UGREEN NAS',
    ugosVersion: 'Unavailable',
    hostname: 'Unavailable',
    ipAddress: 'Unavailable',
    uptimeSeconds: 0,
    lastUpdated: 'Unavailable'
  },
  hardwareSummary: [
    { kind: 'cpu', title: 'CPU', accent: THEME_COLORS.blue, valuePercent: 0, temperatureCelsius: 0, series: [0, 0, 0, 0, 0, 0] },
    { kind: 'ram', title: 'RAM', accent: THEME_COLORS.purple, valuePercent: 0, usedBytes: 0, totalBytes: 0, series: [0, 0, 0, 0, 0, 0] },
    { kind: 'system-load', title: 'System Load', accent: THEME_COLORS.softBlue, value: 0, statusText: 'Unavailable', series: [0, 0, 0, 0, 0, 0] },
    { kind: 'total-storage', title: 'Total Storage', accent: THEME_COLORS.cyan, totalBytes: 0, usedBytes: 0 },
    { kind: 'network', title: 'Network', accent: THEME_COLORS.green, downloadBps: 0, uploadBps: 0 }
  ],
  hardwareDetails: [
    {
      key: 'cpu',
      title: 'CPU',
      subtitle: 'No live data',
      accent: THEME_COLORS.blue,
      utilizationPercent: 0,
      series: [0, 0, 0, 0, 0, 0],
      detailRows: [
        { label: 'Load (1m)', value: 'Unavailable' },
        { label: 'Frequency', value: 'Unavailable' },
        { label: 'Temperature', value: 'Unavailable' },
        { label: 'Uptime', value: 'Unavailable' }
      ]
    },
    {
      key: 'ram',
      title: 'RAM',
      subtitle: 'No live data',
      accent: THEME_COLORS.purple,
      utilizationPercent: 0,
      series: [0, 0, 0, 0, 0, 0],
      detailRows: [
        { label: 'Used', value: 'Unavailable' },
        { label: 'Total', value: 'Unavailable' },
        { label: 'Usage', value: 'Unavailable' },
        { label: 'Swap Used', value: 'Unavailable' }
      ]
    }
  ],
  drives: [],
  storagePools: [],
  dockerProjects: [],
  dockerTotals: {
    totalContainers: 0,
    runningContainers: 0,
    totalProjects: 0,
    onlineProjects: 0
  },
  networkInterfaces: [],
  networkTrafficHistory: [
    { timestampLabel: '', totalsByInterface: {} },
    { timestampLabel: '', totalsByInterface: {} },
    { timestampLabel: '', totalsByInterface: {} },
    { timestampLabel: '', totalsByInterface: {} },
    { timestampLabel: '', totalsByInterface: {} }
  ],
  networkTrafficLines: []
});
