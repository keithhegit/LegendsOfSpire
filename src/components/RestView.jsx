import React from 'react';
import { Heart } from 'lucide-react';
import { ITEM_URL } from '../data/constants';

const RestView = ({ onRest }) => (
    <div className="absolute inset-0 z-50 bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Soraka_0.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 flex flex-col gap-8 text-center items-center">
            <div className="w-24 h-24 rounded-full border-4 border-[#0AC8B9] overflow-hidden bg-black shadow-[0_0_50px_#0AC8B9]"><img src={`${ITEM_URL}/2003.png`} className="w-full h-full object-cover" /></div>
            <h2 className="text-5xl font-serif text-[#0AC8B9] drop-shadow-[0_0_10px_#0AC8B9]">泉水憩息</h2>
            <button onClick={onRest} className="group w-64 h-80 bg-slate-900/80 border-2 border-[#0AC8B9] rounded-xl flex flex-col items-center justify-center hover:bg-[#0AC8B9]/20 transition-all cursor-pointer">
                <Heart size={64} className="text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-white mb-2">回复</h3>
                <p className="text-[#0AC8B9]">回复 30% 生命值</p>
            </button>
        </div>
    </div>
);

export default RestView;

