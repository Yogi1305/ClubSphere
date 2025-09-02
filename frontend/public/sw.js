self.addEventListener("push",(event)=>{
// TODO
let data = event.data.json();

self.registration.showNotification(
  data.title,
  {
    body: data.body,
    icon: '126.jpg',
    vibrate: [200, 100, 200]
  }
);
})