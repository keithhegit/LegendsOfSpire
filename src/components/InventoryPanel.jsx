import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Shield, PackageSearch } from 'lucide-react';
import { CARD_DATABASE } from '../data/cards';
import { RELIC_DATABASE } from '../data/relics';

const tabs = [
    { id: 'cards', label: '卡牌牌组', icon: <Layers size={14} /> },
    { id: 'relics', label: '装备 / 英雄', icon: <Shield size={14} /> }
];

const InventoryPanel = ({ onClose, deck = [], relics = [], champion, gmConfig, currentHp, maxHp, heroSnapshot }) => {
    const [activeTab, setActiveTab] = useState('cards');

    const deckEntries = useMemo(() => {
        const counts = deck.reduce((acc, id) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts)
            .map(([id, count]) => ({ id, count, card: CARD_DATABASE[id] }))
            .filter(entry => entry.card);
    }, [deck]);

    const passiveRelic = champion ? RELIC_DATABASE[champion.relicId] : null;
    const equippedRelics = useMemo(() => {
        return relics
            .filter(rid => rid !== champion?.relicId)
            .map(id => RELIC_DATABASE[id])
            .filter(Boolean);
    }, [relics, champion]);

    const baseCritChance = champion?.id === 'Yasuo' ? 10 : 0;
    const snapshotStatus = heroSnapshot?.status || {};
    const critChanceValue = heroSnapshot?.critChance ?? baseCritChance;
    const critDamageValue = (heroSnapshot?.critDamage ?? 2) * 100;
    const manaValue = heroSnapshot?.mana ?? champion?.maxMana ?? 3;
    const blockValue = heroSnapshot?.block ?? 0;
    const heroStats = [
        { label: 'HP', value: `${heroSnapshot?.hp ?? currentHp}/${maxHp}` },
        { label: '法力', value: `${manaValue}/${champion?.maxMana ?? 3}` },
        { label: '暴击率', value: `${Math.round(critChanceValue)}%` },
        { label: '暴击伤害', value: `${Math.round(critDamageValue)}%` },
        { label: '力量', value: snapshotStatus.strength ?? champion?.baseStr ?? 0 },
        { label: '临时力量', value: snapshotStatus.tempStrength ?? 0 },
        { label: '全攻加成', value: snapshotStatus.globalAttackBonus ?? 0 },
        { label: '敏捷 (Dex)', value: snapshotStatus.dexterity ?? 0 },
        { label: '下一击加成', value: snapshotStatus.nextAttackBonus ?? 0 },
        { label: '双倍攻击', value: snapshotStatus.nextAttackDouble ? 'READY' : '-' },
        { label: '下一次技能加成', value: snapshotStatus.buffNextSkill ?? 0 },
        { label: '护甲值', value: blockValue },
        { label: '下回合护甲', value: snapshotStatus.nextTurnBlock ?? 0 },
        { label: '下回合力量', value: snapshotStatus.nextTurnStrength ?? 0 },
        { label: '下回合法力', value: snapshotStatus.nextTurnMana ?? 0 },
        { label: '额外抽牌', value: snapshotStatus.nextDrawBonus ?? 0 },
        { label: '易伤', value: snapshotStatus.vulnerable ?? 0 },
        { label: '虚弱', value: snapshotStatus.weak ?? 0 },
        { label: '中毒', value: snapshotStatus.poison ?? 0 },
        { label: '流血', value: snapshotStatus.bleed ?? 0 },
        { label: '标记', value: snapshotStatus.mark ?? 0 },
        { label: '吸血', value: snapshotStatus.lifesteal ?? 0 },
        { label: '反伤', value: snapshotStatus.reflectDamage ?? 0 },
        { label: '回蓝', value: snapshotStatus.regenMana ?? 0 }
    ];

    const gmBanner = gmConfig?.enabled ? (
        <div className="text-[11px] text-emerald-200 bg-emerald-900/30 border border-emerald-600/60 rounded px-3 py-2 mb-3 leading-relaxed">
            <div className="font-semibold tracking-[0.3em]">GM MODE</div>
            <div>注入：{gmConfig.extraCards?.length ? gmConfig.extraCards.join(', ') : '无'}</div>
            <div>起手：{gmConfig.forceTopCards?.length ? gmConfig.forceTopCards.join(', ') : '无'}</div>
            {gmConfig.note && <div>备注：{gmConfig.note}</div>}
        </div>
    ) : null;

    const renderCardsTab = () => (
        <div className="flex-1 overflow-y-auto space-y-3">
            {gmBanner}
            <div className="text-xs text-slate-400 tracking-widest">共 {deck.length} 张卡牌</div>
            <div className="grid grid-cols-1 gap-3">
                {deckEntries.map(({ id, count, card }) => (
                    <div key={id} className="flex items-center justify-between px-3 py-2 bg-slate-900/70 border border-slate-700 rounded-lg">
                        <div>
                            <div className="text-sm text-[#F0E6D2] font-semibold flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#C8AA6E]/20 text-[#C8AA6E]">{card.cost}</span>
                                {card.name}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-2">{card.description}</div>
                        </div>
                        <div className="text-sm text-[#C8AA6E] font-bold">x{count}</div>
                    </div>
                ))}
                {deckEntries.length === 0 && (
                    <div className="text-center text-slate-500 text-sm py-6">暂无卡牌数据</div>
                )}
            </div>
        </div>
    );

    const renderRelicsTab = () => (
        <div className="flex-1 overflow-y-auto space-y-4 text-slate-200">
            {champion ? (
                <>
                    <div className="flex items-center gap-3">
                        <img src={champion.img} alt={champion.name} className="w-14 h-14 rounded-full border border-[#C8AA6E]" />
                        <div>
                            <div className="text-lg font-bold text-[#F0E6D2]">{champion.name}</div>
                            <div className="text-xs text-slate-400">{champion.title}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {heroStats.map(stat => (
                            <div key={stat.label} className="bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-center">
                                <div className="text-[11px] text-slate-400 uppercase tracking-[0.4em]">{stat.label}</div>
                                <div className="text-sm text-white font-bold">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 tracking-[0.3em] mb-1">英雄简介</div>
                        <p className="text-sm text-slate-200 leading-relaxed">{champion.description || '暂无描述'}</p>
                    </div>
                </>
            ) : (
                <div className="text-center text-slate-500 text-sm py-6">未选择英雄</div>
            )}
            <div>
                <div className="text-xs text-slate-400 uppercase tracking-[0.4em] mb-2">英雄被动</div>
                {passiveRelic ? (
                    <div className="p-3 border border-amber-500/40 rounded-lg bg-amber-500/5 text-amber-100">
                        <div className="font-semibold text-sm">{passiveRelic.name}</div>
                        <div className="text-xs text-amber-200/80">{passiveRelic.description}</div>
                    </div>
                ) : (
                    <div className="text-xs text-slate-500">未找到被动信息</div>
                )}
            </div>
            <div>
                <div className="text-xs text-slate-400 uppercase tracking-[0.4em] mb-2">已获取装备 / 遗物</div>
                <div className="space-y-3">
                    {equippedRelics.length > 0 ? (
                        equippedRelics.map((relic, idx) => (
                            <div key={`${relic.id}-${idx}`} className="flex gap-3 p-3 border border-slate-700 rounded-lg bg-slate-900/60">
                                <img src={relic.img} alt={relic.name} className="w-10 h-10 rounded border border-slate-600 object-cover" />
                                <div>
                                    <div className="text-sm text-white font-semibold">{relic.name}</div>
                                    <div className="text-[11px] text-slate-400">{relic.description}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-slate-500">暂无额外装备</div>
                    )}
                </div>
            </div>
            {gmBanner}
        </div>
    );

    const renderTab = () => {
        return activeTab === 'cards' ? renderCardsTab() : renderRelicsTab();
    };

    return (
        <div className="fixed inset-0 z-[210]">
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
            <AnimatePresence>
                <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-0 h-full w-full max-w-[360px] bg-[#0a0f1c] border-l border-slate-700 shadow-2xl flex flex-col"
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 bg-slate-900/70">
                        <div className="text-sm text-[#C8AA6E] tracking-[0.5em] flex items-center gap-2">
                            <PackageSearch size={16} /> 背包系统
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="flex items-center border-b border-slate-800 px-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-3 text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-2 ${
                                    activeTab === tab.id
                                        ? 'text-[#C8AA6E] border-b-2 border-[#C8AA6E]'
                                        : 'text-slate-500 border-b-2 border-transparent hover:text-slate-200'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 px-4 py-4 overflow-hidden flex flex-col">{renderTab()}</div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default InventoryPanel;

