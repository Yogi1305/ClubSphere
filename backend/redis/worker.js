import { Worker } from "bullmq";
import client from "../redis/redisconfig.js";
import webpush from "web-push"


// Worker to process notification jobs
const notificationWorker = new Worker(
  "notificationQueue", // queue name
  async (job) => {
    console.log(`Processing job: ${job.id} with data:`, job.data);

    try {
       webpush.sendNotification(job.data.subscription, job.data.message)
      console.log(`Job ${job.id} completed successfully`);
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      throw error; // let bullmq handle retries
    }
  },
  {
    connection: client, // redis connection
  }
);

// Log worker events
notificationWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} has been completed`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed with error:`, err);
});

export default notificationWorker;
