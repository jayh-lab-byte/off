import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname,sep} from 'node:path';
import handler from './api/thoughts/analyze.js';
const root=fileURLToPath(new URL('.',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.mp3':'audio/mpeg','.svg':'image/svg+xml'};
const allowed=new Set(['index.html','styles.css','app.js','data.js','storage.js','contract.js','sound.js','winddown.js']);
http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');
 res.status=code=>{res.statusCode=code;return res;};res.json=value=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(value));};
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/thoughts/analyze'){let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>16000)return res.status(413).json({error:{code:'VALIDATION_ERROR',message:'입력이 너무 깁니다.'}});}req.body=body;return handler(req,res);}
 try{const name=decodeURIComponent(url.pathname).replace(/^\//,'')||'index.html';if(!allowed.has(name)&&!/^assets\/audio\/sound-0[1-5]\.mp3$/.test(name))throw new Error();const path=resolve(root,name);if(!path.startsWith(root))throw new Error();const info=await stat(path);const data=await readFile(path);res.setHeader('Content-Type',types[extname(path)]||'application/octet-stream');res.setHeader('Accept-Ranges','bytes');res.setHeader('Cache-Control','no-cache');const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);if(range){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),info.size-1):info.size-1;if(start> end){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${info.size}`,'Content-Length':end-start+1});res.end(data.subarray(start,end+1));}else{res.setHeader('Content-Length',data.length);res.end(req.method==='HEAD'?undefined:data);}}catch{res.statusCode=404;res.end('Not found');}
}).listen(Number(process.env.PORT||4174),'127.0.0.1',()=>console.log(`OFF preview: http://127.0.0.1:${process.env.PORT||4174}`));
