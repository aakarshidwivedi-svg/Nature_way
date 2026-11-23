// Shared simulation engine for Sandbox, Prediction Lab and Digital Twin. Pure functions, seeded, no UI.
import {rng} from '../lib';
export const cl=(x,a,b)=>Math.min(b,Math.max(a,x));
export const SPECIES={
moth:{name:'Peppered moth',unit:'darkness (0 light – 1 dark)',lo:0,hi:1,init:.5,A:1.2,opt:e=>e.pollution,c0:'#ece6d6',c1:'#2b2723',note:'Optimum darkness equals bark darkness, which follows pollution.'},
finch:{name:'Darwin’s finch',unit:'beak size (relative units, not mm)',lo:1,hi:7,init:3.99,A:3,opt:e=>2.8+2.2*e.hardness,c0:'#e0c070',c1:'#5b4631',note:'Optimum beak size rises with seed hardness (2.8 soft to 5.0 hard).'},
hare:{name:'Snowshoe hare',unit:'whitening-date offset (days; − earlier)',lo:-40,hi:40,init:0,A:3,opt:e=>7*e.temp,c0:'#fbfbf8',c1:'#6b4f33',note:'Multi-generation moult-timing model: warming delays the best whitening date by 7 days per °C. This is separate from the one-year seasonal model used for mismatch days.'},
generic:{name:'Generic species',unit:'trait (0–1)',lo:0,hi:1,init:.3,A:2,opt:e=>e.gopt,c0:'#9fc3dd',c1:'#14301f',note:'Configurable trait with a fixed optimum (default 0.5).'}};
const E0={temp:0,food:.7,predators:.3,pollution:.1,hardness:.1,gopt:.5};
export const ECOS={forest:{name:'Forest',species:['moth','generic'],env:{...E0,food:.8}},island:{name:'Island',species:['finch','generic'],env:{...E0,food:.6,predators:.1}},grassland:{name:'Grassland',species:['generic','finch'],env:{...E0,predators:.25}},arctic:{name:'Arctic',species:['hare','generic'],env:{...E0,pollution:0,predators:.35}}};
export const defaultCfg=()=>({eco:'forest',species:'moth',env:{...ECOS.forest.env},pop:500,gens:40,mutation:.03,init:.5,event:{type:'pollution',gen:15,mag:.8},seed:42});
export function envAt(cfg,g){const e={...cfg.env},v=cfg.event;if(v&&v.type!=='none'&&g>v.gen){const m=v.mag;if(v.type==='pollution')e.pollution=cl(e.pollution+m,0,1);if(v.type==='warming')e.temp+=4*m;if(v.type==='food')e.food=cl(e.food-.6*m,.05,1);if(v.type==='predators')e.predators=cl(e.predators+.5*m,0,1);if(v.type==='hardness')e.hardness=cl(e.hardness+m,0,1)}e.foodEff=cl(e.food*(1-.06*Math.max(0,e.temp)),.05,1);return e}
// Each individual has one inherited trait x. Survival s = 1 - P(0.1 + A|x-opt|/range), P = predators + 0.5(1.15-food). Survivors reproduce (x2, capped at carrying capacity K) with mutation noise.
export function simulate(cfg){const S=SPECIES[cfg.species],r=rng(cfg.seed),rg=S.hi-S.lo,e0=envAt(cfg,0),rows=[];
let x=Array.from({length:Math.round(cfg.pop*(.4+.6*e0.foodEff))},()=>cl(cfg.init+r.g()*.08*rg,S.lo,S.hi));
const rec=(g,e,surv,fit)=>{const n=x.length,m=n?x.reduce((a,b)=>a+b,0)/n:0,sd=n?Math.sqrt(x.reduce((a,b)=>a+(b-m)**2,0)/n):0,h=Array(10).fill(0);x.forEach(v=>h[Math.min(9,Math.floor((v-S.lo)/rg*10))]++);
rows.push({g,n,mean:+m.toFixed(4),sd:+sd.toFixed(4),survival:+surv.toFixed(4),fitness:+fit.toFixed(4),opt:+S.opt(e).toFixed(3),upper:n?x.filter(v=>v>=S.lo+rg/2).length/n:0,temp:e.temp,pollution:e.pollution,food:+e.foodEff.toFixed(3),predators:e.predators,hist:h})};
rec(0,e0,1,1);
for(let g=1;g<=cfg.gens;g++){const e=envAt(cfg,g),o=S.opt(e),P=e.predators+(1.15-e.foodEff)*.5,K=Math.round(cfg.pop*(.4+.6*e.foodEff)),sv=[];let fs=0;
for(const v of x){const s=cl(1-P*(.1+S.A*Math.abs(v-o)/rg),0,.98);fs+=s;if(r()<s)sv.push(v)}
const n0=x.length,nn=Math.min(K,sv.length*2);x=sv.length?Array.from({length:nn},()=>cl(sv[Math.floor(r()*sv.length)]+r.g()*cfg.mutation*rg,S.lo,S.hi)):[];rec(g,e,n0?sv.length/n0:0,n0?fs/n0:0)}return rows}
export const stats=a=>{const n=a.length,m=a.reduce((s,v)=>s+v,0)/n;return{n,mean:m,sd:Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/Math.max(1,n-1)),min:Math.min(...a),max:Math.max(...a)}};
export const distribution=a=>{const s=stats(a),w=(s.max-s.min)/10||1,h=Array.from({length:10},(_,i)=>({bin:+(s.min+i*w).toFixed(2),n:0}));a.forEach(v=>h[Math.min(9,Math.floor((v-s.min)/w))].n++);return{...s,hist:h}};
export const summarize=rows=>{const a=rows[0],z=rows.at(-1);return{n0:a.n,nN:z.n,growthPct:a.n?(z.n-a.n)/a.n*100:0,meanN:z.mean,sdN:z.sd,survival:rows.slice(1).reduce((s,r)=>s+r.survival,0)/Math.max(1,rows.length-1),fitness:z.fitness,gens:rows.length-1}};
// Prediction evaluation: compares predicted trait/population directions with simulated outcome
const dir=(v,t)=>v>t?'up':v<-t?'down':'same';
export function outcome(rows,metric='mean'){const a=rows[0],z=rows.at(-1),tr=metric==='upper'?(z.upper-a.upper)*100:a.mean?(z.mean-a.mean)/Math.abs(a.mean||1)*100:0,pp=a.n?(z.n-a.n)/a.n*100:0;return{traitPct:tr,popPct:pp,trait:dir(tr,5),pop:dir(pp,10)}}
export function evaluate(choice,o){const k=['trait','pop'].filter(d=>choice[d]),ok=k.filter(d=>choice[d]===o[d]).length;return ok===k.length?'correct':ok>0?'partial':'incorrect'}
export const mkRC=(cfg,trials)=>Array.from({length:trials},(_,i)=>simulate({...cfg,seed:cfg.seed+i}).at(-1));
