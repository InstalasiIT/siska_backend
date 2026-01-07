import redisClient from "./redis.js";
import ConnectionPostgress from "../frameworks/database/postgress/connection.js";

export default class CommonFunction {
  constructor() {
    this.database_mysyamrabu = ConnectionPostgress.sequelize;
  }

  async cekRedis(cacheKey) {
    if (redisClient.isReady) {
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        console.log(`${cacheKey} ambil dari redis`);
        return {
          status: true,
          data: JSON.parse(cachedData),
        };
      }

      return {
        status: false,
        data: null,
      };
    } else {
      return {
        status: false,
        data: null,
      };
    }
  }
  async setRedis(cacheKey, results, time = 3600 * 24 * 30) {
    if (redisClient.isReady) {
      await redisClient.set(cacheKey, JSON.stringify(results), {
        EX: time,
      });
    }
    console.log(`${cacheKey} set data ke redis`);
  }

  async getNowDate(time = false) {
    const now = new Date();

    const pad = (n) => n.toString().padStart(2, "0");

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1); // bulan mulai dari 0
    const day = pad(now.getDate());

    if (time) {
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    return `${year}-${month}-${day}`;
  }
}
