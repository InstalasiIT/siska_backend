import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    port: 6379,
    host: "172.16.32.150",
  },
  password: "sy4mr4bu",
});

redisClient.on("error", (err) => {
  console.error(" Redis Client Error", err);
});

redisClient
  .connect()
  .then(() => console.log("Redis connected"))
  .catch((err) => console.error("Redis connection error:", err));

export default redisClient;
