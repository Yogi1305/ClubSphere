import PushNotification from "../model/pushnotification.js";
import { User } from "../model/User.js";
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
    const role=req.role;
    if(role!=="USER"){
    const { title, body } = req.body;
    const user=await User.find({role:role})
    // Logic to send notification to club members
    const filtersubs=user.filter((u)=>u._id && u.role===role).map((u)=>u._id);
    console.log(filtersubs);
    
    const message = JSON.stringify({
        title,
        body
      });
    const filtersubswithsub=await PushNotification.find({userId:{$in:filtersubs}});
    const subscriptions=filtersubswithsub.filter((u)=>u.subscription);
    
      console.log(subscriptions);
             
              sendNotification(subscriptions,message)

    console.log(`Sending notification to club members:`);

    res.status(200).json({ message: "Notification sent to club members" });}

  } catch (error) {
    console.error("Error sending notification to club members:", error);
    res.status(500).json({ message: "Failed to send notification" });
  }
};


