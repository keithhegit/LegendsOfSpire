export const CDN_VERSION = "13.1.1";

export const CDN_URL = `https://ddragon.leagueoflegends.com/cdn/${CDN_VERSION}`;
export const LOADING_URL = "https://ddragon.leagueoflegends.com/cdn/img/champion/loading";
export const SPLASH_URL = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash";
export const ITEM_URL = `${CDN_URL}/img/item`;
export const SPELL_URL = `${CDN_URL}/img/spell`;
export const PASSIVE_URL = `${CDN_URL}/img/passive`;
export const PROFILEICON_URL = `${CDN_URL}/img/profileicon`;

export const MAP_BG_URL = "https://pub-c98d5902eedf42f6a99765dfad981fd88.r2.dev/LoL/lol-valley.jpg";
// 地图/选人场景 BGM
export const BGM_MAP_URL = "https://pub-e9a8f18bbe6141f28c8b86c4c54070e1.r2.dev/bgm/spire/To-the-Infinity%20-Castle%20(1).mp3";
// 战斗场景 BGM
export const BGM_BATTLE_URL = "https://pub-e9a8f18bbe6141f28c8b86c4c54070e1.r2.dev/bgm/spire/guimie-battle%20(1).mp3";
// 英雄语音文件基础 URL
export const VOICE_URL = "https://pub-c98d5902eedf42f6a9765dfad981fd88.r2.dev/audio/spire/vo_assets_v1";

export const STARTING_DECK_BASIC = ["Strike", "Strike", "Strike", "Strike", "Defend", "Defend", "Defend", "Defend"];

// 背景图配置 (按章节)
export const ACT_BACKGROUNDS = {
    1: "https://i.17173cdn.com/2fhnvk/YWxqaGBf/cms3/JfEzktbjDoBxmzd.jpg", // 召唤师峡谷
    2: "https://images.17173cdn.com/2014/lol/2014/08/22/Shadow_Isles_10.jpg", // 暗影之地
    3: "https://pic.upmedia.mg/uploads/content/20220519/EV220519112427593030.webp"  // 虚空之地
};

// 初始解锁英雄（普通账号）
export const DEFAULT_UNLOCKED_HEROES = ['Garen', 'LeeSin', 'Irelia'];

// 特权账号（邮箱前缀匹配）默认全英雄解锁
export const PRIVILEGED_ACCOUNTS = ['keithhe2026', 'momota'];

// 片头视频地址
export const INTRO_VIDEO_URL = 'https://pub-c98d5902eedf42f6a9765dfad981fd88.r2.dev/LoL/begin_sprite.mp4';

// 章节通关默认解锁英雄（Act1/2固定，Act3 首次德莱厄斯）
export const ACT_UNLOCK_HEROES = {
    1: 'Viktor',
    2: 'Zed',
    3: 'Darius'
};