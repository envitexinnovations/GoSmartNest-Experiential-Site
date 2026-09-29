'use client';
import {Lightbulb,Fan,Blinds,Tv,Timer,Wind,ShieldCheck,Moon,Minus,Plus,Power,LockKeyhole,Flame,Blend} from 'lucide-react';
import {Switch} from '@/components/ui/switch';
import {Slider} from '@/components/ui/slider';
import type {Shot} from '@/data/tour';
import type {DeviceValues} from './RoomScene';
export const featureIcons={lights:Lightbulb,fan:Fan,curtains:Blinds,tv:Tv,airfryer:Timer,ac:Wind,bedfan:Fan,bedlight:Lightbulb,guard:ShieldCheck,night:Moon,doorlock:LockKeyhole,chimney:Wind,tablelights:Lightbulb,mixer:Blend,geyser:Flame};
type Key=keyof DeviceValues;
export function DeviceControl({shot,values,change,timer,minutes,setMinutes}:{shot:Shot;values:DeviceValues;change:(key:Key,value:number|boolean)=>void;timer:string;minutes:number;setMinutes:(v:number)=>void}){
 const id=shot.id;if(!(id in featureIcons))return null;
 const Icon=featureIcons[id as keyof typeof featureIcons];
 const key:Key=id==='airfryer'?'fryer':id as Key;
 const val=values[key];
 const isLight=id==='lights'||id==='bedlight'||id==='tablelights';const isFan=id==='fan'||id==='bedfan';
 const isCurtain=id==='curtains';const isAC=id==='ac';const isFryer=id==='airfryer';
 const on=typeof val==='number'?val>0:val;
 let status=on?'On':'Off';
 if(isLight)status=on?`${val}% · warm white`:'Off';
 if(isFan)status=on?`Speed ${val} of 3`:'Off';
 if(isCurtain)status=Number(val)>95?'Open':Number(val)<5?'Closed':`${Math.round(Number(val))}% open`;
 if(isAC)status=on?`Cooling · ${values.temperature}°C`:'Off';
 if(id==='guard')status=on?'Armed · access secured':'Disarmed';
 if(id==='doorlock')status=on?'Locked':'Unlocked';
 if(id==='chimney')status=on?'Extraction on':'Off';
 if(id==='mixer')status=on?'Running':'Off';
 if(id==='geyser')status=on?'On · heating':'Off';
 if(isFryer)status=on?'Cooking · demo timer':'Standby';
 return <div className="device-control"><div className="device-heading"><span className="device-icon"><Icon size={23} strokeWidth={1.3}/></span><div><h3>{shot.label}</h3><p>{status}</p></div><Switch checked={Boolean(on)} onCheckedChange={v=>change(key,isLight?(v?75:0):isFan?(v?2:0):isCurtain?(v?100:0):v)} aria-label={id==='doorlock'?'Lock the front door':isCurtain?'Open curtains':`Turn ${shot.label.toLowerCase()} on`}/></div>
 {(isLight||isCurtain)&&<div className="device-range"><Slider min={0} max={100} step={5} value={[Number(val)]} onValueChange={v=>change(key,v[0])} aria-label={isLight?'Light brightness':'Curtain opening'}/><span>{Math.round(Number(val))}%</span></div>}
 {isFan&&<div className="speed-buttons" role="group" aria-label="Fan speed">{[0,1,2,3].map(n=><button key={n} aria-pressed={Number(val)===n} onClick={()=>change(key,n)}>{n===0?<Power size={14}/>:n===1?'Low':n===2?'Medium':'High'}</button>)}</div>}
 {isAC&&<div className="temperature-control"><button aria-label="Lower temperature" onClick={()=>change('temperature',Math.max(16,values.temperature-1))} disabled={values.temperature<=16}><Minus size={18}/></button><span>{values.temperature}<small>°C</small></span><button aria-label="Raise temperature" onClick={()=>change('temperature',Math.min(30,values.temperature+1))} disabled={values.temperature>=30}><Plus size={18}/></button></div>}
 {isFryer&&<><div className="timer-control"><span>{timer}</span><small>MIN : SEC</small></div><div className="timer-presets" role="group" aria-label="Demo cooking duration">{[5,10,15].map(m=><button key={m} aria-pressed={minutes===m} onClick={()=>setMinutes(m)}>{m} min</button>)}</div></>}
 {id==='guard'&&<div className="guard-status"><span>{on?'✓ Door access secured':'— Door access idle'}</span><span>{on?'✓ Motion alert ready':'— Motion alert idle'}</span></div>}
 <div className="control-footnote">{isFryer?'Illustrative compatible-appliance control':id==='guard'?'Illustrative access + sensor scene':'Try the control · illustrative scene'}</div>
 </div>
}
