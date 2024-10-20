import mongoose from 'mongoose';

declare global {
    var mongoose: any;
}
const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
    return cached.conn;
    }

    if (!cached.promise) {
    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
    });
    }
    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }
    return cached.conn;
}

export default dbConnect;
