import {Transaction,Budget,Goal,Recurring} from "./types";
const seed={transactions:[
{id:"1",type:"income",amount:62000,category:"Salary",note:"Monthly salary",date:"2026-09-01",method:"Bank"},
{id:"2",type:"expense",amount:1200,category:"Food",note:"Groceries",date:"2026-09-04",method:"UPI"},
{id:"3",type:"expense",amount:1800,category:"Transport",note:"Travel",date:"2026-09-07",method:"UPI"},
{id:"4",type:"expense",amount:6500,category:"Rent",note:"Monthly rent",date:"2026-09-01",method:"Bank"},
{id:"5",type:"expense",amount:900,category:"Subscriptions",note:"Streaming",date:"2026-09-09",method:"Card"}
] as Transaction[],budgets:[
{id:"b1",category:"Food",amount:6000,month:"2026-09"},{id:"b2",category:"Transport",amount:4000,month:"2026-09"},{id:"b3",category:"Subscriptions",amount:2000,month:"2026-09"},{id:"b4",category:"Shopping",amount:5000,month:"2026-09"}
] as Budget[],goals:[
{id:"g1",name:"Emergency Fund",target:100000,current:33550,deadline:"2027-03-31"},{id:"g2",name:"New Laptop",target:80000,current:22000,deadline:"2027-01-15"}
] as Goal[],recurring:[
{id:"r1",name:"Netflix",amount:649,category:"Subscriptions",frequency:"Monthly",nextDate:"2026-10-09",active:true},{id:"r2",name:"Rent",amount:6500,category:"Rent",frequency:"Monthly",nextDate:"2026-10-01",active:true}
] as Recurring[]};
const KEY="expenseflow-v2";
export function load(){if(typeof window==="undefined")return seed;try{const x=localStorage.getItem(KEY);return x?JSON.parse(x):seed}catch{return seed}}
export function save(x:any){localStorage.setItem(KEY,JSON.stringify(x))}
export function reset(){localStorage.removeItem(KEY);location.reload()}