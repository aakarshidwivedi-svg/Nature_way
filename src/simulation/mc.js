import {mkRC} from './engine';
export const runMC=(cfg,trials)=>new Promise(res=>{const sync=()=>res(mkRC(cfg,trials).map(l=>({mean:l.mean,n:l.n,upper:l.upper*100})));
try{const w=new Worker(new URL('../workers/mc.worker.js',import.meta.url),{type:'module'});w.onmessage=e=>{res(e.data);w.terminate()};w.onerror=()=>{w.terminate();sync()};w.postMessage({cfg,trials})}catch{sync()}});
