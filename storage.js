export function notify(message){const box=document.querySelector('#notice');box.textContent=message;box.hidden=false;clearTimeout(notify.timer);notify.timer=setTimeout(()=>box.hidden=true,7000);}
export function read(key,fallback=null){try{const raw=localStorage.getItem(key);return raw===null?fallback:JSON.parse(raw);}catch{return fallback;}}
export function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{notify('저장하지 못했어요. 이 화면의 내용은 그대로 남아 있어요.');return false;}}
export function remove(key){try{localStorage.removeItem(key);}catch{notify('저장 공간을 변경할 수 없어요.');}}
export function sessions(){const ids=read('off:session:index',[]);return Array.isArray(ids)?ids.map(id=>read(`off:session:${id}`)).filter(s=>s&&typeof s.id==='string'&&Array.isArray(s.thoughts)&&s.windDown&&s.sound&&s.input):[];}
export function saveSession(session){if(!write(`off:session:${session.id}`,session))return false;const previous=read('off:session:index',[]);const ids=Array.isArray(previous)?previous:[];if(!ids.includes(session.id))ids.push(session.id);return write('off:session:index',ids)&&write('off:current',session.id);}
export const dateKey=(value=new Date())=>new Date(value).toLocaleDateString('sv-SE');
