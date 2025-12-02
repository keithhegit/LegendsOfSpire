import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, X, RefreshCw, Trash2, Wand2 } from 'lucide-react';

const splitInput = (value) => value.split(/[\n,，,\s]+/).map(token => token.trim()).filter(Boolean);

const GMPanel = ({
    gmConfig,
    onChange,
    onClose,
    heroOptions,
    rSkillCards,
    cardDatabase,
    onResetSave,
    onResetConfig
}) => {
    const [extraInput, setExtraInput] = useState((gmConfig.extraCards || []).join('\n'));
    const [forceInput, setForceInput] = useState((gmConfig.forceTopCards || []).join('\n'));
    const [extraInvalid, setExtraInvalid] = useState([]);
    const [forceInvalid, setForceInvalid] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setExtraInput((gmConfig.extraCards || []).join('\n'));
        setForceInput((gmConfig.forceTopCards || []).join('\n'));
    }, [gmConfig.extraCards, gmConfig.forceTopCards]);

    const applyCardList = (value, target) => {
        const tokens = splitInput(value);
        const valid = [];
        const invalid = [];
        tokens.forEach(token => {
            if (!cardDatabase[token]) {
                if (!invalid.includes(token)) invalid.push(token);
            } else if (!valid.includes(token)) {
                valid.push(token);
            }
        });
        if (target === 'extra') {
            setExtraInvalid(invalid);
            onChange(prev => ({ ...prev, extraCards: valid }));
        } else {
            setForceInvalid(invalid);
            onChange(prev => ({ ...prev, forceTopCards: valid }));
        }
    };

    const handleAddCard = (cardId, target) => {
        onChange(prev => {
            const list = target === 'extra' ? prev.extraCards : prev.forceTopCards;
            if (list.includes(cardId)) return prev;
            if (target === 'extra') {
                return { ...prev, extraCards: [...list, cardId] };
            }
            return { ...prev, forceTopCards: [...list, cardId] };
        });
    };

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const searchResults = useMemo(() => {
        const cards = Object.values(cardDatabase);
        if (!normalizedQuery) return cards;
        return cards.filter(card => {
            const hero = card.hero?.toLowerCase() || '';
            const name = card.name?.toLowerCase() || '';
            const id = card.id?.toLowerCase() || '';
            return id.includes(normalizedQuery) || name.includes(normalizedQuery) || hero.includes(normalizedQuery);
        });
    }, [cardDatabase, normalizedQuery]);
    const limitedSearch = searchResults.slice(0, 60);

    const renderRSkillButtons = (target) => (
        <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
            {rSkillCards.map(card => (
                <button
                    key={`${target}-${card.id}`}
                    onClick={() => handleAddCard(card.id, target)}
                    className="px-2 py-1 text-[11px] rounded-full border border-amber-500/60 text-amber-100 bg-amber-500/10 hover:bg-amber-500/20 transition"
                >
                    {card.heroName} · {card.name}
                </button>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 z-[220] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl max-h-[90vh] bg-[#0b111e] border border-emerald-400/50 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.3)] flex flex-col overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20 bg-emerald-900/20">
                    <div className="flex items-center gap-3 text-emerald-100">
                        <FlaskConical className="w-6 h-6" />
                        <div>
                            <h2 className="text-lg font-bold tracking-[0.4em]">GM 控制台</h2>
                            <p className="text-xs text-emerald-200/80 tracking-widest">R 技能快速测试工具</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-100 transition">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-emerald-100 tracking-widest">GM 模式</span>
                                <button
                                    onClick={() => onChange(prev => ({ ...prev, enabled: !prev.enabled }))}
                                    className={`px-4 py-1 rounded-full text-xs font-bold tracking-[0.3em] ${gmConfig.enabled ? 'bg-emerald-500 text-emerald-950' : 'bg-slate-700 text-slate-200'}`}
                                >
                                    {gmConfig.enabled ? 'ON' : 'OFF'}
                                </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] text-slate-300 tracking-widest">目标英雄</label>
                                <select
                                    value={gmConfig.heroId}
                                    onChange={(e) => onChange(prev => ({ ...prev, heroId: e.target.value }))}
                                    className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white"
                                >
                                    <option value="">全部英雄（默认）</option>
                                    {heroOptions.map(hero => (
                                        <option key={hero.id} value={hero.id}>{hero.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] text-slate-300 tracking-widest">HUD 备注</label>
                                <input
                                    value={gmConfig.note}
                                    onChange={(e) => onChange(prev => ({ ...prev, note: e.target.value }))}
                                    maxLength={60}
                                    className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white"
                                    placeholder="例如：瑞文 R 起手测试"
                                />
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                            <h3 className="text-sm text-emerald-100 tracking-widest flex items-center gap-2"><Wand2 size={14} /> 快捷操作</h3>
                            <div className="flex flex-wrap gap-3 text-[11px] text-slate-300 leading-relaxed">
                                <span>1. 打开 GM 面板并启用 GM 模式；</span>
                                <span>2. 选择目标英雄 + R 技能预设；</span>
                                <span>3. 点击 “清空存档” 按钮 → 重新选人；</span>
                                <span>4. 起手手牌会自动给出强制卡；</span>
                                <span>5. 验证完毕后关闭 GM 模式。</span>
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm text-white tracking-widest">额外注入卡牌</h4>
                                <button onClick={() => { setExtraInput(''); setExtraInvalid([]); onChange(prev => ({ ...prev, extraCards: [] })); }} className="text-xs text-slate-300 hover:text-white flex items-center gap-1">
                                    <Trash2 size={12} /> 清空
                                </button>
                            </div>
                            <textarea
                                value={extraInput}
                                onChange={(e) => {
                                    setExtraInput(e.target.value);
                                    applyCardList(e.target.value, 'extra');
                                }}
                                placeholder="每行输入一个卡牌 ID，例如 RivenR"
                                className="mt-2 w-full min-h-[120px] bg-slate-950 border border-slate-700 rounded p-3 text-sm text-white"
                            />
                            {extraInvalid.length > 0 && (
                                <div className="text-xs text-red-400 mt-2">
                                    无效 ID: {extraInvalid.join(', ')}
                                </div>
                            )}
                            {renderRSkillButtons('extra')}
                        </div>
                        <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm text-white tracking-widest">起手强制卡牌</h4>
                                <button onClick={() => { setForceInput(''); setForceInvalid([]); onChange(prev => ({ ...prev, forceTopCards: [] })); }} className="text-xs text-slate-300 hover:text-white flex items-center gap-1">
                                    <Trash2 size={12} /> 清空
                                </button>
                            </div>
                            <textarea
                                value={forceInput}
                                onChange={(e) => {
                                    setForceInput(e.target.value);
                                    applyCardList(e.target.value, 'force');
                                }}
                                placeholder="将这些卡固定在起手手牌"
                                className="mt-2 w-full min-h-[120px] bg-slate-950 border border-slate-700 rounded p-3 text-sm text-white"
                            />
                            {forceInvalid.length > 0 && (
                                <div className="text-xs text-red-400 mt-2">
                                    无效 ID: {forceInvalid.join(', ')}
                                </div>
                            )}
                            {renderRSkillButtons('force')}
                        </div>
                    </section>

                    <section className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm text-white tracking-widest">卡牌库调试</h4>
                                <p className="text-xs text-slate-400">搜索或浏览任意卡牌并一键加入额外注入 / 起手列表。</p>
                            </div>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
                                aria-label="清除搜索"
                            >
                                清空
                            </button>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="输入卡牌 ID、名称或英雄"
                            aria-label="卡牌检索"
                            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:ring-emerald-400/40 focus:border-emerald-400"
                        />
                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-800">
                            {limitedSearch.map(card => {
                                const isExtra = gmConfig.extraCards.includes(card.id);
                                const isForce = gmConfig.forceTopCards.includes(card.id);
                                return (
                                    <div key={card.id} className="flex flex-col gap-1 py-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{card.id}</p>
                                                <p className="text-sm text-white">{card.name}</p>
                                                <p className="text-xs text-slate-500">{card.hero} · {card.rarity} · {card.type}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    aria-label={`注入 ${card.name}`}
                                                    onClick={() => handleAddCard(card.id, 'extra')}
                                                    className={`px-2 py-1 text-[11px] rounded border ${isExtra ? 'border-emerald-400/60 text-emerald-200' : 'border-white/30 text-white hover:border-emerald-400 hover:text-emerald-200'} transition`}
                                                >
                                                    注入
                                                </button>
                                                <button
                                                    aria-label={`设置 ${card.name} 起手`}
                                                    onClick={() => handleAddCard(card.id, 'force')}
                                                    className={`px-2 py-1 text-[11px] rounded border ${isForce ? 'border-sky-400/60 text-sky-200' : 'border-white/30 text-white hover:border-sky-400 hover:text-sky-200'} transition`}
                                                >
                                                    起手
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {limitedSearch.length === 0 && (
                                <p className="text-xs text-slate-500 italic py-2">无匹配结果，尝试其他关键词。</p>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">
                            展示 {Math.min(limitedSearch.length, 60)} / {searchResults.length} 条结果 (最多 60 条)。
                        </p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                            <button
                                onClick={onResetConfig}
                                className="w-full flex items-center justify-center gap-2 rounded-full border border-amber-400 text-amber-200 py-2 text-xs tracking-[0.4em] hover:bg-amber-400/10 transition"
                            >
                                <RefreshCw size={14} /> 恢复默认配置
                            </button>
                            <button
                                onClick={onResetSave}
                                className="w-full flex items-center justify-center gap-2 rounded-full border border-red-500 text-red-200 py-2 text-xs tracking-[0.4em] hover:bg-red-500/10 transition"
                            >
                                <Trash2 size={14} /> 清空 GM 存档
                            </button>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <h4 className="text-sm text-emerald-100 tracking-widest mb-2">当前配置预览</h4>
                            <ul className="text-xs text-slate-200 space-y-1">
                                <li>启用状态：{gmConfig.enabled ? '✅ 已启用' : '⏸ 未启用'}</li>
                                <li>目标英雄：{gmConfig.heroId ? heroOptions.find(h => h.id === gmConfig.heroId)?.name : '全部'}</li>
                                <li>注入卡牌：{gmConfig.extraCards.length ? gmConfig.extraCards.join(', ') : '无'}</li>
                                <li>起手卡牌：{gmConfig.forceTopCards.length ? gmConfig.forceTopCards.join(', ') : '无'}</li>
                                <li>HUD 备注：{gmConfig.note || '（未填写）'}</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default GMPanel;

