import {mkdir,copyFile,cp} from 'node:fs/promises';
// Unverified assets are available for local/preview review only.
if(process.env.VERCEL_ENV==='production'){const {sleepSounds}=await import('../data.js');if(sleepSounds.some(s=>!['owned','cleared'].includes(s.rights)))throw new Error('Confirm audio rights in data.js before production deployment.');}
await mkdir('dist',{recursive:true});
for(const file of ['index.html','styles.css','app.js','data.js','contract.js','storage.js','winddown.js','sound.js'])await copyFile(file,`dist/${file}`);
await cp('assets','dist/assets',{recursive:true});
console.log('OFF static build complete: dist/');
