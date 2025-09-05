import PushNotification from "../model/pushnotification.js";
import { sendNotification } from "../utils/pushnotication.js";


export const sendtoall= async (req, res) => {
  try {
    const { title, body } = req.body;
    const message = JSON.stringify({
        title,
        body
      });
     const subscriptions = await PushNotification.find({}, "subscription");
             
              sendNotification(subscriptions,message)
    
    console.log(`Sending notification to all users:`);

    res.status(200).json({ message: "Notification sent to all users" });
  } catch (error) {
    console.error("Error sending notification to all users:", error);
    res.status(500).json({ message: "Failed to send notification" });
  }
};

export const sendtomembers= async (req, res) => {
  try {
    const { title, body } = req.body;

    // Logic to send notification to club members
    console.log(`Sending notification to club members:`);

    res.status(200).json({ message: "Notification sent to club members" });
  } catch (error) {
    console.error("Error sending notification to club members:", error);
    res.status(500).json({ message: "Failed to send notification" });
  }
};
