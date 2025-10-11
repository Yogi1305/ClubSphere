self.addEventListener("push",(event)=>{
// TODO
let data = event.data.json();

self.registration.showNotification(
  data.title,
  {
    body: data.body,
    icon: 'image.png',
    vibrate: [200, 100, 200]
  }
);
})