import { SPELL_URL } from './constants.js';
// cards.js - Legends of the Spire
// 200 cards: 80 hero cards + 120 neutral cards
// Fields: id, name, type (ATTACK/SKILL/POWER), cost, value, rarity, hero, target, effect, effectValue, description, img, price

export const CARD_DATABASE = {
  // ---------- HERO CARDS (80) ----------
  // Garen
  GarenQ: { id:'GarenQ', name:'鑷村懡鎵撳嚮', type:'ATTACK', cost:1, value:6, rarity:'COMMON', hero:'Garen', target:'single', effect:'VULNERABLE', effectValue:2, description:'瀵瑰崟涓€鐩爣閫犳垚8鐐逛激瀹筹紝骞舵柦鍔?灞傛槗浼ゃ€?, img:`${SPELL_URL}/GarenQ.png`, price:50 },
  GarenW: { id:'GarenW', name:'鍕囨皵', type:'SKILL', cost:1, value:10, rarity:'UNCOMMON', hero:'Garen', target:'self', effect:'CLEANSE', effectValue:1, description:'鑾峰緱10鐐规姢鐢诧紝娓呴櫎1涓礋闈㈢姸鎬併€?, img:`${SPELL_URL}/GarenW.png`, price:80 },
  GarenE: { id:'GarenE', name:'瀹″垽', type:'ATTACK', cost:2, value:14, rarity:'UNCOMMON', hero:'Garen', target:'single', effect:null, effectValue:0, description:'瀵瑰崟涓€鐩爣閫犳垚16鐐逛激瀹炽€?, img:`${SPELL_URL}/GarenE.png`, price:100 },
  GarenR: { id:'GarenR', name:'寰风帥瑗夸簹姝ｄ箟', type:'ATTACK', cost:3, value:24, rarity:'RARE', hero:'Garen', target:'single', effect:'EXECUTE_SCALE', effectValue:0.5, description:'瀵圭洰鏍囬€犳垚 20 + 50%锛堢洰鏍囧凡鎹熷け鐢熷懡锛夌殑鐪熷疄浼ゅ锛堝崟浣撴柀鏉€锛夈€?, img:`${SPELL_URL}/GarenR.png`, price:150 },

  // Darius
  DariusQ: { id:'DariusQ', name:'澶ф潃鍥涙柟', type:'ATTACK', cost:1, value:6, rarity:'COMMON', hero:'Darius', target:'single', effect:'BLEED', effectValue:2, description:'閫犳垚7鐐逛激瀹冲苟鏂藉姞2灞傛祦琛€銆?, img:`${SPELL_URL}/DariusQ.png`, price:50 },
  DariusW: { id:'DariusW', name:'鑷存畫鎵撳嚮', type:'ATTACK', cost:1, value:5, rarity:'UNCOMMON', hero:'Darius', target:'single', effect:'VULNERABLE', effectValue:1, description:'閫犳垚5鐐逛激瀹冲苟缁欎簣鐩爣1灞傛槗浼わ紱鏈洖鍚堜綘鐨勪笅涓€娆℃敾鍑?3浼ゅ銆?, img:`${SPELL_URL}/DariusW.png`, price:80 },
  DariusE: { id:'DariusE', name:'鏃犳儏閾佹墜', type:'SKILL', cost:2, value:0, rarity:'UNCOMMON', hero:'Darius', target:'single', effect:'BLEED_VULN', effectValue:3, description:'瀵圭洰鏍囨柦鍔?灞傛祦琛€骞?灞傝櫄寮便€?, img:`${SPELL_URL}/DariusE.png`, price:100 },
  DariusR: { id:'DariusR', name:'璇哄厠钀ㄦ柉鏂ご鍙?, type:'ATTACK', cost:3, value:18, rarity:'RARE', hero:'Darius', target:'single', effect:'BLEED_EXECUTE', effectValue:2, description:'瀵圭洰鏍囬€犳垚 20 + (娴佽灞傛暟脳2) 浼ゅ锛涜嫢鍑绘潃鍒欐鍗℃湰灞€璐圭敤鍙樹负0銆?, img:`${SPELL_URL}/DariusR.png`, price:150 },

  // Lux
  LuxQ: { id:'LuxQ', name:'鍏変箣鏉熺細', type:'ATTACK', cost:1, value:8, rarity:'COMMON', hero:'Lux', target:'single', effect:'VULNERABLE', effectValue:1, description:'瀵瑰崟浣撻€犳垚9鐐逛激瀹冲苟鏂藉姞1灞傛槗浼ゃ€?, img:`${SPELL_URL}/LuxQ.png`, price:50 },
  LuxW: { id:'LuxW', name:'缁撶晫鎶ょ浘', type:'SKILL', cost:1, value:6, rarity:'UNCOMMON', hero:'Lux', target:'self', effect:'DRAW_NEXT', effectValue:1, description:'鑾峰緱6鎶ょ敳锛涗笅鍥炲悎鎶?寮犵墝銆?, img:`${SPELL_URL}/LuxW.png`, price:80 },
  LuxE: { id:'LuxE', name:'閫忓厜濂囩偣', type:'ATTACK', cost:2, value:12, rarity:'UNCOMMON', hero:'Lux', target:'single', effect:'BONUS_PER_EXTRA_MANA', effectValue:2, description:'瀵瑰崟浣撻€犳垚12浼ゅ锛涜嫢鏈洖鍚堜綘鑾峰緱棰濆娉曞姏鍒欐瘡鐐规硶鍔?2浼ゅ銆?, img:`${SPELL_URL}/LuxE.png`, price:100 },
  LuxR: { id:'LuxR', name:'缁堟瀬闂厜', type:'ATTACK', cost:3, value:28, rarity:'RARE', hero:'Lux', target:'single', effect:'CONDITIONAL_DOUBLE', effectValue:4, description:'瀵瑰崟浣撻€犳垚30浼ゅ锛涜嫢鏈洖鍚堟墦鍑衡墺4寮犵墝鍒欎激瀹崇炕鍊嶃€?, img:`${SPELL_URL}/LuxR.png`, price:150 },

  // Jinx
  JinxQ: { id:'JinxQ', name:'鏈烘灙鎵皠', type:'ATTACK', cost:1, value:8, rarity:'COMMON', hero:'Jinx', target:'single', effect:'MULTI_HIT', effectValue:3, description:'瀵瑰崟浣撻€犳垚涓夋鍑绘墦锛堟€讳激瀹?锛夈€?, img:`${SPELL_URL}/JinxQ.png`, price:50 },
  JinxW: { id:'JinxW', name:'鐢电鐐?, type:'ATTACK', cost:1, value:9, rarity:'UNCOMMON', hero:'Jinx', target:'single', effect:'VULNERABLE', effectValue:2, description:'瀵圭洰鏍囬€犳垚10浼ゅ骞舵柦鍔?灞傛槗浼ゃ€?, img:`${SPELL_URL}/JinxW.png`, price:80 },
  JinxE: { id:'JinxE', name:'鐏闄烽槺', type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Jinx', target:'mark', effect:'MARK_TRIGGER', effectValue:12, description:'缁欑洰鏍囨斁缃爣璁帮紱鏍囪琚Е鍙戞椂瀵硅鐩爣閫犳垚12鐐逛激瀹炽€?, img:`${SPELL_URL}/JinxE.png`, price:100 },
  JinxR: { id:'JinxR', name:'瓒呯┒鏋侀寮?, type:'ATTACK', cost:3, value:25, rarity:'RARE', hero:'Jinx', target:'single', effect:'LOW_HP_BONUS', effectValue:25, description:'瀵瑰崟浣撻€犳垚25浼ゅ锛涜嫢鐩爣HP<50%鍐嶉€犳垚25銆?, img:`${SPELL_URL}/JinxR.png`, price:150 },

  // Yasuo
  YasuoQ: { id:'YasuoQ', name:'鏂╅挗闂?, type:'ATTACK', cost:1, value:7, rarity:'COMMON', hero:'Yasuo', target:'single', effect:'CRIT_CHANCE', effectValue:10, description:'瀵瑰崟浣撻€犳垚7鐐逛激瀹筹紱鏆村嚮鐜囧彈鍔涢噺褰卞搷銆?, img:`${SPELL_URL}/YasuoQ.png`, price:50 },
  YasuoW: { id:'YasuoW', name:'椋庝箣澧?, type:'SKILL', cost:1, value:12, rarity:'UNCOMMON', hero:'Yasuo', target:'self', effect:'IMMUNE_ONCE', effectValue:1, description:'鑾峰緱12鎶ょ敳骞跺厤鐤竴娆′激瀹筹紙鏈洖鍚堬級銆?, img:`${SPELL_URL}/YasuoW.png`, price:80 },
  YasuoE: { id:'YasuoE', name:'鐤鹃姝?, type:'ATTACK', cost:0, value:4, rarity:'UNCOMMON', hero:'Yasuo', target:'single', effect:'DOUBLE_IF_ATTACKED', effectValue:0, description:'閫犳垚4鐐逛激瀹筹紱鑻ユ湰鍥炲悎宸叉墦鍑烘敾鍑诲垯浼ゅ缈诲€嶃€?, img:`${SPELL_URL}/YasuoE.png`, price:60 },
  YasuoR: { id:'YasuoR', name:'鐙傞缁濇伅鏂?, type:'ATTACK', cost:3, value:6, rarity:'RARE', hero:'Yasuo', target:'single', effect:'SCALE_BY_CRIT', effectValue:6, description:'瀵圭洰鏍囬€犳垚 6脳锛堟湰鍥炲悎鏆村嚮娆℃暟锛?浼ゅ銆?, img:`${SPELL_URL}/YasuoR.png`, price:150 },

  // Sona
  SonaQ: { id:'SonaQ', name:'鑻卞媷璧炵編璇?, type:'ATTACK', cost:1, value:8, rarity:'COMMON', hero:'Sona', target:'single', effect:'SELF_BLOCK', effectValue:3, description:'瀵瑰崟浣撻€犳垚8鐐逛激瀹筹紝鍚屾椂鑷韩鑾峰緱3鐐规姢鐢层€?, img:`${SPELL_URL}/SonaQ.png`, price:50 },
  SonaW: { id:'SonaW', name:'鍧氭瘏鍜忓徆璋?, type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Sona', target:'self', effect:'HEAL', effectValue:8, description:'鎭㈠8鐢熷懡銆?, img:`${SPELL_URL}/SonaW.png`, price:80 },
  SonaE: { id:'SonaE', name:'杩呮嵎濂忛福鏇?, type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Sona', target:'self', effect:'DRAW_MANA', effectValue:2, description:'鎶?寮犵墝骞惰幏寰?鐐逛复鏃舵硶鍔涖€?, img:`${SPELL_URL}/SonaE.png`, price:100 },
  SonaR: { id:'SonaR', name:'缁堜箰绔?, type:'ATTACK', cost:3, value:20, rarity:'RARE', hero:'Sona', target:'single', effect:'PER_CARD_BONUS', effectValue:2, description:'瀵瑰崟浣撻€犳垚20鐐逛激瀹筹紱鏈洖鍚堜綘姣忔墦鍑?寮犵墝锛屽璇ョ洰鏍囬澶栭€犳垚2鐐逛激瀹炽€?, img:`${SPELL_URL}/SonaR.png`, price:150 },

  // Ekko
  EkkoQ: { id:'EkkoQ', name:'鏃堕棿鎶樺垉', type:'ATTACK', cost:1, value:7, rarity:'COMMON', hero:'Ekko', target:'single', effect:'RETRO_BONUS', effectValue:6, description:'瀵圭洰鏍囬€犳垚6浼わ紱鑻ョ洰鏍囧湪涓婂洖鍚堝凡鍙椾綘浼ゅ鍒欓澶?6浼ゅ銆?, img:`${SPELL_URL}/EkkoQ.png`, price:50 },
  EkkoW: { id:'EkkoW', name:'鏃跺厜鎶ょ浘', type:'SKILL', cost:1, value:10, rarity:'UNCOMMON', hero:'Ekko', target:'self', effect:'REFLECT_IF_HIT', effectValue:6, description:'鑾峰緱10鎶ょ敳锛涜嫢涓嬪洖鍚堣鏀诲嚮鍒欏弽寮?浼ゅ缁欐敾鍑昏€呫€?, img:`${SPELL_URL}/EkkoW.png`, price:80 },
  EkkoE: { id:'EkkoE', name:'鐩镐綅淇啿', type:'ATTACK', cost:1, value:9, rarity:'UNCOMMON', hero:'Ekko', target:'single', effect:'NEXT_COST_REDUCE', effectValue:1, description:'瀵圭洰鏍囬€犳垚8浼わ紱鏈洖鍚堜笅涓€寮犳敾鍑诲崱璐圭敤-1銆?, img:`${SPELL_URL}/EkkoE.png`, price:100 },
  EkkoR: { id:'EkkoR', name:'鏃剁┖閫嗚浆', type:'SKILL', cost:3, value:20, rarity:'RARE', hero:'Ekko', target:'single', effect:'HEAL_AND_DAMAGE', effectValue:20, description:'鎭㈠20鐢熷懡锛屽悓鏃跺鍗曚綋閫犳垚20浼ゅ锛堜氦鎹㈡晥鏋滐級銆?, img:`${SPELL_URL}/EkkoR.png`, price:150 },

  // Sylas
  SylasQ: { id:'SylasQ', name:'閿侀摼闉瑸', type:'ATTACK', cost:1, value:8, rarity:'COMMON', hero:'Sylas', target:'single', effect:null, effectValue:0, description:'瀵圭洰鏍囬€犳垚8鐐逛激瀹炽€?, img:`${SPELL_URL}/SylasQ.png`, price:50 },
  SylasW: { id:'SylasW', name:'鍚稿彇涔嬫柀', type:'ATTACK', cost:1, value:8, rarity:'UNCOMMON', hero:'Sylas', target:'single', effect:'LIFELINK', effectValue:8, description:'閫犳垚8浼ゅ苟鍥炲8鐢熷懡銆?, img:`${SPELL_URL}/SylasW.png`, price:80 },
  SylasE: { id:'SylasE', name:'鍙涗贡绐佽', type:'SKILL', cost:1, value:6, rarity:'UNCOMMON', hero:'Sylas', target:'self', effect:'NEXT_ATTACK_DOUBLE', effectValue:2, description:'鑾峰緱6鎶ょ敳锛涗笅涓€娆℃敾鍑讳激瀹崇炕鍊嶃€?, img:`${SPELL_URL}/SylasE.png`, price:100 },
  SylasR: { id:'SylasR', name:'澶洪瓊', type:'SKILL', cost:3, value:0, rarity:'RARE', hero:'Sylas', target:'single', effect:'COPY_ENEMY_ACTION', effectValue:0, description:'澶嶅埗鐩爣鐨勪笅涓€琛屽姩骞朵负鑷繁鎵ц锛堜激瀹冲噺鍗婏級銆?, img:`${SPELL_URL}/SylasR.png`, price:150 },

  // Urgot
  UrgotQ: { id:'UrgotQ', name:'鑵愯殌鐐稿脊', type:'ATTACK', cost:1, value:6, rarity:'COMMON', hero:'Urgot', target:'single', effect:null, effectValue:0, description:'瀵圭洰鏍囬€犳垚7鐐逛激瀹炽€?, img:`${SPELL_URL}/UrgotQ.png`, price:50 },
  UrgotW: { id:'UrgotW', name:'闆嗙伀灞忛殰', type:'SKILL', cost:1, value:15, rarity:'UNCOMMON', hero:'Urgot', target:'self', effect:null, effectValue:0, description:'鑾峰緱15鎶ょ敳銆?, img:`${SPELL_URL}/UrgotW.png`, price:80 },
  UrgotE: { id:'UrgotE', name:'瓒呴檺椹卞姩', type:'SKILL', cost:1, value:10, rarity:'UNCOMMON', hero:'Urgot', target:'single', effect:'SELF_DAMAGE', effectValue:4, description:'瀵圭洰鏍囬€犳垚10浼わ紱鑷韩鎵垮彈4鐐瑰弽鍣€?, img:`${SPELL_URL}/UrgotE.png`, price:100 },
  UrgotR: { id:'UrgotR', name:'澶勫垜绱㈠懡', type:'ATTACK', cost:3, value:29, rarity:'RARE', hero:'Urgot', target:'single', effect:'LOW_HP_EXECUTE', effectValue:30, description:'瀵瑰崟浣撻€犳垚30浼わ紱鑻ョ洰鏍嘓P<30%鍒欑洿鎺ュ鍐炽€?, img:`${SPELL_URL}/UrgotR.png`, price:150 },

  // Viktor
  ViktorQ: { id:'ViktorQ', name:'鑳介噺杞', type:'SKILL', cost:1, value:7, rarity:'COMMON', hero:'Viktor', target:'single', effect:'BUFF_NEXT_SKILL', effectValue:2, description:'瀵圭洰鏍囬€犳垚7浼わ紱浠や綘涓嬩竴寮犳妧鑳藉璇ョ洰鏍囦激瀹?2銆?, img:`${SPELL_URL}/ViktorQ.png`, price:50 },
  ViktorW: { id:'ViktorW', name:'寮曞姏鍦?, type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Viktor', target:'single', effect:'STUN', effectValue:1, description:'浣跨洰鏍囩湬鏅?鍥炲悎銆?, img:`${SPELL_URL}/ViktorW.png`, price:80 },
  ViktorE: { id:'ViktorE', name:'鍏夋潫', type:'ATTACK', cost:2, value:12, rarity:'UNCOMMON', hero:'Viktor', target:'single', effect:'BONUS_IF_VULN', effectValue:4, description:'瀵圭洰鏍囬€犳垚12浼わ紱鑻ヨ鐩爣鏈夋槗浼ゅ啀+4銆?, img:`${SPELL_URL}/ViktorE.png`, price:100 },
  ViktorR: { id:'ViktorR', name:'杩涘寲姝ц矾', type:'SKILL', cost:3, value:18, rarity:'RARE', hero:'Viktor', target:'single', effect:'DRAW_ON_USE', effectValue:1, description:'瀵圭洰鏍囬€犳垚18浼ゅ苟鎶?寮犵墝锛堣繘鍖栨墦鐐癸級銆?, img:`${SPELL_URL}/ViktorR.png`, price:150 },

  // Riven
  RivenQ: { id:'RivenQ', name:'鏂墤閲嶉摳', type:'ATTACK', cost:1, value:12, rarity:'COMMON', hero:'Riven', target:'single', effect:'MULTI_HIT', effectValue:4, description:'瀵瑰崟浣撻€犳垚涓夋鎵撳嚮锛屾€昏12浼ゃ€?, img:`${SPELL_URL}/RivenQ.png`, price:50 },
  RivenW: { id:'RivenW', name:'姘斿悎鏂?, type:'SKILL', cost:1, value:8, rarity:'UNCOMMON', hero:'Riven', target:'self', effect:'DRAW', effectValue:1, description:'鑾峰緱8鎶ょ敳骞舵娊1寮犵墝銆?, img:`${SPELL_URL}/RivenW.png`, price:80 },
  RivenE: { id:'RivenE', name:'鍕囧線鐩村墠', type:'SKILL', cost:1, value:4, rarity:'UNCOMMON', hero:'Riven', target:'self', effect:'ATTACK_BUFF', effectValue:4, description:'鏈洖鍚堜綘鐨勬敾鍑?4浼ゅ銆?, img:`${SPELL_URL}/RivenE.png`, price:100 },
  RivenR: { id:'RivenR', name:'鏀鹃€愪箣鍒?, type:'ATTACK', cost:3, value:20, rarity:'RARE', hero:'Riven', target:'single', effect:'PER_ATTACK_BONUS', effectValue:4, description:'瀵圭洰鏍囬€犳垚20浼わ紱鏈洖鍚堟瘡鎵撳嚭1寮犳敾鍑荤墝瀵硅鐩爣棰濆+4浼ゅ銆?, img:`${SPELL_URL}/RivenR.png`, price:150 },

  // Card-Master (鍗＄墝澶у笀)
  CardMasterQ: { id:'CardMasterQ', name:'绾㈢墝', type:'ATTACK', cost:1, value:8, rarity:'COMMON', hero:'CardMaster', target:'single', effect:'VULN_ON_HIT', effectValue:1, description:'閫犳垚6浼ゅ苟缁欎簣1灞傛槗浼ゃ€?, img:`${SPELL_URL}/CardMasterQ.png`, price:50 },
  CardMasterW: { id:'CardMasterW', name:'钃濈墝', type:'SKILL', cost:1, value:7, rarity:'UNCOMMON', hero:'CardMaster', target:'self', effect:'GAIN_MANA', effectValue:1, description:'閫犳垚6浼ゅ苟鑾峰緱1鐐规硶鍔涖€?, img:`${SPELL_URL}/CardMasterW.png`, price:80 },
  CardMasterE: { id:'CardMasterE', name:'榛勭墝', type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'CardMaster', target:'single', effect:'STUN', effectValue:1, description:'浣跨洰鏍囩湬鏅?鍥炲悎銆?, img:`${SPELL_URL}/CardMasterE.png`, price:100 },
  CardMasterR: { id:'CardMasterR', name:'鍛借繍', type:'SKILL', cost:3, value:0, rarity:'RARE', hero:'CardMaster', target:'single', effect:'DRAW_AND_SCOUT', effectValue:3, description:'鎶?寮犲苟鏌ョ湅鐩爣涓嬩竴琛屽姩锛涜嫢鎴樻枟鑳滃埄棰濆鑾峰緱15閲戝竵锛堣Е鍙戞垬鏂楃粨绠楋級銆?, img:`${SPELL_URL}/CardMasterR.png`, price:150 },

  // Lee Sin
  LeeQ: { id:'LeeQ', name:'闊虫尝鍥為煶', type:'ATTACK', cost:1, value:7, rarity:'COMMON', hero:'LeeSin', target:'single', effect:'CHAIN_TRIGGER', effectValue:7, description:'瀵圭洰鏍囬€犳垚7浼わ紱鍛戒腑鍚庡彲鍏嶈垂鍐嶈Е鍙戜竴娆★紙0璐癸級銆?, img:`${SPELL_URL}/LeeQ.png`, price:50 },
  LeeW: { id:'LeeW', name:'閲戦挓缃?, type:'SKILL', cost:1, value:8, rarity:'UNCOMMON', hero:'LeeSin', target:'self', effect:'ATTACK_BUFF', effectValue:2, description:'鑾峰緱8鎶ょ敳锛涗笅涓€娆℃敾鍑?2浼ゅ銆?, img:`${SPELL_URL}/LeeW.png`, price:80 },
  LeeE: { id:'LeeE', name:'澶╅浄鐮?, type:'ATTACK', cost:1, value:6, rarity:'UNCOMMON', hero:'LeeSin', target:'single', effect:'WEAK_ON_HIT', effectValue:1, description:'瀵圭洰鏍囬€犳垚6浼ゅ苟鏂藉姞1灞傝櫄寮便€?, img:`${SPELL_URL}/LeeE.png`, price:100 },
  LeeR: { id:'LeeR', name:'鐚涢緳鎽嗗熬', type:'ATTACK', cost:3, value:20, rarity:'RARE', hero:'LeeSin', target:'single', effect:'REMOVE_BUFF', effectValue:1, description:'瀵圭洰鏍囬€犳垚20浼ゅ苟绉婚櫎鐩爣鐨勪竴涓鐩娿€?, img:`${SPELL_URL}/LeeR.png`, price:150 },

  // Vayne
  VayneQ: { id:'VayneQ', name:'缈绘粴', type:'ATTACK', cost:0, value:6, rarity:'COMMON', hero:'Vayne', target:'single', effect:'NEXT_HIT_DOUBLE', effectValue:2, description:'閫犳垚4浼わ紱涓嬩竴娆″鍚屼竴鐩爣鐨勬敾鍑讳激瀹崇炕鍊嶃€?, img:`${SPELL_URL}/VayneQ.png`, price:30 },
  VaynePassive: { id:'VaynePassive', name:'鍦ｉ摱寮╃琚姩', type:'POWER', cost:0, value:0, rarity:'COMMON', hero:'Vayne', target:'self', effect:'TRIPLE_CHAIN_BONUS', effectValue:15, description:'瀵瑰悓涓€鐩爣杩炵画閫犳垚3娆′激瀹虫椂锛岀3娆￠€犳垚棰濆12鐐圭湡瀹炰激瀹筹紙鍗曚綋琚姩锛夈€?, img:`${SPELL_URL}/VaynePassive.png`, price:0 },
  VayneE: { id:'VayneE', name:'澧欒绐佽', type:'ATTACK', cost:1, value:8, rarity:'UNCOMMON', hero:'Vayne', target:'single', effect:'STUN_IF_WEAK', effectValue:1, description:'瀵圭洰鏍囬€犳垚6浼わ紱鑻ョ洰鏍囪櫄寮卞垯浣垮叾鐪╂檿1鍥炲悎銆?, img:`${SPELL_URL}/VayneE.png`, price:100 },
  VayneR: { id:'VayneR', name:'鏈€缁堟椂鍒?, type:'SKILL', cost:3, value:0, rarity:'RARE', hero:'Vayne', target:'self', effect:'DOUBLE_ATTACK_INVIS', effectValue:0, description:'鏈洖鍚堜綘鐨勬敾鍑讳激瀹崇炕鍊嶏紝骞惰幏寰楅殣韬紙鍏嶅彈瀵规柟涓嬩竴娆℃敾鍑伙級銆?, img:`${SPELL_URL}/VayneR.png`, price:150 },

  // Teemo
  TeemoQ: { id:'TeemoQ', name:'鑷寸洸鍚圭', type:'ATTACK', cost:1, value:10, rarity:'COMMON', hero:'Teemo', target:'single', effect:'BLIND', effectValue:2, description:'閫犳垚6浼ゅ苟浣跨洰鏍囪櫄寮?锛堣嚧鐩叉晥鏋滐級銆?, img:`${SPELL_URL}/TeemoQ.png`, price:50 },
  TeemoW: { id:'TeemoW', name:'鐤鹃€熻鍐?, type:'SKILL', cost:1, value:5, rarity:'UNCOMMON', hero:'Teemo', target:'self', effect:'DRAW', effectValue:1, description:'鎶?寮犵墝骞惰幏寰?鎶ょ敳銆?, img:`${SPELL_URL}/TeemoW.png`, price:80 },
  TeemoE: { id:'TeemoE', name:'姣掓€у皠鍑?, type:'ATTACK', cost:1, value:0, rarity:'UNCOMMON', hero:'Teemo', target:'single', effect:'POISON', effectValue:7, description:'瀵圭洰鏍囨柦鍔?灞傛瘨锛堢洰鏍囧崟浣撴寔缁激瀹筹級銆?, img:`${SPELL_URL}/TeemoE.png`, price:100 },
  TeemoR: { id:'TeemoR', name:'铇戣弴鏍囪', type:'SKILL', cost:3, value:0, rarity:'RARE', hero:'Teemo', target:'mark', effect:'MUSHROOM_MARK', effectValue:15, description:'瀵圭洰鏍囨斁缃槕鑿囨爣璁帮細褰撹鐩爣瑙﹀彂鏍囪鏃跺鍏堕€犳垚12浼ゅ锛堝崟浣撹Е鍙戯級銆?, img:`${SPELL_URL}/TeemoR.png`, price:150 },

  // Zed
  ZedQ: { id:'ZedQ', name:'鎵嬮噷鍓?, type:'ATTACK', cost:1, value:11, rarity:'COMMON', hero:'Zed', target:'single', effect:'MULTI_HIT', effectValue:3, description:'瀵圭洰鏍囬€犳垚涓夋浼ゅ锛屾€昏9鐐广€?, img:`${SPELL_URL}/ZedQ.png`, price:50 },
  ZedW: { id:'ZedW', name:'褰卞垎韬?, type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Zed', target:'self', effect:'COPY_NEXT_ATTACK', effectValue:75, description:'鍙敜褰卞垎韬細鍦ㄦ湰鍥炲悎澶嶅埗涓嬩竴娆″鍗曚綋鐨勬敾鍑伙紙鍒嗚韩閫犳垚50%浼ゅ锛夈€?, img:`${SPELL_URL}/ZedW.png`, price:80 },
  ZedE: { id:'ZedE', name:'褰辨柀', type:'ATTACK', cost:1, value:8, rarity:'UNCOMMON', hero:'Zed', target:'single', effect:'WEAK_ON_HIT', effectValue:1, description:'瀵圭洰鏍囬€犳垚6浼ゅ苟鏂藉姞1灞傝櫄寮便€?, img:`${SPELL_URL}/ZedE.png`, price:100 },
  ZedR: { id:'ZedR', name:'姝讳骸鍗拌', type:'SKILL', cost:3, value:0, rarity:'RARE', hero:'Zed', target:'single', effect:'DEATHMARK', effectValue:3, description:'瀵圭洰鏍囨柦鍔犲嵃璁帮紙3鍥炲悎锛夛紱鑻ュ湪鍗拌鏈熼棿閫犳垚鑷村懡浼ゅ锛屽垯棰濆閫犳垚绛夐噺浼ゅ銆?, img:`${SPELL_URL}/ZedR.png`, price:150 },

  // Nasus
  NasusQ: { id:'NasusQ', name:'姹查瓊鐥涘嚮', type:'ATTACK', cost:1, value:8, rarity:'COMMON', hero:'Nasus', target:'single', effect:'PERMA_STR_ON_KILL', effectValue:1, description:'閫犳垚8浼わ紱鑻ユ湰鐗屽嚮鏉€鐩爣鍒欐案涔呰幏寰?1鍔涢噺锛堣法鎴樻枟鎴栨湰灞€璁剧疆锛夈€?, img:`${SPELL_URL}/NasusQ.png`, price:50 },
  NasusW: { id:'NasusW', name:'鑵愬寲鍜?, type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Nasus', target:'single', effect:'WEAK_VULN', effectValue:2, description:'浣跨洰鏍囪櫄寮?骞舵槗浼?銆?, img:`${SPELL_URL}/NasusW.png`, price:80 },
  NasusE: { id:'NasusE', name:'鐏甸瓊鐑堢劙', type:'ATTACK', cost:2, value:10, rarity:'UNCOMMON', hero:'Nasus', target:'single', effect:'STR_DEBUFF', effectValue:2, description:'瀵圭洰鏍囬€犳垚10浼ゅ苟鍑忓皯鍏跺姏閲?銆?, img:`${SPELL_URL}/NasusE.png`, price:100 },
  NasusR: { id:'NasusR', name:'鐙傛矙涔嬫€?, type:'POWER', cost:3, value:8, rarity:'RARE', hero:'Nasus', target:'self', effect:'TEMP_STR', effectValue:8, description:'鏈洖鍚堝姏閲?8銆?, img:`${SPELL_URL}/NasusR.png`, price:150 },

  // Irelia
  IreliaQ: { id:'IreliaQ', name:'鍒╁垉鍐插嚮', type:'ATTACK', cost:1, value:8, rarity:'COMMON', hero:'Irelia', target:'single', effect:'KILL_REWARD', effectValue:1, description:'閫犳垚6浼わ紱鑻ュ嚮鏉€鐩爣鍒欐娊1骞跺洖澶?娉曞姏銆?, img:`${SPELL_URL}/IreliaQ.png`, price:50 },
  IreliaW: { id:'IreliaW', name:'鍙嶅嚮涔嬭垶', type:'SKILL', cost:1, value:12, rarity:'UNCOMMON', hero:'Irelia', target:'self', effect:'REFLECT_BUFF', effectValue:2, description:'鑾峰緱12鎶ょ敳锛涜嫢琚懡涓垯涓嬩竴娆℃敾鍑讳激瀹趁?銆?, img:`${SPELL_URL}/IreliaW.png`, price:80 },
  IreliaE: { id:'IreliaE', name:'鏉熺細涔嬪垉', type:'ATTACK', cost:1, value:9, rarity:'UNCOMMON', hero:'Irelia', target:'single', effect:'STUN', effectValue:1, description:'瀵圭洰鏍囬€犳垚8浼ゅ苟浣垮叾鐪╂檿1鍥炲悎銆?, img:`${SPELL_URL}/IreliaE.png`, price:100 },
  IreliaR: { id:'IreliaR', name:'鍏堥攱绐佽', type:'ATTACK', cost:3, value:13, rarity:'RARE', hero:'Irelia', target:'single', effect:'ALL_ATTACKS_BONUS', effectValue:2, description:'閫犳垚12浼わ紱鏈洖鍚堜綘鎵€鏈夊璇ョ洰鏍囩殑鏀诲嚮棰濆+2浼ゃ€?, img:`${SPELL_URL}/IreliaR.png`, price:150 },

  // Thresh
  ThreshQ: { id:'ThreshQ', name:'鐢熸鍒ゅ喅', type:'ATTACK', cost:1, value:8, rarity:'COMMON', hero:'Thresh', target:'single', effect:'PULL', effectValue:0, description:'閫犳垚8浼ゅ苟鎷夎繎鐩爣锛堝奖鍝嶄笅涓€鍥炲悎鐨勫喅绛栵級銆?, img:`${SPELL_URL}/ThreshQ.png`, price:50 },
  ThreshW: { id:'ThreshW', name:'鐏甸瓊鐏', type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Thresh', target:'self', effect:'HEAL', effectValue:8, description:'鎭㈠8鐢熷懡銆?, img:`${SPELL_URL}/ThreshW.png`, price:80 },
  ThreshE: { id:'ThreshE', name:'缃伓寮?, type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Thresh', target:'single', effect:'WEAK', effectValue:2, description:'浣跨洰鏍囪櫄寮?銆?, img:`${SPELL_URL}/ThreshE.png`, price:100 },
  ThreshR: { id:'ThreshR', name:'骞藉啣鐩戠墷', type:'SKILL', cost:3, value:0, rarity:'RARE', hero:'Thresh', target:'single', effect:'WEAK_VULN_AND_PERMAHP', effectValue:2, description:'浣跨洰鏍囪櫄寮?骞舵槗浼?锛涜嫢闅忓悗鍑绘潃璇ョ洰鏍囧垯姘镐箙+2鏈€澶х敓鍛姐€?, img:`${SPELL_URL}/ThreshR.png`, price:150 },

  // Katarina
  KatarinaQ: { id:'KatarinaQ', name:'寮у垉鏂?, type:'ATTACK', cost:1, value:10, rarity:'COMMON', hero:'Katarina', target:'single', effect:'MULTI_HIT', effectValue:3, description:'瀵圭洰鏍囪繘琛屼笁娈垫敾鍑伙紝鎬昏9浼ゃ€?, img:`${SPELL_URL}/KatarinaQ.png`, price:50 },
  KatarinaW: { id:'KatarinaW', name:'杩呭垉绐佽', type:'ATTACK', cost:1, value:9, rarity:'UNCOMMON', hero:'Katarina', target:'single', effect:'DRAW_ON_HIT', effectValue:1, description:'閫犳垚8浼ゅ苟鎶?寮犵墝銆?, img:`${SPELL_URL}/KatarinaW.png`, price:80 },
  KatarinaE: { id:'KatarinaE', name:'铔囨闂嚮', type:'ATTACK', cost:1, value:7, rarity:'UNCOMMON', hero:'Katarina', target:'single', effect:'COMBO_BONUS', effectValue:4, description:'閫犳垚6浼わ紱鑻ユ湰鍥炲悎浣犲凡閫犳垚浼ゅ鍒欐湰鐗岄澶?4銆?, img:`${SPELL_URL}/KatarinaE.png`, price:100 },
  KatarinaR: { id:'KatarinaR', name:'姝讳骸鑾插崕', type:'ATTACK', cost:3, value:30, rarity:'RARE', hero:'Katarina', target:'single', effect:'MULTI_STRIKE_SEGMENTS', effectValue:5, description:'瀵瑰崟浣撻€犳垚5娈?浼わ紝鍏?0浼わ紙鍒嗘鍒ゅ畾锛屽崟浣擄級銆?, img:`${SPELL_URL}/KatarinaR.png`, price:150 },

  // ---------- END HERO CARDS (80) ----------
  // ---------- NEUTRAL CARDS (120) ----------
  // We'll enumerate neutral cards id'ed as Neutral_001 ... Neutral_120
  Neutral_001: { id:'Neutral_001', name:'鐮寸唤鍒哄嚮', type:'ATTACK', cost:1, value:6, rarity:'COMMON', hero:'Neutral', target:'single', effect:'BONUS_IF_MARKED', effectValue:4, description:'瀵圭洰鏍囬€犳垚6鐐逛激锛涜嫢鐩爣鏈夋爣璁板垯鍐嶉€犳垚4鐐逛激銆?, img:`${SPELL_URL}/Neutral_001.png`, price:50 },
  Neutral_002: { id:'Neutral_002', name:'鑷寸洸鐑熷箷', type:'ATTACK', cost:1, value:4, rarity:'COMMON', hero:'Neutral', target:'single', effect:'WEAK', effectValue:2, description:'閫犳垚4鐐逛激骞朵娇鐩爣铏氬急2銆?, img:`${SPELL_URL}/Neutral_002.png`, price:50 },
  Neutral_003: { id:'Neutral_003', name:'缂氶瓊閽?, type:'SKILL', cost:1, value:5, rarity:'UNCOMMON', hero:'Neutral', target:'mark', effect:'TETHER_MARK', effectValue:8, description:'瀵圭洰鏍囬€犳垚5浼ゅ苟鍦ㄥ叾涓婃斁缃€滅壍缁娾€濇爣璁帮細鑻ヤ綘涓嬪洖鍚堝鍏舵敾鍑诲垯棰濆瑙﹀彂8浼ゃ€?, img:`${SPELL_URL}/Neutral_003.png`, price:80 },
  Neutral_004: { id:'Neutral_004', name:'鐮寸敳涓€鍑?, type:'ATTACK', cost:2, value:12, rarity:'UNCOMMON', hero:'Neutral', target:'single', effect:'ARMOR_REDUCE', effectValue:6, description:'閫犳垚12鐐逛激骞跺噺灏戠洰鏍囨姢鐢?鐐广€?, img:`${SPELL_URL}/Neutral_004.png`, price:100 },
  Neutral_005: { id:'Neutral_005', name:'鎵板績涔嬪垉', type:'ATTACK', cost:1, value:6, rarity:'UNCOMMON', hero:'Neutral', target:'single', effect:'DEBUFF_CARD', effectValue:-1, description:'閫犳垚6鐐逛激骞朵娇鐩爣涓嬩竴寮犲崱鏁堟灉闄嶄綆1锛堣嫢瀹炵幇瀵?AI 闈炵湡瀹炲崱鏀逛负闄嶄綆涓嬩竴琛屽姩濞佸姏锛夈€?, img:`${SPELL_URL}/Neutral_005.png`, price:80 },
  Neutral_006: { id:'Neutral_006', name:'缂犵粫闄烽槺', type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Neutral', target:'mark', effect:'TRAP_TRIGGER', effectValue:10, description:'鍦ㄧ洰鏍囦笂鏀剧疆闄烽槺鏍囪锛氳嫢鐩爣涓嬪洖鍚堝皾璇曟敾鍑绘垨鎵撶墝锛屽垯瑙﹀彂瀵硅鐩爣閫犳垚10浼ゃ€?, img:`${SPELL_URL}/Neutral_006.png`, price:90 },
  Neutral_007: { id:'Neutral_007', name:'閫嗘祦鐗靛埗', type:'ATTACK', cost:1, value:10, rarity:'UNCOMMON', hero:'Neutral', target:'single', effect:'REMOVE_BUFF', effectValue:1, description:'鑻ョ洰鏍囨湰鍥炲悎鏈夊鐩婏紝鍒欏鍏堕€犳垚10浼ゅ苟绉婚櫎涓€涓鐩娿€?, img:`${SPELL_URL}/Neutral_007.png`, price:100 },
  Neutral_008: { id:'Neutral_008', name:'寮哄埗鏂╁嚮', type:'ATTACK', cost:2, value:14, rarity:'UNCOMMON', hero:'Neutral', target:'single', effect:'FREE_IF_WEAK', effectValue:0, description:'瀵瑰崟浣撻€犳垚14浼わ紱鑻ョ洰鏍囪櫄寮卞垯璐圭敤鍙樹负0銆?, img:`${SPELL_URL}/Neutral_008.png`, price:120 },

  Neutral_009: { id:'Neutral_009', name:'鍑€鍖栦箣椤?, type:'SKILL', cost:0, value:0, rarity:'COMMON', hero:'Neutral', target:'self', effect:'DRAW', effectValue:2, description:'鎶?寮犵墝銆?, img:`${SPELL_URL}/Neutral_009.png`, price:40 },
  Neutral_010: { id:'Neutral_010', name:'娉曞姏瀹瑰櫒', type:'SKILL', cost:1, value:0, rarity:'COMMON', hero:'Neutral', target:'self', effect:'TEMP_MANA', effectValue:1, description:'鑾峰緱1鐐逛复鏃舵硶鍔涳紙鏈洖鍚堬級銆?, img:`${SPELL_URL}/Neutral_010.png`, price:50 },
  Neutral_011: { id:'Neutral_011', name:'璐┆鍟嗗埜', type:'SKILL', cost:0, value:10, rarity:'COMMON', hero:'Neutral', target:'self', effect:'GAIN_GOLD', effectValue:10, description:'鑾峰緱10閲戝竵锛涜嫢寮冪疆姝ょ墝鍒欓澶栬幏寰?0閲戝竵锛堝純缃闄╂崲濂栧姳锛夈€?, img:`${SPELL_URL}/Neutral_011.png`, price:30 },
  Neutral_012: { id:'Neutral_012', name:'鎴樹簤瀛﹁瘑', type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Neutral', target:'self', effect:'CONDITIONAL_DRAW', effectValue:2, description:'鎶?锛涜嫢鏈洖鍚堝凡鎵撳嚭鈮?寮犳敾鍑诲垯鏀逛负鎶?銆?, img:`${SPELL_URL}/Neutral_012.png`, price:80 },
  Neutral_013: { id:'Neutral_013', name:'鎴樻湳閫熻', type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Neutral', target:'self', effect:'NEXT_DRAW_PLUS', effectValue:1, description:'涓嬪洖鍚堝厛鎵嬫娊鐗?1銆?, img:`${SPELL_URL}/Neutral_013.png`, price:80 },
  Neutral_014: { id:'Neutral_014', name:'鏆楀奖绗旇', type:'SKILL', cost:0, value:0, rarity:'RARE', hero:'Neutral', target:'single', effect:'SCOUT', effectValue:1, description:'鏌ョ湅鐩爣涓嬩竴涓鍔紙鍦?AI 鐜涓负鏌ョ湅鍏剁瓥鐣ワ級銆?, img:`${SPELL_URL}/Neutral_014.png`, price:120 },
  Neutral_015: { id:'Neutral_015', name:'閲戝竵鎶兼敞', type:'SKILL', cost:0, value:0, rarity:'RARE', hero:'Neutral', target:'self', effect:'GAMBLE', effectValue:30, description:'50%鑾峰緱+30G锛?0%澶卞幓10HP锛堥珮椋庨櫓楂樺洖鎶ワ級銆?, img:`${SPELL_URL}/Neutral_015.png`, price:0 },
  Neutral_016: { id:'Neutral_016', name:'娉曞姏鐭崇鐗?, type:'SKILL', cost:0, value:0, rarity:'COMMON', hero:'Neutral', target:'self', effect:'MANA_IF_LOW_HAND', effectValue:1, description:'鑻ヤ綘鎵嬬墝鈮?锛屽垯鑾峰緱1娉曞姏骞舵娊1銆?, img:`${SPELL_URL}/Neutral_016.png`, price:40 },

  Neutral_017: { id:'Neutral_017', name:'姹傜煡閾枃', type:'POWER', cost:2, value:0, rarity:'RARE', hero:'Neutral', target:'self', effect:'PERMA_DRAW_ON_KILL', effectValue:1, description:'姣忔鍑绘潃鍗曚綅锛堥潪 boss锛夋案涔?1鎶界墝锛堟厧鐢級銆?, img:`${SPELL_URL}/Neutral_017.png`, price:200 },
  Neutral_018: { id:'Neutral_018', name:'鍖犻瓊涔嬮敜', type:'SKILL', cost:2, value:0, rarity:'RARE', hero:'Neutral', target:'self', effect:'PERMA_UPGRADE_CARD', effectValue:1, description:'閫夋嫨涓€寮犲崱姘镐箙+1鏁板€硷紙鎴?1璐圭敤锛夈€?, img:`${SPELL_URL}/Neutral_018.png`, price:220 },
  Neutral_019: { id:'Neutral_019', name:'鑽ｈ獕濂栫珷', type:'SKILL', cost:1, value:0, rarity:'COMMON', hero:'Neutral', target:'self', effect:'WIN_GOLD_BONUS', effectValue:10, description:'鎴樻枟鑳滃埄鏃惰幏寰楅澶?10閲戝竵锛堝彲鍙狅級銆?, img:`${SPELL_URL}/Neutral_019.png`, price:60 },
  Neutral_020: { id:'Neutral_020', name:'鐚庢墜寰界珷', type:'POWER', cost:1, value:0, rarity:'UNCOMMON', hero:'Neutral', target:'self', effect:'TEMP_STR_ON_KILLS', effectValue:2, description:'鑻ユ湰灞€鍑绘潃鈮?锛岀珛鍗宠幏寰楁湰灞€鍔涢噺+2锛堟垬鏂楀唴鎴愰暱锛夈€?, img:`${SPELL_URL}/Neutral_020.png`, price:120 },
  Neutral_021: { id:'Neutral_021', name:'閲庡績濂戠害', type:'SKILL', cost:0, value:0, rarity:'RARE', hero:'Neutral', target:'self', effect:'PERMA_STR_FOR_HP', effectValue:1, description:'鐗虹壊5鏈€澶х敓鍛?鈫?姘镐箙+1鍔涢噺锛堥珮浠ｄ环闀挎湡鏀剁泭锛夈€?, img:`${SPELL_URL}/Neutral_021.png`, price:0 },
  Neutral_022: { id:'Neutral_022', name:'鍙よ€佺閾?, type:'POWER', cost:3, value:0, rarity:'RARE', hero:'Neutral', target:'self', effect:'DRAW_AT_START', effectValue:1, description:'鎴樻枟寮€濮嬫椂鑻ユ寔鏈夋湰鍗″垯姣忓洖鍚堝紑濮嬮澶栨娊1寮狅紙鎸佺画鎴樻枟鏈燂級銆?, img:`${SPELL_URL}/Neutral_022.png`, price:200 },

  Neutral_023: { id:'Neutral_023', name:'閫嗗悜寮曟搸', type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Neutral', target:'self', effect:'RECYCLE', effectValue:1, description:'浠庡純鐗屽爢灏嗕竴寮犲崱杩斿洖鎵嬬墝銆?, img:`${SPELL_URL}/Neutral_023.png`, price:80 },
  Neutral_024: { id:'Neutral_024', name:'鐚キ涔嬬幆', type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Neutral', target:'self', effect:'SELF_HP_FOR_BLOCK', effectValue:12, description:'鐗虹壊6鐢熷懡鑾峰緱12鎶ょ敳銆?, img:`${SPELL_URL}/Neutral_024.png`, price:70 },
  Neutral_025: { id:'Neutral_025', name:'闅忛淇＄', type:'SKILL', cost:0, value:0, rarity:'COMMON', hero:'Neutral', target:'self', effect:'DISCOUNT_ONE_CARD', effectValue:1, description:'闅忔満閫夋嫨涓€寮犳墜鐗屼娇鍏舵湰鍥炲悎璐圭敤-1锛涚粨鏉熷洖鍚堝悗璇ュ崱琚Щ闄?娑堣€楃増)銆?, img:`${SPELL_URL}/Neutral_025.png`, price:40 },
  Neutral_026: { id:'Neutral_026', name:'鏆楅噾鍗疯酱', type:'SKILL', cost:2, value:0, rarity:'RARE', hero:'Neutral', target:'self', effect:'UPGRADE_CARD', effectValue:1, description:'绔嬪嵆鍗囩骇涓€寮犻潪BASIC鍗★紙+3鏁板€兼垨-1璐圭敤锛夈€?, img:`${SPELL_URL}/Neutral_026.png`, price:200 },
  Neutral_027: { id:'Neutral_027', name:'璇遍サ涔嬬', type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Neutral', target:'mark', effect:'BAIT_TRIGGER', effectValue:8, description:'鏀剧疆璇遍サ鏍囪锛涜嫢鐩爣灏濊瘯瑙﹀彂鍒欏鍏堕€犳垚8浼ゃ€?, img:`${SPELL_URL}/Neutral_027.png`, price:80 },
  Neutral_028: { id:'Neutral_028', name:'鍥炴棆寮?, type:'ATTACK', cost:1, value:9, rarity:'UNCOMMON', hero:'Neutral', target:'single', effect:'NEXT_ENEMY_COST_PLUS', effectValue:1, description:'閫犳垚9浼ゅ苟浣挎晫浜轰笅涓€寮犲崱璐圭敤+1锛堣祫婧愬帇鍒讹級銆?, img:`${SPELL_URL}/Neutral_028.png`, price:90 },
  Neutral_029: { id:'Neutral_029', name:'铏氬急濂戠害', type:'SKILL', cost:0, value:0, rarity:'UNCOMMON', hero:'Neutral', target:'single', effect:'STR_DEBUFF', effectValue:1, description:'浣跨洰鏍?1鍔涢噺锛屾寔缁?鍥炲悎銆?, img:`${SPELL_URL}/Neutral_029.png`, price:60 },
  Neutral_030: { id:'Neutral_030', name:'閲嶅鐭?, type:'SKILL', cost:2, value:0, rarity:'RARE', hero:'Neutral', target:'self', effect:'TRANSFORM', effectValue:0, description:'闅忔満灏嗘墜涓婁竴寮犲崱鏇挎崲涓哄悓绋€鏈夊害鍙︿竴寮犲崱锛堥珮鍙樻暟锛夈€?, img:`${SPELL_URL}/Neutral_030.png`, price:200 },

  Neutral_031: { id:'Neutral_031', name:'瀹堟姢涔嬬浘', type:'SKILL', cost:1, value:10, rarity:'COMMON', hero:'Neutral', target:'self', effect:null, effectValue:0, description:'鑾峰緱10鎶ょ敳銆?, img:`${SPELL_URL}/Neutral_031.png`, price:60 },
  Neutral_032: { id:'Neutral_032', name:'鍥炲绉樿嵂', type:'SKILL', cost:1, value:10, rarity:'COMMON', hero:'Neutral', target:'self', effect:'HEAL', effectValue:10, description:'鍥炲10鐢熷懡銆?, img:`${SPELL_URL}/Neutral_032.png`, price:60 },
  Neutral_033: { id:'Neutral_033', name:'鏍兼尅涔嬫瓕', type:'SKILL', cost:1, value:6, rarity:'COMMON', hero:'Neutral', target:'self', effect:'NEXT_DAMAGE_REDUCE', effectValue:4, description:'鑾峰緱6鎶ょ敳骞朵娇涓嬩竴娆″彈鍒扮殑浼ゅ棰濆鍑忓皯4銆?, img:`${SPELL_URL}/Neutral_033.png`, price:70 },
  Neutral_034: { id:'Neutral_034', name:'閫嗕激鍙嶉渿', type:'SKILL', cost:2, value:0, rarity:'UNCOMMON', hero:'Neutral', target:'self', effect:'RETALIATE_ON_HIT', effectValue:8, description:'鑻ュ湪鏈洖鍚堣鏀诲嚮锛屽垯鍙嶅脊8浼ょ粰鏀诲嚮鑰呫€?, img:`${SPELL_URL}/Neutral_034.png`, price:100 },
  Neutral_035: { id:'Neutral_035', name:'鑳介噺鍥炲', type:'SKILL', cost:2, value:0, rarity:'UNCOMMON', hero:'Neutral', target:'self', effect:'REGEN_MANA', effectValue:2, description:'鎭㈠2娉曞姏锛氭湰鍥炲悎涓庝笅鍥炲悎鍚?1锛堣妭濂忥級锛屽悎璁?鍥炪€?, img:`${SPELL_URL}/Neutral_035.png`, price:120 },
  Neutral_036: { id:'Neutral_036', name:'绋冲浐濮挎€?, type:'POWER', cost:0, value:0, rarity:'COMMON', hero:'Neutral', target:'self', effect:'PASSIVE_BLOCK_IF_IDLE', effectValue:6, description:'鑻ユ湰鍥炲悎娌℃湁鍑虹墝锛屽垯涓嬪洖鍚堣幏寰?鎶ょ敳锛堥紦鍔变繚鐣欙級銆?, img:`${SPELL_URL}/Neutral_036.png`, price:40 },

  // World-theme / small group (4)
  Neutral_037: { id:'Neutral_037', name:'鏆楀奖宀涗箣姝?, type:'ATTACK', cost:2, value:8, rarity:'UNCOMMON', hero:'Neutral', target:'single', effect:'OPEN_SHADOW_EVENT', effectValue:0, description:'瀵瑰崟浣撻€犳垚8浼わ紱鑳滃埄鏃惰В閿佷竴娆℃殫褰卞矝浜嬩欢锛堝墽鎯?濂栧姳锛夈€?, img:`${SPELL_URL}/Neutral_037.png`, price:100 },
  Neutral_038: { id:'Neutral_038', name:'璇哄厠钀ㄦ柉鏂珷', type:'SKILL', cost:1, value:0, rarity:'UNCOMMON', hero:'Neutral', target:'single', effect:'HEAL_REDUCE', effectValue:50, description:'鐩爣鑾峰彇娌荤枟鏁堟灉闄嶄綆50%锛屾寔缁?鍥炲悎銆?, img:`${SPELL_URL}/Neutral_038.png`, price:90 },
  Neutral_039: { id:'Neutral_039', name:'寰风帥涔嬪窘', type:'SKILL', cost:2, value:0, rarity:'UNCOMMON', hero:'Neutral', target:'single', effect:'DAMAGE_REDUCE', effectValue:30, description:'鐩爣瀵逛綘閫犳垚鐨勪激瀹冲噺灏?0%锛?鍥炲悎锛夈€?, img:`${SPELL_URL}/Neutral_039.png`, price:110 },
  Neutral_040: { id:'Neutral_040', name:'铏氱┖鐮?, type:'SKILL', cost:3, value:0, rarity:'RARE', hero:'Neutral', target:'single', effect:'VOID_DOT', effectValue:5, description:'鏍囪鐩爣锛氬叾鍦?鍥炲悎鍐呮瘡鍥炲悎鎹熷け5鐢熷懡锛涜嫢鍑绘潃鐩爣鍒欒繑杩?0G銆?, img:`${SPELL_URL}/Neutral_040.png`, price:200 },

  // ---------------------------------------------------------
// Neutral_041
{
  id: 'Neutral_041',
  name: '鏃犵晱澹佸瀿',
  type: 'SKILL',
  target: 'self',
  cost: 1,
  value: 12,
  rarity: 'COMMON',
  effect: null,
  effectValue: 0,
  description: '鑾峰緱12鐐规姢鐢层€?,
  price: 55
},

// Neutral_042
{
  id: 'Neutral_042',
  name: '绮惧噯鎵撳嚮',
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 8,
  rarity: 'COMMON',
  effect: 'CRIT_IF_VULN',
  effectValue: 6,
  description: '閫犳垚8鐐逛激瀹筹紱鑻ョ洰鏍囧浜庢槗浼わ紝棰濆閫犳垚6鐐逛激瀹炽€?,
  price: 60
},

// Neutral_043
{
  id: 'Neutral_043',
  name: '鐏靛阀韬硶',
  type: 'SKILL',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'COMMON',
  effect: 'GAIN_AGI',
  effectValue: 1,
  description: '鑾峰緱1鐐规晱鎹枫€?,
  price: 55
},

// Neutral_044
{
  id: 'Neutral_044',
  name: '闆嗙伀鍙蜂护',
  type: 'POWER',
  target: 'self',
  cost: 2,
  value: 0,
  rarity: 'RARE',
  effect: 'NEXT_ATTACK_X2',
  effectValue: 0,
  description: '浣犵殑涓嬩竴寮犳敾鍑荤墝浼ゅ缈诲€嶃€?,
  price: 110
},

// Neutral_045
{
  id: 'Neutral_045',
  name: '绉搫鎬掔伀',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'GAIN_STRENGTH_PER_HIT',
  effectValue: 1,
  description: '姣忓綋浣犲彈鍒颁激瀹虫椂锛岃幏寰?鐐瑰姏閲忋€?,
  price: 90
},

// Neutral_046
{
  id: 'Neutral_046',
  name: '鏆楀奖姣掑垉',
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 4,
  rarity: 'UNCOMMON',
  effect: 'POISON',
  effectValue: 4,
  description: '閫犳垚4鐐逛激瀹冲苟闄勫姞4灞備腑姣掋€?,
  price: 70
},

// Neutral_047
{
  id: 'Neutral_047',
  name: '璇辨晫娣卞叆',
  type: 'SKILL',
  target: 'single',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'MARK',
  effectValue: 1,
  description: '缁欑洰鏍囨柦鍔犫€滆鎹曟爣璁扳€濓細鐩爣涓嬫鏀诲嚮浣犳椂鍙楀埌8鐐瑰弽鍣€?,
  price: 70
},

// Neutral_048
{
  id: 'Neutral_048',
  name: '鐗虹壊鎵?,
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 12,
  rarity: 'UNCOMMON',
  effect: 'SELF_DAMAGE',
  effectValue: 3,
  description: '閫犳垚12鐐逛激瀹筹紝浣犺嚜宸卞彈鍒?鐐瑰弽浼ゃ€?,
  price: 60
},

// Neutral_049
{
  id: 'Neutral_049',
  name: '闂浆鑵炬尓',
  type: 'SKILL',
  target: 'self',
  cost: 0,
  value: 5,
  rarity: 'COMMON',
  effect: null,
  effectValue: 0,
  description: '鑾峰緱5鐐规姢鐢层€?,
  price: 40
},

// Neutral_050
{
  id: 'Neutral_050',
  name: '鎴樻湳鎾ら€€',
  type: 'SKILL',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'COMMON',
  effect: 'DRAW',
  effectValue: 2,
  description: '鎶?寮犵墝銆?,
  price: 45
},

// Neutral_051
{
  id: 'Neutral_051',
  name: '鐑堢伀璇曠偧',
  type: 'ATTACK',
  target: 'single',
  cost: 2,
  value: 18,
  rarity: 'RARE',
  effect: 'BURN',
  effectValue: 5,
  description: '閫犳垚18鐐逛激瀹冲苟闄勫姞5灞傜噧鐑с€?,
  price: 120
},

// Neutral_052
{
  id: 'Neutral_052',
  name: '钃勮兘鍐ユ兂',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'RARE',
  effect: 'GAIN_MANA_NEXT_TURN',
  effectValue: 1,
  description: '涓嬩釜鍥炲悎寮€濮嬫椂鑾峰緱1鐐归澶栨硶鍔涖€?,
  price: 90
},

// Neutral_053
{
  id: 'Neutral_053',
  name: '鏆楀奖铏瑰惛',
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 7,
  rarity: 'UNCOMMON',
  effect: 'LIFESTEAL',
  effectValue: 5,
  description: '閫犳垚7鐐逛激瀹筹紝骞跺洖澶?鐐圭敓鍛姐€?,
  price: 70
},

// Neutral_054
{
  id: 'Neutral_054',
  name: '绗︽枃鐐圭噧',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'DAMAGE_UP_PER_TURN',
  effectValue: 1,
  description: '姣忓洖鍚堝紑濮嬫椂鑾峰緱1鐐瑰姏閲忥紙浠呮湰鎴樻枟锛夈€?,
  price: 95
},

// Neutral_055
{
  id: 'Neutral_055',
  name: '涓嶅眻鎰忓織',
  type: 'SKILL',
  target: 'self',
  cost: 1,
  value: 12,
  rarity: 'COMMON',
  effect: 'CLEANSE',
  effectValue: 1,
  description: '鑾峰緱12鐐规姢鐢插苟绉婚櫎1涓礋闈㈢姸鎬併€?,
  price: 60
},

// Neutral_056
{
  id: 'Neutral_056',
  name: '钃勫娍寰呭彂',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'COMMON',
  effect: 'FIRST_ATTACK_PLUS',
  effectValue: 4,
  description: '姣忓洖鍚堜綘鐨勭涓€寮犳敾鍑荤墝棰濆閫犳垚4鐐逛激瀹炽€?,
  price: 85
},

// Neutral_057
{
  id: 'Neutral_057',
  name: '鑷村懡杩炲嚮',
  type: 'ATTACK',
  target: 'single',
  cost: 2,
  value: 10,
  rarity: 'RARE',
  effect: 'DOUBLE_HIT',
  effectValue: 10,
  description: '閫犳垚10鐐逛激瀹筹紝鐒跺悗鍐嶆閫犳垚10鐐逛激瀹炽€?,
  price: 140
},

// Neutral_058
{
  id: 'Neutral_058',
  name: '鍐涘琛ョ粰',
  type: 'SKILL',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'DRAW',
  effectValue: 3,
  description: '鎶?寮犵墝銆?,
  price: 65
},

// Neutral_059
{
  id: 'Neutral_059',
  name: '寮烘敾鎵嚮',
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 13,
  rarity: 'UNCOMMON',
  effect: null,
  effectValue: 0,
  description: '閫犳垚13鐐逛激瀹炽€?,
  price: 70
},

// Neutral_060
{
  id: 'Neutral_060',
  name: '鏆楀奖灞忛殰',
  type: 'SKILL',
  target: 'self',
  cost: 2,
  value: 20,
  rarity: 'RARE',
  effect: 'AVOID_NEXT_DAMAGE',
  effectValue: 1,
  description: '鑾峰緱20鐐规姢鐢诧紝骞舵棤鏁堝寲涓嬩竴娆″彈鍒扮殑浼ゅ銆?,
  price: 130
},
// Neutral_061
{
  id: 'Neutral_061',
  name: '绗﹁兘绌垮埡',
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 9,
  rarity: 'COMMON',
  effect: 'IGNORE_BLOCK',
  effectValue: 1,
  description: '閫犳垚9鐐规棤瑙嗘姢鐢茬殑浼ゅ銆?,
  price: 70
},

// Neutral_062
{
  id: 'Neutral_062',
  name: '鎴樻湳鍘嬪埗',
  type: 'SKILL',
  target: 'single',
  cost: 1,
  value: 0,
  rarity: 'COMMON',
  effect: 'WEAK',
  effectValue: 2,
  description: '瀵圭洰鏍囨柦鍔?灞傝櫄寮便€?,
  price: 60
},

// Neutral_063
{
  id: 'Neutral_063',
  name: '绗︽枃搴囨姢',
  type: 'SKILL',
  target: 'self',
  cost: 1,
  value: 15,
  rarity: 'COMMON',
  effect: null,
  effectValue: 0,
  description: '鑾峰緱15鐐规姢鐢层€?,
  price: 60
},

// Neutral_064
{
  id: 'Neutral_064',
  name: '鏆楀奖娲炲療',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'SEE_ENEMY_ACTION',
  effectValue: 1,
  description: '鎵€鏈夊洖鍚堥兘鑳界湅鍒版晫浜虹殑涓嬩竴涓鍔ㄣ€?,
  price: 90
},

// Neutral_065
{
  id: 'Neutral_065',
  name: '绮惧噯鐖嗗ご',
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 11,
  rarity: 'UNCOMMON',
  effect: 'CRIT_25',
  effectValue: 10,
  description: '閫犳垚11鐐逛激瀹筹紱25% 鍑犵巼棰濆閫犳垚10鐐逛激瀹炽€?,
  price: 75
},

// Neutral_066
{
  id: 'Neutral_066',
  name: '杩呭嚮涓夎繛',
  type: 'ATTACK',
  target: 'single',
  cost: 2,
  value: 5,
  rarity: 'UNCOMMON',
  effect: 'TRIPLE_HIT',
  effectValue: 5,
  description: '杩炵画鏀诲嚮3娆★紝姣忔閫犳垚5鐐逛激瀹炽€?,
  price: 110
},

// Neutral_067
{
  id: 'Neutral_067',
  name: '鐥涜嫤鐚キ',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'RARE',
  effect: 'GAIN_STR_WHEN_LOSE_HP',
  effectValue: 1,
  description: '姣忓綋浣犳崯澶辩敓鍛斤紝鑾峰緱1鐐瑰姏閲忋€?,
  price: 120
},

// Neutral_068
{
  id: 'Neutral_068',
  name: '鐑堢劙鍐插嚮',
  type: 'ATTACK',
  target: 'single',
  cost: 2,
  value: 20,
  rarity: 'RARE',
  effect: null,
  effectValue: 0,
  description: '閫犳垚20鐐逛激瀹炽€?,
  price: 120
},

// Neutral_069
{
  id: 'Neutral_069',
  name: '鏆楀奖骞绘',
  type: 'SKILL',
  target: 'self',
  cost: 0,
  value: 6,
  rarity: 'UNCOMMON',
  effect: 'GAIN_AGI',
  effectValue: 1,
  description: '鑾峰緱6鐐规姢鐢诧紝骞惰幏寰?鐐规晱鎹枫€?,
  price: 70
},

// Neutral_070
{
  id: 'Neutral_070',
  name: '姝荤嚎涓€鍑?,
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 7,
  rarity: 'COMMON',
  effect: 'BONUS_IF_LOW_HP',
  effectValue: 10,
  description: '閫犳垚7鐐逛激瀹筹紱鑻ョ洰鏍囩敓鍛戒綆浜?0%锛岄澶栭€犳垚10鐐逛激瀹炽€?,
  price: 65
},

// Neutral_071
{
  id: 'Neutral_071',
  name: '澶嶄粐涔嬬劙',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'GAIN_STRENGTH_WHEN_HIT',
  effectValue: 1,
  description: '姣忓綋浣犲彈鍒颁激瀹筹紝鑾峰緱1鐐瑰姏閲忋€?,
  price: 100
},

// Neutral_072
{
  id: 'Neutral_072',
  name: '鐏甸瓊鍘嬪埗',
  type: 'SKILL',
  target: 'single',
  cost: 1,
  value: 0,
  rarity: 'RARE',
  effect: 'REMOVE_BUFF',
  effectValue: 1,
  description: '绉婚櫎鐩爣鐨勪竴涓鐩婄姸鎬併€?,
  price: 120
},

// Neutral_073
{
  id: 'Neutral_073',
  name: '鏆楀奖鐏靛埡',
  type: 'ATTACK',
  target: 'single',
  cost: 0,
  value: 4,
  rarity: 'COMMON',
  effect: null,
  effectValue: 0,
  description: '閫犳垚4鐐逛激瀹炽€?,
  price: 30
},

// Neutral_074
{
  id: 'Neutral_074',
  name: '澶嶇敓鍗拌',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'RARE',
  effect: 'REVIVE_ONCE',
  effectValue: 20,
  description: '鎴樻枟涓娆℃浜℃椂锛屼互20鐐圭敓鍛藉娲汇€?,
  price: 200
},

// Neutral_075
{
  id: 'Neutral_075',
  name: '绮惧噯澶勫垜',
  type: 'ATTACK',
  target: 'single',
  cost: 2,
  value: 15,
  rarity: 'RARE',
  effect: 'EXECUTE_THRESHOLD',
  effectValue: 25,
  description: '閫犳垚15鐐逛激瀹筹紱鑻ョ洰鏍囦綆浜?5%鐢熷懡锛岀洿鎺ュ鍐炽€?,
  price: 150
},

// Neutral_076
{
  id: 'Neutral_076',
  name: '濂ユ湳灞忛殰',
  type: 'SKILL',
  target: 'self',
  cost: 1,
  value: 14,
  rarity: 'UNCOMMON',
  effect: 'SHIELD',
  effectValue: 8,
  description: '鑾峰緱14鐐规姢鐢诧紝骞惰幏寰?鐐逛复鏃跺睆闅溿€?,
  price: 75
},

// Neutral_077
{
  id: 'Neutral_077',
  name: '绗︽枃婵€鑽?,
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'RARE',
  effect: 'GAIN_POWER_PER_TURN',
  effectValue: 1,
  description: '姣忓洖鍚堝紑濮嬫椂鑾峰緱1鐐瑰姏閲忎笌1鐐规晱鎹枫€?,
  price: 150
},

// Neutral_078
{
  id: 'Neutral_078',
  name: '閲嶆柀杩炲彂',
  type: 'ATTACK',
  target: 'single',
  cost: 2,
  value: 9,
  rarity: 'UNCOMMON',
  effect: 'DOUBLE_HIT',
  effectValue: 9,
  description: '杩炵画鏀诲嚮涓ゆ锛屾瘡娆￠€犳垚9鐐逛激瀹炽€?,
  price: 110
},

// Neutral_079
{
  id: 'Neutral_079',
  name: '鐏靛阀鏍兼尅',
  type: 'SKILL',
  target: 'self',
  cost: 1,
  value: 10,
  rarity: 'COMMON',
  effect: 'GAIN_AGI',
  effectValue: 1,
  description: '鑾峰緱10鐐规姢鐢蹭笌1鐐规晱鎹枫€?,
  price: 60
},

// Neutral_080
{
  id: 'Neutral_080',
  name: '鍙嶅埗閿侀摼',
  type: 'SKILL',
  target: 'single',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'COUNTER',
  effectValue: 10,
  description: '鏈洖鍚堣嫢鐩爣鏀诲嚮浣狅紝瀵瑰叾鍙嶅嚮閫犳垚10鐐逛激瀹炽€?,
  price: 80
},
// ---------------------------------------------------------
// Neutral_081
{
  id: 'Neutral_081',
  name: '鐚庢潃棰勫厗',
  type: 'SKILL',
  target: 'single',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'MARK',
  effectValue: 1,
  description: '瀵圭洰鏍囨柦鍔犫€滅寧鏉€鏍囪鈥濓細浣犱笅娆″鍏堕€犳垚鐨勪激瀹?+8銆?,
  price: 70
},

// Neutral_082
{
  id: 'Neutral_082',
  name: '鐥涘嚮',
  type: 'ATTACK',
  target: 'single',
  cost: 0,
  value: 3,
  rarity: 'COMMON',
  effect: 'APPLY_WEAK',
  effectValue: 1,
  description: '閫犳垚3鐐逛激瀹冲苟浣跨洰鏍囪櫄寮?鍥炲悎銆?,
  price: 35
},

// Neutral_083
{
  id: 'Neutral_083',
  name: '榄傝兘鍐插嚮',
  type: 'ATTACK',
  target: 'single',
  cost: 2,
  value: 22,
  rarity: 'RARE',
  effect: null,
  effectValue: 0,
  description: '閫犳垚22鐐逛激瀹炽€?,
  price: 120
},

// Neutral_084
{
  id: 'Neutral_084',
  name: '鎴樻妧绐佺牬',
  type: 'SKILL',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'GAIN_STRENGTH',
  effectValue: 2,
  description: '鑾峰緱2鐐瑰姏閲忋€?,
  price: 80
},

// Neutral_085
{
  id: 'Neutral_085',
  name: '绗︽枃鐕冪儳',
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 10,
  rarity: 'UNCOMMON',
  effect: 'BURN',
  effectValue: 3,
  description: '閫犳垚10鐐逛激瀹冲苟闄勫姞3灞傜噧鐑с€?,
  price: 75
},

// Neutral_086
{
  id: 'Neutral_086',
  name: '鐏甸瓊鎶藉彇',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'RARE',
  effect: 'LIFESTEAL_BUFF',
  effectValue: 3,
  description: '鎵€鏈夋敾鍑荤墝鑾峰緱3鐐瑰惛琛€鏁堟灉銆?,
  price: 130
},

// Neutral_087
{
  id: 'Neutral_087',
  name: '渚佃殌姣掗浘',
  type: 'SKILL',
  target: 'single',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'POISON',
  effectValue: 6,
  description: '瀵圭洰鏍囨柦鍔?灞備腑姣掋€?,
  price: 80
},

// Neutral_088
{
  id: 'Neutral_088',
  name: '娌夌ǔ濮挎€?,
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'COMMON',
  effect: 'GAIN_BLOCK_NEXT_TURN',
  effectValue: 8,
  description: '涓嬪洖鍚堝紑濮嬫椂鑾峰緱8鐐规姢鐢层€?,
  price: 60
},

// Neutral_089
{
  id: 'Neutral_089',
  name: '澶辫　鐚涘嚮',
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 7,
  rarity: 'COMMON',
  effect: 'VULNERABLE',
  effectValue: 1,
  description: '閫犳垚7鐐逛激瀹冲苟闄勫姞1灞傛槗浼ゃ€?,
  price: 55
},

// Neutral_090
{
  id: 'Neutral_090',
  name: '绗︾汗鐢茶儎',
  type: 'SKILL',
  target: 'self',
  cost: 2,
  value: 24,
  rarity: 'RARE',
  effect: null,
  effectValue: 0,
  description: '鑾峰緱24鐐规姢鐢层€?,
  price: 130
},

// Neutral_091
{
  id: 'Neutral_091',
  name: '鐏佃兘娑屽姩',
  type: 'POWER',
  target: 'self',
  cost: 2,
  value: 0,
  rarity: 'RARE',
  effect: 'DRAW_START',
  effectValue: 1,
  description: '姣忓洖鍚堝鎶?寮犵墝銆?,
  price: 150
},

// Neutral_092
{
  id: 'Neutral_092',
  name: '鑷村懡鏍囪',
  type: 'SKILL',
  target: 'single',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'MARK',
  effectValue: 1,
  description: '瀵圭洰鏍囨柦鍔犫€滆嚧鍛芥爣璁扳€濓細鍏朵笅娆″彈鍒版敾鍑婚澶?+12 浼ゅ銆?,
  price: 80
},

// Neutral_093
{
  id: 'Neutral_093',
  name: '鍑跺垉杩炶垶',
  type: 'ATTACK',
  target: 'single',
  cost: 2,
  value: 6,
  rarity: 'RARE',
  effect: 'TRIPLE_HIT',
  effectValue: 6,
  description: '杩炵画3娆￠€犳垚6鐐逛激瀹炽€?,
  price: 130
},

// Neutral_094
{
  id: 'Neutral_094',
  name: '浠紡鐚キ',
  type: 'SKILL',
  target: 'self',
  cost: 0,
  value: 0,
  rarity: 'RARE',
  effect: 'LOSE_HP_GAIN_STRENGTH',
  effectValue: 2,
  description: '澶卞幓4鐐圭敓鍛斤紝鑾峰緱2鐐瑰姏閲忋€?,
  price: 60
},

// Neutral_095
{
  id: 'Neutral_095',
  name: '骞介瓊閽╃埅',
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 11,
  rarity: 'UNCOMMON',
  effect: 'LIFESTEAL',
  effectValue: 3,
  description: '閫犳垚11鐐逛激瀹冲苟鍥炲3鐐圭敓鍛姐€?,
  price: 80
},

// Neutral_096
{
  id: 'Neutral_096',
  name: '杞寲鐩爣',
  type: 'SKILL',
  target: 'single',
  cost: 1,
  value: 0,
  rarity: 'COMMON',
  effect: 'REDUCE_BLOCK',
  effectValue: 6,
  description: '浣跨洰鏍囧噺灏?鐐规姢鐢层€?,
  price: 50
},

// Neutral_097
{
  id: 'Neutral_097',
  name: '鍐烽叿绮惧噯',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'CRIT_UP',
  effectValue: 10,
  description: '浣犵殑鎵€鏈夋敾鍑荤墝鏆村嚮鍑犵巼 +10%銆?,
  price: 100
},

// Neutral_098
{
  id: 'Neutral_098',
  name: '鎿嶆帶蹇冩櫤',
  type: 'SKILL',
  target: 'single',
  cost: 1,
  value: 0,
  rarity: 'RARE',
  effect: 'DELAY_ACTION',
  effectValue: 1,
  description: '寤惰繜鐩爣涓嬩竴涓鍔紙寤惰繜 1 鍥炲悎锛夈€?,
  price: 150
},

// Neutral_099
{
  id: 'Neutral_099',
  name: '琛€鑹插啿閿?,
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 9,
  rarity: 'COMMON',
  effect: 'GAIN_STRENGTH',
  effectValue: 1,
  description: '閫犳垚9鐐逛激瀹筹紝骞惰幏寰?鐐瑰姏閲忋€?,
  price: 55
},

// Neutral_100
{
  id: 'Neutral_100',
  name: '绗︽枃闇囩垎',
  type: 'ATTACK',
  target: 'single',
  cost: 3,
  value: 28,
  rarity: 'RARE',
  effect: null,
  effectValue: 0,
  description: '閫犳垚28鐐逛激瀹炽€?,
  price: 160
},

// Neutral_101
{
  id: 'Neutral_101',
  name: '榄傜伀搴囦綉',
  type: 'SKILL',
  target: 'self',
  cost: 1,
  value: 14,
  rarity: 'UNCOMMON',
  effect: 'CLEANSE',
  effectValue: 1,
  description: '鑾峰緱14鐐规姢鐢插苟绉婚櫎1涓礋闈㈢姸鎬併€?,
  price: 75
},

// Neutral_102
{
  id: 'Neutral_102',
  name: '琛€鍊鸿鍋?,
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 6,
  rarity: 'UNCOMMON',
  effect: 'DAMAGE_IF_HURT',
  effectValue: 10,
  description: '閫犳垚6鐐逛激瀹筹紱鑻ヤ笂涓€鍥炲悎浣犲彈鍒颁激瀹筹紝鍒欓澶栭€犳垚10鐐广€?,
  price: 75
},

// Neutral_103
{
  id: 'Neutral_103',
  name: '閾佸瀹堝娍',
  type: 'SKILL',
  target: 'self',
  cost: 2,
  value: 25,
  rarity: 'RARE',
  effect: 'GAIN_AGI',
  effectValue: 1,
  description: '鑾峰緱25鐐规姢鐢插拰1鐐规晱鎹枫€?,
  price: 150
},

// Neutral_104
{
  id: 'Neutral_104',
  name: '鏃犲０姣掓伅',
  type: 'SKILL',
  target: 'single',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'POISON',
  effectValue: 7,
  description: '鏂藉姞7灞備腑姣掋€?,
  price: 85
},

// Neutral_105
{
  id: 'Neutral_105',
  name: '杩囪浇鎵撳嚮',
  type: 'ATTACK',
  target: 'single',
  cost: 2,
  value: 18,
  rarity: 'UNCOMMON',
  effect: 'SELF_WEAK',
  effectValue: 1,
  description: '閫犳垚18鐐逛激瀹筹紝浣犺幏寰?灞傝櫄寮便€?,
  price: 95
},

// Neutral_106
{
  id: 'Neutral_106',
  name: '鐏垫劅杩稿彂',
  type: 'SKILL',
  target: 'self',
  cost: 0,
  value: 0,
  rarity: 'COMMON',
  effect: 'DRAW',
  effectValue: 1,
  description: '鎶?寮犵墝銆?,
  price: 25
},

// Neutral_107
{
  id: 'Neutral_107',
  name: '杩呮嵎绐佽',
  type: 'ATTACK',
  target: 'single',
  cost: 0,
  value: 5,
  rarity: 'COMMON',
  effect: null,
  effectValue: 0,
  description: '閫犳垚5鐐逛激瀹炽€?,
  price: 30
},

// Neutral_108
{
  id: 'Neutral_108',
  name: '鍧氶煣淇′话',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'END_TURN_BLOCK',
  effectValue: 4,
  description: '姣忓洖鍚堢粨鏉熸椂鑾峰緱4鐐规姢鐢层€?,
  price: 80
},

// Neutral_109
{
  id: 'Neutral_109',
  name: '铏氱┖鑵愯殌',
  type: 'SKILL',
  target: 'single',
  cost: 2,
  value: 0,
  rarity: 'RARE',
  effect: 'HP_DEGEN',
  effectValue: 12,
  description: '浣跨洰鏍囧湪3鍥炲悎鍐呮瘡鍥炲悎鎹熷け4鐐圭敓鍛姐€?,
  price: 140
},

// Neutral_110
{
  id: 'Neutral_110',
  name: '鎬ラ€熸柀',
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 9,
  rarity: 'COMMON',
  effect: 'DRAW_IF_KILL',
  effectValue: 1,
  description: '閫犳垚9鐐逛激瀹筹紱鑻ュ嚮鏉€鐩爣锛屾娊1寮犵墝銆?,
  price: 60
},

// Neutral_111
{
  id: 'Neutral_111',
  name: '鑻卞媷椋庤寖',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'GAIN_BLOCK_WHEN_ATTACK',
  effectValue: 4,
  description: '浣犳瘡娆℃墦鍑烘敾鍑荤墝鏃惰幏寰?鐐规姢鐢层€?,
  price: 80
},

// Neutral_112
{
  id: 'Neutral_112',
  name: '鎴樻湳鍘嬪埗',
  type: 'SKILL',
  target: 'single',
  cost: 1,
  value: 0,
  rarity: 'COMMON',
  effect: 'WEAK',
  effectValue: 2,
  description: '瀵圭洰鏍囨柦鍔?灞傝櫄寮便€?,
  price: 50
},

// Neutral_113
{
  id: 'Neutral_113',
  name: '寮傝兘娉ㄥ叆',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'RARE',
  effect: 'GAIN_RANDOM_BUFF',
  effectValue: 2,
  description: '鑾峰緱闅忔満2鐐瑰睘鎬э紙鍔涢噺鎴栨晱鎹凤級銆?,
  price: 150
},

// Neutral_114
{
  id: 'Neutral_114',
  name: '缁堢剦鏍囪',
  type: 'SKILL',
  target: 'single',
  cost: 1,
  value: 0,
  rarity: 'RARE',
  effect: 'MARK',
  effectValue: 1,
  description: '鏂藉姞鈥滅粓鐒夋爣璁扳€濓細鐩爣鍦?鍥炲悎鍚庡彈鍒?5鐐逛激瀹炽€?,
  price: 160
},

// Neutral_115
{
  id: 'Neutral_115',
  name: '鏆楀奖娣卞嚮',
  type: 'ATTACK',
  target: 'single',
  cost: 1,
  value: 12,
  rarity: 'UNCOMMON',
  effect: 'BONUS_IF_MARKED',
  effectValue: 6,
  description: '閫犳垚12鐐逛激瀹筹紱鑻ョ洰鏍囪鏍囪锛屽垯棰濆閫犳垚6鐐广€?,
  price: 85
},

// Neutral_116
{
  id: 'Neutral_116',
  name: '鐏甸瓊鐚キ',
  type: 'SKILL',
  target: 'self',
  cost: 0,
  value: 0,
  rarity: 'RARE',
  effect: 'LOSE_HP_GAIN_MANA',
  effectValue: 1,
  description: '澶卞幓4鐐圭敓鍛斤紝鑾峰緱1鐐规硶鍔涖€?,
  price: 70
},

// Neutral_117
{
  id: 'Neutral_117',
  name: '鏈堜箣榧撳姩',
  type: 'POWER',
  target: 'self',
  cost: 1,
  value: 0,
  rarity: 'UNCOMMON',
  effect: 'GAIN_STRENGTH_NEXT_TURN',
  effectValue: 2,
  description: '涓嬪洖鍚堝紑濮嬫椂鑾峰緱2鐐瑰姏閲忋€?,
  price: 90
},

// Neutral_118
{
  id: 'Neutral_118',
  name: '閿嬭姃鏆村埡',
  type: 'ATTACK',
  target: 'single',
  cost: 0,
  value: 4,
  rarity: 'COMMON',
  effect: 'APPLY_VULNERABLE',
  effectValue: 1,
  description: '閫犳垚4鐐逛激瀹筹紝骞舵柦鍔?灞傛槗浼ゃ€?,
  price: 35
},

// Neutral_119
{
  id: 'Neutral_119',
  name: '绗︾伀杩為攣',
  type: 'ATTACK',
  target: 'single',
  cost: 2,
  value: 14,
  rarity: 'RARE',
  effect: 'DOUBLE_HIT',
  effectValue: 14,
  description: '杩炵画閫犳垚涓ゆ14鐐逛激瀹炽€?,
  price: 150
},

// Neutral_120
{
  id: 'Neutral_120',
  name: '铏氱┖瑁傜棔',
  type: 'ATTACK',
  target: 'single',
  cost: 3,
  value: 30,
  rarity: 'RARE',
  effect: 'APPLY_VULNERABLE',
  effectValue: 2,
  description: '閫犳垚30鐐逛激瀹筹紝骞堕檮鍔?灞傛槗浼ゃ€?,
  price: 170
},

