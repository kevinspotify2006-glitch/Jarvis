'use client';

import { FormEvent, useState } from 'react';

type Message={role:'user'|'assistant';content:string};

const starter=['Plan mijn dag efficiënt','Help me met een programmeerprobleem','Analyseer een idee voor een bedrijf'];

export default function Home(){
 const [messages,setMessages]=useState<Message[]>([]); const [input,setInput]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
 async function send(e?:FormEvent){e?.preventDefault();const text=input.trim();if(!text||loading)return;setInput('');setError('');const next=[...messages,{role:'user' as const,content:text}];setMessages(next);setLoading(true);try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:next})});const data=await r.json();if(!r.ok)throw new Error(data.error||'Er ging iets mis.');setMessages([...next,{role:'assistant',content:data.content}]);}catch(err){setError(err instanceof Error?err.message:'Er ging iets mis.');}finally{setLoading(false)}}
 function reset(){setMessages([]);setError('')}
 return <div className="app">
  <aside className="side"><div className="brand"><div className="orb">J</div><div><strong>JARVIS</strong><small>PERSONAL AI SYSTEM</small></div></div><button className="new" onClick={reset}>＋ Nieuwe conversatie</button><div className="section">Systeem</div><div className="chats"><button className="chat active">Huidige sessie</button></div><div className="sideBottom"><button className="settings" onClick={()=>alert('Server-side AI configuratie wordt via Vercel Environment Variables beheerd.')}>⚙ Systeeminstellingen</button></div></aside>
  <main className="main"><header className="top"><div className="status"><span className="dot"/> JARVIS ONLINE</div><div className="pill">MULTI-LLM ROUTER · VERCEL</div></header>
   <section className="content">{messages.length===0?<div className="welcome"><div className="heroOrb">J</div><h1>HOW MAY I ASSIST?</h1><p>Een persoonlijke AI-assistent met intelligente modelrouting. Stel een vraag, geef een opdracht of begin met één van de suggesties.</p><div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap',marginTop:24}}>{starter.map(s=><button key={s} className="chat" style={{border:'1px solid var(--line)',background:'#0b1119'}} onClick={()=>setInput(s)}>{s}</button>)}</div></div>:<div className="messages">{messages.map((m,i)=><div className={'row '+m.role} key={i}><div className="bubble"><div className="label">{m.role==='user'?'You':'JARVIS'}</div>{m.content}</div></div>)}{loading&&<div className="row"><div className="bubble"><div className="label">JARVIS</div>Denkt na…</div></div>}</div>}{error&&<div className="error">{error}</div>}</section>
   <div className="composerWrap"><form className="composer" onSubmit={send}><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Bericht aan JARVIS…" rows={1}/><button className="send" type="submit" disabled={loading||!input.trim()}>↑</button></form></div>
  </main></div>
}
