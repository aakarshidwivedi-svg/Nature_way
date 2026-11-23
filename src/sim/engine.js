// Deterministic simulation engines (no React). Every run is reproducible from {params, seed}.
import {rng} from '../lib';
const bin=(r,n,p)=>{let k=0;for(let i=0;i<n;i++)if(r()<p)k++;return k};
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
export const stats=a=>{const n=a.length,m=a.reduce((s,v)=>s+v,0)/n,sd=Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/Math.max(1,n-1));return{n,mean:m,sd,min:Math.min(...a),max:Math.max(...a)}};
// MOTHS: individual-level binomial survival. detection = pred (mismatched) or pred*(1-conceal) (matched); survival = 1-detection
export function mothRun({pred,conceal,p0,env},seed,N=1000,G=45){const r=rng(seed);let L=Math.round(p0*N);const row=(g)=>({g,light:L/N*100,dark:100-L/N*100,nLight:L,nDark:N-L});const rows=[row(0)];
for(let g=1;g<=G;g++){const lb=g<=env,sL=1-pred*(lb?1-conceal:1),sD=1-pred*(lb?1:1-conceal),a=bin(r,L,sL),b=bin(r,N-L,sD);L=bin(r,N,a+b?a/(a+b):.5);rows.push({...row(g),sL,sD})}return rows}
// FINCHES: Gaussian fitness around preferred beak size; strength k = sel*(1.15-food); offspring = parent + N(0,mu)
export function finchRun({mu,av,sel,opt0,opt1,sw},seed,N=200,G=40){const r=rng(seed);let b=Array.from({length:N},()=>3.99+r.g()*.5);const rows=[];
const rec=g=>{const s=stats(b),h=Array(12).fill(0);b.forEach(x=>h[clamp(Math.floor((x-1)/.5),0,11)]++);rows.push({g,mean:+s.mean.toFixed(3),sd:+s.sd.toFixed(3),hist:h})};rec(0);
for(let g=1;g<=G;g++){const opt=g<=sw?opt0:opt1,k=sel*(1.15-av),cum=[];let t=0;b.forEach(x=>{t+=Math.exp(-k*(x-opt)**2/2);cum.push(t)});
b=b.map(()=>{const u=r()*t;let lo=0,hi=N-1;while(lo<hi){const m=(lo+hi)>>1;cum[m]<u?lo=m+1:hi=m}return clamp(b[lo]+r.g()*mu,1,7)});rec(g)}return rows}
// GENETIC ALGORITHM: evolve a binary chromosome to match a target bit sequence (target generated from tseed)
export function gaRun({pop,len,mu,cx,gens,tseed},seed){const r=rng(seed),tr=rng(tseed),T=Array.from({length:len},()=>tr()<.5?1:0),fit=c=>c.reduce((s,v,i)=>s+(v===T[i]),0)/len*100;
let P=Array.from({length:pop},()=>Array.from({length:len},()=>r()<.5?1:0));const rows=[];
const rec=g=>{const f=P.map(fit),bi=f.indexOf(Math.max(...f));rows.push({g,best:+f[bi].toFixed(2),mean:+(f.reduce((a,b)=>a+b,0)/pop).toFixed(2),unique:new Set(P.map(c=>c.join(''))).size,bits:P[bi].slice(),target:T})};rec(0);
const tour=()=>{let b=P[Math.floor(r()*pop)];for(let i=0;i<2;i++){const c=P[Math.floor(r()*pop)];if(fit(c)>fit(b))b=c}return b};
for(let g=1;g<=gens;g++){const el=[...P].sort((a,b)=>fit(b)-fit(a)).slice(0,2).map(c=>c.slice()),N2=el;while(N2.length<pop){const a=tour(),b=tour(),pt=Math.floor(r()*len),ch=r()<cx?a.slice(0,pt).concat(b.slice(pt)):a.slice();N2.push(ch.map(v=>r()<mu?1-v:v))}P=N2;rec(g)}return rows}
export const monteCarlo=(run,params,seed,trials,final)=>{const f=Array.from({length:trials},(_,i)=>final(run(params,seed+i)));const s=stats(f),lo=s.min,hi=s.max,w=(hi-lo)/10||1,h=Array.from({length:10},(_,i)=>({bin:+(lo+i*w).toFixed(1),n:0}));f.forEach(v=>h[Math.min(9,Math.floor((v-lo)/w))].n++);return{...s,hist:h,trials}};
export const toCsv=rows=>{const k=Object.keys(rows[0]).filter(x=>typeof rows[0][x]!=='object');return[k.join(','),...rows.map(r=>k.map(x=>r[x]).join(','))].join('\n')};
