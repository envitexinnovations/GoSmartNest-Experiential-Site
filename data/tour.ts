export type Room = 'living' | 'kitchen' | 'bedroom';
export type Scene = Room | 'entry' | 'bathroom';
export type Feature = 'welcome'|'lights'|'fan'|'curtains'|'tv'|'kitchen'|'airfryer'|'bedroom'|'ac'|'bedfan'|'bedlight'|'guard'|'night'|'complete'|'doorlock'|'chimney'|'tablelights'|'mixer'|'geyser';
export type Camera = {x:number;y:number;zoom:number};
export type Shot = {id:Feature;room:Room;scene?:Scene;title:string;label:string;hint:string;target:[number,number];camera:Camera};
export const shots:Shot[]=[
 {id:'welcome',room:'living',title:'COME ON IN.',label:'Your smart home',hint:'Scroll to step inside',target:[.5,.5],camera:{x:.5,y:.5,zoom:1}},
 {id:'lights',room:'living',title:'A WARMER WELCOME.',label:'Ceiling lights',hint:'Set the light. Change the feeling.',target:[.493,.195],camera:{x:.49,y:.26,zoom:1.65}},
 {id:'fan',room:'living',title:'COMFORT IN MOTION.',label:'Smart fan',hint:'A little breeze, just your way.',target:[.525,.105],camera:{x:.525,y:.16,zoom:2.05}},
 {id:'curtains',room:'living',title:'HELLO, MORNING.',label:'Morning mode',hint:'Let the day in.',target:[.19,.34],camera:{x:.22,y:.40,zoom:1.65}},
 {id:'tv',room:'living',title:'MAKE YOURSELF AT HOME.',label:'Entertainment',hint:'Your evening, one touch away.',target:[.785,.445],camera:{x:.78,y:.48,zoom:2.3}},
 {id:'doorlock',room:'living',scene:'entry',title:'WELCOME. SAFELY.',label:'Door lock',hint:'Your front door, in your control.',target:[.623,.399],camera:{x:.623,y:.42,zoom:1.9}},
 {id:'kitchen',room:'kitchen',title:'INTO THE KITCHEN.',label:'Kitchen',hint:'Everyday routines, a little easier.',target:[.5,.5],camera:{x:.52,y:.5,zoom:1}},
 {id:'airfryer',room:'kitchen',title:'A SMARTER ROUTINE.',label:'Air fryer',hint:'Power on. Timer set.',target:[.619,.492],camera:{x:.62,y:.5,zoom:3.1}},
 {id:'chimney',room:'kitchen',title:'A FRESHER KITCHEN.',label:'Kitchen chimney',hint:'Switch the extractor on or off.',target:[.41,.30],camera:{x:.42,y:.32,zoom:2.1}},
 {id:'tablelights',room:'kitchen',title:'LIGHT THE EVERYDAY.',label:'Table lights',hint:'A warmer spot to gather.',target:[.555,.155],camera:{x:.54,y:.22,zoom:1.8}},
 {id:'mixer',room:'kitchen',title:'BLEND INTO YOUR DAY.',label:'Mixer / juicer',hint:'A little help with your daily routine.',target:[.366,.478],camera:{x:.366,y:.478,zoom:2.7}},
 {id:'bedroom',room:'bedroom',title:'YOUR QUIET PLACE.',label:'Bedroom',hint:'Comfort follows you here.',target:[.5,.5],camera:{x:.5,y:.5,zoom:1}},
 {id:'ac',room:'bedroom',title:'JUST THE RIGHT FEELING.',label:'Air conditioning',hint:'Settle into your comfort zone.',target:[.726,.23],camera:{x:.72,y:.30,zoom:2.5}},
 {id:'geyser',room:'bedroom',scene:'bathroom',title:'COMFORT, NEXT DOOR.',label:'Bathroom geyser',hint:'A simple on / off for your en-suite.',target:[.737,.148],camera:{x:.737,y:.23,zoom:2}},
 {id:'bedfan',room:'bedroom',title:'REST COMES NATURALLY.',label:'Bedroom fan',hint:'Find your perfect breeze.',target:[.495,.113],camera:{x:.495,y:.18,zoom:2.05}},
 {id:'bedlight',room:'bedroom',title:'SOFTEN THE EVENING.',label:'Bedside lights',hint:'Bright enough to read. Soft enough to unwind.',target:[.29,.49],camera:{x:.32,y:.52,zoom:2.2}},
 {id:'guard',room:'bedroom',title:'GOODNIGHT, WORRIES.',label:'Night guard',hint:'An access and sensor scene for the night.',target:[.929,.509],camera:{x:.83,y:.51,zoom:1.85}},
 {id:'night',room:'bedroom',title:'A GENTLER GOODNIGHT.',label:'Night lights',hint:'A little light, where you need it.',target:[.766,.709],camera:{x:.73,y:.64,zoom:2.4}},
 {id:'complete',room:'bedroom',title:'FEEL AT HOME.',label:'Your home, connected',hint:'Start with one room. Grow from there.',target:[.5,.5],camera:{x:.5,y:.5,zoom:1}},
];
export const roomNames:Record<Room,string>={living:'Living room',kitchen:'Kitchen',bedroom:'Bedroom'};
export const roomStarts:Record<Room,number>={living:shots.findIndex(s=>s.room==='living'),kitchen:shots.findIndex(s=>s.room==='kitchen'),bedroom:shots.findIndex(s=>s.room==='bedroom')};
export const roomEnds:Record<Room,number>={living:shots.length-1-[...shots].reverse().findIndex(s=>s.room==='living'),kitchen:shots.length-1-[...shots].reverse().findIndex(s=>s.room==='kitchen'),bedroom:shots.length-1-[...shots].reverse().findIndex(s=>s.room==='bedroom')};
export const assets:Record<Scene,string>={living:'/tour/living-room.webp',kitchen:'/tour/kitchen.webp',bedroom:'/tour/bedroom.webp',entry:'/tour/entry.webp',bathroom:'/tour/bathroom.webp'};
export const clamp=(n:number,min=0,max=1)=>Math.max(min,Math.min(max,n));
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export function cameraAt(index:number,progress:number,reduced:boolean):Camera{
 const current=shots[index];const previous=shots[Math.max(0,index-1)];if(reduced)return current.camera;
 const start=(previous.scene??previous.room)===(current.scene??current.room)?previous.camera:{x:.5,y:.5,zoom:1.22};
 const t=clamp(progress/.55);const ease=t*t*(3-2*t);
 const base={x:mix(start.x,current.camera.x,ease),y:mix(start.y,current.camera.y,ease),zoom:mix(start.zoom,current.camera.zoom,ease)};
 return base;
}
