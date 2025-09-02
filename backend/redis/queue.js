import { Queue } from "bullmq";
import client from "../redis/redisconfig.js";

// Create queue
export const notificationQueue = new Queue("notificationQueue", {
  connection:client,
  maxRetries: 5,
  backoff: 5000
});

// Function to add jobs
export const addNotificationJob = async ({subscription,message}) => {
  console.log("i am in queue")
  await notificationQueue.add("notificationQueue", {subscription,message}, {
    attempts: 3,       // retry if fails
    backoff: 5000,     // wait before retry
    removeOnComplete: true,
    removeOnFail: false,
    
  });
};
