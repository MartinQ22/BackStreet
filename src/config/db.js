import mongoose from "mongoose";

//MongoDB
const connectMongoDB = async() => {
  try {
    //env
    await mongoose.connect(process.env.URI_MONGODB)
    console.log("Conectado Con MongoDB");  
  } catch (error) {
    console.log("Error al conectar con MongoDB"); 
  }
};

export default connectMongoDB;