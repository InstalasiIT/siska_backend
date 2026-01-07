import mongoose from "mongoose";
import LoggerMongo from "../../../utils/logger.js";
import config from "../../../config/config.js";

const connectMongo = async () => {  
  const mongoURI = `mongodb://${config.mongo.user}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}/${config.mongo.name}?authSource=admin`;
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
} catch (err) {
    console.log("MongoDB connected Failed");
  }
};

export default connectMongo;