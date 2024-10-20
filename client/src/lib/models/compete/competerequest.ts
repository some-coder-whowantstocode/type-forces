export default interface competeRequest{
    name:string,
    time:Date,
    code:string,
    type:string,
    test:string,
    numbers?:boolean,
    symbols?:boolean,
    duration:number
}