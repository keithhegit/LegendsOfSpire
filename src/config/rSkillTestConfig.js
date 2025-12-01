export const R_SKILL_TEST = {
    /**
     * 将 enabled 切换为 false 即可关闭所有 GM 注入逻辑，恢复正常流程。
     */
    enabled: true,

    /**
     * 指定要测试的英雄。留空（null）则所有英雄都会应用配置。
     */
    heroId: 'Riven',

    /**
     * 进入冒险时强行塞入到该英雄的初始牌堆中（可重复配置同一张卡）。
     * 例如 ['RivenR', 'RivenR'] 能让 QA 在第一场战斗前就拥有两张 R 技能。
     */
    extraCards: ['RivenR', 'RivenR'],

    /**
     * 战斗开始前强制将这些卡牌放到牌堆顶端，保证起手抽到。
     * 排序自上而下执行，因此 ['RivenR'] 会把第一张牌替换为 R 技能。
     */
    forceTopCards: ['RivenR'],

    /**
     * 方便在 HUD 中提示 QA 当前 GM 配置的备注信息。
     */
    note: 'GM: 瑞文 R 起手测试'
};

