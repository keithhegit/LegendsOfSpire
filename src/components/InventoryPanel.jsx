import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Trash2, BookOpen, Coins } from 'lucide-react';
import { CARD_DATABASE } from '../data/cards';
import { RELIC_DATABASE } from '../data/relics';

const CARD_DELETE_COST = { COMMON: 50, UNCOMMON: 100, RARE: 200 };
const MAX_RELIC_SLOTS = 6;

const getHeroStats = (champion, deckSize, relicCount) => [
    { label: '最大生命', value: champion?.maxHp ?? '-' },
    { label: '最大法力', value: champion?.maxMana ?? 3 },
    { label: '基础力量', value: champion?.baseStr ?? 0 },
    { label: '基础暴击率', value: champion?.id === 'Yasuo' ? '10%' : '0%' },
    { label: '基础暴击伤害', value: '200%' },
    { label: '敏捷', value: 0 },
    { label: '牌组数量', value: deckSize },
    { label: '遗物槽位', value: `${relicCount}/${MAX_RELIC_SLOTS}` }
];

const InventoryPanel = ({
    onClose,
    deck = [],
    relics = [],
    champion,
    gold = 0,
    onRemoveCard,
    initialTab = 'CARDS',
    onTabChange,
    pendingRelic,
    onRelicReplace,
    onCancelPendingRelic
}) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchTerm, setSearchTerm] = useState('');
    const [rarityFilter, setRarityFilter] = useState('ALL');
    const [heroFilter, setHeroFilter] = useState('ALL');

    useEffect(() => {
        setActiveTab(initialTab || 'CARDS');
    }, [initialTab]);

    const changeTab = (tab) => {
        setActiveTab(tab);
        onTabChange?.(tab);
    };

    const deckEntries = useMemo(() => {
        const counts = deck.reduce((acc, id) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts)
            .map(([id, count]) => ({ id, count, card: CARD_DATABASE[id] }))
            .filter(entry => entry.card);
    }, [deck]);

    const heroOptions = useMemo(() => {
        const heroes = new Set(deckEntries.map(entry => entry.card.hero || 'Neutral'));
        return ['ALL', ...Array.from(heroes)];
    }, [deckEntries]);

    const filteredDeck = deckEntries.filter(({ card }) => {
        const matchSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchRarity = rarityFilter === 'ALL' || card.rarity === rarityFilter;
        const heroKey = card.hero || 'Neutral';
        const matchHero = heroFilter === 'ALL' || heroFilter === heroKey;
        return matchSearch && matchRarity && matchHero;
    });

    const passiveRelic = champion ? RELIC_DATABASE[champion.relicId] : null;
    const extraRelics = useMemo(
        () => (champion ? relics.filter(id => id !== champion.relicId) : relics),
        [relics, champion]
    );
    const relicSlots = useMemo(
        () => [...extraRelics, ...Array(Math.max(0, MAX_RELIC_SLOTS - extraRelics.length)).fill(null)],
        [extraRelics]
    );
    const pendingRelicData = pendingRelic ? RELIC_DATABASE[pendingRelic.id] : null;
    const heroStats = getHeroStats(champion, deck.length, extraRelics.length);

    const canDeleteCard = (card) =>
        card && card.hero === 'Neutral' && card.rarity !== 'BASIC' && CARD_DELETE_COST[card.rarity];

    const handleDelete = (cardId) => {
        const card = CARD_DATABASE[cardId];
        if (!canDeleteCard(card)) return;
        onRemoveCard?.(cardId);
    };

    const renderCardTile = ({ id, count, card }) => {
        const deletable = canDeleteCard(card);
        const cost = deletable ? CARD_DELETE_COST[card.rarity] : null;
        return (
            <motion.div
                key={id}
                layoutId={id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group w-48 h-64 bg-slate-900/80 border border-amber-500/30 rounded-lg overflow-hidden hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-300"
            >
                <div className="h-32 overflow-hidden bg-black">
                    <img src={card.img} alt={card.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-3 flex flex-col h-32">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-amber-100 font-bold text-sm truncate">{card.name}</h3>
                        <span className="text-xs text-amber-500 font-mono">{card.cost} Mana</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mb-2 flex gap-2">
                        <span className="uppercase text-green-400">{card.rarity}</span>
                        <span className="uppercase text-slate-500">{card.type}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-tight line-clamp-2 flex-1">{card.description}</p>
                    <div className="mt-auto flex items-center justify-between text-[11px] text-slate-400">
                        <span>数量 x{count}</span>
                        <button
                            disabled={!deletable}
                            onClick={() => handleDelete(id)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition ${
                                deletable ? 'bg-red-500/20 text-red-200 hover:bg-red-500/40' : 'bg-slate-700/40 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            <Trash2 size={12} />
                            {deletable ? `删除 -${cost}G` : '不可删除'}
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderCardsTab = () => (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="搜索卡牌..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-800 border-none rounded-full pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500/50 w-64"
                    />
                </div>
                <select
                    value={heroFilter}
                    onChange={(e) => setHeroFilter(e.target.value)}
                    className="bg-slate-800 border-none rounded-full px-4 py-2 text-sm text-slate-300 focus:ring-2 focus:ring-amber-500/50"
                >
                    {heroOptions.map(hero => (
                        <option key={hero} value={hero}>
                            {hero === 'Neutral' ? '中立' : hero === 'ALL' ? '所有英雄' : hero}
                        </option>
                    ))}
                </select>
                <select
                    value={rarityFilter}
                    onChange={(e) => setRarityFilter(e.target.value)}
                    className="bg-slate-800 border-none rounded-full px-4 py-2 text-sm text-slate-300 focus:ring-2 focus:ring-amber-500/50"
                >
                    <option value="ALL">全部稀有度</option>
                    <option value="COMMON">Common</option>
                    <option value="UNCOMMON">Uncommon</option>
                    <option value="RARE">Rare</option>
                </select>
                <div className="ml-auto flex items-center gap-2 text-amber-200 text-sm">
                    <Coins size={14} /> {gold} G
                </div>
            </div>
            <div className="text-xs text-slate-400 tracking-widest">共 {deck.length} 张卡牌</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredDeck.map(renderCardTile)}
                {filteredDeck.length === 0 && (
                    <div className="col-span-full text-center text-slate-500 py-8 text-sm">没有符合条件的卡牌</div>
                )}
            </div>
        </div>
    );

    const renderRelicsTab = () => (
        <div className="space-y-6">
            {champion ? (
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 flex gap-4 items-center">
                    <img src={champion.img} alt={champion.name} className="w-20 h-20 rounded-2xl border-2 border-[#C8AA6E] object-cover" />
                    <div className="flex-1 space-y-3">
                        <div>
                            <div className="text-lg font-bold text-[#F0E6D2]">{champion.name}</div>
                            <div className="text-xs text-slate-400">{champion.title}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {heroStats.map(stat => (
                                <div key={stat.label} className="bg-slate-800/60 border border-slate-700 rounded-lg p-2 text-center">
                                    <div className="text-[10px] text-slate-400 uppercase tracking-[0.3em]">{stat.label}</div>
                                    <div className="text-sm text-white font-bold">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 text-center text-slate-500">未选择英雄</div>
            )}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4">
                    <h4 className="text-xs uppercase tracking-[0.4em] text-slate-400 mb-2">英雄被动</h4>
                    {passiveRelic ? (
                        <div className="flex gap-3">
                            <img src={passiveRelic.img} alt={passiveRelic.name} className="w-12 h-12 rounded border border-amber-500/40 object-cover" />
                            <div>
                                <div className="text-sm text-amber-200 font-semibold">{passiveRelic.name}</div>
                                <div className="text-xs text-slate-300">{passiveRelic.description}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-slate-500">暂无数据</div>
                    )}
                </div>
            </div>
            {pendingRelicData && (
                <div className="bg-amber-500/10 border border-amber-400/50 rounded-xl p-4 space-y-3">
                    <div className="text-sm text-amber-200 font-semibold">新的遗物：{pendingRelicData.name}</div>
                    <p className="text-xs text-amber-100">{pendingRelicData.description}</p>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={onCancelPendingRelic}
                            className="px-3 py-1 text-xs uppercase tracking-[0.3em] border border-amber-400 rounded-full text-amber-200 hover:bg-amber-400/10"
                        >
                            放弃新遗物
                        </button>
                        <span className="text-xs text-amber-200/80">请选择一个槽位替换（上限 {MAX_RELIC_SLOTS}）。</span>
                    </div>
                </div>
            )}
            <div>
                <h4 className="text-xs uppercase tracking-[0.4em] text-slate-400 mb-3">装备槽位</h4>
                <div className="grid grid-cols-3 gap-3">
                    {relicSlots.map((slotId, idx) => {
                        const relic = slotId ? RELIC_DATABASE[slotId] : null;
                        return (
                            <div key={`slot-${idx}`} className="bg-slate-900/70 border border-slate-700 rounded-xl p-3 flex flex-col items-center text-center min-h-[130px]">
                                {relic ? (
                                    <>
                                        <img src={relic.img} alt={relic.name} className="w-12 h-12 rounded border border-slate-600 object-cover mb-2" />
                                        <div className="text-sm text-white font-semibold">{relic.name}</div>
                                        <div className="text-[11px] text-slate-400 line-clamp-2">{relic.description}</div>
                                        {pendingRelicData && (
                                            <button
                                                onClick={() => onRelicReplace?.(slotId)}
                                                className="mt-2 px-3 py-1 text-[10px] uppercase tracking-[0.3em] rounded-full bg-amber-500/20 text-amber-200 hover:bg-amber-500/40"
                                            >
                                                替换
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="text-3xl text-slate-600 mb-2">–</div>
                                        <div className="text-xs text-slate-500">空槽位</div>
                                        {pendingRelicData && (
                                            <button
                                                onClick={() => onRelicReplace?.(null)}
                                                className="mt-4 px-3 py-1 text-[10px] uppercase tracking-[0.3em] rounded-full bg-amber-500/20 text-amber-200 hover:bg-amber-500/40"
                                            >
                                                放入
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const tabs = [
        { id: 'CARDS', label: 'CARDS' },
        { id: 'RELICS', label: 'RELICS' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] bg-slate-950/95 backdrop-blur-sm flex flex-col overflow-hidden font-sans"
        >
            <div className="h-20 border-b border-amber-500/20 bg-slate-900/80 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <BookOpen className="text-amber-400 w-7 h-7" />
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase tracking-widest">
                        Inventory
                    </h1>
                </div>
                <div className="flex gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => changeTab(tab.id)}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                                activeTab === tab.id
                                    ? 'bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'CARDS' && (
                            <motion.div
                                key="inventory-cards"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {renderCardsTab()}
                            </motion.div>
                        )}
                        {activeTab === 'RELICS' && (
                            <motion.div
                                key="inventory-relics"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {renderRelicsTab()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default InventoryPanel;

