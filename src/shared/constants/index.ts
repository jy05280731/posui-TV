// 网站默认视频源，所有用户打开都会自动加载
export const DEFAULT_VIDEO_SOURCES = [
  {"name":"高清主源1-阿冰资源","url":"https://api.apibdzy.com/api.php/provide/vod/","isEnabled":true},
  {"name":"高清主源2-福利资源","url":"https://cj.lziapi.com/api.php/provide/vod/","isEnabled":true},
  {"name":"高清主源3-闪电资源","url":"https://sdzyapi.com/api.php/provide/vod/","isEnabled":true},
  {"name":"高清主源4-魔都资源","url":"https://www.mdzyapi.com/api.php/provide/vod/","isEnabled":true},
  {"name":"备用源1-小盒子主仓","url":"https://xhztv.top/xhz","isEnabled":true},
  {"name":"备用源2-小盒子4K仓","url":"https://xhztv.top/4k.json","isEnabled":true},
  {"name":"备用源3-暴风资源","url":"https://bfzyapi.com/api.php/provide/vod/","isEnabled":true},
  {"name":"备用源4-高天流云镜像","url":"https://raw.githubusercontent.com/gaotianliuyun/gao/master/js.json","isEnabled":true}
];

// 其他常量保持不变（如果有）
export * from './countries';
