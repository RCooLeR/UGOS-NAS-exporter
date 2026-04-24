import { mdiChartLine, mdiDatabase, mdiHexagonMultipleOutline } from '@mdi/js';
import {
  siGitea,
  siGrafana,
  siHomeassistant,
  siJellyfin,
  siMysql,
  siNginx,
  siQbittorrent,
  siUptimekuma
} from 'simple-icons';
import gorentLogoUrl from './assets/gorent-logo.svg';
import { THEME_COLORS } from './theme';
import ugreenLogoUrl from './assets/ugreen-logo.svg';

export type ProjectLogo =
  | {
      kind: 'path';
      path: string;
      color: string;
      viewBox?: string;
      background?: string;
    }
  | {
      kind: 'inline-svg';
      svg: string;
      background?: string;
    }
  | {
      kind: 'image';
      src?: string;
      alt: string;
      background?: string;
      fallback?: NonImageProjectLogo;
    };

type NonImageProjectLogo = Extract<ProjectLogo, { kind: 'path' | 'inline-svg' }>;

const iconBackground = 'linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))';

const pathLogo = (path: string, color: string): NonImageProjectLogo => ({
  kind: 'path',
  path,
  color,
  viewBox: '0 0 24 24',
  background: iconBackground
});

const imageLogo = (src: string | undefined, alt: string, fallback?: NonImageProjectLogo): ProjectLogo => ({
  kind: 'image',
  src,
  alt,
  fallback,
  background: iconBackground
});

const inlineLogo = (svg: string): NonImageProjectLogo => ({
  kind: 'inline-svg',
  svg,
  background: iconBackground
});

const fallbackGlyph: NonImageProjectLogo = pathLogo(mdiChartLine, THEME_COLORS.softBlue);

export const fallbackProjectLogo: ProjectLogo = fallbackGlyph;

export const projectLogos: Record<string, ProjectLogo> = {
  gitea: pathLogo(siGitea.path, `#${siGitea.hex}`),
  grafana: pathLogo(siGrafana.path, `#${siGrafana.hex}`),
  go_back_db: pathLogo(siMysql.path, `#${siMysql.hex}`),
  gorent: imageLogo(gorentLogoUrl, 'GoRent logo', fallbackGlyph),
  'home-assistant': pathLogo(siHomeassistant.path, `#${siHomeassistant.hex}`),
  home_assistant: pathLogo(siHomeassistant.path, `#${siHomeassistant.hex}`),
  jellyfin: pathLogo(siJellyfin.path, `#${siJellyfin.hex}`),
  kuma: pathLogo(siUptimekuma.path, `#${siUptimekuma.hex}`),
  kuma_monitoring: pathLogo(siUptimekuma.path, `#${siUptimekuma.hex}`),
  monitoring: pathLogo(siGrafana.path, `#${siGrafana.hex}`),
  'uptime-kuma': pathLogo(siUptimekuma.path, `#${siUptimekuma.hex}`),
  uptime_kuma: pathLogo(siUptimekuma.path, `#${siUptimekuma.hex}`),
  nas: imageLogo(
    ugreenLogoUrl,
    'UGREEN logo',
    inlineLogo(`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="${THEME_COLORS.cyan}" d="${mdiHexagonMultipleOutline}"></path>
      </svg>
    `)
  ),
  torrent: pathLogo(siQbittorrent.path, `#${siQbittorrent.hex}`),
  webserver: pathLogo(siNginx.path, `#${siNginx.hex}`)
};

export const dockerTotalsLogo: ProjectLogo = pathLogo(mdiDatabase, THEME_COLORS.softBlue);
