import mongoose from "mongoose";
import config from "../../../config/config.js";

const LogSchema = new mongoose.Schema({
  level: String,
  timestamp: String,
  pid: String,
  hostname: String,
  req: Object,
  res: Object,
  responTime: String,
  msg: String,
});

const LoggerDB = mongoose.model(config.mongo.logName, LogSchema);

export default LoggerDB;
