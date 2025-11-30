import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, Shield, Sword, Zap, BookOpen, User, Hexagon, Layers, Info, Skull } from 'lucide-react';
import { CARD_DATABASE } from '../data/cards';
import { RELIC_DATABASE } from '../data/relics';

// 效果词条
const EFFECT_GLOSSARY = [
    { id: 'VULNERABLE', name: 'Vulnerable', icon: <Zap className="text-yellow-400" />, desc: 'Target takes 50% more damage while this is active.' },
    { id: 'WEAK', name: 'Weak', icon: <Shield className="text-blue-400" />, desc: 'Enemy deals 25% less damage on its next attack.' },
    { id: 'STUN', name: 'Stun', icon: <Zap className="text-purple-400" />, desc: 'Prevents the enemy from acting for one turn.' },
    { id: 'BLEED', name: 'Bleed', icon: <Sword className="text-red-500" />, desc: 'Deals damage over time at the end of each turn.' },
    { id: 'POISON', name: 'Poison', icon: <Skull className="text-green-500" />, desc: 'Stacks damage that triggers every turn until the stack decays.' },
    { id: 'BLOCK', name: 'Block', icon: <Shield className="text-blue-300" />, desc: 'Absorbs incoming damage before HP is reduced.' },
    { id: 'STRENGTH', name: 'Strength', icon: <Sword className="text-red-400" />, desc: 'Increases the damage of all attack cards.' },
    { id: 'MULTI_HIT', name: 'Multi Hit', icon: <Layers className="text-orange-400" />, desc: 'Card hits multiple times; each strike benefits from buffs.' },
    { id: 'CRIT', name: 'Critical', icon: <Zap className="text-yellow-500" />, desc: 'A critical strike deals double damage.' },
    { id: 'DEATHMARK', name: 'Death Mark', icon: <Skull className="text-red-600" />, desc: 'Stores damage dealt for a few turns, then releases it in a burst.' },
];

