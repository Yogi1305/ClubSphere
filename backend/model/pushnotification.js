import mongoose from 'mongoose';

const pushNotificationSchema = new mongoose.Schema({
   userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   subscription:{
      type: Object,
      required: true
   }
});

const PushNotification = mongoose.model('PushNotification', pushNotificationSchema);

export default PushNotification;
