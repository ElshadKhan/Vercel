// import mongoose from "mongoose";
// import * as dotenv from "dotenv";
// dotenv.config()
//
// export async function runDb() {
//     try {
//         await mongoose.connect(process.env.MONGODB_URL || "");
//         console.log("Connected successfully to mongo server")
//     } catch {
//         console.log("Can't connect to db")
//         await mongoose.disconnect()
//     }
// }