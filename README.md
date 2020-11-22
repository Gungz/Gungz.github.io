# Football Club PWA

## Petunjuk untuk Reviewer
a. Tolong ganti token pada `js/api.js` dengan API token dari football-data.org milik Anda. Saya tetap include punya saya karena toh ini free version namun ada baiknya bila diganti.

b. Ganti `gcm_sender_id` pada `manifest.json` dengan sender id milik Anda.

c. Ganti public key yang dipass sebagai parameter pada function `urlBase64ToUint8Array` di line 319 pada `api.js` dengan public key Anda (public key berasal dari eksekusi `web-push generate-vapid-keys --json`). Walau bisa saja punya saya dikeep.

d. Ganti public and private key, gcmAPIKey, endpoint, p256dh, dan auth pada `push.js` dengan milik Anda, jika Anda mau melakukan simulasi. Atau anda bisa keep punya saya dan hanya mengganti hasil subscription yaitu endpoint, p256dh, dan auth.

## Mengenai ESLint
Karena saya tidak menggunakan modul javascript dalam development PWA ini,saya hanya melakukan linting and fixing the lint error pada `service-worker.js` dan `push.js`. Linter bisa dijalankan dengan command `npm run lint`.