export const cl=(x,a,b)=>Math.min(b,Math.max(a,x));
const hx=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
export const mix=(a,b,t)=>{const A=hx(a),B=hx(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
export const lum=h=>{const[r,g,b]=hx(h);return(.299*r+.587*g+.114*b)/255};
// Seeded RNG: seed fixed at 42 as in the project
export function rng(seed=42){let s=seed;const r=()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};r.g=()=>Math.sqrt(-2*Math.log(r()||1e-9))*Math.cos(6.2832*r());return r}
export const R=rng(42);
// MOTHS: reference curve reconstructed to hit the project's reported points (50:50, 94.6% light at gen 15, 92% dark at gen 45)
const r1=Math.pow(94.6/5.4,1/15),r2=Math.pow((92/8)/(5.4/94.6),1/30);
export const refP=g=>g<=15?(o=>o/(1+o))(r1**g):1-(o=>o/(1+o))(5.4/94.6*r2**(g-15));
// FINCHES: project values at gen 0/20/40, linear between
export const refM=g=>g<=20?3.99-1.04*g/20:2.95+1.9*(g-20)/20;
export const OPT=[2.8,5];
// HARES: fixed coat schedule; calibrated so presets give 38/66/94 mismatch days
export const D1=115,D2=286;
export const coat=d=>d<=D1?1:d<D1+30?1-(d-D1)/30:d<=D2?0:d<D2+30?(d-D2)/30:1;
export const white=d=>coat(d)>.5;
export const snowB=(d,M,S)=>d<M||d>=S;
export const snowV=(d,M,S)=>cl((M+4-d)/8,0,1)+cl((d-S+4)/8,0,1);
export const mmArr=(M,S)=>Array.from({length:365},(_,d)=>white(d)!==snowB(d,M,S));
export const runs=a=>{const r=[];let s=-1;a.forEach((v,i)=>{if(v&&s<0)s=i;if(!v&&s>=0){r.push([s,i]);s=-1}});if(s>=0)r.push([s,a.length]);return r};
export const PRE=[['Normal snow season',0,38],['Shortened by 4 weeks (2 weeks each end)',14,66],['Shortened by 8 weeks (4 weeks each end)',28,94]];
export const dt=d=>new Date(2001,0,1+d).toLocaleDateString('en',{month:'short',day:'numeric'});