const CollectionSystem = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('CARDS'); // CARDS, HEROES, RELICS, EFFECTS
    const [searchTerm, setSearchTerm] = useState('');
    const [filterHero, setFilterHero] = useState('ALL');
    const [filterRarity, setFilterRarity] = useState('ALL');

    // 鏁版嵁澶勭悊
    const allCards = useMemo(() => Object.values(CARD_DATABASE), []);
    const allRelics = useMemo(() => Object.values(RELIC_DATABASE), []);
    const allHeroes = useMemo(
        () => [
            "Garen", "Darius", "Lux", "Jinx", "Yasuo", "Sona", "Ekko", "Sylas", "Urgot", "Viktor",
            "Riven", "TwistedFate", "LeeSin", "Vayne", "Teemo", "Zed", "Nasus", "Irelia", "Thresh", "Katarina"
        ],
        []
    );

    // 杩囨护鍗＄墝
    const filteredCards = useMemo(() => {
        return allCards.filter(card => {
            const matchSearch = card.name.includes(searchTerm) || card.description.includes(searchTerm);
            const matchHero = filterHero === 'ALL' || card.hero === filterHero;
            const matchRarity = filterRarity === 'ALL' || card.rarity === filterRarity;
            return matchSearch && matchHero && matchRarity;
        });
    }, [allCards, searchTerm, filterHero, filterRarity]);

    // 娓叉煋鍗＄墝
    const renderCard = (card) => (
        <motion.div
            key={card.id}
            layoutId={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group w-48 h-64 bg-slate-900/80 border border-amber-500/30 rounded-lg overflow-hidden hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-300"
        >
            {/* 鍗＄墝鍥剧墖 */}
            <div className="h-32 overflow-hidden bg-black">
                <img src={card.img} alt={card.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            {/* 鍗＄墝淇℃伅 */}
            <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-amber-100 font-bold text-sm truncate">{card.name}</h3>
                    <span className="text-xs text-amber-500 font-mono">{card.cost} Mana</span>
                </div>
                <div className="text-[10px] text-slate-400 mb-2 flex gap-2">
                    <span className={`uppercase ${getRarityColor(card.rarity)}`}>{card.rarity}</span>
                    <span className="uppercase text-slate-500">{card.type}</span>
                </div>
                <p className="text-xs text-slate-300 leading-tight line-clamp-3">{card.description}</p>
            </div>
        </motion.div>
    );

    // 娓叉煋閬楃墿
    const renderRelic = (relic) => (
        <motion.div
            key={relic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
        >
            <div className="w-16 h-16 rounded border border-amber-500/50 overflow-hidden shrink-0">
                <img src={relic.img} alt={relic.name} className="w-full h-full object-cover" />
            </div>
            <div>
                <h3 className="text-amber-200 font-bold">{relic.name}</h3>
                <p className="text-xs text-amber-500/80 mb-1 uppercase tracking-wider">{relic.rarity}</p>
                <p className="text-sm text-slate-300">{relic.description}</p>
            </div>
        </motion.div>
    );

    // 娓叉煋鏁堟灉璇嶆潯
    const renderEffect = (effect) => (
        <motion.div
            key={effect.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 p-4 bg-slate-900/60 border border-slate-700 rounded-lg"
        >
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600">
                {effect.icon}
            </div>
            <div>
                <h3 className="text-slate-100 font-bold">{effect.name}</h3>
                <p className="text-sm text-slate-400">{effect.desc}</p>
            </div>
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-sm flex flex-col overflow-hidden font-sans"
        >
            {/* 椤堕儴瀵艰埅鏍?*/}
            <div className="h-20 border-b border-amber-500/20 bg-slate-900/80 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <BookOpen className="text-amber-400 w-8 h-8" />
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase tracking-widest">
                        Collection
                    </h1>
                </div>

                {/* 鏍囩椤靛垏鎹?*/}
                <div className="flex gap-2">
                    {['CARDS', 'HEROES', 'RELICS', 'EFFECTS'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === tab
                                    ? 'bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                        >
                            {tab}
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

            {/* 鍐呭鍖哄煙 */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-7xl mx-auto">

                    {/* 鍗＄墝绛涢€夋爮 */}
                    {activeTab === 'CARDS' && (
                        <div className="mb-8 flex flex-wrap gap-4 items-center bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search cards..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-slate-800 border-none rounded-full pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500/50 w-64"
                                />
                            </div>

                            <select
                                value={filterHero}
                                onChange={(e) => setFilterHero(e.target.value)}
                                className="bg-slate-800 border-none rounded-full px-4 py-2 text-sm text-slate-300 focus:ring-2 focus:ring-amber-500/50"
                            >
                                <option value="ALL">All Heroes</option>
                                {allHeroes.map(h => <option key={h} value={h}>{h}</option>)}
                                <option value="Neutral">Neutral</option>
                            </select>

                            <select
                                value={filterRarity}
                                onChange={(e) => setFilterRarity(e.target.value)}
                                className="bg-slate-800 border-none rounded-full px-4 py-2 text-sm text-slate-300 focus:ring-2 focus:ring-amber-500/50"
                            >
                                <option value="ALL">All Rarities</option>
                                <option value="BASIC">Basic</option>
                                <option value="COMMON">Common</option>
                                <option value="UNCOMMON">Uncommon</option>
                                <option value="RARE">Rare</option>
                            </select>

                            <div className="ml-auto text-slate-500 text-sm">
                                Showing {filteredCards.length} cards
                            </div>
                        </div>
                    )}

                    {/* 鍐呭灞曠ず */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'CARDS' && (
                            <motion.div
                                key="cards"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6"
                            >
                                {filteredCards.map(renderCard)}
                            </motion.div>
                        )}

                        {activeTab === 'HEROES' && (
                            <motion.div
                                key="heroes"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {allHeroes.map(heroId => (
                                    <div key={heroId} className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-500/30 overflow-hidden">
                                                {/* 杩欓噷搴旇鐢ㄨ嫳闆勫ご鍍忥紝鏆傛椂鐢ㄥ崰浣嶇 */}
                                                <div className="w-full h-full flex items-center justify-center text-amber-700 font-bold text-xl">
                                                    {heroId[0]}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-amber-100">{heroId}</h3>
                                                <p className="text-sm text-slate-400">Champion</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">Passive</h4>
                                            {/* 杩欓噷闇€瑕佷粠 RELIC_DATABASE 鑾峰彇琚姩淇℃伅 */}
                                            {(() => {
                                                const passiveId = `${heroId}Passive`;
                                                const passive = RELIC_DATABASE[passiveId];
                                                return passive ? (
                                                    <div className="flex gap-3 bg-slate-800/50 p-3 rounded">
                                                        <img src={passive.img} className="w-8 h-8 rounded" alt="" />
                                                        <div>
                                                            <div className="text-sm font-bold text-amber-200">{passive.name}</div>
                                                            <div className="text-xs text-slate-400">{passive.description}</div>
                                                        </div>
                                                    </div>
                                                ) : <div className="text-slate-600 text-sm">No passive data</div>;
                                            })()}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'RELICS' && (
                            <motion.div
                                key="relics"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {allRelics.filter(r => r.rarity !== 'PASSIVE').map(renderRelic)}
                            </motion.div>
                        )}

                        {activeTab === 'EFFECTS' && (
                            <motion.div
                                key="effects"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {EFFECT_GLOSSARY.map(renderEffect)}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

// 杈呭姪鍑芥暟锛氳幏鍙栫█鏈夊害棰滆壊
const getRarityColor = (rarity) => {
    switch (rarity) {
        case 'BASIC': return 'text-slate-400';
        case 'COMMON': return 'text-green-400';
        case 'UNCOMMON': return 'text-blue-400';
        case 'RARE': return 'text-amber-400';
        default: return 'text-slate-400';
    }
};

export default CollectionSystem;
