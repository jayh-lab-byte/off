export const sleepSounds = [15.046531,178.938708,178.233417,191.64,164.075042].map((duration,i)=>({
  id:`sound-0${i+1}`, title:`수면 사운드 0${i+1}`, file:`/assets/audio/sound-0${i+1}.mp3`,
  duration, source:'user-provided', rights:'unverified'
}));
export const categories = {tomorrow:'내일 할 일',later:'나중에 생각할 일',let_go:'오늘은 내려놓을 생각'};
export const presets = {
  breathing:{title:'천천히 호흡하기',description:'4초 들이쉬고, 2초 멈추고, 6초 내쉬어요.',duration:180},
  body_relax:{title:'몸의 긴장 풀기',description:'턱부터 발끝까지, 천천히 힘을 빼요.',duration:180},
  quiet:{title:'고요하게 쉬기',description:'아무것도 하지 않아도 괜찮아요.',duration:0}
};
export const bodySteps=['턱에 힘을 풀어주세요.','어깨를 가볍게 내려놓으세요.','손을 편안하게 놓아주세요.','배에 힘을 풀고 편하게 호흡하세요.','다리와 발끝의 긴장을 내려놓으세요.','지금은 아무것도 하지 않아도 괜찮아요.'];
export function mockAnalysis(text) {
  const parts=text.split(/[\n.!?。]+|그리고\s*/).map(x=>x.trim()).filter(Boolean).slice(0,12);
  return {thoughts:parts.map((original,i)=>({id:`temp-${i}`,original,summary:original,category:/언젠가|나중|여행|장기/.test(original)?'later':/후회|걱정|신경|마음|왜|말.*같/.test(original)?'let_go':'tomorrow'})),tonightMessage:'남겨둔 생각은 아침에 다시 만나요.',windDown:{type:'breathing',duration:180},safety:{flagged:/자살|죽고\s*싶|자해|목숨을|해치고\s*싶/.test(text),type:/자살|죽고\s*싶|자해|목숨을|해치고\s*싶/.test(text)?'high_risk':null}};
}
