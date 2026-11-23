import {useState,useEffect} from 'react';
import {Sec,H2,Lead,Btn,Badge,Slider,Insight,Note,Chart} from './ui';
import {Finch} from './art';import {cl,R,refM,OPT} from './lib';
const init=()=>({g:0,m:3.99,h:[{g:0,sim:3.99}],ref:false});
const PROJ=[{g:0,proj:3.99},{g:20,proj:2.95},{g:40,proj:4.85}];
export default function Finches(){const[s,set]=useState(init),[type,setType]=useState(0),[dry,setDry]=useState(false),[av,setAv]=useState(.7),[play,setPlay]=useState(false);
const adv=n=>set(v=>{let{g,m,h}=v;for(let i=0;i<n&&g<40;i++){g++;const pr=(1.15-av)*(dry?1.5:1);m=cl(m+cl(.22*pr,.02,.4)*(OPT[type]-m)+R.g()*.03,1.5,6.5);h=[...h,{g,sim:+m.toFixed(2)}]}return{g,m,h,ref:false}});
useEffect(()=>{if(!play)return;if(s.g>=40){setPlay(false);return}const t=setTimeout(()=>set(v=>{const g=v.g+1,m=refM(g);return{g,m,h:[...v.h,{g,sim:+m.toFixed(2)}],ref:true}}),140);return()=>clearTimeout(t)},[play,s.g]);
const n=4+Math.round(av*14),fit=Math.max(0,Math.round((1-Math.abs(s.m-OPT[type])/3)*100)),data=[...s.h.map(h=>({...h,...(PROJ.find(p=>p.g===h.g)||{})})),...PROJ.filter(p=>!s.h.some(h=>h.g===p.g))].sort((a,b)=>a.g-b.g);
const touch=f=>()=>{setPlay(false);f()};
return<Sec id="finches"><H2>Beaks follow the food.</H2><Lead>Darwin’s finches on the Galápagos: when seeds change, so does the beak that works best. Beak sizes are relative simulated units, not millimetres.</Lead>
<div className="grid md:grid-cols-[5fr_6fr] gap-10 items-start"><div className="rounded-3xl overflow-hidden" style={{background:'#ecdcab'}}><svg viewBox="0 0 400 300" className="block w-full"><circle cx="330" cy="60" r="36" fill="#f6ecc6"/><path d="M-10 175Q160 200 410 165" stroke="#5b4631" strokeWidth="12" fill="none"/><Finch m={s.m} x={150} y={130} s={1.5}/>
{Array.from({length:type?Math.ceil(n/3):n},(_,i)=><circle key={i} cx={250+(i*53)%130+(type?10:0)} cy={170+(i*37)%110} r={type?9:3.2} fill={type?'#7a5a3a':'#c9b66b'}/>)}</svg></div>
<div><Badge ref_={s.ref}>{s.ref?'Project result (interpolated between 3 reported values)':'Illustrative simulation'}</Badge>
<div className="flex flex-wrap gap-2 my-4"><Btn on={type===0} alt onClick={touch(()=>setType(0))}>Small soft seeds</Btn><Btn on={type===1} alt onClick={touch(()=>setType(1))}>Large hard seeds</Btn><Btn alt onClick={touch(()=>setDry(d=>!d))}>Climate: {dry?'dry':'wet'}</Btn></div>
<Slider label="Food availability" val={Math.round(av*100)+'%'} min={10} max={100} value={av*100} onChange={e=>touch(()=>setAv(e.target.value/100))()}/>
<div className="flex flex-wrap gap-2 my-4"><Btn onClick={touch(()=>adv(1))}>+1 generation</Btn><Btn onClick={touch(()=>adv(20))}>+20 generations</Btn><Btn alt onClick={()=>{set(init());setPlay(true)}}>Play project result</Btn><Btn alt onClick={touch(()=>set(init()))}>Reset</Btn></div>
<p className="font-semibold tabular-nums">Generation {s.g} · mean beak {s.m.toFixed(2)} units · fit for these seeds {fit}%</p>
<Chart data={data} x="g" xd={[0,40]} yd={[2,6]} lines={[{k:'sim',c:'#14301f'},{k:'proj',c:'#cfa94a',dots:true}]}/>
<Note>Gold dots are the project’s results: gen 0 = 3.99, gen 20 = 2.95, gen 40 = 4.85.</Note>
<Insight>Environmental pressure changes which inherited traits are advantageous.</Insight></div></div></Sec>}
