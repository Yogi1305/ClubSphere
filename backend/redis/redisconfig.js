import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const client = new Redis({
  username: "default",
  password: process.env.Redis_password,
  host: process.env.Redis_host,
  port: process.env.Redis_port,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
client.on("connect", () => {
  console.log("Redis client connected");
});
client.on("error", (err) => console.log("Redis Client Error", err));

// await client.connect();


export default client;