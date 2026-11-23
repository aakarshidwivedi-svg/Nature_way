import {useState} from 'react';
import {Sec,H2,Lead,Btn,Slider,Note,Chart} from './ui';import {cl,R} from './lib';
const N=24,G=12,STEPS=['Generate candidates','Evaluate fitness','Select better','Produce variations','Repeat'];
const tg=(i,ph)=>.5+.38*Math.sin(i/(G-1)*6.2832+ph),fit=(a,ph)=>Math.max(0,1-a.reduce((s,v,i)=>s+Math.abs(v-tg(i,ph)),0)/G*2);
const stats=(pop,ph)=>{const f=pop.map(a=>fit(a,ph));return{best:Math.max(...f),mean:f.reduce((a,b)=>a+b,0)/N}};
const fresh=ph=>{const pop=Array.from({length:N},()=>Array.from({length:G},R));return{pop,gen:0,h:[{i:0,...stats(pop,ph)}]}};
function evolve(st,ph,mu){const s=st.pop.map(a=>[fit(a,ph),a]).sort((a,b)=>b[0]-a[0]),pick=()=>{let b=s[Math.floor(R()*N)];for(let i=0;i<2;i++){const c=s[Math.floor(R()*N)];if(c[0]>b[0])b=c}return b[1]},nx=s.slice(0,3).map(x=>x[1]);
while(nx.length<N){const a=pick(),b=pick();nx.push(a.map((v,i)=>{let g=R()<.5?v:b[i];if(R()<mu)g=cl(g+R.g()*.15,0,1);return g}))}return{pop:nx,gen:st.gen+1,h:[...st.h,{i:st.h.length,...stats(nx,ph)}]}}
export default function GA(){const[ph,setPh]=useState(0),[mu,setMu]=useState(.15),[st,set]=useState(()=>fresh(0)),[hl,setHl]=useState(-1);
const flash=()=>STEPS.forEach((_,k)=>setTimeout(()=>setHl(k),k*80)),step=()=>{set(s=>evolve(s,ph,mu));flash()};
const run=()=>{let n=0;const t=setInterval(()=>{step();if(++n>=30)clearInterval(t)},80)};
const newPh=p=>{setPh(p);set(s=>({...s,h:[...s.h,{i:s.h.length,...stats(s.pop,p)}]}))};
const f=st.pop.map(a=>fit(a,ph)),bi=f.indexOf(Math.max(...f)),X=i=>20+i/(G-1)*560,Y=v=>180-v*170,pts=a=>a.map((v,i)=>`${X(i)},${Y(v)}`).join(' ');
return<Sec id="ga" tone="alt"><H2>Engineers borrow the loop.</H2><Lead>An evolutionary algorithm improves candidate solutions by repeating the same cycle. Each line is one candidate; the dashed line is the target.</Lead>
<div className="flex flex-wrap gap-2 mb-6">{STEPS.map((s,i)=><span key={s} className={`px-3 py-1 rounded-full border border-forest/40 text-sm transition ${hl===i?'bg-forest text-paper':''}`}>{s}</span>)}</div>
<div className="grid md:grid-cols-2 gap-10"><div><svg viewBox="0 0 600 190" className="w-full">{st.pop.map((a,k)=><polyline key={k} points={pts(a)} fill="none" stroke="#14301f" strokeOpacity={.08+f[k]*.3}/>)}<polyline points={pts(st.pop[bi])} fill="none" stroke="#cfa94a" strokeWidth="3.5"/><polyline points={pts(Array.from({length:G},(_,i)=>tg(i,ph)))} fill="none" stroke="#14301f" strokeWidth="2" strokeDasharray="6 5"/>{st.pop[bi].map((v,i)=><circle key={i} cx={X(i)} cy={Y(v)} r="4" fill="#cfa94a"/>)}</svg>
<Chart h={180} data={st.h} x="i" xd={[0,Math.max(10,st.h.length-1)]} yd={[0,1]} yfmt={v=>v*100+'%'} lines={[{k:'best',c:'#7a8b3f'},{k:'mean',c:'#5b4631'}]}/></div>
<div><Slider label="Mutation rate" val={Math.round(mu*100)+'%'} min={0} max={50} value={mu*100} onChange={e=>setMu(e.target.value/100)}/>
<Slider label="Fitness target shape" val={ph.toFixed(1)} min={0} max={628} value={ph*100} onChange={e=>newPh(e.target.value/100)}/>
<div className="flex flex-wrap gap-2 my-4"><Btn onClick={()=>{set(fresh(ph));flash()}}>Generate population</Btn><Btn onClick={step}>Step</Btn><Btn onClick={run}>Run 30</Btn><Btn alt onClick={()=>newPh((ph+1.6)%6.28)}>Shift the target</Btn></div>
<p className="font-semibold tabular-nums">Generation {st.gen} · best {(Math.max(...f)*100).toFixed(1)}% · mean {(st.h.at(-1).mean*100).toFixed(1)}%</p></div></div>
<div className="grid md:grid-cols-2 gap-5 my-8"><div className="p-6 rounded-2xl bg-forest/10"><h3 className="text-2xl">Biological evolution</h3><p className="mt-2">Natural variation → Natural selection → Inheritance → Generations</p><Note>No predefined goal. Fitness is whatever the environment happens to reward.</Note></div><div className="p-6 rounded-2xl bg-forest/10"><h3 className="text-2xl">Evolutionary algorithms</h3><p className="mt-2">Candidate solutions → Fitness evaluation → Selection → Mutation → Iteration</p><Note>The engineer defines the fitness function. Move the target to see fitness collapse and recover.</Note></div></div>
<Note>Link to AI: a hare tuned to last year’s snow is like a model trained on yesterday’s data. When the world shifts (distribution shift), a once-perfect fit becomes a mismatch. “Shift the target” shows the same thing happening to a population.</Note></Sec>}
