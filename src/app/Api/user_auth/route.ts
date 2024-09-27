import { NextApiRequest, NextApiResponse } from "next";

export function handler(req : NextApiRequest, res : NextApiResponse){
    if(req.method === "POST"){
        const {action} = req.body;
        
    }
}