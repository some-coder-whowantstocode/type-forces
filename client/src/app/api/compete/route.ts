import competeRequest from "@/lib/models/compete/competerequest";
import { NextResponse } from "next/server";
import Competes, { competetype } from "@/lib/models/compete/competes";
import dbConnect from "@/lib/mongodb";

export function LinearCongruentialGenerator(seed : number){
    const modulus = 2 ** 31 -1;
    const multiplier = 48271;
    const increment = 0;

    return (multiplier * seed + increment) % modulus;
}


export async function POST(request:Request){
    try {
        const body : competeRequest = await request.json();
        const code = LinearCongruentialGenerator(Date.now());
        const competetiondata = new Date(body.time);
        if(competetiondata < new Date()){
        return NextResponse.json({error:"Tere baap ne past mein competetion rakha tha ?"},{status:400});
        }
        const newcompete  = {
            createdBy:body.name,
            time:body.time,
            code,
            type:body.type || "public",
            numbers:body.numbers || false,
            symbols:body.symbols || false,
            duration:body.duration
        }
        await dbConnect();
        const competetion = await Competes.create(newcompete);
        return NextResponse.json({message:"successfully created competetion", competetion},{status:200});
    } catch (error ) {
        console.log(error);
        return NextResponse.json({error:error.message || "something went wrong in creating competetion"},{status:500});
    }
}