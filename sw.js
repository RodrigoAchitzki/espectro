const CACHE='espectro-v2';
const CORE=['./espectro.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./privacidade.html',
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const keep=(req,res)=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return res};
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  // Página: rede primeiro, para receber atualizações; cache quando estiver offline
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>keep(req,r)).catch(()=>caches.match(req).then(r=>r||caches.match('./espectro.html'))));return}
  // Demais arquivos: cache primeiro
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>keep(req,res))));
});
