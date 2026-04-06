import mongoose from "mongoose";

const mongodbUrl = process.env.MONGO_URI 

if(!mongodbUrl){
    throw new Error("MONGO_URI is not defined in environment variables");
}

let cache = global.mongoose
if(!cache){
    cache = global.mongoose = { conn: null, promise: null };
}


const connectDB = async () => {
    if (cache.conn) {
        return cache.conn;
    }

    if (!cache.promise) {
        // Add a server selection timeout to fail faster during debugging
        cache.promise = mongoose
            .connect(mongodbUrl, { serverSelectionTimeoutMS: 10000 })
            .then((conn) => conn.connection);
    }

    try {
        const conn = await cache.promise;
        cache.conn = conn;
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Re-throw so callers can handle the failure instead of silently proceeding
        throw error;
    }
};

export default connectDB;