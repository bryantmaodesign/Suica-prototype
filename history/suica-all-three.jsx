import { useState, useMemo } from "react";
import {
  Train, ShoppingBag, Star, ArrowLeftRight,
  Upload, ChevronRight, ChevronUp, X,
  TrendingUp, TrendingDown, CreditCard,
  MapPin, List, Navigation, Clock,
  BarChart3
} from "lucide-react";

// ─── Design System Tokens ────────────────────────────────────────────────────
const B = {
  // Brand
  green:       "#00833E",   // --brand-default
  greenDark:   "#005C2B",   // --brand-strong
  greenTint:   "#E6F4ED",   // --brand-subtle
  greenBorder: "#B8E5CE",   // --brand-green-200
  // Text
  silver:      "#9B9A94",   // --text-tertiary
  ink:         "#1F1E1B",   // --text-primary
  inkLight:    "#5E5D58",   // --text-secondary
  // Surface
  bg:          "#F5F4F1",   // --surface-page
  surface:     "#FFFFFF",   // --surface-default
  raised:      "#EBEAE6",   // --surface-raised
  line:        "#D8D7D2",   // --border-default
  // Semantic
  blue:        "#1250A8",   // --info-default
  blueTint:    "#ECF3FF",   // --info-subtle
  red:         "#A62628",   // --error-default
  redTint:     "#FBEAE8",   // --error-subtle
  amber:       "#9A7505",   // --warning-default
  amberTint:   "#FEFACE",   // --warning-subtle
};

// DS Shadows
const S = {
  xs:  "0 1px 2px rgba(0,0,0,0.08)",
  sm:  "0 1px 4px rgba(0,0,0,0.04)",
  md:  "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
  lg:  "0 3px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.10)",
  bsm: "0 4px 12px rgba(0,131,62,0.10)",
  bmd: "0 6px 20px rgba(0,131,62,0.10), 0 2px 6px rgba(0,0,0,0.04)",
};

// DS Font family
const FF = "-apple-system, 'Inter', sans-serif";

// ─── Shared data ─────────────────────────────────────────────────────────────
const CARDS = [
  { id:1, name:"My Suica",   last:"0012", balance:4280  },
  { id:2, name:"Work Suica", last:"8821", balance:12050 },
];

const TX = [
  { id:1,  date:"2026-04-27", time:"08:12", type:"transport", label:"Shinjuku → Shibuya",   sub:"JR Yamanote Line",       amount:-210,  bal:4280,  pts:0,   station:"Shibuya"   },
  { id:2,  date:"2026-04-27", time:"13:44", type:"purchase",  label:"7-Eleven",              sub:"Convenience Store",      amount:-543,  bal:4490,  pts:5,   station:"Shibuya"   },
  { id:3,  date:"2026-04-26", time:"19:20", type:"jre",       label:"JRE Points Earned",     sub:"Shopping reward",        amount:0,     bal:5033,  pts:120, station:"Tokyo"     },
  { id:4,  date:"2026-04-26", time:"09:05", type:"transport", label:"Tokyo → Akihabara",     sub:"JR Chuo Line",           amount:-170,  bal:5033,  pts:0,   station:"Akihabara" },
  { id:5,  date:"2026-04-25", time:"18:33", type:"tappay",    label:"Received from Keiko",   sub:"Tappay transfer",        amount:3000,  bal:5203,  pts:0,   station:"Shinjuku"  },
  { id:6,  date:"2026-04-25", time:"12:10", type:"purchase",  label:"Lawson",                sub:"Convenience Store",      amount:-890,  bal:2203,  pts:8,   station:"Shinjuku"  },
  { id:7,  date:"2026-04-24", time:"08:01", type:"transport", label:"Ueno → Ikebukuro",      sub:"Tokyo Metro Marunouchi", amount:-240,  bal:3093,  pts:0,   station:"Ikebukuro" },
  { id:8,  date:"2026-04-24", time:"15:22", type:"purchase",  label:"Excelsior Café",        sub:"Café",                   amount:-620,  bal:3333,  pts:6,   station:"Ikebukuro" },
  { id:9,  date:"2026-04-23", time:"11:00", type:"jre",       label:"JRE Points Redeemed",   sub:"Converted to balance",   amount:500,   bal:3953,  pts:-50, station:"Tokyo"     },
  { id:10, date:"2026-04-23", time:"10:45", type:"tappay",    label:"Tappay Top-up",         sub:"Linked bank account",    amount:5000,  bal:3453,  pts:0,   station:"Tokyo"     },
  { id:11, date:"2026-04-22", time:"07:58", type:"transport", label:"Harajuku → Ebisu",      sub:"JR Yamanote Line",       amount:-170,  bal:1547,  pts:0,   station:"Ebisu"     },
  { id:12, date:"2026-04-22", time:"13:30", type:"purchase",  label:"NewDays Kiosk",         sub:"Station Shop",           amount:-340,  bal:1717,  pts:3,   station:"Ebisu"     },
  { id:13, date:"2026-04-21", time:"08:03", type:"transport", label:"Shinjuku → Tachikawa",  sub:"JR Chuo Line Rapid",     amount:-398,  bal:2057,  pts:0,   station:"Tachikawa" },
  { id:14, date:"2026-04-21", time:"17:45", type:"purchase",  label:"MUJI Tachikawa",        sub:"Retail",                 amount:-2400, bal:2455,  pts:24,  station:"Tachikawa" },
];

const TYPE_CFG = {
  transport: { Icon:Train,          label:"Transport",  color:B.blue,  tint:B.blueTint  },
  purchase:  { Icon:ShoppingBag,    label:"Purchase",   color:B.red,   tint:B.redTint   },
  jre:       { Icon:Star,           label:"JRE Points", color:B.amber, tint:B.amberTint },
  tappay:    { Icon:ArrowLeftRight, label:"Tappay",     color:B.green, tint:B.greenTint },
};

const MONTHLY = [
  {m:"Nov",v:8200},{m:"Dec",v:11400},{m:"Jan",v:7100},
  {m:"Feb",v:9300},{m:"Mar",v:10600},{m:"Apr",v:4980},
];
const WEEK = [
  {day:"Mon",date:"21",spend:2798},{day:"Tue",date:"22",spend:510},
  {day:"Wed",date:"23",spend:0},   {day:"Thu",date:"24",spend:860},
  {day:"Fri",date:"25",spend:890}, {day:"Sat",date:"26",spend:170},
  {day:"Mon",date:"27",spend:753},
];

