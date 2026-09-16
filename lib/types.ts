export type TxType="income"|"expense"|"transfer";
export type Transaction={id:string;type:TxType;amount:number;category:string;note:string;date:string;method:string};
export type Budget={id:string;category:string;amount:number;month:string};
export type Goal={id:string;name:string;target:number;current:number;deadline:string};
export type Recurring={id:string;name:string;amount:number;category:string;frequency:string;nextDate:string;active:boolean};