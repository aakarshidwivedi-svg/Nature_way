import {useState,useEffect} from 'react';
import {motion,useScroll,useSpring} from 'framer-motion';
import Hero from './Hero';import Moths from './Moths';import Finches from './Finches';import Hares from './Hares';import GA from './GA';import Lab from './Lab';
import {Science,Results,Method,Refs,Closing} from './Rest';
import Sandbox from './features/Sandbox';import PredictionLab from './features/PredictionLab';import DigitalTwin from './features/DigitalTwin';import Experiments from './features/Experiments';import Learn from './features/Learn';
const L=[['','Home'],['sandbox','Evolution Sandbox'],['predict','Prediction Lab'],['twin','Digital Twin'],['experiments','Experiments'],['learn','Learn']];
const Home=()=><><Hero/><Science/><Moths/><Finches/><Hares/><GA/><Lab/><Results/><Method/><Refs/><Closing/></>;
const P={sandbox:Sandbox,predict:PredictionLab,twin:DigitalTwin,experiments:Experiments,learn:Learn};
export default function App(){const[h,setH]=useState(location.hash),{scrollYProgress}=useScroll(),sx=useSpring(scrollYProgress,{stiffness:120,damping:25}),r=h.startsWith('#/')?h.slice(2):'',Page=P[r]||Home;
useEffect(()=>{const f=()=>{setH(location.hash);if(location.hash.startsWith('#/'))scrollTo(0,0)};addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);
return<main><nav aria-label="Main" className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-forest/80 text-paper text-sm"><div className="mx-auto w-[min(1180px,100%-40px)] flex gap-5 items-center overflow-x-auto py-3 whitespace-nowrap"><b className="font-serif text-lg mr-3">EVOLVE</b>{L.map(([k,t])=><a key={k} href={`#/${k}`} aria-current={r===k?'page':undefined} className={`hover:text-ochre ${r===k?'text-ochre':''}`}>{t}</a>)}</div><motion.div style={{scaleX:sx}} className="h-[3px] bg-ochre origin-left"/></nav><Page/></main>}
