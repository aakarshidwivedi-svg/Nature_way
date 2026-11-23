import {useEffect,useRef} from 'react';
import {motion,useInView,animate} from 'framer-motion';
import {Info} from 'lucide-react';
import {LineChart,Line,XAxis,YAxis,CartesianGrid,ReferenceLine,ReferenceArea,ResponsiveContainer,Tooltip} from 'recharts';
export const Sec=({id,tone='',children})=><section id={id} className={`py-24 md:py-36 ${tone==='dk'?'bg-forest text-paper':tone==='alt'?'bg-paper2':''}`}><div className="mx-auto w-[min(1180px,100%-40px)]">{children}</div></section>;
export const H2=({children})=><motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.8}} className="text-5xl md:text-8xl max-w-[15ch]">{children}</motion.h2>;
export const Lead=({children})=><p className="max-w-[56ch] text-lg opacity-85 mt-5 mb-10">{children}</p>;
export const Btn=({on,alt,...p})=><button {...p} className={`px-5 py-2.5 rounded-full border-[1.5px] font-semibold text-sm transition hover:-translate-y-0.5 ${on?'bg-current':alt?'':'bg-ochre text-forest border-ochre'} ${p.className||''}`} style={on?{background:'currentColor'}:undefined}>{on?<span className="mix-blend-difference text-white">{p.children}</span>:p.children}</button>;
export const Badge=({ref_,children})=><span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${ref_?'bg-moss':'bg-alert'}`}>{children}</span>;
export const Slider=({label,val,...p})=><label className="block mt-4 font-medium text-[15px]">{label}: <b className="tabular-nums">{val}</b><input type="range" {...p}/></label>;
export const Insight=({children})=><p className="font-serif text-2xl max-w-[34ch] mt-6 mb-2">{children}</p>;
export const Note=({children})=><p className="text-sm opacity-75 max-w-[60ch] mt-2">{children}</p>;
export const Tip=({text})=><span className="relative group inline-block ml-2 align-middle" tabIndex={0}><Info size={16}/><span className="hidden group-hover:block group-focus:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-60 p-3 rounded-lg bg-paper text-forest text-xs shadow-xl z-10">{text}</span></span>;
export function Counter({from=0,to,d=0}){const ref=useRef(),v=useInView(ref,{once:true,amount:.6});useEffect(()=>{if(!v)return;const a=animate(from,to,{duration:1.6,ease:'easeOut',onUpdate:x=>ref.current&&(ref.current.textContent=x.toFixed(d))});return()=>a.stop()},[v]);return<span ref={ref}>{from.toFixed(d)}</span>}
// Recharts wrapper. lines:[{k,c,dots}] data keyed by x
export function Chart({data,x='x',lines,xd,yd,vlines=[],areas=[],dark,h=250,yfmt}){const fg=dark?'#f2eee3':'#14301f';
return<div style={{height:h}} className="mt-3"><ResponsiveContainer><LineChart data={data} margin={{top:10,right:10,left:-10,bottom:0}}><CartesianGrid stroke={fg} strokeOpacity={.15}/><XAxis dataKey={x} type="number" domain={xd} stroke={fg} fontSize={11} allowDecimals={false}/><YAxis domain={yd} stroke={fg} fontSize={11} tickFormatter={yfmt}/><Tooltip contentStyle={{background:'#f2eee3',color:'#14301f',border:0,borderRadius:8,fontSize:12}}/>
{areas.map(([a,b],i)=><ReferenceArea key={i} x1={a} x2={b} fill="#d8582a" fillOpacity={.45}/>)}{vlines.map(([v,l],i)=><ReferenceLine key={i} x={v} stroke={fg} strokeDasharray="4 3" label={{value:l,fill:fg,fontSize:11,position:'insideTopRight'}}/>)}
{lines.map(l=><Line key={l.k} dataKey={l.k} stroke={l.c} strokeWidth={2.4} dot={l.dots?{r:4}:false} connectNulls isAnimationActive animationDuration={500}/>)}</LineChart></ResponsiveContainer></div>}
