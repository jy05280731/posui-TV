interface SettingsConfig {
  network?: {
    defaultTimeout?: number;
    defaultRetry?: number;
    concurrencyLimit?: number;
    isProxyEnabled?: boolean;
    proxyUrl?: string;
  };
  search?: {
    isSearchHistoryEnabled?: boolean;
    isSearchHistoryVisible?: boolean;
    maxSearchHistoryCount?: number;
  };
  playback?: {
    isViewingHistoryEnabled?: boolean;
    isViewingHistoryVisible?: boolean;
    isAutoPlayEnabled?: boolean;
    defaultEpisodeOrder?: 'asc' | 'desc';
    defaultVolume?: number;
    playerThemeColor?: string;
    maxViewingHistoryCount?: number;
    tmdbMatchCacheTTLHours?: number;
    isLoopEnabled?: boolean;
    isPipEnabled?: boolean;
    isAutoMiniEnabled?: boolean;
    isScreenshotEnabled?: boolean;
    isMobileGestureEnabled?: boolean;
    longPressPlaybackRate?: number;
    isFullscreenProgressHidden?: boolean;
  };
  system?: {
    tmdbEnabled?: boolean;
    tmdbApiBaseUrl?: string;
    tmdbImageBaseUrl?: string;
    isUpdateLogEnabled?: boolean;
    isScrollChromeAnimationEnabled?: boolean;
  };
  // 新增视频源配置
  videoSources?: Array<{
    name: string;
    url: string;
    isEnabled: boolean;
  }>;
}

export const initialConfig: SettingsConfig = {
  network: {
    defaultTimeout: 30000,
    defaultRetry: 1,
    concurrencyLimit: 5,
    isProxyEnabled: false,
    proxyUrl: '',
  },
  search: {
    isSearchHistoryEnabled: true,
    isSearchHistoryVisible: true,
    maxSearchHistoryCount: 20,
  },
  playback: {
    isViewingHistoryEnabled: true,
    isViewingHistoryVisible: true,
    isAutoPlayEnabled: true,
    defaultEpisodeOrder: 'asc',
    defaultVolume: 1,
    playerThemeColor: '#1677ff',
    maxViewingHistoryCount: 100,
    tmdbMatchCacheTTLHours: 24,
    isLoopEnabled: false,
    isPipEnabled: true,
    isAutoMiniEnabled: true,
    isScreenshotEnabled: true,
    isMobileGestureEnabled: true,
    longPressPlaybackRate: 2,
    isFullscreenProgressHidden: false,
  },
  system: {
    tmdbEnabled: true,
    tmdbApiBaseUrl: 'https://api.themoviedb.org/3',
    tmdbImageBaseUrl: 'https://image.tmdb.org/t/p',
    isUpdateLogEnabled: true,
    isScrollChromeAnimationEnabled: true,
  },
  // 这里就是你要的8个视频源，已经写死在配置里了
  videoSources: [
    {"name":"高清主源1-阿冰资源","url":"https://api.apibdzy.com/api.php/provide/vod/","isEnabled":true},
    {"name":"高清主源2-福利资源","url":"https://cj.lziapi.com/api.php/provide/vod/","isEnabled":true},
    {"name":"高清主源3-闪电资源","url":"https://sdzyapi.com/api.php/provide/vod/","isEnabled":true},
    {"name":"高清主源4-魔都资源","url":"https://www.mdzyapi.com/api.php/provide/vod/","isEnabled":true},
    {"name":"备用源1-小盒子主仓","url":"https://xhztv.top/xhz","isEnabled":true},
    {"name":"备用源2-小盒子4K仓","url":"https://xhztv.top/4k.json","isEnabled":true},
    {"name":"备用源3-暴风资源","url":"https://bfzyapi.com/api.php/provide/vod/","isEnabled":true},
    {"name":"备用源4-高天流云镜像","url":"https://raw.githubusercontent.com/gaotianliuyun/gao/master/js.json","isEnabled":true}
  ]
};
