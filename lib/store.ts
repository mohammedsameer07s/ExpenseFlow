import {Transaction,Budget,Goal,Recurring} from "./types";
const emptyData={transactions:[] as Transaction[],budgets:[] as Budget[],goals:[] as Goal[],recurring:[] as Recurring[]};
const KEY="expenseflow-v3";
export function load(){if(typeof window==="undefined")return emptyData;try{const x=localStorage.getItem(KEY);return x?JSON.parse(x):emptyData}catch{return emptyData}}
export function save(x:any){localStorage.setItem(KEY,JSON.stringify(x))}
export function reset(){localStorage.removeItem(KEY);location.reload()}