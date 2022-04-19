import mongoose from 'mongoose'

// import config from "../config";
// import log from "../utils/logger";

const db = () => {
    return mongoose
        .connect(process.env.MONGODB_URI as string, {
            dbName: process.env.DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        .then(() => {
            console.log('MongoDB connected')
        })
        .catch((err: any) => {
            console.log('DB error', err.message)
            process.exit(1)
        })
}

export default db
