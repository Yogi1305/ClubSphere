import webpush from "web-push";
import dotenv from "dotenv";
import PushNotification from "../model/pushnotification.js"; // adjust path
import { Contest } from "../model/Contest.js";
import { addNotificationJob } from "../redis/queue.js";

dotenv.config();

// setup once
webpush.setVapidDetails(
  "mailto:yogesh.22273@knit.ac.in",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
export const sendNotification = async (subscriptions, message) => {
  try {
    for(const {subscription} of subscriptions){
      addNotificationJob({subscription, message});
    }
    
  } catch (error) {
    console.error("Error sending web push notification:", error);
  }
};

