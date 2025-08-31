import mongoose from 'mongoose';

const pushNotificationSchema = new mongoose.Schema({
   userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   fcmToken:{
      type: String,
      required: true
   }
});

const PushNotification = mongoose.model('PushNotification', pushNotificationSchema);

export default PushNotification;
