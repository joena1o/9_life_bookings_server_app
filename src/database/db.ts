import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const connection_string: string = process.env.URL || "";

export default async function connectToDb(){
   await mongoose.connect(connection_string).then((res)=>{
     console.log("Connection was successful");                  
   }).catch((err)=>{
      console.log(`Failed to connect due to ${err}`);                 
   });                     
}

//8UPiQf9smIzivgOA