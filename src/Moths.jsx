import {useState,useEffect} from 'react';
import {Play,StepForward,RotateCcw,Contrast} from 'lucide-react';
import {Sec,H2,Lead,Btn,Badge,Slider,Insight,Note,Chart} from './ui';
import {Moth} from './art';import {cl,mix,lum,R,refP} from './lib';
const init=()=>({g:0,p:.5,mode:'ref',b:.1,marks:[15],hist:[{g:0,p:.5}],sel:null});
const step=s=>{if(s.g>=45)return s;const g=s.g+1;if(s.mode==='ref')return{...s,g,p:refP(g),b:g<=15?.1:.9,hist:[...s.hist,{g,p:refP(g)}]};
const fL=1-.35*s.b,fD=1-.35*(1-s.b),p0=s.p*fL/(s.p*fL+(1-s.p)*fD),p=cl(p0+R.g()*Math.sqrt(p0*(1-p0)/1000),.005,.995);return{...s,g,p,hist:[...s.hist,{g,p}]}};
const setBark=(s,b)=>({...s,mode:'ill',b,marks:(s.mode==='ref'?[]:s.marks).concat((b>.5)!==(s.b>.5)?[s.g]:[])});
const POS=Array.from({length:36},(_,i)=>[85+((i*.618)%1)*150,25+((i*.414+i*.07)%1)*385,(i*37)%70-35]);
export default function Moths(){const[s,set]=useState(init),[run,setRun]=useState(false);
useEffect(()=>{if(!run)return;if(s.g>=45){setRun(false);return}const t=setTimeout(()=>set(step),110);return()=>clearTimeout(t)},[run,s.g]);
const bark=mix('#d6cfbd','#2a241d',s.b),nl=Math.round(s.p*36),col=i=>i<nl?'#ece6d6':'#2b2723',L=Math.round(s.p*1000),ref=s.mode==='ref';
const cam=s.sel!=null&&Math.round((1-Math.abs(lum(col(s.sel))-lum(bark)))*100);
const data=s.hist.map(h=>({g:h.g,light:Math.round(h.p*1000),dark:1000-Math.round(h.p*1000)}));
return<Sec id="moths" tone="dk"><H2>Peppered moths and the soot-dark trees.</H2><Lead>Industrial melanism: when bark colour changes, the camouflage advantage flips. Click any moth to inspect how well it hides.</Lead>
<div className="grid md:grid-cols-[5fr_6fr] gap-10 items-start"><div className="rounded-3xl overflow-hidden bg-black/20"><svg viewBox="0 0 320 440" className="block w-full"><rect width="320" height="440" fill="#233a2a"/><rect x="60" width="200" height="440" fill={bark} style={{transition:'fill .4s'}}/><path d="M95 0v440M140 0v440M190 0v440M225 0v440" stroke="#000" strokeOpacity=".18" strokeWidth="2"/>
{POS.map(([x,y,r],i)=><Moth key={i} x={x} y={y} r={r} s={1.1} c={col(i)} sel={s.sel===i} className="cursor-pointer" onClick={()=>set(v=>({...v,sel:i}))}/>)}</svg></div>
<div><Badge ref_={ref}>{ref?'Project reference values':'Illustrative simulation: new output'}</Badge>
<Slider label="Bark colour (light ↔ dark)" val={Math.round(s.b*100)+'%'} min={0} max={100} value={s.b*100} onChange={e=>set(v=>setBark(v,e.target.value/100))}/>
<div className="flex flex-wrap gap-2 my-4"><Btn onClick={()=>{setRun(false);set(step)}}><StepForward className="inline mr-1" size={14}/>Simulate 1 generation</Btn><Btn onClick={()=>setRun(true)}><Play className="inline mr-1" size={14}/>Run all 45</Btn><Btn alt onClick={()=>set(v=>setBark(v,v.b>.5?.1:.9))}><Contrast className="inline mr-1" size={14}/>Toggle bark</Btn><Btn alt onClick={()=>{setRun(false);set(init())}}><RotateCcw className="inline mr-1" size={14}/>Reset</Btn></div>
<p className="font-semibold tabular-nums">Generation {s.g} · Light {(s.p*100).toFixed(1)}% ({L}) · Dark {(100-s.p*100).toFixed(1)}% ({1000-L})</p>
<Chart dark data={data} x="g" xd={[0,45]} yd={[0,1000]} vlines={s.marks.map(m=>[m,'bark changed'])} lines={[{k:'light',c:'#f2eee3'},{k:'dark',c:'#cfa94a'}]}/>
<p className="text-sm min-h-[3em] mt-2">{s.sel==null?'Click a moth on the trunk.':`Moth ${s.sel+1} (${col(s.sel)==='#ece6d6'?'light':'dark'}): camouflage ${cam}% against this bark. ${cam>70?'Hard for a bird to spot.':'Stands out to predators.'}`}</p>
<Insight>The environment determines which trait has the survival advantage.</Insight>
<Note>Project run: 1,000 moths, 50:50 start, light moths reach 94.6% on light bark by generation 15, then bark darkens and dark moths reach 92% by generation 45. The reference curve is interpolated between those reported points. Moving the slider or toggle starts a new illustrative simulation, not the project’s output.</Note></div></div></Sec>}
