// ══════════════════════════════════════════════════════════════
//  data.js — Static game data: buildings, upgrades, milestones
// ══════════════════════════════════════════════════════════════

const SAVE_KEY = 'cookieEmporiumSave';

const BUILDINGS = [
  { id:'cursor',   name:'Magic Cursor',  icon:'👆', baseCost:15,       baseCPS:0.1,   desc:'Taps the cookie for you.' },
  { id:'grandma',  name:'Grandma',       icon:'👵', baseCost:100,      baseCPS:0.5,   desc:'A kindly old lady who bakes cookies.' },
  { id:'farm',     name:'Cookie Farm',   icon:'🌾', baseCost:1100,     baseCPS:4,     desc:'Grows cookie plants in fertile soil.' },
  { id:'mine',     name:'Cookie Mine',   icon:'⛏️', baseCost:12000,    baseCPS:10,    desc:'Mines deep for chocolate ore.' },
  { id:'factory',  name:'Factory',       icon:'🏭', baseCost:130000,   baseCPS:40,    desc:'Mass-produces cookies by the ton.' },
  { id:'bank',     name:'Cookie Bank',   icon:'🏦', baseCost:1400000,  baseCPS:100,   desc:'Generates cookie income passively.' },
  { id:'temple',   name:'Cookie Temple', icon:'🛕', baseCost:20000000, baseCPS:400,   desc:'The gods demand tribute in cookies.' },
  { id:'wizard',   name:'Wizard Tower',  icon:'🧙', baseCost:3e8,      baseCPS:1666,  desc:'Conjures cookies from thin air.' },
  { id:'shipment', name:'Shipment',      icon:'🚀', baseCost:5.1e9,    baseCPS:8888,  desc:'Imports cookies from Cookie Planet.' },
  { id:'alchemy',  name:'Alchemy Lab',   icon:'⚗️', baseCost:7.5e10,   baseCPS:47777, desc:'Turns gold into cookies (superior).' },
];

const UPGRADES_DEF = [
  { id:'u1', name:'Butter Fingers',  icon:'🧈', cost:100,    desc:'+1 click',       effectType:'click', effectVal:1 },
  { id:'u2', name:'Golden Whisk',    icon:'🪄', cost:500,    desc:'+3 clicks',      effectType:'click', effectVal:3 },
  { id:'u3', name:'Secret Recipe',   icon:'📜', cost:3000,   desc:'×2 all CPS',     effectType:'gcps',  effectVal:2 },
  { id:'u4', name:'Choco Ritual',    icon:'🔮', cost:10000,  desc:'+10 clicks',     effectType:'click', effectVal:10 },
  { id:'u5', name:"Grandma's Love",  icon:'💝', cost:50000,  desc:'×3 Grandma CPS', effectType:'bld',   effectVal:3, effectTarget:'grandma' },
  { id:'u6', name:'Quantum Oven',    icon:'⚡', cost:200000, desc:'×2 all CPS',     effectType:'gcps',  effectVal:2 },
  { id:'u7', name:'Time Warp Dough', icon:'⏳', cost:1e6,    desc:'+50 clicks',     effectType:'click', effectVal:50 },
  { id:'u8', name:'Dark Matter Mix', icon:'🌑', cost:5e7,    desc:'×5 all CPS',     effectType:'gcps',  effectVal:5 },
];

const MILESTONES = [
  { at:100,   label:'100 Cookies!' },
  { at:1000,  label:'1K Club' },
  { at:10000, label:'10K Baker' },
  { at:1e6,   label:'Millionaire' },
  { at:1e9,   label:'Billionaire' },
  { at:1e12,  label:'Trillionaire' },
  { at:1e15,  label:'Legendary' },
];

const NEWS = [
  '🍪 Local cookie mysteriously disappears — witnesses claim it "tasted incredible".',
  '📈 Cookie futures at all-time high. Economists baffled.',
  '👵 Grandma bakes 10,000th batch, shows no signs of stopping.',
  '🚀 Scientists discover entire planet made of cookies.',
  '🔮 Wizard\'s latest spell accidentally turns town square into gingerbread.',
  '🏭 Factory workers demand more breaks. Cookie production continues.',
  '🌾 Bumper harvest season: cookie wheat prices collapse.',
  '⚗️ Alchemist successfully transmutes lead into snickerdoodles.',
];
