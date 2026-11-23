const open=()=>new Promise((res,rej)=>{const q=indexedDB.open('natures-way',1);q.onupgradeneeded=()=>q.result.createObjectStore('runs',{keyPath:'id'});q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)});
const tx=async(m,f)=>{const db=await open();return new Promise((res,rej)=>{const t=db.transaction('runs',m),q=f(t.objectStore('runs'));t.oncomplete=()=>res(q.result);t.onerror=()=>rej(t.error)})};
export const idb={all:()=>tx('readonly',s=>s.getAll()),put:v=>tx('readwrite',s=>s.put(v)),del:id=>tx('readwrite',s=>s.delete(id))};
