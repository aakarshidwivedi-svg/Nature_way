import {mkRC} from '../simulation/engine';
onmessage=e=>postMessage(mkRC(e.data.cfg,e.data.trials).map(l=>({mean:l.mean,n:l.n,upper:l.upper*100})));
