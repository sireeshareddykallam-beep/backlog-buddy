const CACHE='backlog-buddy-v3';
const CORE=['/','/index.html','/styles.css','/app.js','/config.js','/supabase.js','/manifest.webmanifest','/icons/backlog-buddy.svg','/icons/backlog-buddy-maskable.svg','/papers/dbms-model-paper.pdf','/papers/os-model-paper.pdf','/papers/cn-model-paper.pdf'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||!event.request.url.startsWith(self.location.origin))return;
 const isPage=event.request.mode==='navigate';
 event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(async()=>{const cached=await caches.match(event.request);if(cached)return cached;if(isPage)return caches.match('/index.html');return new Response('Offline resource unavailable',{status:503,headers:{'Content-Type':'text/plain'}})}));
});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()});
