const path=require('path');
const http=require('http');
const express=require('express');
const {WebSocketServer}=require('ws');
const {BattleStream}=require('pokemon-showdown');
const app=express();
const server=http.createServer(app); const wss=new WebSocketServer({server});
app.use(express.json({limit:'1mb'})); app.use(express.static(__dirname));
const queue=[]; const rooms=new Map(); let rid=1;
function send(ws,msg){if(ws.readyState===1)ws.send(JSON.stringify(msg));}
function pair(){while(queue.length>=2){const a=queue.shift(),b=queue.shift(); startRoom(a,b)}}
function startRoom(a,b){const id='room-'+rid++; const stream=new BattleStream(); const room={id,a,b,stream,logs:[],ended:false}; rooms.set(id,room); a.room=room;b.room=room;a.side='p1';b.side='p2';
 send(a.ws,{type:'matched',room:id,side:'p1',opponent:b.name}); send(b.ws,{type:'matched',room:id,side:'p2',opponent:a.name});
 (async()=>{for await(const output of stream){room.logs.push(output); broadcast(room,{type:'protocol',data:output}); const end=output.startsWith('end'); if(end){room.ended=true; broadcast(room,{type:'ended',data:output})}}})().catch(e=>broadcast(room,{type:'error',message:e.message}));
 const fmt='gen9vgc2026regmc';
 stream.write(`>start ${JSON.stringify({formatid:fmt})}`);
 stream.write(`>player p1 ${JSON.stringify({name:a.name,team:a.team})}`);
 stream.write(`>player p2 ${JSON.stringify({name:b.name,team:b.team})}`);
}
function broadcast(room,msg){send(room.a.ws,msg);send(room.b.ws,msg)}
wss.on('connection',ws=>{const client={ws,name:'CoachPlayer',team:null,side:null,room:null};
 ws.on('message',raw=>{let m;try{m=JSON.parse(raw)}catch{return} if(m.type==='queue'){client.name=String(m.name||'Player').slice(0,24);client.team=String(m.team||''); if(!client.team){send(ws,{type:'error',message:'Falta el equipo empaquetado para iniciar una batalla.'});return} queue.push(client);send(ws,{type:'queued',position:queue.length});pair();}
 else if(m.type==='choice'&&client.room){client.room.stream.write(`>${client.side} ${String(m.choice||'')}`)}
 else if(m.type==='leave'){if(client.room){broadcast(client.room,{type:'ended',data:'|message|Un jugador abandonó la sala.'});client.room=null}else{const i=queue.indexOf(client);if(i>=0)queue.splice(i,1)}}
 });
 ws.on('close',()=>{const i=queue.indexOf(client);if(i>=0)queue.splice(i,1); if(client.room&&!client.room.ended) broadcast(client.room,{type:'ended',data:'|message|Conexión perdida.'})});
});
app.get('/api/health',(req,res)=>res.json({ok:true,queue:queue.length,rooms:rooms.size}));
app.get('/api/showdown-status',(req,res)=>res.json({simulator:'BattleStream',format:'gen9vgc2026regmc',note:'Format id can be changed in server.js when the active ruleset changes.'}));
const port=process.env.PORT||3000;server.listen(port,()=>console.log(`VGC Coach running at http://localhost:${port}`));
