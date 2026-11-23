import {useState,useEffect,useMemo} from 'react';
import {Play,Pause} from 'lucide-react';
import {Sec,H2,Lead,Btn,Badge,Slider,Insight,Note,Chart} from './ui';
import {Hare} from './art';import {mix,coat,white,snowB,snowV,mmArr,runs,PRE,dt,cl} from './lib';
export default function Hares(){const[S0,setS]=useState(320),[M0,setM]=useState(110),[t,setT]=useState(0),[day,setDay]=useState(0),[play,setPlay]=useState(false);
useEffect(()=>{if(!play)return;const i=setInterval(()=>setDay(d=>(d+2)%365),50);return()=>clearInterval(i)},[play]);
const S=Math.min(365,S0+7*t),M=M0-7*t,A=useMemo(()=>mmArr(M,S),[M,S]),n=A.filter(Boolean).length,s=cl(snowV(day,M,S),0,1),cc=coat(day),mm=white(day)!==snowB(day,M,S);
const pre=PRE.find(p=>t===0&&M===110-p[1]&&S===320+p[1]),ref=pre&&pre[2]===n;
const data=useMemo(()=>Array.from({length:122},(_,i)=>({d:i*3,snow:+cl(snowV(i*3,M,S),0,1).toFixed(2),coat:+coat(i*3).toFixed(2)})),[M,S]);
const apply=p=>{setS(320+p);setM(110-p);setT(0)};
return<Sec id="hares" tone="dk"><H2>The hare that stayed white.</H2><Lead>One snowshoe hare, one year. Its coat follows a fixed schedule. Shorten the snow season and the schedule falls out of step with the ground.</Lead>
<div className="rounded-3xl overflow-hidden"><svg viewBox="0 0 600 300" className="block w-full"><rect width="600" height="300" fill={mix('#b5cbb9','#cfd9e0',s)}/><path d="M50 210l36-130 36 130zM470 215l44-160 44 160zM380 205l28-100 28 100z" fill="#2f4a37"/><path d="M-10 215Q300 190 610 215V300H-10z" fill={mix('#76803f','#f7f9fa',s)}/>
{s>.6&&Array.from({length:16},(_,i)=><circle key={i} cx={(i*83+day*3)%600} cy={(i*47+day*5)%200} r="2.2" fill="#fff"/>)}
<Hare c={mix('#6b4f33','#fbfbf8',cc)} x={300} y={225} s={2.1} o={mm?'#d8582a':'#0003'} w={mm?3:1.2}/>
<text x="16" y="28" fontSize="16" fill={s>.5?'#14301f':'#fff'}>{dt(day)}</text><text x="584" y="28" textAnchor="end" fontSize="16" fontWeight="600" fill={mm?'#d8582a':s>.5?'#14301f':'#fff'}>{mm?'Mismatch: coat ≠ ground':'Camouflaged'}</text></svg></div>
<div className="grid md:grid-cols-2 gap-10 mt-8"><div><Badge ref_={!!ref}>{ref?'Matches project reference':'Illustrative setting'}</Badge>
<Slider label="Day of year" val={dt(day)} min={0} max={364} value={day} onChange={e=>setDay(+e.target.value)}/>
<Btn className="mt-3" onClick={()=>setPlay(p=>!p)}>{play?<Pause className="inline mr-1" size={14}/>:<Play className="inline mr-1" size={14}/>}{play?'Pause':'Play the year'}</Btn>
<Slider label="First snowfall" val={dt(S)} min={260} max={364} value={S0} onChange={e=>setS(+e.target.value)}/>
<Slider label="Snowmelt" val={dt(M)} min={40} max={160} value={M0} onChange={e=>setM(+e.target.value)}/>
<Slider label="Warming (illustrative)" val={'+'+t+'°C'} min={0} max={4} step={.5} value={t} onChange={e=>setT(+e.target.value)}/>
<p className="font-semibold mt-4 tabular-nums">Snow season {M+365-S} days · mismatch days this year: {n}{ref?' (project result)':''}</p></div>
<div><Chart dark h={280} data={data} x="d" xd={[0,364]} yd={[0,1]} yfmt={v=>v*100+'%'} areas={runs(A)} vlines={[[day,'']]} lines={[{k:'snow',c:'#9fc3dd'},{k:'coat',c:'#cfa94a'}]}/><Note>Blue: snow cover. Gold: coat whiteness. Orange bands: mismatch days.</Note></div></div>
<h3 className="text-2xl mt-10 mb-3">Snow season scenarios (click to apply)</h3>
{PRE.map(([l,p,v])=>{const a=mmArr(110-p,Math.min(365,320+p)),sn=runs(a.map((_,d)=>snowB(d,110-p,320+p)));return<button key={l} onClick={()=>apply(p)} className="grid grid-cols-1 md:grid-cols-[260px_1fr_80px] gap-3 items-center w-full text-left my-2 text-sm"><span>{l}</span><div className="relative h-5 rounded-full bg-white/10 overflow-hidden border border-white/20">{sn.map(([x,y])=><b key={x} className="absolute inset-y-0 bg-[#cfe1ee]" style={{left:x/3.65+'%',width:(y-x)/3.65+'%'}}/>)}{runs(a).map(([x,y])=><b key={x} className="absolute inset-y-0 bg-alert" style={{left:x/3.65+'%',width:(y-x)/3.65+'%'}}/>)}</div><span className="font-semibold">{v} days</span></button>})}
<Insight>A fixed biological schedule can become a disadvantage when the environment changes.</Insight>
<Note>This follows one hare over one year, not natural selection across generations. Mismatch days are a risk indicator, not a direct measurement of survival. The model is calibrated so its three presets reproduce the project’s 38, 66 and 94 mismatch days; other settings are illustrative.</Note></Sec>}
