import {describe,it,expect} from 'vitest';import {simulate,defaultCfg,outcome,evaluate,stats,summarize} from './engine';
describe('engine',()=>{const c=defaultCfg();
it('is reproducible for a seed',()=>expect(simulate(c)).toEqual(simulate(c)));
it('differs across seeds',()=>expect(simulate({...c,seed:7}).at(-1).mean).not.toBe(simulate(c).at(-1).mean));
it('darker bark selects darker moths',()=>{const o=outcome(simulate(c),'upper');expect(o.trait).toBe('up')});
it('food shortage shrinks the population',()=>{const o=outcome(simulate({...c,species:'generic',init:.5,event:{type:'food',gen:5,mag:1}}));expect(o.pop).toBe('down')});
it('evaluates partial predictions',()=>expect(evaluate({trait:'up',pop:'down'},{trait:'up',pop:'same'})).toBe('partial'));
it('computes stats',()=>{const s=stats([1,2,3]);expect(s.mean).toBe(2);expect(s.sd).toBe(1)});
it('summarizes',()=>expect(summarize(simulate(c)).gens).toBe(40))});
