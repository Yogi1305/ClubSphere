import admin from "firebase-admin";
// import {serviceAccount} from "./../serviceAccountKey.js" ;
import dotenv from "dotenv";
import PushNotification from "../model/pushnotification.js";
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI,
    tokenUri: process.env.FIREBASE_TOKEN_URI,
    authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    clientC509CertUrl: process.env.FIREBASE_CLIENT_CERT_URL,
    universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN
  })
});

export const subscribetofirebase = async(userId,fcmToken) => {

   const newid= await PushNotification.create({
        userId,
        fcmToken
    });
    await newid.save();
    console.log("Token saved:", newid);

};

export const sendnotification = async (userId, message) => {
    const user = await PushNotification.find({ userId });
    if (!user) {
        console.log("User not found");
        return;
    }

    const token = user.map(u => u.fcmToken);
    const payload = {
        notification: {
            title: "New Notification",
            body: message,
        },
        token: token,
    };

    admin.messaging().send(payload)
        .then((response) => {
            console.log("Successfully sent message:", response);
        })
        .catch((error) => {
            console.log("Error sending message:", error);
        });
};
