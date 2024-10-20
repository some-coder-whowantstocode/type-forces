import mongoose, {Schema, Document, model} from "mongoose";

export interface competetype extends Document{
    createdBy:string,
    time:Date,
    code:number,
    type:string,
    test:string | null ,
    numbers:boolean,
    symbols:boolean,
    duration:number
}

const competeSchema = new Schema<competetype>({
    createdBy:{
        type:String,
        required:[true, "who created this"],
        maxlength:[25,"Name can not exceed 25 characters"],
        minlength:[4,"Name, can not be smaller than 4 characters"]
    },
    time:{
        type:Date,
        required:[true, "The date for the competetion is required"]
    },
    code:{
        type:Number,
        required:[true,'Code is nessesary for competetion']
    },
    type:{
        type:String,
        default:'public'
    },
    test:{
        type:String
    },
    numbers:{
        type: Boolean,
        default:false
    },
    symbols:{
        type:Boolean,
        default:false
    },
    duration:{
        type:Number,
        default:20
    }
})

export default mongoose.models?.Compete || model<competetype>('Compete',competeSchema)