// ─── Map geometry ─────────────────────────────────────────────────────────────
const STATIONS = {
  Shinjuku:  {x:132,y:135}, Shibuya:   {x:142,y:200},
  Ebisu:     {x:150,y:228}, Harajuku:  {x:132,y:214},
  Ikebukuro: {x:128,y:78},  Ueno:      {x:238,y:78},
  Tokyo:     {x:254,y:152}, Akihabara: {x:264,y:118},
  Tachikawa: {x:28, y:148},
};
const YAMANOTE_PTS = [[128,78],[164,57],[213,50],[253,70],[278,98],[283,132],[268,163],[254,192],[238,214],[213,238],[184,253],[157,258],[149,254],[132,240],[120,220],[113,198],[111,170],[115,146],[118,113],[124,88],[128,78]].map(p=>p.join(",")).join(" ");
const CHUO_PTS     = [[28,148],[62,144],[94,141],[132,138],[200,146],[254,152]].map(p=>p.join(",")).join(" ");
const MARU_PTS     = [[128,78],[174,98],[228,128],[254,152],[240,196]].map(p=>p.join(",")).join(" ");
const GINZA_PTS    = [[238,78],[248,118],[254,152],[248,190],[238,214]].map(p=>p.join(",")).join(" ");
const CITY_BLOCKS  = [
  {x:30,y:55,w:38,h:18},{x:72,y:55,w:24,h:18},{x:30,y:80,w:28,h:14},{x:62,y:78,w:32,h:16},
  {x:165,y:42,w:30,h:16},{x:198,y:42,w:26,h:16},{x:285,y:80,w:32,h:18},{x:290,y:102,w:26,h:16},
  {x:288,y:140,w:28,h:18},{x:285,y:162,w:24,h:20},{x:168,y:260,w:32,h:18},{x:202,y:260,w:28,h:18},
  {x:92,y:255,w:28,h:18},{x:122,y:255,w:22,h:18},{x:40,y:162,w:26,h:16},{x:40,y:182,w:24,h:14},
  {x:220,y:46,w:18,h:14},{x:196,y:58,w:22,h:14},{x:295,y:200,w:26,h:16},
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function groupByDate(txns) {
  const m = {};
  txns.forEach(t => { (m[t.date] ??= []).push(t); });
  return Object.entries(m).sort((a,b) => b[0].localeCompare(a[0]));
}
function relDate(ds) {
  const diff = Math.round((new Date("2026-04-27") - new Date(ds)) / 86400000);
  if (diff===0) return "Today";
  if (diff===1) return "Yesterday";
  return new Date(ds+"T00:00:00").toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"});
}
function fmtAmt(t) {
  if (t.amount===0) return `${t.pts>0?"+":""}${t.pts} pt`;
  return `${t.amount>0?"+":""}¥${Math.abs(t.amount).toLocaleString()}`;
}
function amtColor(t) {
  if (t.amount>0) return B.green;
  if (t.amount===0) return B.amber;
  return B.ink;
}
function pinR(count) { return Math.min(14, 8+count*1.5); }

// ═══════════════════════════════════════════════════════════════════════════════
// SHELL
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [v, setV] = useState(1);
  return (
    <div style={{background:B.raised, minHeight:"100vh", fontFamily:FF}}>

      {v !== 3 && (
        <div style={{
          position:"fixed", top:0, left:0, right:0, zIndex:9999,
          background:B.surface, borderBottom:`1px solid ${B.line}`,
          display:"flex", alignItems:"center", padding:"0 12px", height:44, gap:4,
          boxShadow:S.sm,
        }}>
          <div style={{
            width:24, height:24, borderRadius:8,
            background:B.green, display:"flex", alignItems:"center",
            justifyContent:"center", marginRight:8, flexShrink:0,
          }}>
            <Train size={13} color="#fff" strokeWidth={2.5}/>
          </div>
          <span style={{fontSize:13,fontWeight:700,color:B.ink,marginRight:"auto",letterSpacing:-.3,fontFamily:FF}}>Suica</span>
          {[[1,"Functional"],[2,"Insights"],[3,"Map View"]].map(([n,lbl])=>(
            <button key={n} onClick={()=>setV(n)} style={{
              padding:"5px 14px", borderRadius:24, border:"none", cursor:"pointer",
              fontSize:12, fontWeight:600, transition:"all 0.15s",
              background: v===n ? B.green : "transparent",
              color: v===n ? "#fff" : B.silver,
              fontFamily:FF,
            }}>{lbl}</button>
          ))}
        </div>
      )}

      {v===3 && (
        <div style={{
          position:"fixed", top:10, right:14, zIndex:9999,
          display:"flex", gap:6,
        }}>
          {[[1,"Functional"],[2,"Insights"],[3,"Map"]].map(([n,lbl])=>(
            <button key={n} onClick={()=>setV(n)} style={{
              padding:"6px 14px", borderRadius:24, border:"none", cursor:"pointer",
              fontSize:11, fontWeight:600, transition:"all 0.15s",
              background: v===n ? B.green : "rgba(255,255,255,.92)",
              color: v===n ? "#fff" : B.inkLight,
              boxShadow:S.lg,
              fontFamily:FF,
            }}>{lbl}</button>
          ))}
        </div>
      )}

      <div style={v!==3 ? {paddingTop:44} : {}}>
        {v===1 && <V1/>}
        {v===2 && <V2/>}
        {v===3 && <V3/>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// V1 — FUNCTIONAL
// ═══════════════════════════════════════════════════════════════════════════════
function V1() {
  const [card,setCard]      = useState(1);
  const [selDay,setSelDay]  = useState(null);
  const [typeF,setTypeF]    = useState("all");
  const [exportOpen,setEx]  = useState(false);
  const [exportRange,setER] = useState("month");

  const filtered = TX.filter(t =>
    (typeF==="all" || t.type===typeF) &&
    (!selDay || t.date.endsWith(selDay))
  );
  const grouped   = groupByDate(filtered);
  const maxSpend  = Math.max(...WEEK.map(w=>w.spend), 1);
  const totalSpent= Math.abs(filtered.filter(t=>t.amount<0).reduce((a,t)=>a+t.amount,0));

  return (
    <div style={{maxWidth:430,margin:"0 auto",background:B.bg,minHeight:"100vh",paddingBottom:100,fontFamily:FF}}>

      {/* Card selector */}
      <div style={{background:B.surface,borderBottom:`1px solid ${B.line}`,padding:"12px 16px"}}>
        <div style={{display:"flex",gap:8}}>
          {CARDS.map(c=>(
            <button key={c.id} onClick={()=>setCard(c.id)} style={{
              flex:1,padding:"10px 14px",borderRadius:16,cursor:"pointer",
              border: card===c.id ? `1.5px solid ${B.green}` : `1.5px solid ${B.line}`,
              background: card===c.id ? B.greenTint : B.surface,
              textAlign:"left",transition:"all 0.18s",
              boxShadow: card===c.id ? S.bsm : S.xs,
            }}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <CreditCard size={13} color={card===c.id?B.green:B.silver} strokeWidth={2}/>
                <span style={{fontSize:11,color:card===c.id?B.green:B.silver,fontWeight:500,letterSpacing:.3}}>
                  {c.name} ···{c.last}
                </span>
              </div>
              <div style={{fontSize:22,fontWeight:700,color:B.ink,letterSpacing:-.8}}>
                ¥{c.balance.toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Week strip */}
      <div style={{background:B.surface,padding:"10px 16px 0",borderBottom:`1px solid ${B.line}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:11,fontWeight:500,color:B.inkLight,letterSpacing:.3}}>APR 21 – 27</span>
          {selDay && (
            <button onClick={()=>setSelDay(null)} style={{
              display:"flex",alignItems:"center",gap:3,background:"none",border:"none",
              cursor:"pointer",color:B.silver,fontSize:11,fontFamily:FF,
            }}><X size={11}/> Clear</button>
          )}
        </div>
        <div style={{display:"flex",gap:4}}>
          {WEEK.map(w=>{
            const sel     = selDay===w.date;
            const isToday = w.date==="27";
            const barH    = Math.max(4,(w.spend/maxSpend)*32);
            return (
              <button key={w.date} onClick={()=>setSelDay(sel?null:w.date)} style={{
                flex:1,display:"flex",flexDirection:"column",alignItems:"center",
                gap:3,background:"none",border:"none",cursor:"pointer",padding:"0 0 10px",
              }}>
                <div style={{width:"100%",height:36,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
                  <div style={{
                    width:"70%",borderRadius:"3px 3px 0 0",height:barH,
                    background: sel?B.green : isToday?B.greenBorder : B.line,
                    transition:"all 0.18s",
                  }}/>
                </div>
                <span style={{fontSize:9,color:sel?B.green:B.silver,fontWeight:500,height:10,lineHeight:"10px"}}>
                  {sel&&w.spend>0 ? `¥${(w.spend/1000).toFixed(1)}k` : ""}
                </span>
                <span style={{fontSize:11,color:sel?B.green:isToday?B.ink:B.silver,fontWeight:sel||isToday?600:400}}>
                  {w.day}
                </span>
                <div style={{
                  width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                  background: sel?B.green : isToday?B.raised:"transparent",transition:"all 0.18s",
                }}>
                  <span style={{fontSize:11,fontWeight:700,color:sel?"#fff":isToday?B.ink:B.silver}}>{w.date}</span>
                </div>
                <div style={{width:4,height:4,borderRadius:"50%",background:w.spend>0?(sel?"#fff":B.greenBorder):"transparent"}}/>
              </button>
            );
          })}
        </div>
      </div>

      {/* Type filter + export */}
      <div style={{background:B.surface,borderBottom:`1px solid ${B.line}`,display:"flex",alignItems:"center"}}>
        {[["all","All"],["transport","Train"],["purchase","Shop"],["jre","Points"],["tappay","Pay"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTypeF(k)} style={{
            flex:1,padding:"11px 2px",border:"none",cursor:"pointer",background:"none",
            borderBottom: typeF===k?`2px solid ${B.green}`:"2px solid transparent",
            color: typeF===k?B.green:B.silver,
            fontSize:11,fontWeight:typeF===k?600:400,transition:"all 0.15s",letterSpacing:.2,
            fontFamily:FF,
          }}>{l}</button>
        ))}
        <div style={{width:1,height:24,background:B.line,flexShrink:0}}/>
        <button onClick={()=>setEx(!exportOpen)} style={{
          padding:"10px 14px",border:"none",cursor:"pointer",background:"none",
          display:"flex",alignItems:"center",gap:5,color:exportOpen?B.green:B.silver,
        }}>
          <Upload size={13} strokeWidth={2}/>
        </button>
      </div>

      {/* Export panel */}
      {exportOpen && (
        <div style={{background:B.surface,margin:"8px 16px",borderRadius:16,padding:16,border:`1px solid ${B.greenBorder}`,boxShadow:S.bsm}}>
          <div style={{fontSize:13,fontWeight:600,color:B.ink,marginBottom:12}}>Export history</div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            {[["week","This week"],["month","This month"],["3m","Last 3 months"],["all","All time"]].map(([k,l])=>(
              <button key={k} onClick={()=>setER(k)} style={{
                flex:1,padding:"7px 2px",borderRadius:8,cursor:"pointer",fontSize:10,fontWeight:500,
                border: exportRange===k?`1.5px solid ${B.green}`:`1.5px solid ${B.line}`,
                background: exportRange===k?B.greenTint:B.surface,
                color: exportRange===k?B.green:B.inkLight,transition:"all 0.15s",
                fontFamily:FF,
              }}>{l}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={{flex:1,padding:11,background:B.green,border:"none",color:"#fff",fontWeight:600,fontSize:13,borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:FF}}>
              <Upload size={14}/> PDF
            </button>
            <button style={{flex:1,padding:11,background:B.surface,border:`1.5px solid ${B.green}`,color:B.green,fontWeight:600,fontSize:13,borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:FF}}>
              <BarChart3 size={14}/> CSV
            </button>
          </div>
        </div>
      )}

      {/* Summary row */}
      <div style={{padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:13,color:B.silver}}>
          {selDay ? `Apr ${selDay}` : "April 2026"} · {filtered.length} transactions
        </span>
        <span style={{fontSize:13,fontWeight:600,color:B.ink}}>¥{totalSpent.toLocaleString()} spent</span>
      </div>

      {/* Transaction list */}
      <div style={{padding:"0 16px"}}>
        {grouped.length===0 && (
          <div style={{textAlign:"center",padding:48,color:B.silver,fontSize:13}}>No transactions</div>
        )}
        {grouped.map(([date,txns])=>(
          <div key={date} style={{marginBottom:4}}>
            <div style={{fontSize:11,fontWeight:500,color:B.silver,padding:"12px 2px 6px",letterSpacing:.4,textTransform:"uppercase"}}>
              {relDate(date)}
            </div>
            <div style={{background:B.surface,borderRadius:16,overflow:"hidden",border:`1px solid ${B.line}`,boxShadow:S.xs}}>
              {txns.map((t,i)=>{
                const {Icon,color,tint}=TYPE_CFG[t.type];
                return (
                  <div key={t.id} style={{
                    padding:"12px 14px",display:"flex",alignItems:"center",gap:12,
                    borderBottom: i<txns.length-1?`1px solid ${B.line}`:"none",
                  }}>
                    <div style={{width:40,height:40,borderRadius:12,background:tint,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <Icon size={18} color={color} strokeWidth={1.8}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:15,fontWeight:600,color:B.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.label}</div>
                      <div style={{fontSize:11,color:B.silver,marginTop:2,display:"flex",alignItems:"center",gap:4}}>
                        <Clock size={10} color={B.silver}/> {t.time} · {t.sub}
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:15,fontWeight:600,color:amtColor(t)}}>{fmtAmt(t)}</div>
                      <div style={{fontSize:11,color:B.silver,marginTop:2}}>¥{t.bal.toLocaleString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// V2 — INSIGHTS
// ═══════════════════════════════════════════════════════════════════════════════
function V2() {
  const [card,setCard]      = useState(1);
  const [period,setPer]     = useState("week");
  const [typeF,setTypeF]    = useState("all");
  const [exportOpen,setEx]  = useState(false);

  const cardData  = CARDS.find(c=>c.id===card);
  const filtered  = TX.filter(t => typeF==="all" || t.type===typeF);
  const grouped   = groupByDate(filtered);
  const spent     = Math.abs(filtered.filter(t=>t.amount<0).reduce((a,t)=>a+t.amount,0));
  const income    = filtered.filter(t=>t.amount>0).reduce((a,t)=>a+t.amount,0);
  const pts       = filtered.reduce((a,t)=>a+t.pts,0);
  const txCount   = filtered.length;

  const byType    = Object.entries(TYPE_CFG).map(([k,cfg])=>({
    key:k,...cfg,
    total: Math.abs(TX.filter(t=>t.type===k&&t.amount<0).reduce((a,t)=>a+t.amount,0)),
  }));
  const typeTotal = byType.reduce((a,b)=>a+b.total,0)||1;
  const maxType   = Math.max(...byType.map(b=>b.total),1);
  const maxMonth  = Math.max(...MONTHLY.map(m=>m.v),1);
  const maxWeek   = Math.max(...WEEK.map(w=>w.spend),1);

  const balPts    = TX.slice(0,8).reverse().map(t=>t.bal);
  const minB      = Math.min(...balPts), maxB = Math.max(...balPts);
  const SW=260, SH=44;
  const toSY      = (v,h) => h-((v-minB)/(maxB-minB||1))*h;
  const sparkPts  = balPts.map((v,i)=>`${(i/(balPts.length-1))*SW},${toSY(v,SH)}`).join(" ");

  return (
    <div style={{maxWidth:430,margin:"0 auto",background:B.bg,minHeight:"100vh",paddingBottom:100,fontFamily:FF}}>

      {/* Green hero */}
      <div style={{background:`linear-gradient(150deg,${B.greenDark} 0%,${B.green} 100%)`,padding:"20px 20px 24px"}}>
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {CARDS.map(c=>(
            <button key={c.id} onClick={()=>setCard(c.id)} style={{
              flex:1,padding:"9px 12px",borderRadius:16,cursor:"pointer",border:"none",
              background: card===c.id?"rgba(255,255,255,.96)":"rgba(255,255,255,.12)",
              textAlign:"left",transition:"all 0.18s",
            }}>
              <div style={{fontSize:10,color:card===c.id?B.green:"rgba(255,255,255,.55)",fontWeight:500,marginBottom:3,letterSpacing:.4}}>
                {c.name} ···{c.last}
              </div>
              <div style={{fontSize:20,fontWeight:700,color:card===c.id?B.ink:"#fff",letterSpacing:-.6}}>
                ¥{c.balance.toLocaleString()}
              </div>
            </button>
          ))}
        </div>

        {/* Period picker */}
        <div style={{background:"rgba(0,0,0,.18)",borderRadius:8,padding:3,display:"flex",gap:2,marginBottom:20}}>
          {[["today","Today"],["week","Week"],["month","Month"],["3m","3 Months"]].map(([k,l])=>(
            <button key={k} onClick={()=>setPer(k)} style={{
              flex:1,padding:"6px 4px",borderRadius:6,border:"none",cursor:"pointer",
              background: period===k?"rgba(255,255,255,.96)":"transparent",
              color: period===k?B.green:"rgba(255,255,255,.6)",
              fontSize:11,fontWeight:period===k?600:400,transition:"all 0.18s",
              fontFamily:FF,
            }}>{l}</button>
          ))}
        </div>

        <div style={{fontSize:11,color:"rgba(255,255,255,.6)",fontWeight:500,letterSpacing:.4,marginBottom:4}}>TOTAL SPENT THIS WEEK</div>
        <div style={{fontSize:34,fontWeight:700,color:"#fff",letterSpacing:-1,lineHeight:1}}>¥{spent.toLocaleString()}</div>
        <div style={{display:"flex",alignItems:"center",gap:4,marginTop:6}}>
          <TrendingDown size={13} color="rgba(255,255,255,.6)"/>
          <span style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>¥{income.toLocaleString()} received · {pts} pts earned</span>
        </div>
      </div>

      {/* Filter + export strip */}
      <div style={{background:B.surface,padding:"10px 16px",borderBottom:`1px solid ${B.line}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[["all","All"],["transport","Train"],["purchase","Shop"],["jre","Points"],["tappay","Pay"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTypeF(k)} style={{
              padding:"5px 12px",borderRadius:24,border:"none",cursor:"pointer",
              fontSize:11,fontWeight:500,transition:"all 0.15s",
              background: typeF===k?B.green:B.raised,
              color: typeF===k?"#fff":B.inkLight,
              fontFamily:FF,
            }}>{l}</button>
          ))}
        </div>
        <button onClick={()=>setEx(!exportOpen)} style={{
          background:"none",border:"none",cursor:"pointer",color:exportOpen?B.green:B.silver,
          display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:500,
          fontFamily:FF,
        }}>
          <Upload size={13}/> Export
        </button>
      </div>

      {exportOpen && (
        <div style={{background:B.surface,margin:"8px 16px 0",borderRadius:16,padding:16,border:`1px solid ${B.greenBorder}`,boxShadow:S.bsm}}>
          <div style={{fontSize:13,fontWeight:600,color:B.ink,marginBottom:10}}>Export history</div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            {["This week","This month","3 months","All time"].map(l=>(
              <button key={l} style={{flex:1,padding:"7px 2px",borderRadius:8,border:`1px solid ${B.line}`,background:B.surface,fontSize:10,fontWeight:500,color:B.inkLight,cursor:"pointer",fontFamily:FF}}>{l}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={{flex:1,padding:11,background:B.green,border:"none",color:"#fff",fontWeight:600,fontSize:13,borderRadius:8,cursor:"pointer",fontFamily:FF}}>PDF</button>
            <button style={{flex:1,padding:11,background:B.surface,border:`1.5px solid ${B.green}`,color:B.green,fontWeight:600,fontSize:13,borderRadius:8,cursor:"pointer",fontFamily:FF}}>CSV</button>
          </div>
        </div>
      )}

      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:12}}>

        {/* KPI tiles */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {label:"Transactions",value:txCount,       sub:"this week", Icon:List,  color:B.blue},
            {label:"JRE Points",   value:`+${pts}`,    sub:"earned",    Icon:Star,  color:B.amber},
          ].map(({label,value,sub,Icon,color})=>(
            <div key={label} style={{background:B.surface,borderRadius:16,padding:"14px 16px",border:`1px solid ${B.line}`,boxShadow:S.xs}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <span style={{fontSize:11,color:B.silver,fontWeight:400}}>{label}</span>
                <Icon size={15} color={color} strokeWidth={1.8}/>
              </div>
              <div style={{fontSize:28,fontWeight:700,color:B.ink,letterSpacing:-.5,lineHeight:1}}>{value}</div>
              <div style={{fontSize:11,color:B.silver,marginTop:4}}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Balance sparkline */}
        <div style={{background:B.surface,borderRadius:16,padding:"16px 18px",border:`1px solid ${B.line}`,boxShadow:S.xs}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:B.ink}}>Balance</div>
              <div style={{fontSize:11,color:B.silver,marginTop:2}}>Last 8 transactions</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:20,fontWeight:700,color:B.ink}}>¥{cardData.balance.toLocaleString()}</div>
              <div style={{fontSize:11,color:B.green,fontWeight:500,display:"flex",alignItems:"center",gap:2,justifyContent:"flex-end"}}>
                <TrendingUp size={11}/> Current
              </div>
            </div>
          </div>
          <svg width="100%" viewBox={`0 0 ${SW} ${SH+6}`} style={{height:54,overflow:"visible"}} preserveAspectRatio="none">
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={B.green} stopOpacity=".16"/>
                <stop offset="100%" stopColor={B.green} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <polygon points={`0,${SH} ${sparkPts} ${SW},${SH}`} fill="url(#sg)"/>
            <polyline points={sparkPts} fill="none" stroke={B.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {balPts.map((v,i)=>(
              <circle key={i} cx={(i/(balPts.length-1))*SW} cy={toSY(v,SH)} r="3" fill="#fff" stroke={B.green} strokeWidth="1.8"/>
            ))}
          </svg>
        </div>

        {/* Daily spend bars */}
        <div style={{background:B.surface,borderRadius:16,padding:"16px 18px",border:`1px solid ${B.line}`,boxShadow:S.xs}}>
          <div style={{fontSize:13,fontWeight:600,color:B.ink,marginBottom:14}}>Daily spending · This week</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80}}>
            {WEEK.map(w=>{
              const h=Math.max(4,(w.spend/maxWeek)*64);
              const isToday=w.date==="27";
              return (
                <div key={w.date} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <span style={{fontSize:9,color:isToday?B.green:"transparent",fontWeight:600}}>
                    {isToday?`¥${(w.spend/1000).toFixed(1)}k`:"·"}
                  </span>
                  <div style={{width:"100%",borderRadius:"4px 4px 0 0",height:h,background:isToday?B.green:B.greenBorder,transition:"height 0.4s"}}/>
                  <span style={{fontSize:9,color:isToday?B.ink:B.silver,fontWeight:isToday?600:400}}>{w.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut + category bars */}
        <div style={{background:B.surface,borderRadius:16,padding:"16px 18px",border:`1px solid ${B.line}`,boxShadow:S.xs}}>
          <div style={{fontSize:13,fontWeight:600,color:B.ink,marginBottom:4}}>Category breakdown</div>
          <div style={{fontSize:11,color:B.silver,marginBottom:14}}>April 2026</div>
          {(()=>{
            const R=54,CX=70,CY=70,stroke=18;
            const circ=2*Math.PI*R;
            let offset=0;
            const slices=byType.filter(b=>b.total>0).map(b=>{
              const dash=(b.total/typeTotal)*circ;
              const s={...b,dash,offset};
              offset+=dash;
              return s;
            });
            return (
              <div style={{display:"flex",gap:16,alignItems:"center"}}>
                <svg width={140} height={140} viewBox="0 0 140 140" style={{flexShrink:0}}>
                  {slices.map((s,i)=>(
                    <circle key={i} cx={CX} cy={CY} r={R} fill="none" stroke={s.color} strokeWidth={stroke}
                      strokeDasharray={`${s.dash} ${circ-s.dash}`} strokeDashoffset={-s.offset}
                      style={{transform:"rotate(-90deg)",transformOrigin:"70px 70px"}}/>
                  ))}
                  <text x={CX} y={CY-6} textAnchor="middle" style={{fontSize:17,fontWeight:700,fill:B.ink,fontFamily:FF}}>
                    ¥{(typeTotal/1000).toFixed(1)}k
                  </text>
                  <text x={CX} y={CY+11} textAnchor="middle" style={{fontSize:9,fill:B.silver,fontFamily:FF}}>total spent</text>
                </svg>
                <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
                  {byType.map(b=>(
                    <div key={b.key}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <div style={{width:8,height:8,borderRadius:"50%",background:b.color,flexShrink:0}}/>
                          <span style={{fontSize:11,color:B.inkLight,fontWeight:400}}>{b.label}</span>
                        </div>
                        <span style={{fontSize:11,fontWeight:600,color:B.ink}}>¥{b.total.toLocaleString()}</span>
                      </div>
                      <div style={{height:3,background:B.line,borderRadius:2,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${(b.total/maxType)*100}%`,background:b.color,borderRadius:2,transition:"width 0.5s"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Monthly trend */}
        <div style={{background:B.surface,borderRadius:16,padding:"16px 18px",border:`1px solid ${B.line}`,boxShadow:S.xs}}>
          <div style={{fontSize:13,fontWeight:600,color:B.ink,marginBottom:4}}>6-month trend</div>
          <div style={{fontSize:11,color:B.silver,marginBottom:14}}>Monthly total spend</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:8,height:72}}>
            {MONTHLY.map(m=>{
              const h=Math.max(4,(m.v/maxMonth)*58);
              const isCur=m.m==="Apr";
              return (
                <div key={m.m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  <span style={{fontSize:9,color:isCur?B.green:"transparent",fontWeight:600}}>
                    {isCur?`¥${(m.v/1000).toFixed(1)}k`:"·"}
                  </span>
                  <div style={{width:"100%",borderRadius:"4px 4px 0 0",height:h,background:isCur?B.green:B.line,transition:"height 0.4s"}}/>
                  <span style={{fontSize:9,color:isCur?B.ink:B.silver,fontWeight:isCur?600:400}}>{m.m}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transaction list */}
        <div style={{borderRadius:16,overflow:"hidden",border:`1px solid ${B.line}`,boxShadow:S.xs}}>
          <div style={{background:B.greenTint,padding:"12px 16px",borderBottom:`1px solid ${B.greenBorder}`}}>
            <div style={{fontSize:13,fontWeight:600,color:B.greenDark}}>All transactions</div>
          </div>
          {grouped.map(([date,txns])=>(
            <div key={date}>
              <div style={{background:B.raised,padding:"8px 16px",borderBottom:`1px solid ${B.line}`}}>
                <span style={{fontSize:11,fontWeight:500,color:B.silver,letterSpacing:.4,textTransform:"uppercase"}}>{relDate(date)}</span>
              </div>
              {txns.map((t,i)=>{
                const {Icon,color,tint}=TYPE_CFG[t.type];
                return (
                  <div key={t.id} style={{
                    background:B.surface,padding:"11px 16px",display:"flex",alignItems:"center",gap:12,
                    borderBottom:`1px solid ${B.line}`,
                  }}>
                    <div style={{width:40,height:40,borderRadius:12,background:tint,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <Icon size={18} color={color} strokeWidth={1.8}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:15,fontWeight:600,color:B.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.label}</div>
                      <div style={{fontSize:11,color:B.silver,marginTop:2}}>{t.time} · {t.sub}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:15,fontWeight:600,color:amtColor(t)}}>{fmtAmt(t)}</div>
                      <div style={{fontSize:11,color:B.silver,marginTop:1}}>¥{t.bal.toLocaleString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// V3 — MAP VIEW
// Full-viewport map. Bottom sheet (peek / half / full). No calendar.
// ═══════════════════════════════════════════════════════════════════════════════
function V3() {
  const [card,setCard]        = useState(1);
  const [typeF,setTypeF]      = useState("all");
  const [selStation,setSel]   = useState(null);
  const [sheetState,setSheet] = useState("peek");
  const [exportOpen,setEx]    = useState(false);

  const cardData = CARDS.find(c=>c.id===card);

  const filtered = useMemo(()=>
    TX.filter(t => typeF==="all" || t.type===typeF),
    [typeF]
  );

  const stationMap = useMemo(()=>{
    const m={};
    filtered.forEach(t=>{ (m[t.station]??=[]).push(t); });
    return m;
  },[filtered]);

  const selTx    = selStation ? (stationMap[selStation]||[]) : [];
  const selSpent = Math.abs(selTx.filter(t=>t.amount<0).reduce((a,t)=>a+t.amount,0));
  const overviewGroups = groupByDate(filtered);

  const SHEET_H = {peek:96, half:340, full:600};
  const sheetH  = SHEET_H[sheetState];

  function tapPin(name) {
    if (selStation===name) { setSel(null); setSheet("peek"); }
    else { setSel(name); setSheet("half"); }
  }
  function cycleSheet() {
    setSheet(s => s==="peek"?"half" : s==="half"?"full":"peek");
  }

  function TxRow({t,borderBottom}) {
    const {Icon,color,tint}=TYPE_CFG[t.type];
    return (
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:borderBottom?`1px solid ${B.line}`:"none"}}>
        <div style={{width:40,height:40,borderRadius:12,background:tint,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <Icon size={18} color={color} strokeWidth={1.8}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:15,fontWeight:600,color:B.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.label}</div>
          <div style={{fontSize:11,color:B.silver,marginTop:2,display:"flex",alignItems:"center",gap:4}}>
            <Clock size={10} color={B.silver}/> {t.time} · {selStation ? t.sub : t.station}
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontSize:15,fontWeight:600,color:amtColor(t)}}>{fmtAmt(t)}</div>
          <div style={{fontSize:11,color:B.silver,marginTop:1}}>¥{t.bal.toLocaleString()}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth:430, margin:"0 auto",
      height:"100vh", maxHeight:860,
      position:"relative", overflow:"hidden",
      background:"#E8ECF0",
      display:"flex", flexDirection:"column",
      fontFamily:FF,
    }}>

      {/* ── MAP — fills entire background ── */}
      <div style={{position:"absolute",inset:0,zIndex:0}}>
        <svg viewBox="0 0 400 320" style={{width:"100%",height:"100%",display:"block"}}
          preserveAspectRatio="xMidYMid slice">

          <rect width={400} height={320} fill="#EEF1F5"/>

          {CITY_BLOCKS.map((b,i)=>(
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={2} fill="#E4E8EF" stroke="#D8DCE4" strokeWidth={.4}/>
          ))}

          {/* Tokyo Bay */}
          <ellipse cx={360} cy={290} rx={80} ry={55} fill="#DDE8F2" opacity={.7}/>
          <text x={328} y={298} style={{fontSize:8,fill:"#A8C0D8",fontWeight:500}}>Tokyo Bay</text>

          {/* Major roads */}
          {[[[0,148],[400,148]],[[160,0],[160,320]],[[254,0],[254,320]]].map(([[x1,y1],[x2,y2]],i)=>(
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D8DCE4" strokeWidth={3} strokeLinecap="round"/>
          ))}

          {/* Train lines */}
          <polygon points={YAMANOTE_PTS} fill="rgba(100,160,230,.07)" stroke="#5BA4E8" strokeWidth={2.8} strokeLinejoin="round"/>
          <polyline points={CHUO_PTS}    fill="none" stroke="#E8803A" strokeWidth={2.2} strokeLinecap="round"/>
          <polyline points={MARU_PTS}    fill="none" stroke="#D04050" strokeWidth={2.2} strokeDasharray="6 3" strokeLinecap="round"/>
          <polyline points={GINZA_PTS}   fill="none" stroke="#F0A020" strokeWidth={2}   strokeDasharray="3 3" strokeLinecap="round"/>

          {/* Inactive station dots */}
          {Object.entries(STATIONS).filter(([n])=>!stationMap[n]).map(([name,pos])=>(
            <g key={name}>
              <circle cx={pos.x} cy={pos.y} r={4} fill="#fff" stroke="#C8CDD8" strokeWidth={1.5}/>
              <text x={pos.x} y={pos.y-7} textAnchor="middle" style={{fontSize:7,fill:"#B0B8C8",fontWeight:500}}>{name}</text>
            </g>
          ))}

          {/* Active station pins */}
          {Object.entries(stationMap).map(([name,txns])=>{
            const pos=STATIONS[name]; if(!pos) return null;
            const isSel=selStation===name;
            const r=pinR(txns.length);
            const spent=Math.abs(txns.filter(t=>t.amount<0).reduce((a,t)=>a+t.amount,0));
            return (
              <g key={name} onClick={()=>tapPin(name)} style={{cursor:"pointer"}}>
                {isSel&&<>
                  <circle cx={pos.x} cy={pos.y} r={r+10} fill={`${B.green}18`} stroke={`${B.green}40`} strokeWidth={1.5}/>
                  <circle cx={pos.x} cy={pos.y} r={r+5}  fill={`${B.green}25`} stroke={`${B.green}60`} strokeWidth={1}/>
                </>}
                <circle cx={pos.x} cy={pos.y+1.5} r={r} fill="rgba(0,0,0,.12)" style={{filter:"blur(2px)"}}/>
                <circle cx={pos.x} cy={pos.y} r={r}
                  fill={isSel?B.green:"#fff"} stroke={isSel?B.greenDark:B.green} strokeWidth={isSel?0:2.5}
                  style={{transition:"all 0.22s"}}/>
                <text x={pos.x} y={pos.y+4} textAnchor="middle"
                  style={{fontSize:r>10?9:8,fontWeight:700,fill:isSel?"#fff":B.green,fontFamily:FF}}>
                  {txns.length}
                </text>
                <text x={pos.x} y={pos.y+r+11} textAnchor="middle"
                  style={{fontSize:8.5,fontWeight:isSel?700:500,fill:isSel?B.greenDark:B.inkLight,fontFamily:FF}}>
                  {name}
                </text>
                {isSel&&spent>0&&(
                  <g>
                    <rect x={pos.x-24} y={pos.y-r-23} width={48} height={16} rx={8} fill={B.greenDark}/>
                    <text x={pos.x} y={pos.y-r-12} textAnchor="middle"
                      style={{fontSize:8,fontWeight:600,fill:"#fff",fontFamily:FF}}>
                      ¥{spent.toLocaleString()}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Legend */}
          <rect x={8} y={270} width={112} height={44} rx={4} fill="rgba(255,255,255,.88)"/>
          {[["#5BA4E8","Yamanote",283],["#E8803A","Chuo",295],["#D04050","Marunouchi",307]].map(([color,label,y])=>(
            <g key={label}>
              <line x1={14} y1={y} x2={30} y2={y} stroke={color} strokeWidth={2.5} strokeLinecap="round"
                strokeDasharray={label==="Marunouchi"?"5 3":undefined}/>
              <text x={35} y={y+3.5} style={{fontSize:7.5,fill:"#555",fontFamily:FF,fontWeight:500}}>{label}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* ── FLOATING CARD + CONTROLS ── */}
      <div style={{position:"absolute",top:0,left:0,right:0,zIndex:30,padding:"10px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>

        {/* Card badge */}
        <div style={{
          background:B.surface,borderRadius:16,padding:"8px 12px",
          boxShadow:S.lg,
          display:"flex",alignItems:"center",gap:8,flex:1,
        }}>
          <div style={{
            width:30,height:30,borderRadius:8,background:B.green,
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
          }}>
            <Train size={14} color="#fff" strokeWidth={2.5}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,color:B.silver,fontWeight:500,letterSpacing:.4}}>
              {cardData.name} ···{cardData.last}
            </div>
            <div style={{fontSize:17,fontWeight:700,color:B.ink,letterSpacing:-.5,lineHeight:1.2}}>
              ¥{cardData.balance.toLocaleString()}
            </div>
          </div>
          {/* Card dot switcher */}
          <div style={{display:"flex",gap:4}}>
            {CARDS.map(c=>(
              <button key={c.id} onClick={()=>setCard(c.id)} style={{
                width:8,height:8,borderRadius:"50%",border:"none",cursor:"pointer",
                background:card===c.id?B.green:B.line,transition:"all 0.18s",
              }}/>
            ))}
          </div>
        </div>

        {/* Export */}
        <button onClick={()=>setEx(!exportOpen)} style={{
          width:46,height:46,borderRadius:12,border:"none",cursor:"pointer",
          background:exportOpen?B.green:B.surface,
          boxShadow:S.lg,
          display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.18s",
        }}>
          <Upload size={16} color={exportOpen?"#fff":B.inkLight} strokeWidth={2}/>
        </button>
      </div>

      {/* Export dropdown */}
      {exportOpen && (
        <div style={{
          position:"absolute",top:72,right:14,zIndex:40,
          background:B.surface,borderRadius:16,padding:16,width:220,
          boxShadow:"0 8px 32px rgba(0,0,0,.16)",
        }}>
          <div style={{fontSize:13,fontWeight:600,color:B.ink,marginBottom:10}}>Export history</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
            {["This week","This month","Last 3 months","All time"].map(l=>(
              <button key={l} style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${B.line}`,background:B.surface,fontSize:13,cursor:"pointer",color:B.inkLight,textAlign:"left",fontWeight:400,fontFamily:FF}}>
                {l}
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={{flex:1,padding:9,background:B.green,border:"none",color:"#fff",fontWeight:600,fontSize:13,borderRadius:8,cursor:"pointer",fontFamily:FF}}>PDF</button>
            <button style={{flex:1,padding:9,background:B.surface,border:`1.5px solid ${B.green}`,color:B.green,fontWeight:600,fontSize:13,borderRadius:8,cursor:"pointer",fontFamily:FF}}>CSV</button>
          </div>
        </div>
      )}

      {/* ── TYPE FILTER PILLS ── */}
      <div style={{
        position:"absolute",top:72,left:0,right:0,zIndex:20,
        padding:"0 14px",display:"flex",gap:6,overflowX:"auto",
      }}>
        {[["all","All"],["transport","Train"],["purchase","Shop"],["jre","Points"],["tappay","Pay"]].map(([k,l])=>(
          <button key={k} onClick={()=>{setTypeF(k);setSel(null);setSheet("peek");}} style={{
            padding:"7px 16px",borderRadius:24,border:"none",cursor:"pointer",
            fontSize:11,fontWeight:500,flexShrink:0,transition:"all 0.15s",
            background:typeF===k?B.green:B.surface,
            color:typeF===k?"#fff":B.inkLight,
            boxShadow:S.md,
            fontFamily:FF,
          }}>{l}</button>
        ))}
      </div>

      {/* ── BOTTOM SHEET ── */}
      <div style={{
        position:"absolute",bottom:0,left:0,right:0,zIndex:20,
        background:B.surface,borderRadius:"24px 24px 0 0",
        boxShadow:"0 -4px 24px rgba(0,0,0,.12)",
        height:sheetH,transition:"height 0.28s cubic-bezier(0.16,1,0.3,1)",
        display:"flex",flexDirection:"column",overflow:"hidden",
      }}>

        {/* Handle + header */}
        <div onClick={cycleSheet} style={{padding:"10px 16px 0",cursor:"pointer",flexShrink:0}}>
          <div style={{width:36,height:4,borderRadius:2,background:B.line,margin:"0 auto 10px"}}/>

          {selStation ? (
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:10,borderBottom:`1px solid ${B.line}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:36,height:36,borderRadius:12,background:B.greenTint,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <MapPin size={16} color={B.green} strokeWidth={2}/>
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:B.ink,letterSpacing:-.3}}>{selStation}</div>
                  <div style={{fontSize:11,color:B.silver,marginTop:1}}>
                    {selTx.length} transactions{selSpent>0?` · ¥${selSpent.toLocaleString()} spent`:""}
                  </div>
                </div>
              </div>
              <button onClick={e=>{e.stopPropagation();setSel(null);setSheet("peek");}} style={{
                width:28,height:28,borderRadius:"50%",background:B.raised,border:"none",cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>
                <X size={13} color={B.inkLight} strokeWidth={2.5}/>
              </button>
            </div>
          ) : (
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:10,borderBottom:`1px solid ${B.line}`}}>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:B.ink,letterSpacing:-.3}}>
                  {Object.keys(stationMap).length} stations visited
                </div>
                <div style={{fontSize:11,color:B.silver,marginTop:1}}>
                  {filtered.length} transactions · April 2026
                </div>
              </div>
              <ChevronUp size={18} color={B.silver} strokeWidth={2}
                style={{transform:sheetState==="full"?"rotate(180deg)":"none",transition:"transform 0.28s"}}/>
            </div>
          )}
        </div>

        {/* Sheet body */}
        <div style={{flex:1,overflowY:sheetState==="peek"?"hidden":"auto",padding:"0 16px 24px"}}>

          {/* PEEK — station quick-chips */}
          {sheetState==="peek" && (
            <div style={{padding:"10px 0 0",display:"flex",gap:8}}>
              {Object.entries(stationMap).slice(0,4).map(([name,txns])=>(
                <button key={name} onClick={()=>tapPin(name)} style={{
                  flex:1,padding:"7px 6px",borderRadius:8,border:`1px solid ${B.line}`,
                  background:B.surface,cursor:"pointer",textAlign:"center",
                  boxShadow:S.xs,fontFamily:FF,
                }}>
                  <div style={{fontSize:11,fontWeight:600,color:B.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</div>
                  <div style={{fontSize:11,color:B.silver,marginTop:2}}>{txns.length} tx</div>
                </button>
              ))}
            </div>
          )}

          {/* HALF / FULL — station transactions */}
          {sheetState!=="peek" && selStation && (
            <div style={{marginTop:12}}>
              {groupByDate(selTx).map(([date,txns])=>(
                <div key={date}>
                  <div style={{fontSize:11,fontWeight:500,color:B.silver,padding:"10px 0 6px",letterSpacing:.4,textTransform:"uppercase"}}>
                    {relDate(date)}
                  </div>
                  {txns.map((t,i)=><TxRow key={t.id} t={t} borderBottom={i<txns.length-1}/>)}
                </div>
              ))}
            </div>
          )}

          {/* HALF / FULL — overview (no station selected) */}
          {sheetState!=="peek" && !selStation && (
            <>
              <div style={{marginTop:12,marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:500,color:B.silver,letterSpacing:.4,marginBottom:8,textTransform:"uppercase"}}>Stations</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {Object.entries(stationMap).map(([name,txns])=>(
                    <button key={name} onClick={()=>tapPin(name)} style={{
                      padding:"6px 12px",borderRadius:24,cursor:"pointer",
                      border:`1px solid ${B.greenBorder}`,background:B.greenTint,
                      display:"flex",alignItems:"center",gap:6,
                      fontFamily:FF,
                    }}>
                      <MapPin size={11} color={B.green} strokeWidth={2}/>
                      <span style={{fontSize:11,fontWeight:600,color:B.greenDark}}>{name}</span>
                      <span style={{fontSize:11,color:B.green}}>{txns.length}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{fontSize:11,fontWeight:500,color:B.silver,letterSpacing:.4,marginBottom:8,textTransform:"uppercase"}}>All transactions</div>
              {overviewGroups.map(([date,txns])=>(
                <div key={date}>
                  <div style={{fontSize:11,color:B.silver,padding:"8px 0 4px",fontWeight:500}}>{relDate(date)}</div>
                  {txns.map((t,i)=><TxRow key={t.id} t={t} borderBottom={i<txns.length-1}/>)}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
