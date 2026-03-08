import { useState, useEffect, useRef } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

// ─────────────────────────────────────────────────────────
// THEMES
// ─────────────────────────────────────────────────────────
const DARK  = { bg:"#07090F", surface:"#0D1120", card:"#111827", border:"#1C2B3A", gold:"#F59E0B", teal:"#06B6D4", rose:"#F43F5E", violet:"#8B5CF6", text:"#F1F5F9", dim:"#64748B", green:"#10B981", blue:"#3B82F6", sub:"rgba(255,255,255,0.18)" };
const LIGHT = { bg:"#F0F4F8", surface:"#FFFFFF", card:"#FFFFFF", border:"#E2E8F0", gold:"#D97706", teal:"#0891B2", rose:"#E11D48", violet:"#7C3AED", text:"#0F172A", dim:"#64748B", green:"#059669", blue:"#2563EB", sub:"rgba(0,0,0,0.22)" };

// ─────────────────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────────────────
const TR = {
  en: {
    appName:"Audit Flip", tagline:"Know where every rupee goes.",
    findive:"FinDive", findiveDesc:"Discover your money personality in 3 minutes",
    startBtn:"Dive In →", settings:"Settings", refresh:"Refresh",
    darkMode:"Dark Mode", lightMode:"Light Mode", language:"Language",
    dashboard:"Dashboard", aiCoach:"AI Coach", goals:"Goals", report:"Report",
    next:"Next →", back:"← Back", recommended:"Recommended for You",
    send:"Send →", askAnything:"Ask about your money…", greetingPrefix:"Welcome back,",
    catLabels:{ rent:"Rent/Housing", food_delivery:"Food Delivery", groceries:"Groceries",
      transport:"Transport", subscriptions:"Subscriptions", shopping:"Shopping",
      education:"Education", misc:"Miscellaneous" },
  },
  hi: {
    appName:"ऑडिट फ्लिप", appNameSub:"Audit Flip",
    tagline:"हर रुपये का हिसाब रखें।", taglineSub:"Know where every rupee goes.",
    findive:"फिनडाइव", findiveSub:"FinDive",
    findiveDesc:"3 मिनट में अपनी पहचान जानें", findiveDescSub:"Discover your money personality",
    startBtn:"शुरू करें →", startBtnSub:"Dive In →",
    settings:"सेटिंग्स", settingsSub:"Settings", refresh:"ताज़ा करें", refreshSub:"Refresh",
    darkMode:"डार्क मोड", darkModeSub:"Dark Mode", lightMode:"लाइट मोड", lightModeSub:"Light Mode",
    language:"भाषा", languageSub:"Language",
    dashboard:"डैशबोर्ड", dashboardSub:"Dashboard", aiCoach:"AI कोच", aiCoachSub:"AI Coach",
    goals:"लक्ष्य", goalsSub:"Goals", report:"रिपोर्ट", reportSub:"Report",
    next:"अगला →", nextSub:"Next →", back:"← वापस", backSub:"← Back",
    recommended:"आपके लिए सुझाव", recommendedSub:"Recommended for You",
    send:"भेजें →", sendSub:"Send →", askAnything:"अपने पैसे के बारे में पूछें…",
    greetingPrefix:"स्वागत,", greetingPrefixSub:"Welcome,",
    catLabels:{ rent:"किराया", food_delivery:"फूड डिलीवरी", groceries:"किराना",
      transport:"परिवहन", subscriptions:"सदस्यता", shopping:"खरीदारी", education:"शिक्षा", misc:"विविध" },
    catLabelsSub:{ rent:"Rent", food_delivery:"Food Delivery", groceries:"Groceries",
      transport:"Transport", subscriptions:"Subscriptions", shopping:"Shopping", education:"Education", misc:"Misc" },
  },
  ta: {
    appName:"ஆடிட் ஃப்ளிப்", appNameSub:"Audit Flip",
    tagline:"ஒவ்வொரு ரூபாயும் கண்காணியுங்கள்.", taglineSub:"Know where every rupee goes.",
    findive:"ஃபின்டைவ்", findiveSub:"FinDive",
    findiveDesc:"3 நிமிடத்தில் ஆளுமையை அறியுங்கள்", findiveDescSub:"Discover your money personality",
    startBtn:"தொடங்குங்கள் →", startBtnSub:"Dive In →",
    settings:"அமைப்புகள்", settingsSub:"Settings", refresh:"புதுப்பி", refreshSub:"Refresh",
    darkMode:"இருண்ட முறை", darkModeSub:"Dark Mode", lightMode:"ஒளி முறை", lightModeSub:"Light Mode",
    language:"மொழி", languageSub:"Language",
    dashboard:"டாஷ்போர்டு", dashboardSub:"Dashboard", aiCoach:"AI பயிற்சியாளர்", aiCoachSub:"AI Coach",
    goals:"இலக்குகள்", goalsSub:"Goals", report:"அறிக்கை", reportSub:"Report",
    next:"அடுத்து →", nextSub:"Next →", back:"← திரும்பு", backSub:"← Back",
    recommended:"உங்களுக்கான பரிந்துரை", recommendedSub:"Recommended for You",
    send:"அனுப்பு →", sendSub:"Send →", askAnything:"உங்கள் பணத்தைப் பற்றி கேளுங்கள்…",
    greetingPrefix:"வரவேற்கிறோம்,", greetingPrefixSub:"Welcome,",
    catLabels:{ rent:"வாடகை", food_delivery:"உணவு டெலிவரி", groceries:"மளிகை",
      transport:"போக்குவரத்து", subscriptions:"சந்தாக்கள்", shopping:"கடை", education:"கல்வி", misc:"இதர" },
    catLabelsSub:{ rent:"Rent", food_delivery:"Food Delivery", groceries:"Groceries",
      transport:"Transport", subscriptions:"Subscriptions", shopping:"Shopping", education:"Education", misc:"Misc" },
  },
};
const tx  = (lang, key) => (TR[lang]||TR.en)[key] || TR.en[key] || key;
const txS = (lang, key) => lang==="en" ? null : (TR[lang]||{})[key+"Sub"] || TR.en[key] || null;

// ─────────────────────────────────────────────────────────
// EXPENSE CATEGORIES
// ─────────────────────────────────────────────────────────
const CATS = [
  { key:"rent",          emoji:"🏠", color:"#8B5CF6" },
  { key:"food_delivery", emoji:"🛵", color:"#F43F5E" },
  { key:"groceries",     emoji:"🛒", color:"#10B981" },
  { key:"transport",     emoji:"🚇", color:"#06B6D4" },
  { key:"subscriptions", emoji:"📱", color:"#F59E0B" },
  { key:"shopping",      emoji:"🛍️", color:"#EC4899" },
  { key:"education",     emoji:"📚", color:"#3B82F6" },
  { key:"misc",          emoji:"💫", color:"#F97316" },
];

// ─────────────────────────────────────────────────────────
// QUIZ STEPS  (name → income → expenses → outside income → 3 personality Qs)
// ─────────────────────────────────────────────────────────
const QUIZ = [
  {
    field:"name", type:"text",
    questions:{ en:"Hi! What's your name?", hi:"नमस्ते! आपका नाम क्या है?", ta:"வணக்கம்! உங்கள் பெயர் என்ன?" },
    qSubs:{ hi:"Hi! What's your name?", ta:"Hi! What's your name?" },
    placeholders:{ en:"e.g. Priya", hi:"जैसे प्रिया", ta:"எ.கா. பிரியா" },
  },
  {
    field:"income", type:"number",
    questions:{ en:"What is your fixed monthly income? (salary, stipend, allowance)", hi:"आपकी निश्चित मासिक आय कितनी है? (वेतन, वजीफा, भत्ता)", ta:"உங்கள் நிலையான மாதாந்திர வருமானம் என்ன? (சம்பளம், உதவி, கொடுப்பனவு)" },
    qSubs:{ hi:"Fixed monthly income (salary, stipend, allowance)?", ta:"Fixed monthly income (salary, stipend, allowance)?" },
    placeholders:{ en:"e.g. 25000", hi:"जैसे 25000", ta:"எ.கா. 25000" },
    hint:"This is your financial baseline — your score is calculated from this.",
  },
  {
    field:"expenses", type:"expenses",
    questions:{ en:"Where does your money go each month? (fill what applies)", hi:"आपका पैसा हर महीने कहाँ जाता है?", ta:"ஒவ்வொரு மாதமும் உங்கள் பணம் எங்கே செல்கிறது?" },
    qSubs:{ hi:"Where does your money go each month?", ta:"Where does your money go each month?" },
  },
  {
    field:"outside_income", type:"calculator",
    questions:{ en:"Any extra income this month? (freelance, tuition, gifts, part-time…)", hi:"इस महीने कोई अतिरिक्त आय? (फ्रीलांस, ट्यूशन, उपहार, पार्ट-टाइम…)", ta:"இந்த மாதம் கூடுதல் வருமானம் ஏதும்? (ஃப்ரீலான்ஸ், டியூஷன், பரிசு, பார்ட்-டைம்…)" },
    qSubs:{ hi:"Any extra income this month?", ta:"Any extra income this month?" },
  },
  {
    field:"q1", type:"choice",
    questions:{ en:"When salary hits — first move?", hi:"सैलरी मिलने पर सबसे पहले?", ta:"சம்பளம் வந்தால் முதல் செயல்?" },
    qSubs:{ hi:"When salary hits — first move?", ta:"When salary hits — first move?" },
    options:{
      en:["Save a fixed amount first 💰","Pay bills then plan 📋","Treat myself — I earned it 🎉","Check my wishlist 🛒"],
      hi:["पहले एक राशि बचाएं 💰","बिल भरें फिर योजना 📋","खुद को ट्रीट करें 🎉","विशलिस्ट देखें 🛒"],
      hiSub:["Save first","Pay bills","Treat myself","Check wishlist"],
      ta:["முதலில் சேமிக்கிறேன் 💰","பில் கட்டி திட்டம் 📋","என்னை ட்ரீட் 🎉","விஷ்லிஸ்ட் 🛒"],
      taSub:["Save first","Pay bills","Treat myself","Check wishlist"],
    },
    scores:[{saver:2},{balanced:2},{impulsive:2},{impulsive:1,balanced:1}],
  },
  {
    field:"q2", type:"choice",
    questions:{ en:"Month-end ₹3000 left — you:", hi:"महीने के अंत में ₹3000 बचे:", ta:"மாத இறுதியில் ₹3000 மீதம்:" },
    qSubs:{ hi:"Month-end ₹3000 left — you:", ta:"Month-end ₹3000 left — you:" },
    options:{
      en:["Save all of it 🏦","Save half, enjoy half ⚖️","Already spent somehow 😅","Invest in SIP 📈"],
      hi:["सब बचा लें 🏦","आधा बचाएं आधा खर्च ⚖️","पहले से खर्च 😅","SIP में निवेश 📈"],
      hiSub:["Save all","Save half","Already spent","Invest SIP"],
      ta:["எல்லாம் சேமிக்கிறேன் 🏦","பாதி சேமி பாதி செலவு ⚖️","ஏற்கனவே செலவானது 😅","SIP முதலீடு 📈"],
      taSub:["Save all","Save half","Already spent","Invest SIP"],
    },
    scores:[{saver:2},{balanced:2},{impulsive:2},{saver:2}],
  },
  {
    field:"q3", type:"choice",
    questions:{ en:"Surprise ₹5000 trip invite — you:", hi:"₹5000 की अचानक यात्रा का न्योता:", ta:"திடீர் ₹5000 பயண அழைப்பு:" },
    qSubs:{ hi:"Surprise ₹5000 trip invite — you:", ta:"Surprise ₹5000 trip invite — you:" },
    options:{
      en:["Decline — not budgeted ✋","Check finances first 🔍","Go YOLO! ✈️","Propose cheaper plan 🤝"],
      hi:["मना करते हैं ✋","पहले वित्त जांचें 🔍","YOLO जाते हैं! ✈️","सस्ती योजना 🤝"],
      hiSub:["Decline","Check first","Go YOLO","Cheaper plan"],
      ta:["வேண்டாம் ✋","நிதி பாருங்கள் 🔍","YOLO போகிறேன்! ✈️","மலிவான திட்டம் 🤝"],
      taSub:["Decline","Check first","Go YOLO","Cheaper plan"],
    },
    scores:[{saver:2},{balanced:2},{impulsive:2},{balanced:2}],
  },
];

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
const fmtInr   = n => "₹" + (n||0).toLocaleString("en-IN");
const nowLabel = () => new Date().toLocaleString("en-IN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});

// Score uses base monthly income as 100% benchmark
function calcScore(baseIncome, totalInc, totalExp) {
  if (!baseIncome) return 0;
  const net = totalInc - totalExp;
  const savPct = net / baseIncome;          // 1.0 = saved 100% of base income
  const ratio  = Math.min(savPct, 1);       // cap at 1
  const base   = ratio * 70;               // up to 70 pts from savings
  // bonus: extra income beyond base
  const extraBonus = totalInc > baseIncome ? Math.min((totalInc-baseIncome)/baseIncome*20, 20) : 0;
  // penalty: overspend
  const penalty = totalExp > totalInc ? Math.min((totalExp-totalInc)/baseIncome*40, 40) : 0;
  return Math.round(Math.min(100, Math.max(0, base + extraBonus + 10 - penalty)));
}

function getGrade(s) {
  if (s>=85) return { g:"A", color:"#10B981", label:"Excellent" };
  if (s>=70) return { g:"B", color:"#06B6D4", label:"Good" };
  if (s>=55) return { g:"C", color:"#F59E0B", label:"Average" };
  if (s>=40) return { g:"D", color:"#F43F5E", label:"Needs Work" };
  return { g:"F", color:"#EF4444", label:"Critical" };
}
const getLayout = () => ({ isDesktop: window.innerWidth >= 1024, isTablet: window.innerWidth >= 768, isMobile: window.innerWidth < 768 });
async function askClaude(messages, system) {
  const r = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system }),
  });
  const d = await r.json();
  return d.content?.map(b => b.text || "").join("") || "Unable to respond right now.";
}

// Personalized recommendations based on user data
function getPersonalRecs(userData) {
  const { baseIncome=0, expenses={}, personality="balanced", incomeLog=[], expenseLog=[] } = userData;
  const totalInc = incomeLog.reduce((a,b)=>a+b.amount,0) || baseIncome;
  const totalExp = expenseLog.reduce((a,b)=>a+b.amount,0);
  const net = totalInc - totalExp;
  const savPct = totalInc>0 ? Math.round((net/totalInc)*100) : 0;
  const recs = [];

  // Based on savings rate
  if (savPct < 10)  recs.push({ icon:"🔴", text:`Your savings rate is only ${savPct}%. Try saving at least 20% = ${fmtInr(Math.round(totalInc*0.2))}/month.` });
  else if (savPct < 20) recs.push({ icon:"🟡", text:`Savings at ${savPct}% — push to 20% by cutting ₹${fmtInr(Math.round(totalInc*0.2-net))} more per month.` });
  else if (savPct >= 30) recs.push({ icon:"✅", text:`Great! ${savPct}% savings rate. Consider investing your surplus in index funds.` });

  // Based on top expense
  const topCat = CATS.map(c=>({ key:c.key, val:expenses[c.key]||0 })).sort((a,b)=>b.val-a.val)[0];
  if (topCat?.val > totalInc*0.15) recs.push({ icon:"⚠️", text:`${TR.en.catLabels[topCat.key]} is your top spend at ${fmtInr(topCat.val)} (${Math.round((topCat.val/totalInc)*100)}% of income). Reduce by 20%.` });

  // Based on food delivery
  if ((expenses.food_delivery||0) > totalInc*0.08) recs.push({ icon:"🛵", text:`Food delivery (${fmtInr(expenses.food_delivery)}) is high. Cook 3× per week to save ~${fmtInr(Math.round((expenses.food_delivery||0)*0.35))}.` });

  // Based on rent
  if ((expenses.rent||0) > totalInc*0.4) recs.push({ icon:"🏠", text:`Rent is ${Math.round(((expenses.rent||0)/totalInc)*100)}% of income (over the 40% limit). Consider a flatmate.` });

  // Based on personality
  if (personality==="impulsive") recs.push({ icon:"🧠", text:"As an impulse spender — try the 48-hour rule: wait 2 days before any purchase over ₹500." });
  if (personality==="saver")     recs.push({ icon:"📈", text:"Great saver! Don't let money idle — invest monthly surplus in a low-cost index fund." });
  if (personality==="balanced")  recs.push({ icon:"⚖️", text:"Balanced personality — automate savings via SIP so you never accidentally spend your surplus." });

  // Emergency fund
  const efTarget = totalInc * 3;
  if (net < efTarget) recs.push({ icon:"🛡️", text:`Build a ${fmtInr(efTarget)} emergency fund (3× income). Save ${fmtInr(Math.round(efTarget/12))} per month.` });

  // subscriptions
  if ((expenses.subscriptions||0) > totalInc*0.05) recs.push({ icon:"📱", text:`Subscriptions (${fmtInr(expenses.subscriptions)}) exceed 5% of income. Audit and cancel unused ones today.` });

  // Generic if few
  if (recs.length < 3) recs.push({ icon:"💡", text:"Track every expense for 30 days — awareness alone reduces spending by ~15% on average." });

  return recs.slice(0,6);
}

// ─────────────────────────────────────────────────────────
// SMALL UI ATOMS
// ─────────────────────────────────────────────────────────
function Bi({ main, sub, C, ms={}, ss={}, block=false }) {
  if (!sub) return <span style={ms}>{main}</span>;
  const Tag = block ? "div" : "span";
  return (
    <Tag style={block ? {} : { display:"inline-flex", flexDirection:"column" }}>
      <span style={ms}>{main}</span>
      <span style={{ fontSize:"0.6em", color:C.sub, letterSpacing:0.3, lineHeight:1.1, ...ss }}>{sub}</span>
    </Tag>
  );
}

const iSt = (C, extra={}) => ({
  width:"100%", boxSizing:"border-box", background:C.surface, color:C.text,
  border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 14px",
  fontSize:15, outline:"none", fontFamily:"inherit", ...extra,
});

function ScoreRing({ score, C }) {
  const { g, color, label } = getGrade(score);
  const r=50, circ=2*Math.PI*r, dash=(score/100)*circ;
  return (
    <div style={{ textAlign:"center", position:"relative", display:"inline-block" }}>
      <svg width={120} height={120} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={60} cy={60} r={r} fill="none" stroke={C.border} strokeWidth={8}/>
        <circle cx={60} cy={60} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter:`drop-shadow(0 0 8px ${color})`, transition:"stroke-dasharray 1s ease" }}/>
      </svg>
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
        <div style={{ fontSize:28, fontWeight:900, color, fontFamily:"Georgia,serif", lineHeight:1 }}>{g}</div>
        <div style={{ fontSize:11, color:C.dim }}>{score}/100</div>
        <div style={{ fontSize:10, color }}>{label}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// COIN LOGO
// ─────────────────────────────────────────────────────────
function Coin({ C, size=72 }) {
  const [gain, setGain] = useState(true);
  const [spin, setSpin] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => { setSpin(true); setTimeout(()=>{ setGain(g=>!g); setSpin(false); }, 320); }, 3000);
    return () => clearInterval(iv);
  }, []);
  const col = gain ? "#10B981" : "#F43F5E";
  return (
    <div onClick={()=>{ setSpin(true); setTimeout(()=>{ setGain(g=>!g); setSpin(false); }, 320); }} title="Click to flip"
      style={{ width:size, height:size, borderRadius:"50%", cursor:"pointer", userSelect:"none", flexShrink:0,
        background:`radial-gradient(circle at 35% 35%, ${col}ee, ${col}55)`,
        border:`${Math.max(2,size/30)}px solid ${col}`,
        boxShadow:`0 0 ${size*0.35}px ${col}45, inset 0 2px 6px rgba(255,255,255,0.15)`,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        transform:spin?"rotateY(90deg) scale(0.85)":"rotateY(0deg) scale(1)",
        transition:"transform .32s cubic-bezier(.68,-.55,.265,1.55), background .3s, border-color .3s",
        position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:size*0.07, borderRadius:"50%", border:`1px solid ${col}40`, pointerEvents:"none" }}/>
      <span style={{ fontSize:size*0.32, fontWeight:900, color:"#fff", fontFamily:"Georgia,serif", lineHeight:1, textShadow:"0 1px 6px rgba(0,0,0,.4)" }}>₹</span>
      <span style={{ fontSize:size*0.14, fontWeight:800, color:"rgba(255,255,255,.85)", letterSpacing:1.5, marginTop:2 }}>{gain?"GAIN":"LOSS"}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ANIMATED TITLE
// ─────────────────────────────────────────────────────────
function AnimTitle({ C }) {
  const words = ["Audit","Flip"], cols = [C.gold, C.teal];
  let idx = 0;
  return (
    <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:"0.15em" }}>
      {words.map((word,wi) => (
        <span key={wi} style={{ display:"inline-flex" }}>
          {word.split("").map((ch,ci) => {
            const i = idx++;
            return <span key={ci} style={{ fontSize:"clamp(44px,8.5vw,90px)", fontWeight:900, fontFamily:"Georgia,'Times New Roman',serif",
              background:`linear-gradient(135deg,${cols[wi]},${wi===0?"#FCD34D":"#67E8F9"},${cols[wi]})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              animation:"letterBob 2.8s ease-in-out infinite", animationDelay:`${i*0.1}s`,
              filter:`drop-shadow(0 0 14px ${cols[wi]}70)`, letterSpacing:-1, lineHeight:1.05 }}>{ch}</span>;
          })}
          {wi===0 && <span style={{ width:"0.2em" }}/>}
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MINI CALCULATOR
// ─────────────────────────────────────────────────────────
function MiniCalculator({ C, onResult }) {
  const [display, setDisplay] = useState("0");
  const [expr,    setExpr]    = useState("");
  const [fresh,   setFresh]   = useState(true);

  const press = (btn) => {
    if (btn === "C") { setDisplay("0"); setExpr(""); setFresh(true); return; }
    if (btn === "⌫") { const d = display.length>1 ? display.slice(0,-1) : "0"; setDisplay(d); return; }
    if (btn === "=") {
      try {
        // safe eval: only allow digits, +, -, *, /, ., spaces
        const safe = (expr + display).replace(/[^0-9+\-*/. ]/g,"");
        // eslint-disable-next-line no-new-func
        const res = Function('"use strict"; return (' + safe + ')')();
        const rounded = Math.round(Number(res));
        setDisplay(String(rounded));
        setExpr("");
        setFresh(true);
      } catch { setDisplay("ERR"); setFresh(true); }
      return;
    }
    if (["+","-","×","÷"].includes(btn)) {
      const op = btn==="×"?"*":btn==="÷"?"/":btn;
      setExpr(expr + display + op);
      setFresh(true);
      return;
    }
    if (btn === ".") {
      if (fresh) { setDisplay("0."); setFresh(false); }
      else if (!display.includes(".")) setDisplay(display+".");
      return;
    }
    // digit
    if (fresh) { setDisplay(btn); setFresh(false); }
    else { setDisplay(display==="0" ? btn : display+btn); }
  };

  const rows = [
    ["7","8","9","÷"],
    ["4","5","6","×"],
    ["1","2","3","-"],
    ["C","0",".","⌫"],
    ["=","+"],
  ];

  const btnColor = (b) => {
    if (b==="=")  return C.teal;
    if (b==="+")  return C.green;
    if (["-","×","÷"].includes(b)) return C.gold;
    if (b==="C")  return C.rose;
    if (b==="⌫") return C.violet;
    return null;
  };

  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginTop:10, boxShadow:`0 8px 32px rgba(0,0,0,.25)` }}>
      <div style={{ fontSize:11, color:C.dim, marginBottom:6 }}>🧮 Calculator — add up your extra income sources</div>
      {/* Display */}
      <div style={{ background:C.bg, borderRadius:10, padding:"8px 14px", marginBottom:10, textAlign:"right", border:`1px solid ${C.border}` }}>
        {expr && <div style={{ fontSize:11, color:C.dim, minHeight:16 }}>{expr}</div>}
        <div style={{ fontSize:24, fontWeight:800, color:C.text, fontFamily:"Georgia,serif" }}>{display}</div>
      </div>
      {/* Buttons */}
      {rows.map((row,ri) => (
        <div key={ri} style={{ display:"flex", gap:6, marginBottom:6 }}>
          {row.map(btn => (
            <button key={btn} onClick={()=>press(btn)} style={{
              flex: btn==="="||btn==="+"?2:1, padding:"11px 0", borderRadius:8, border:"none",
              background: btnColor(btn) ? btnColor(btn)+"22" : C.card,
              color: btnColor(btn)||C.text, fontWeight:700, fontSize:15,
              cursor:"pointer", border:`1px solid ${(btnColor(btn)||C.border)+"44"}`,
              transition:"background .12s",
            }}>{btn}</button>
          ))}
        </div>
      ))}
      <button onClick={()=>onResult(display==="ERR"?"0":display)} style={{ width:"100%", marginTop:4, padding:"11px", borderRadius:10, background:`linear-gradient(135deg,${C.teal},${C.teal}cc)`, color:"#fff", fontWeight:800, border:"none", cursor:"pointer", fontSize:14 }}>
        Use this amount: {fmtInr(Number(display==="ERR"?0:display))} →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────
function Sidebar({ C, lang, setLang, dark, setDark, page, setPage, open, setOpen, userData }) {
  const navItems = [
    { id:"home",      icon:"🏠", label:"Home" },
    { id:"dashboard", icon:"📊", key:"dashboard" },
    { id:"chat",      icon:"💬", key:"aiCoach" },
    { id:"goals",     icon:"🎯", key:"goals" },
    { id:"report",    icon:"📋", key:"report" },
  ];
  const LANGS = [
    { code:"en", flag:"🇬🇧", native:"English", name:"English" },
    { code:"hi", flag:"🇮🇳", native:"हिंदी",   name:"Hindi" },
    { code:"ta", flag:"🇮🇳", native:"தமிழ்",   name:"Tamil" },
  ];
  const recs = getPersonalRecs(userData);

  return (
    <>
      {open && <div onClick={()=>setOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:90, backdropFilter:"blur(2px)" }}/>}
      <div style={{ position:"fixed", top:0, left:0, bottom:0, zIndex:100, width:290,
        background:C.surface, borderRight:`1px solid ${C.border}`,
        transform:open?"translateX(0)":"translateX(-100%)",
        transition:"transform .32s cubic-bezier(.4,0,.2,1)",
        display:"flex", flexDirection:"column", overflowY:"auto",
        boxShadow:open?"6px 0 48px rgba(0,0,0,.35)":"none" }}>

        {/* Header */}
        <div style={{ padding:"20px 18px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Coin C={C} size={34}/>
            <span style={{ fontWeight:800, fontSize:15, color:C.gold, fontFamily:"Georgia,serif" }}>Audit Flip</span>
          </div>
          <button onClick={()=>setOpen(false)} style={{ background:"none", border:"none", color:C.dim, fontSize:18, cursor:"pointer", padding:4 }}>✕</button>
        </div>

        {/* Nav */}
        <div style={{ padding:"10px 10px 0" }}>
          <div style={{ fontSize:10, color:C.dim, letterSpacing:1.8, padding:"6px 8px 4px", textTransform:"uppercase", fontWeight:600 }}>Navigation</div>
          {navItems.map(n => {
            const lbl = n.key ? (lang!=="en" ? tx(lang,n.key) : n.key.charAt(0).toUpperCase()+n.key.slice(1)) : n.label;
            const sub = n.key ? txS(lang,n.key) : null;
            return (
              <button key={n.id} onClick={()=>{ setPage(n.id); setOpen(false); }} style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"9px 10px", borderRadius:10, border:"none",
                background:page===n.id?C.gold+"18":"transparent",
                color:page===n.id?C.gold:C.text, cursor:"pointer", textAlign:"left",
                borderLeft:`3px solid ${page===n.id?C.gold:"transparent"}`,
                transition:"all .15s", marginBottom:2 }}>
                <span style={{ fontSize:17 }}>{n.icon}</span>
                <Bi main={lbl} sub={sub} C={C} ms={{ fontWeight:600, fontSize:13 }}/>
              </button>
            );
          })}
        </div>
        <div style={{ margin:"10px 18px", borderTop:`1px solid ${C.border}` }}/>

        {/* Settings */}
        <div style={{ padding:"0 10px" }}>
          <div style={{ fontSize:10, color:C.dim, letterSpacing:1.8, padding:"4px 8px 6px", textTransform:"uppercase", fontWeight:600 }}>Settings</div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", borderRadius:10, background:C.card, border:`1px solid ${C.border}`, marginBottom:8 }}>
            <span style={{ fontWeight:600, fontSize:13, color:C.text }}>{dark?"Dark Mode":"Light Mode"}</span>
            <div onClick={()=>setDark(d=>!d)} style={{ width:44, height:24, borderRadius:12, background:dark?C.gold:C.border, position:"relative", cursor:"pointer", transition:"background .3s", flexShrink:0 }}>
              <div style={{ position:"absolute", top:3, left:dark?23:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left .3s" }}/>
            </div>
          </div>
          <button onClick={()=>{ setPage("home"); setOpen(false); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:`1px solid ${C.border}`, background:C.card, color:C.text, cursor:"pointer", marginBottom:8, fontSize:14, fontWeight:600 }}>
            <span style={{ fontSize:18 }}>🔄</span> Refresh / Home
          </button>
        </div>
        <div style={{ margin:"10px 18px", borderTop:`1px solid ${C.border}` }}/>

        {/* Language */}
        <div style={{ padding:"0 10px" }}>
          <div style={{ fontSize:10, color:C.dim, letterSpacing:1.8, padding:"4px 8px 6px", textTransform:"uppercase", fontWeight:600 }}>Language</div>
          {LANGS.map(l => (
            <button key={l.code} onClick={()=>setLang(l.code)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:10,
              padding:"8px 10px", borderRadius:10, border:"none",
              background:lang===l.code?C.teal+"18":"transparent",
              color:lang===l.code?C.teal:C.text, cursor:"pointer", marginBottom:3,
              borderLeft:`3px solid ${lang===l.code?C.teal:"transparent"}` }}>
              <span style={{ fontSize:18 }}>{l.flag}</span>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{l.native}</div>
                {l.code!=="en" && <div style={{ fontSize:10, color:C.sub }}>{l.name}</div>}
              </div>
              {lang===l.code && <span style={{ marginLeft:"auto", color:C.teal }}>✓</span>}
            </button>
          ))}
        </div>
        <div style={{ margin:"10px 18px", borderTop:`1px solid ${C.border}` }}/>

        {/* Personalised Recommended */}
        <div style={{ padding:"0 10px 24px" }}>
          <div style={{ fontSize:10, color:C.dim, letterSpacing:1.8, padding:"4px 8px 8px", textTransform:"uppercase", fontWeight:600 }}>
            <Bi main={lang!=="en"?tx(lang,"recommended"):"Recommended for You"} sub={txS(lang,"recommended")} C={C} ms={{ color:C.dim }} ss={{ color:C.sub }}/>
          </div>
          {recs.map((r,i) => (
            <div key={i} style={{ padding:"8px 10px", borderRadius:8, background:C.gold+"0f", border:`1px solid ${C.gold}18`, marginBottom:6, fontSize:12, color:C.text, lineHeight:1.55 }}>
              <span style={{ marginRight:6 }}>{r.icon}</span>{r.text}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// TOP BAR
// ─────────────────────────────────────────────────────────
function TopBar({ C, onMenu, page }) {
  const labels = { dashboard:"Dashboard", chat:"AI Coach", goals:"Goals", report:"Report", quiz:"FinDive" };
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:80, height:54, background:C.surface+"f0", backdropFilter:"blur(16px)", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", padding:"0 16px", gap:12 }}>
      <button onClick={onMenu} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", gap:5, padding:"6px 8px", borderRadius:8 }}>
        {[0,1,2].map(i=><div key={i} style={{ width:22, height:2, borderRadius:2, background:C.gold }}/>)}
      </button>
      <Coin C={C} size={30}/>
      <span style={{ fontWeight:800, fontSize:15, color:C.gold, fontFamily:"Georgia,serif" }}>Audit Flip</span>
      <span style={{ color:C.border }}>|</span>
      <span style={{ fontSize:13, color:C.dim }}>{labels[page]||page}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────
function HomePage({ C, lang, setPage }) {
  const [hov, setHov] = useState(false);
  const { isDesktop, isTablet } = getLayout();
  const wide = isDesktop || isTablet;

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "system-ui,sans-serif", position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: wide ? "60px 60px" : "80px 24px 60px",
    }}>
      {/* Background blobs */}
      <div style={{ position:"absolute", top:"12%", left:"8%", width:400, height:400, borderRadius:"50%", background:C.gold+"07", filter:"blur(100px)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"15%", right:"6%", width:320, height:320, borderRadius:"50%", background:C.teal+"08", filter:"blur(80px)", pointerEvents:"none" }}/>

      {/* Main layout — two column on desktop, single column on mobile */}
      <div style={{
        display: "flex",
        flexDirection: wide ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: wide ? 80 : 0,
        width: "100%",
        maxWidth: 1100,
      }}>

        {/* LEFT — Branding */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: wide ? "flex-start" : "center",
          textAlign: wide ? "left" : "center",
          flex: wide ? 1 : "unset",
        }}>
          <Coin C={C} size={wide ? 100 : 88} />
          <div style={{ marginTop: 26, marginBottom: 8 }}>
            <AnimTitle C={C} />
            {lang !== "en" && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: "clamp(16px,3vw,20px)", fontFamily: "Georgia,serif", color: C.gold+"cc" }}>{tx(lang,"appName")}</div>
                <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Audit Flip</div>
              </div>
            )}
          </div>
          <div style={{ marginBottom: wide ? 40 : 46 }}>
            {lang !== "en"
              ? <><p style={{ fontSize:"clamp(14px,2.5vw,18px)", color:C.dim, margin:0 }}>{tx(lang,"tagline")}</p><p style={{ fontSize:12, color:C.sub, margin:"3px 0 0" }}>{txS(lang,"tagline")}</p></>
              : <p style={{ fontSize: "clamp(14px,2vw,20px)", color: C.dim, margin: 0 }}>Know where every rupee goes.</p>
            }
          </div>
          {/* Badges — only show on desktop left column */}
          {wide && (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["No credit card","Free forever","AI-powered","Made for India 🇮🇳"].map(t => (
                <span key={t} style={{ fontSize:12, color:C.dim, background:C.card, border:`1px solid ${C.border}`, borderRadius:999, padding:"4px 12px" }}>{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — FinDive Card */}
        <div style={{ flex: wide ? 1 : "unset", width: wide ? "auto" : "100%", maxWidth: wide ? 480 : 420 }}>
          <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={() => setPage("quiz")}
            style={{
              cursor: "pointer",
              width: "100%",
              borderRadius: 24,
              border: `2px solid ${hov ? C.teal : C.border}`,
              background: hov ? C.teal+"0e" : C.card,
              boxShadow: hov ? `0 0 48px ${C.teal}28` : `0 8px 36px rgba(0,0,0,.18)`,
              padding: wide ? "40px 48px" : "32px 36px",
              textAlign: "center",
              transition: "all .3s cubic-bezier(.4,0,.2,1)",
              transform: hov ? "translateY(-5px) scale(1.015)" : "none",
              position: "relative", overflow: "hidden",
            }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.teal},transparent)`, opacity:hov?1:0, transition:"opacity .3s" }}/>
            <div style={{ fontSize: wide ? 48 : 38, marginBottom: 8 }}>🌊</div>
            <div style={{ fontSize: wide ? 30 : 26, fontWeight:900, fontFamily:"Georgia,serif", color:C.teal, marginBottom:4 }}>
              {lang !== "en"
                ? <><div>{tx(lang,"findive")}</div><div style={{ fontSize:13, color:C.sub, fontWeight:400, fontFamily:"system-ui,sans-serif", marginTop:1 }}>FinDive</div></>
                : "FinDive"
              }
            </div>
            <div style={{ color:C.dim, fontSize: wide ? 15 : 14, lineHeight:1.6, marginBottom:22 }}>
              {lang !== "en"
                ? <><div>{tx(lang,"findiveDesc")}</div><div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{txS(lang,"findiveDesc")}</div></>
                : "Discover your money personality in 3 minutes"
              }
            </div>
            <div style={{ display:"inline-block", background:`linear-gradient(135deg,${C.teal},${C.teal}cc)`, color:"#fff", fontWeight:800, fontSize: wide ? 16 : 15, borderRadius:12, padding: wide ? "14px 40px" : "12px 32px", boxShadow:`0 4px 20px ${C.teal}45`, transform:hov?"scale(1.04)":"scale(1)", transition:"transform .2s" }}>
              {lang !== "en"
                ? <Bi main={tx(lang,"startBtn")} sub={txS(lang,"startBtn")} C={C} ms={{ color:"#fff" }} ss={{ color:"rgba(255,255,255,.5)" }}/>
                : "Dive In →"
              }
            </div>
            <div style={{ marginTop:24, display:"flex", justifyContent:"center", gap: wide ? 32 : 22 }}>
              {[["📝","Name & Income"],["💸","Expenses"],["🧮","Outside Income"]].map(([e,l]) => (
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontSize: wide ? 22 : 18 }}>{e}</div>
                  <div style={{ fontSize:10, color:C.dim, marginTop:3 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges on mobile — below card */}
          {!wide && (
            <div style={{ marginTop:28, display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
              {["No credit card","Free forever","AI-powered","Made for India 🇮🇳"].map(t => (
                <span key={t} style={{ fontSize:12, color:C.dim, background:C.card, border:`1px solid ${C.border}`, borderRadius:999, padding:"4px 12px" }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes letterBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// QUIZ STEP COMPONENTS
// ─────────────────────────────────────────────────────────
function StepNav({ C, lang, onBack, onNext, disabled }) {
  return (
    <div style={{ display:"flex", gap:10, marginTop:4 }}>
      <button onClick={onBack} style={{ background:C.card, border:`1px solid ${C.border}`, color:C.dim, borderRadius:10, padding:"12px 20px", cursor:"pointer", fontWeight:600, fontSize:14 }}>
        <Bi main={lang!=="en"?tx(lang,"back"):"← Back"} sub={txS(lang,"back")} C={C} ms={{ color:C.dim }} ss={{ color:C.sub }}/>
      </button>
      <button onClick={onNext} disabled={disabled} style={{ flex:1, background:disabled?C.border:`linear-gradient(135deg,${C.teal},${C.teal}bb)`, color:disabled?C.dim:"#fff", border:"none", borderRadius:10, padding:"12px 20px", cursor:disabled?"not-allowed":"pointer", fontWeight:700, fontSize:15 }}>
        <Bi main={lang!=="en"?tx(lang,"next"):"Next →"} sub={txS(lang,"next")} C={C} ms={{ color:disabled?C.dim:"#fff" }} ss={{ color:"rgba(255,255,255,.4)" }}/>
      </button>
    </div>
  );
}

// Text step — stores as string, no conversion issue
function TextStep({ C, lang, q, initVal, onNext, onBack }) {
  const [val, setVal] = useState(initVal||"");
  return (
    <>
      <input autoFocus value={val}
        onChange={e=>setVal(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&val.trim()&&onNext(val.trim())}
        placeholder={q.placeholders[lang]||q.placeholders.en}
        style={{ ...iSt(C), fontSize:22, padding:"18px 20px", marginBottom:20 }}/>
      <StepNav C={C} lang={lang} onBack={onBack} onNext={()=>val.trim()&&onNext(val.trim())} disabled={!val.trim()}/>
    </>
  );
}

// Number step — stored as string to allow free typing, converted on submit
function NumberStep({ C, lang, q, initVal, onNext, onBack }) {
  const [val, setVal] = useState(initVal ? String(initVal) : "");
  const isValid = val !== "" && !isNaN(Number(val)) && Number(val) > 0;
  return (
    <>
      {q.hint && <div style={{ background:C.teal+"12", border:`1px solid ${C.teal}28`, borderRadius:10, padding:"10px 14px", fontSize:13, color:C.teal, marginBottom:14, lineHeight:1.5 }}>💡 {q.hint}</div>}
      <div style={{ position:"relative", marginBottom:20 }}>
        <span style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)", fontSize:22, color:C.gold, fontWeight:900, pointerEvents:"none" }}>₹</span>
        <input
          autoFocus
          type="text"
          inputMode="numeric"
          value={val}
          onChange={e => {
            const v = e.target.value.replace(/[^0-9]/g,"");
            setVal(v);
          }}
          onKeyDown={e=>e.key==="Enter"&&isValid&&onNext(val)}
          placeholder={q.placeholders?.[lang]||q.placeholders?.en||"0"}
          style={{ ...iSt(C), fontSize:26, padding:"18px 20px 18px 50px", letterSpacing:1 }}
        />
        {isValid && <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:14, color:C.teal, fontWeight:700 }}>{fmtInr(Number(val))}</div>}
      </div>
      <StepNav C={C} lang={lang} onBack={onBack} onNext={()=>isValid&&onNext(val)} disabled={!isValid}/>
    </>
  );
}

// Expenses step — stores each as string, converts on submit
function ExpensesStep({ C, lang, initExp, onNext, onBack }) {
  const [exp, setExp] = useState(() => {
    const init = {};
    CATS.forEach(c => { init[c.key] = initExp?.[c.key] ? String(initExp[c.key]) : ""; });
    return init;
  });

  const getNum = key => exp[key]===undefined||exp[key]===""?0:Number(exp[key])||0;
  const tot = CATS.reduce((a,c)=>a+getNum(c.key), 0);

  const getCatLabel = key => {
    if (lang!=="en"&&TR[lang]?.catLabels?.[key]) return { main:TR[lang].catLabels[key], sub:TR.en.catLabels[key] };
    return { main:TR.en.catLabels[key], sub:null };
  };

  const handleSubmit = () => {
    const numeric = {};
    CATS.forEach(c => { numeric[c.key] = getNum(c.key); });
    onNext(numeric);
  };

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10, marginBottom:14 }}>
        {CATS.map(cat => {
          const { main, sub } = getCatLabel(cat.key);
          const numVal = getNum(cat.key);
          return (
            <div key={cat.key} style={{ borderRadius:12, border:`1px solid ${numVal>0?cat.color+"55":C.border}`, background:numVal>0?cat.color+"0a":C.card, padding:"10px 12px", transition:"all .2s" }}>
              <label style={{ fontSize:12, color:C.dim, display:"flex", alignItems:"center", gap:5, marginBottom:6 }}>
                <span>{cat.emoji}</span><span>{main}</span>
                {sub&&<span style={{ color:C.sub, fontSize:10 }}>/ {sub}</span>}
              </label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", color:cat.color, fontWeight:700, fontSize:13, pointerEvents:"none" }}>₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={exp[cat.key]}
                  onChange={e => {
                    const v = e.target.value.replace(/[^0-9]/g,"");
                    setExp(prev => ({ ...prev, [cat.key]:v }));
                  }}
                  placeholder="0"
                  style={{ ...iSt(C), padding:"8px 8px 8px 24px", fontSize:15, borderColor:numVal>0?cat.color+"55":C.border }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding:"10px 14px", borderRadius:10, background:C.teal+"0f", border:`1px solid ${C.teal}28`, marginBottom:16, display:"flex", justifyContent:"space-between", fontSize:14 }}>
        <span style={{ color:C.dim }}>Total Expenses</span>
        <span style={{ color:C.teal, fontWeight:700, fontSize:17 }}>{fmtInr(tot)}</span>
      </div>
      <StepNav C={C} lang={lang} onBack={onBack} onNext={handleSubmit} disabled={false}/>
    </>
  );
}

// Calculator step — outside/extra income with built-in calculator
function CalculatorStep({ C, lang, initVal, onNext, onBack }) {
  const [val,     setVal]     = useState(initVal ? String(initVal) : "");
  const [showCalc, setShowCalc] = useState(false);
  const isValid = val===""||(!isNaN(Number(val))&&Number(val)>=0);

  return (
    <>
      <div style={{ fontSize:14, color:C.dim, marginBottom:12, lineHeight:1.6 }}>
        Include: freelance work, tuition fees you earned, gifts received, part-time job, rental income, etc.<br/>
        <span style={{ color:C.sub, fontSize:12 }}>Enter 0 if none — this is fine too!</span>
      </div>
      <div style={{ position:"relative", marginBottom:8 }}>
        <span style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)", fontSize:22, color:C.green, fontWeight:900, pointerEvents:"none" }}>₹</span>
        <input
          type="text"
          inputMode="numeric"
          value={val}
          onChange={e => { const v = e.target.value.replace(/[^0-9]/g,""); setVal(v); }}
          onKeyDown={e=>e.key==="Enter"&&isValid&&onNext(val||"0")}
          placeholder="0"
          style={{ ...iSt(C), fontSize:26, padding:"18px 20px 18px 50px", letterSpacing:1 }}
        />
        {val!==""&&Number(val)>0&&<div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:14, color:C.green, fontWeight:700 }}>{fmtInr(Number(val))}</div>}
      </div>

      {/* Toggle calculator */}
      <button onClick={()=>setShowCalc(s=>!s)} style={{ background:"none", border:`1px solid ${C.gold}44`, borderRadius:8, color:C.gold, fontSize:13, fontWeight:600, padding:"7px 14px", cursor:"pointer", marginBottom:12 }}>
        🧮 {showCalc?"Hide":"Open"} Calculator
      </button>

      {showCalc && <MiniCalculator C={C} onResult={r=>{ setVal(r); setShowCalc(false); }}/>}

      <StepNav C={C} lang={lang} onBack={onBack} onNext={()=>isValid&&onNext(val||"0")} disabled={!isValid}/>
    </>
  );
}

// Choice step
function ChoiceStep({ C, lang, q, onNext, onBack }) {
  const opts    = q.options[lang]||q.options.en;
  const optsSub = q.options[lang+"Sub"]||[];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {opts.map((opt,i) => (
        <button key={i} onClick={()=>onNext(i, q.scores[i])}
          style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"15px 18px", color:C.text, textAlign:"left", cursor:"pointer", fontSize:14, fontFamily:"inherit", transition:"all .15s", display:"flex", flexDirection:"column", gap:2 }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.background=C.gold+"0f"; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.card; }}>
          <span><span style={{ color:C.gold, marginRight:10, fontWeight:800 }}>{String.fromCharCode(65+i)}.</span>{opt}</span>
          {lang!=="en"&&optsSub[i]&&<span style={{ fontSize:11, color:C.sub, marginLeft:24 }}>{optsSub[i]}</span>}
        </button>
      ))}
      <button onClick={onBack} style={{ background:"none", border:"none", color:C.dim, fontSize:13, cursor:"pointer", marginTop:4, textAlign:"left" }}>← Back</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// QUIZ PAGE
// ─────────────────────────────────────────────────────────
function QuizPage({ C, lang, setPage, setUserData }) {
  const [step,   setStep]   = useState(0);
  const [ans,    setAns]    = useState({ expenses:{} });
  const [scores, setScores] = useState({ saver:0, balanced:0, impulsive:0 });
  const [vis,    setVis]    = useState(true);

  const transition = fn => { setVis(false); setTimeout(()=>{ fn(); setVis(true); }, 210); };

  const advance = (value, sc) => {
    const newAns = { ...ans };
    const q = QUIZ[step];
    if (q.field==="expenses")       newAns.expenses = value;
    else if (q.field==="outside_income") newAns.outside_income = Number(value)||0;
    else                            newAns[q.field] = value;

    const ns = { ...scores };
    if (sc) Object.entries(sc).forEach(([k,v])=>{ ns[k]=(ns[k]||0)+v; });

    if (step < QUIZ.length-1) {
      transition(()=>{ setStep(s=>s+1); setAns(newAns); setScores(ns); });
    } else {
      const winner = Object.entries(ns).sort((a,b)=>b[1]-a[1])[0]?.[0]||"balanced";
      const baseIncome     = Number(newAns.income)||0;
      const outsideIncome  = Number(newAns.outside_income)||0;
      const totalInc       = baseIncome + outsideIncome;
      const totalExp       = Object.values(newAns.expenses||{}).reduce((a,b)=>a+(Number(b)||0), 0);
      const now = nowLabel();
      const incomeLog = [
        ...(baseIncome>0   ? [{ id:Date.now(),   label:"Monthly salary/stipend", amount:baseIncome,   date:now }] : []),
        ...(outsideIncome>0 ? [{ id:Date.now()+1, label:"Outside/extra income",  amount:outsideIncome, date:now }] : []),
      ];
      const expenseLog = CATS.filter(c=>(newAns.expenses?.[c.key]||0)>0).map((c,i)=>({
        id:Date.now()+i+10, category:c.key, label:TR.en.catLabels[c.key], amount:newAns.expenses[c.key], date:now,
      }));
      setUserData({ ...newAns, baseIncome, income:totalInc, savings:totalInc-totalExp, personality:winner, incomeLog, expenseLog });
      setPage("dashboard");
    }
  };

  const goBack = () => { if (step>0) transition(()=>setStep(s=>s-1)); else setPage("home"); };
  const q      = QUIZ[step];
  const qText  = q.questions[lang]||q.questions.en;
  const qSub   = lang!=="en" ? (q.qSubs?.[lang]||q.questions.en) : null;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"system-ui,sans-serif", display:"flex", alignItems:"center", justifyContent:"center", padding:"80px 20px 40px" }}>
      <div style={{ width:"min(640px,100%)" }}>
        {/* Progress */}
        <div style={{ display:"flex", gap:6, marginBottom:30 }}>
          {QUIZ.map((_,i)=><div key={i} style={{ flex:1, height:4, borderRadius:2, background:i<=step?C.teal:C.border, transition:"background .4s" }}/>)}
        </div>
        <div style={{ opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(14px)", transition:"all .22s ease" }}>
          <span style={{ fontSize:11, color:C.dim, letterSpacing:2, textTransform:"uppercase" }}>Step {step+1} / {QUIZ.length}</span>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(18px,4vw,24px)", margin:"8px 0 4px", lineHeight:1.4 }}>{qText}</h2>
          {qSub && <p style={{ color:C.sub, fontSize:13, margin:"0 0 16px" }}>{qSub}</p>}

          {q.type==="text"       && <TextStep       key={step} C={C} lang={lang} q={q} initVal={ans[q.field]}        onNext={v=>advance(v)}        onBack={goBack}/>}
          {q.type==="number"     && <NumberStep     key={step} C={C} lang={lang} q={q} initVal={ans[q.field]}        onNext={v=>advance(v)}        onBack={goBack}/>}
          {q.type==="expenses"   && <ExpensesStep   key={step} C={C} lang={lang} initExp={ans.expenses}              onNext={v=>advance(v)}        onBack={goBack}/>}
          {q.type==="calculator" && <CalculatorStep key={step} C={C} lang={lang} initVal={ans.outside_income}       onNext={v=>advance(v)}        onBack={goBack}/>}
          {q.type==="choice"     && <ChoiceStep     key={step} C={C} lang={lang} q={q}                               onNext={(v,sc)=>advance(v,sc)} onBack={goBack}/>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ADD EXPENSE / INCOME BOXES
// ─────────────────────────────────────────────────────────
function AddEntryBoxes({ C, userData, setUserData }) {
  const [expLabel, setExpLabel] = useState("");
  const [expCat,   setExpCat]   = useState("misc");
  const [expAmt,   setExpAmt]   = useState("");
  const [incLabel, setIncLabel] = useState("");
  const [incAmt,   setIncAmt]   = useState("");
  const [flash,    setFlash]    = useState(null);
  const showFlash = type => { setFlash(type); setTimeout(()=>setFlash(null), 1400); };

  const addExpense = () => {
    const amt = Number(expAmt); if(!amt||amt<=0) return;
    const newEntry = { id:Date.now(), category:expCat, label:expLabel||TR.en.catLabels[expCat], amount:amt, date:nowLabel() };
    const newExp   = { ...userData.expenses, [expCat]:(userData.expenses[expCat]||0)+amt };
    const totalInc = userData.incomeLog.reduce((a,b)=>a+b.amount,0);
    const totalExp = Object.values(newExp).reduce((a,b)=>a+b,0);
    setUserData({ ...userData, expenses:newExp, expenseLog:[newEntry,...(userData.expenseLog||[])], savings:totalInc-totalExp });
    setExpLabel(""); setExpAmt(""); showFlash("exp");
  };

  const addIncome = () => {
    const amt = Number(incAmt); if(!amt||amt<=0) return;
    const newEntry = { id:Date.now(), label:incLabel||"Income received", amount:amt, date:nowLabel() };
    const newLog   = [newEntry, ...(userData.incomeLog||[])];
    const totalInc = newLog.reduce((a,b)=>a+b.amount,0);
    const totalExp = Object.values(userData.expenses||{}).reduce((a,b)=>a+b,0);
    setUserData({ ...userData, income:totalInc, incomeLog:newLog, savings:totalInc-totalExp });
    setIncLabel(""); setIncAmt(""); showFlash("inc");
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
      {/* Expense box */}
      <div style={{ background:C.card, border:`2px solid ${flash==="exp"?C.rose:C.border}`, borderRadius:16, padding:18, transition:"border-color .4s" }}>
        <div style={{ fontWeight:700, fontSize:14, color:C.rose, marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>📤 Add Expense</div>
        <select value={expCat} onChange={e=>setExpCat(e.target.value)} style={{ ...iSt(C), marginBottom:8, fontSize:13 }}>
          {CATS.map(c=><option key={c.key} value={c.key}>{c.emoji} {TR.en.catLabels[c.key]}</option>)}
        </select>
        <input value={expLabel} onChange={e=>setExpLabel(e.target.value)} placeholder="Description (optional)" style={{ ...iSt(C), marginBottom:8, fontSize:13 }}/>
        <div style={{ position:"relative", marginBottom:10 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.rose, fontWeight:700, pointerEvents:"none" }}>₹</span>
          <input type="text" inputMode="numeric" value={expAmt} onChange={e=>setExpAmt(e.target.value.replace(/[^0-9]/g,""))} onKeyDown={e=>e.key==="Enter"&&addExpense()} placeholder="Amount" style={{ ...iSt(C), paddingLeft:28, fontSize:15 }}/>
        </div>
        <button onClick={addExpense} style={{ width:"100%", background:flash==="exp"?C.green:`linear-gradient(135deg,${C.rose},${C.rose}bb)`, color:"#fff", fontWeight:700, border:"none", borderRadius:10, padding:"11px", cursor:"pointer", fontSize:14, transition:"background .3s" }}>
          {flash==="exp"?"✓ Added!":"Add Expense →"}
        </button>
      </div>
      {/* Income box */}
      <div style={{ background:C.card, border:`2px solid ${flash==="inc"?C.green:C.border}`, borderRadius:16, padding:18, transition:"border-color .4s" }}>
        <div style={{ fontWeight:700, fontSize:14, color:C.green, marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>📥 Add Income / Receiving</div>
        <input value={incLabel} onChange={e=>setIncLabel(e.target.value)} placeholder="Source (salary, freelance, gift…)" style={{ ...iSt(C), marginBottom:8, fontSize:13 }}/>
        <div style={{ height:36, marginBottom:8 }}/>
        <div style={{ position:"relative", marginBottom:10 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.green, fontWeight:700, pointerEvents:"none" }}>₹</span>
          <input type="text" inputMode="numeric" value={incAmt} onChange={e=>setIncAmt(e.target.value.replace(/[^0-9]/g,""))} onKeyDown={e=>e.key==="Enter"&&addIncome()} placeholder="Amount" style={{ ...iSt(C), paddingLeft:28, fontSize:15 }}/>
        </div>
        <button onClick={addIncome} style={{ width:"100%", background:flash==="inc"?C.teal:`linear-gradient(135deg,${C.green},${C.green}bb)`, color:"#fff", fontWeight:700, border:"none", borderRadius:10, padding:"11px", cursor:"pointer", fontSize:14, transition:"background .3s" }}>
          {flash==="inc"?"✓ Added!":"Add Income →"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// AI ADVICE BLOCK
// ─────────────────────────────────────────────────────────
function AIAdviceBlock({ C, prompt, label }) {
  const [advice,  setAdvice]  = useState("");
  const [loading, setLoading] = useState(false);
  const gen = async () => {
    setLoading(true);
    try { const r = await askClaude([{ role:"user", content:prompt }], "You are FinMentor, a concise AI finance coach for Indian students. Give 3 bullet-point actionable tips. Use ₹ amounts. Under 120 words."); setAdvice(r); }
    catch { setAdvice("Unable to load. Please retry."); }
    setLoading(false);
  };
  return (
    <div style={{ background:C.gold+"0a", border:`1px solid ${C.gold}28`, borderRadius:12, padding:14, marginTop:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:advice?10:0 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.gold }}>🤖 AI Advice — {label}</div>
        <button onClick={gen} disabled={loading} style={{ background:C.gold+"22", color:C.gold, border:`1px solid ${C.gold}40`, borderRadius:7, padding:"5px 12px", cursor:"pointer", fontSize:12, fontWeight:600 }}>{loading?"Loading…":"Get Tips"}</button>
      </div>
      {advice && <div style={{ fontSize:13, lineHeight:1.8, color:C.text, whiteSpace:"pre-wrap" }}>{advice}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────

function DashboardPage({ C, lang, userData, setUserData, setPage }) {
  const { expenses={}, name="Friend", incomeLog=[], expenseLog=[], baseIncome=0 } = userData;
  const { isMobile } = getLayout(); 
  const totalInc = incomeLog.reduce((a,b)=>a+b.amount,0);
  const totalExp = expenseLog.reduce((a,b)=>a+b.amount,0);
  const net      = totalInc - totalExp;
  const isGain   = net >= 0;
  const savPct   = totalInc>0 ? Math.round((net/totalInc)*100) : 0;
  const score    = calcScore(baseIncome||totalInc, totalInc, totalExp);

  const catLabel    = key => lang!=="en"&&TR[lang]?.catLabels?.[key] ? TR[lang].catLabels[key] : TR.en.catLabels[key];
  const pieData     = CATS.filter(c=>expenses[c.key]>0).map(c=>({ name:catLabel(c.key), value:expenses[c.key], color:c.color }));
  const expCatData  = CATS.map(c=>({ name:c.emoji+" "+TR.en.catLabels[c.key].split(/[\s/]/)[0], value:expenses[c.key]||0, color:c.color })).filter(d=>d.value>0).sort((a,b)=>b.value-a.value);
  const topCat      = expCatData[0];
  const incChart    = [...incomeLog].reverse().slice(-10).map((e,i)=>({ name:`#${i+1}`, amount:e.amount }));

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"system-ui,sans-serif", padding:"70px 18px 60px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(22px,4vw,30px)", margin:"0 0 4px" }}>
              {lang!=="en" ? <Bi main={`${tx(lang,"greetingPrefix")} ${name}!`} sub={`Welcome back, ${name}!`} C={C} ms={{}} block/> : `Welcome back, ${name}!`}
            </h1>
            <p style={{ color:C.dim, fontSize:13, margin:0 }}>Live overview — add entries below to update instantly</p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {[{icon:"💬",id:"chat"},{icon:"🎯",id:"goals"},{icon:"📋",id:"report"}].map(a=>(
              <button key={a.id} onClick={()=>setPage(a.id)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 13px", color:C.text, cursor:"pointer", fontSize:17 }}>{a.icon}</button>
            ))}
          </div>
        </div>

        {/* ── ADD ENTRIES ── */}
        <AddEntryBoxes C={C} userData={userData} setUserData={setUserData}/>

        {/* ══ SECTION 1: OVERALL ══ */}
        <div style={{ background:C.teal+"08", border:`1px solid ${C.teal}22`, borderRadius:18, padding:20, marginBottom:18 }}>
          <div style={{ fontWeight:800, fontSize:16, color:C.teal, marginBottom:16, fontFamily:"Georgia,serif" }}>📊 Overall Financial Summary</div>

          {/* Big Net */}
          <div style={{ textAlign:"center", padding:"14px 0 18px", borderBottom:`1px solid ${C.border}`, marginBottom:18 }}>
            <div style={{ fontSize:13, color:C.dim, marginBottom:4 }}>{isGain?"💚 You're in the GREEN — income exceeds expenses":"🔴 You're in the RED — spending more than you earn"}</div>
            <div style={{ fontSize:"clamp(30px,6vw,52px)", fontWeight:900, color:isGain?C.green:C.rose, fontFamily:"Georgia,serif", letterSpacing:-1 }}>
              {isGain?"+":"-"}{fmtInr(Math.abs(net))}
            </div>
            <div style={{ fontSize:13, color:C.dim, marginTop:4 }}>Total Received − Total Spent</div>
            {baseIncome>0 && <div style={{ fontSize:12, color:C.sub, marginTop:4 }}>Your baseline (quiz income): {fmtInr(baseIncome)} — used as score benchmark</div>}
          </div>

          {/* KPI cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))", gap:12, marginBottom:18 }}>
            {[
              { label:"Total Received", val:fmtInr(totalInc), col:C.green,  icon:"📥" },
              { label:"Total Spent",    val:fmtInr(totalExp), col:C.rose,   icon:"📤" },
              { label:"Net Position",   val:(isGain?"+":"-")+fmtInr(Math.abs(net)), col:isGain?C.green:C.rose, icon:"⚖️" },
              { label:"Savings Rate",   val:`${savPct}%`,     col:C.teal,   icon:"📈" },
            ].map(m=>(
              <div key={m.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontSize:20, marginBottom:5 }}>{m.icon}</div>
                <div style={{ fontSize:"clamp(17px,2.5vw,22px)", fontWeight:900, color:m.col, fontFamily:"Georgia,serif" }}>{m.val}</div>
                <div style={{ fontSize:11, color:C.dim, marginTop:2 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Comparison bar */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, color:C.dim, marginBottom:8 }}>Income vs Expenses Comparison</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={[{name:"Income",value:totalInc},{name:"Expenses",value:totalExp},{name:"Net",value:Math.abs(net)}]} barSize={54}>
                <XAxis dataKey="name" tick={{ fill:C.dim, fontSize:12 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:C.dim, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>"₹"+(v/1000).toFixed(0)+"k"}/>
                <Tooltip formatter={v=>fmtInr(v)} contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8 }}/>
                <Bar dataKey="value" radius={[8,8,0,0]}>{[C.green,C.rose,isGain?C.teal:C.rose].map((col,i)=><Cell key={i} fill={col}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Score */}
          <div style={{ display:"flex", alignItems:"center", gap:18, padding:"14px 16px", background:C.card, borderRadius:12, border:`1px solid ${C.border}` }}>
            <ScoreRing score={score} C={C}/>
            <div>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Financial Health Score</div>
              <div style={{ fontSize:13, color:C.dim, lineHeight:1.6 }}>
                Scored against your baseline income of {fmtInr(baseIncome||totalInc)}.<br/>
                {score>=70?"✅ You're on a healthy track!":score>=50?"⚠️ Room for improvement — check sections below.":"🔴 Expenses are outpacing income."}
              </div>
            </div>
          </div>
        </div>

        {/* ══ SECTION 2: INCOME DATA ══ */}
        <div style={{ background:C.green+"08", border:`1px solid ${C.green}22`, borderRadius:18, padding:20, marginBottom:18 }}>
          <div style={{ fontWeight:800, fontSize:16, color:C.green, marginBottom:14, fontFamily:"Georgia,serif" }}>📥 Income Data</div>
          {incomeLog.length===0 ? (
            <div style={{ textAlign:"center", padding:"28px 0", color:C.dim, fontSize:14 }}>No income entries yet. Use the "Add Income" box above ↑</div>
          ) : (
            <>
              {/* Entries */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:12, color:C.dim, marginBottom:8 }}>Recent Income Entries</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:200, overflowY:"auto" }}>
                  {incomeLog.slice(0,10).map(e=>(
                    <div key={e.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:C.card, borderRadius:10, border:`1px solid ${C.border}` }}>
                      <div><div style={{ fontWeight:600, fontSize:13 }}>{e.label}</div><div style={{ fontSize:11, color:C.dim }}>{e.date}</div></div>
                      <div style={{ fontWeight:800, color:C.green, fontSize:15 }}>+{fmtInr(e.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Line chart */}
              {incChart.length>1 && (
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:12, color:C.dim, marginBottom:8 }}>Income Trend</div>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={incChart}>
                      <CartesianGrid stroke={C.border} strokeDasharray="3 3"/>
                      <XAxis dataKey="name" tick={{ fill:C.dim, fontSize:10 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill:C.dim, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>"₹"+(v/1000).toFixed(0)+"k"}/>
                      <Tooltip formatter={v=>fmtInr(v)} contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8 }}/>
                      <Line type="monotone" dataKey="amount" stroke={C.green} strokeWidth={2.5} dot={{ fill:C.green, r:4 }} activeDot={{ r:7 }}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              {/* Status badges */}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {savPct>=30&&<span style={{ fontSize:12, background:C.green+"18", color:C.green, border:`1px solid ${C.green}30`, borderRadius:999, padding:"3px 12px" }}>✅ Excellent savings: {savPct}%</span>}
                {savPct<10&&<span style={{ fontSize:12, background:C.rose+"18", color:C.rose, border:`1px solid ${C.rose}30`, borderRadius:999, padding:"3px 12px" }}>⚠️ Low savings: {savPct}%</span>}
                {incomeLog.length>1&&<span style={{ fontSize:12, background:C.teal+"18", color:C.teal, border:`1px solid ${C.teal}30`, borderRadius:999, padding:"3px 12px" }}>{incomeLog.length} income entries</span>}
              </div>
            </>
          )}
          <AIAdviceBlock C={C} label="Income" prompt={`My total income is ₹${totalInc} (base salary: ₹${baseIncome}). Savings rate: ${savPct}%. Income sources: ${incomeLog.length}. Give 3 specific tips to increase and protect income.`}/>
        </div>

        {/* ══ SECTION 3: SPENT ON ══ */}
        <div style={{ background:C.rose+"08", border:`1px solid ${C.rose}22`, borderRadius:18, padding:20 }}>
          <div style={{ fontWeight:800, fontSize:16, color:C.rose, marginBottom:14, fontFamily:"Georgia,serif" }}>📤 Spent On — Expense Tracker</div>
          {expenseLog.length===0 ? (
            <div style={{ textAlign:"center", padding:"28px 0", color:C.dim, fontSize:14 }}>No expense entries yet. Use the "Add Expense" box above ↑</div>
          ) : (
            <>
              {/* Top spender alert */}
              {topCat&&(
                <div style={{ display:"flex", gap:10, alignItems:"center", padding:"10px 14px", background:C.rose+"0f", border:`1px solid ${C.rose}30`, borderRadius:10, marginBottom:14 }}>
                  <span style={{ fontSize:22 }}>🔴</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13 }}>Highest: <span style={{ color:C.rose }}>{topCat.name} — {fmtInr(topCat.value)}</span></div>
                    <div style={{ fontSize:12, color:C.dim }}>{totalInc>0?`${Math.round((topCat.value/totalInc)*100)}% of your total income`:"Add income to see %"}</div>
                  </div>
                </div>
              )}
              {/* Bar chart */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:12, color:C.dim, marginBottom:8 }}>Spending by Category</div>
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart data={expCatData} barSize={36}>
                    <XAxis dataKey="name" tick={{ fill:C.dim, fontSize:10 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill:C.dim, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>"₹"+(v/1000).toFixed(0)+"k"}/>
                    <Tooltip formatter={v=>fmtInr(v)} contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8 }}/>
                    <Bar dataKey="value" radius={[6,6,0,0]}>{expCatData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Pie + ranked */}
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:14, marginBottom:14 }}>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={expCatData} cx="50%" cy="50%" innerRadius={46} outerRadius={76} paddingAngle={2} dataKey="value">
                      {expCatData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip formatter={v=>fmtInr(v)} contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12 }}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", flexDirection:"column", gap:6, justifyContent:"center" }}>
                  {expCatData.slice(0,5).map((d,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12 }}>
                      <span>{d.name}</span><span style={{ color:d.color, fontWeight:700 }}>{fmtInr(d.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Expense log */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:12, color:C.dim, marginBottom:8 }}>Recent Expense Entries</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:230, overflowY:"auto" }}>
                  {expenseLog.slice(0,12).map(e=>{
                    const cat = CATS.find(c=>c.key===e.category);
                    return (
                      <div key={e.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:C.card, borderRadius:10, border:`1px solid ${(cat?.color||C.border)+"30"}` }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:18 }}>{cat?.emoji||"💫"}</span>
                          <div><div style={{ fontWeight:600, fontSize:13 }}>{e.label}</div><div style={{ fontSize:11, color:C.dim }}>{e.date}</div></div>
                        </div>
                        <div style={{ fontWeight:800, color:C.rose, fontSize:15 }}>-{fmtInr(e.amount)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Warnings */}
              <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:4 }}>
                {[
                  totalInc>0&&(expenses.food_delivery||0)>totalInc*.1 && `⚠️ Food delivery (${fmtInr(expenses.food_delivery)}) is ${Math.round(((expenses.food_delivery||0)/totalInc)*100)}% of income. Recommended: under 5%.`,
                  totalInc>0&&(expenses.rent||0)>totalInc*.4 && `⚠️ Rent (${fmtInr(expenses.rent)}) exceeds 40% of income. Consider sharing accommodation.`,
                  totalInc>0&&(expenses.shopping||0)>totalInc*.15 && `⚠️ Shopping (${fmtInr(expenses.shopping)}) is very high. Try a 30-day purchase pause.`,
                  totalInc>0&&(expenses.subscriptions||0)>totalInc*.05 && `⚠️ Subscriptions (${fmtInr(expenses.subscriptions)}) exceed 5% of income. Audit unused ones.`,
                  totalExp>totalInc && `🔴 CRITICAL: Expenses (${fmtInr(totalExp)}) exceed income (${fmtInr(totalInc)}). You are in deficit!`,
                ].filter(Boolean).map((w,i)=>(
                  <div key={i} style={{ display:"flex", gap:8, padding:"9px 12px", background:C.rose+"0a", borderRadius:9, border:`1px solid ${C.rose}20`, fontSize:13, lineHeight:1.6 }}>{w}</div>
                ))}
                {totalExp<=totalInc && expenseLog.length>0 && (
                  <div style={{ fontSize:13, color:C.green, padding:"8px 12px", background:C.green+"0a", borderRadius:9, border:`1px solid ${C.green}20` }}>✅ No critical alerts — spending looks balanced!</div>
                )}
              </div>
            </>
          )}
          <AIAdviceBlock C={C} label="Spending" prompt={`My total expenses: ₹${totalExp}. Breakdown: ${expCatData.map(d=>`${d.name}: ₹${d.value}`).join(", ")}. Total income: ₹${totalInc}. Top spend: ${topCat?.name||"N/A"} at ₹${topCat?.value||0}. Give 3 specific actionable tips to reduce spending.`}/>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// AI CHAT
// ─────────────────────────────────────────────────────────
function ChatPage({ C, lang, userData }) {
  const [msgs,    setMsgs]    = useState([]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const { incomeLog=[], expenseLog=[], expenses={}, name="Friend", personality="balanced", baseIncome=0 } = userData;
  const totalInc = incomeLog.reduce((a,b)=>a+b.amount,0);
  const totalExp = expenseLog.reduce((a,b)=>a+b.amount,0);
  const li = { en:"Respond in English.", hi:"Respond in Hindi (Devanagari). Include English in parentheses for financial terms.", ta:"Respond in Tamil. Include English in parentheses for financial terms." };
  const system = `You are FinMentor inside Audit Flip, an AI finance coach for young Indian students and professionals. User: ${name}. Base income: ₹${baseIncome}/month. Total income: ₹${totalInc}, Total expenses: ₹${totalExp}, Net: ₹${totalInc-totalExp}. Top expenses: ${CATS.filter(c=>expenses[c.key]).map(c=>`${TR.en.catLabels[c.key]}: ₹${expenses[c.key]}`).join(", ")}. Personality: ${personality}. ${li[lang]||li.en} Be warm, specific, actionable. 2-3 paragraphs max.`;
  const qs = {
    en:["How can I save ₹5000 more monthly?","Am I overspending on food delivery?","Best beginner investment?","How to build an emergency fund?"],
    hi:["₹5000 और कैसे बचाऊं?","फूड डिलीवरी पर ज्यादा खर्च?","शुरुआती निवेश?","इमरजेंसी फंड कैसे बनाएं?"],
    ta:["₹5000 அதிகமாக சேமிக்க?","உணவு டெலிவரி அதிகமா?","தொடக்கநிலை முதலீடு?","அவசர நிதி எப்படி?"],
  };
  useEffect(()=>{ ref.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);
  const send = async (text) => {
    const msg = text||input.trim(); if(!msg) return;
    setInput("");
    const nm = [...msgs, { role:"user", content:msg }];
    setMsgs(nm); setLoading(true);
    try { const r = await askClaude(nm, system); setMsgs(m=>[...m,{ role:"assistant", content:r }]); }
    catch { setMsgs(m=>[...m,{ role:"assistant", content:"Connection issue. Please try again." }]); }
    setLoading(false);
  };
  return (
    <div style={{ height:"100vh", background:C.bg, color:C.text, fontFamily:"system-ui,sans-serif", display:"flex", flexDirection:"column", paddingTop:54 }}>
      <div style={{ padding:"10px 18px", borderBottom:`1px solid ${C.border}`, background:C.surface }}>
        <div style={{ maxWidth:760, margin:"0 auto", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.teal})`, display:"grid", placeItems:"center", fontSize:16 }}>🤖</div>
          <div>
            <Bi main={lang!=="en"?tx(lang,"aiCoach"):"AI Finance Coach"} sub={txS(lang,"aiCoach")} C={C} ms={{ fontWeight:700, fontSize:14 }} block/>
            <div style={{ fontSize:11, color:C.green }}>● Online — powered by Claude</div>
          </div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:18, maxWidth:760, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
        {msgs.length===0&&(
          <div style={{ textAlign:"center", padding:"36px 0" }}>
            <div style={{ fontSize:44, marginBottom:12 }}>💬</div>
            <h3 style={{ fontFamily:"Georgia,serif", fontSize:20, marginBottom:18 }}>Hi {name}! Ask me anything.</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
              {(qs[lang]||qs.en).map(q=>(
                <button key={q} onClick={()=>send(q)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:"7px 13px", color:C.text, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.teal}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>{q}</button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:12 }}>
            {m.role==="assistant"&&<div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.teal})`, display:"grid", placeItems:"center", fontSize:13, marginRight:8, flexShrink:0, alignSelf:"flex-end" }}>🤖</div>}
            <div style={{ maxWidth:"76%", padding:"11px 15px", borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", background:m.role==="user"?`linear-gradient(135deg,${C.gold},${C.gold}bb)`:C.card, color:m.role==="user"?"#000":C.text, border:m.role==="assistant"?`1px solid ${C.border}`:"none", fontSize:14, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{m.content}</div>
          </div>
        ))}
        {loading&&<div style={{ display:"flex", gap:5, padding:"10px 14px", width:60, background:C.card, borderRadius:"18px 18px 18px 4px", border:`1px solid ${C.border}` }}>{[0,1,2].map(i=><div key={i} style={{ width:7, height:7, borderRadius:"50%", background:C.gold, animation:"blink 1.2s infinite", animationDelay:`${i*.2}s` }}/>)}</div>}
        <div ref={ref}/>
      </div>
      <div style={{ padding:"12px 18px", borderTop:`1px solid ${C.border}`, background:C.surface }}>
        <div style={{ maxWidth:760, margin:"0 auto", display:"flex", gap:10 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder={lang!=="en"?tx(lang,"askAnything"):"Ask about your money…"} style={{ ...iSt(C), flex:1 }}/>
          <button onClick={()=>send()} disabled={!input.trim()||loading} style={{ background:input.trim()?`linear-gradient(135deg,${C.teal},${C.teal}aa)`:C.border, color:input.trim()?"#fff":C.dim, fontWeight:700, border:"none", borderRadius:10, padding:"10px 18px", cursor:input.trim()?"pointer":"not-allowed", fontSize:14 }}>
            <Bi main={lang!=="en"?tx(lang,"send"):"Send →"} sub={txS(lang,"send")} C={C} ms={{ color:input.trim()?"#fff":C.dim }} ss={{ color:"rgba(255,255,255,.4)" }}/>
          </button>
        </div>
      </div>
      <style>{`@keyframes blink{0%,80%,100%{transform:scale(.7);opacity:.3}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// GOALS
// ─────────────────────────────────────────────────────────
function GoalsPage({ C, lang, userData }) {
  const { incomeLog=[], expenseLog=[] } = userData;
  const totalInc = incomeLog.reduce((a,b)=>a+b.amount,0)||userData.income||0;
  const totalExp = expenseLog.reduce((a,b)=>a+b.amount,0);
  const monthly  = totalInc - totalExp;

  const [goals, setGoals] = useState([
    { id:1, name:"Emergency Fund", emoji:"🛡️", amount:50000, saved:8000,  color:C.teal },
    { id:2, name:"New Laptop",     emoji:"💻", amount:70000, saved:15000, color:C.gold },
  ]);
  const [adding,     setAdding]     = useState(false);
  const [ng,         setNg]         = useState({ name:"", amount:"", emoji:"🎯" });
  const [customAmts, setCustomAmts] = useState({});
  const emojis = ["🎯","💻","✈️","🏠","🚗","💍","📚","🎸","🛡️","💊"];

  const addGoal = () => {
    if (!ng.name||!ng.amount) return;
    setGoals([...goals, { id:Date.now(), name:ng.name, amount:Number(ng.amount), saved:0, emoji:ng.emoji, color:[C.violet,C.rose,C.blue,C.green][goals.length%4] }]);
    setNg({ name:"", amount:"", emoji:"🎯" }); setAdding(false);
  };
  const deposit = goalId => {
    const amt = Number(customAmts[goalId]||0); if(!amt||amt<=0) return;
    setGoals(goals.map(g=>g.id===goalId?{ ...g, saved:Math.min(g.saved+amt,g.amount) }:g));
    setCustomAmts({ ...customAmts, [goalId]:"" });
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"system-ui,sans-serif", padding:"70px 18px 60px" }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22, flexWrap:"wrap", gap:10 }}>
          <div>
            <h1 style={{ fontFamily:"Georgia,serif", fontSize:26, margin:"0 0 4px" }}>
              <Bi main={lang!=="en"?tx(lang,"goals"):"Goal Tracker"} sub={txS(lang,"goals")} C={C} ms={{}} block/>
            </h1>
            <p style={{ color:C.dim, fontSize:13, margin:0 }}>Monthly available: <span style={{ color:C.green, fontWeight:700 }}>{fmtInr(monthly)}</span></p>
          </div>
          <button onClick={()=>setAdding(true)} style={{ background:`linear-gradient(135deg,${C.gold},${C.gold}cc)`, color:"#000", fontWeight:700, border:"none", borderRadius:10, padding:"10px 20px", cursor:"pointer", fontSize:14 }}>+ New Goal</button>
        </div>
        {adding&&(
          <div style={{ background:C.card, border:`1px solid ${C.gold}40`, borderRadius:16, padding:22, marginBottom:20 }}>
            <h3 style={{ color:C.gold, marginBottom:14 }}>Create New Goal</h3>
            <div style={{ display:"flex", gap:10, marginBottom:12, flexWrap:"wrap" }}>
              <input value={ng.name} onChange={e=>setNg({...ng,name:e.target.value})} placeholder="Goal name (e.g. Europe Trip)" style={{ ...iSt(C), flex:2, minWidth:160 }}/>
              <div style={{ position:"relative", flex:1, minWidth:130 }}>
                <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.gold, fontWeight:700, pointerEvents:"none" }}>₹</span>
                <input type="text" inputMode="numeric" value={ng.amount} onChange={e=>setNg({...ng,amount:e.target.value.replace(/[^0-9]/g,"")})} placeholder="Target amount" style={{ ...iSt(C), paddingLeft:28 }}/>
              </div>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
              {emojis.map(e=><button key={e} onClick={()=>setNg({...ng,emoji:e})} style={{ fontSize:20, background:ng.emoji===e?C.gold+"30":"transparent", border:`1px solid ${ng.emoji===e?C.gold:C.border}`, borderRadius:8, padding:"5px 9px", cursor:"pointer" }}>{e}</button>)}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={addGoal} style={{ background:C.gold, color:"#000", fontWeight:700, border:"none", borderRadius:8, padding:"10px 20px", cursor:"pointer" }}>Create Goal</button>
              <button onClick={()=>setAdding(false)} style={{ background:"transparent", color:C.dim, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 20px", cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        )}
        {goals.map(goal => {
          const pct = Math.round((goal.saved/goal.amount)*100);
          const remaining = goal.amount-goal.saved;
          const mos = monthly>0 ? Math.ceil(remaining/monthly) : null;
          const weekSave = monthly>0 ? Math.round(monthly/4.3) : 0;
          const custAmt = customAmts[goal.id]||"";
          return (
            <div key={goal.id} style={{ background:C.card, border:`1px solid ${goal.color}25`, borderRadius:16, padding:"20px 22px", marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ fontSize:36 }}>{goal.emoji}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:17, fontFamily:"Georgia,serif" }}>{goal.name}</div>
                    <div style={{ fontSize:13, color:C.dim, marginTop:2 }}>{fmtInr(goal.saved)} saved of {fmtInr(goal.amount)} goal</div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:30, fontWeight:900, color:goal.color, fontFamily:"Georgia,serif" }}>{pct}%</div>
                  <div style={{ fontSize:12, color:C.dim }}>{mos?`~${mos} months to go`:"Add income to calculate"}</div>
                </div>
              </div>
              <div style={{ background:C.surface, borderRadius:6, height:9, marginBottom:14, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, background:goal.color, borderRadius:6, transition:"width .6s", boxShadow:`0 0 10px ${goal.color}50` }}/>
              </div>
              {weekSave>0&&mos&&mos>0&&(
                <div style={{ display:"flex", gap:5, overflowX:"auto", paddingBottom:4, marginBottom:14 }}>
                  {Array.from({ length:Math.min(8,mos) },(_,i)=>{
                    const c=goal.saved+weekSave*(i+1), wp=Math.min(100,Math.round((c/goal.amount)*100));
                    return <div key={i} style={{ minWidth:64, textAlign:"center", padding:"6px 4px", background:C.surface, borderRadius:8, border:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:10, color:C.dim }}>Wk {i+1}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:goal.color }}>{wp}%</div>
                      <div style={{ fontSize:9, color:C.dim }}>{fmtInr(weekSave)}</div>
                    </div>;
                  })}
                </div>
              )}
              {/* Custom amount deposit input */}
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ position:"relative", flex:1 }}>
                  <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:goal.color, fontWeight:800, fontSize:14, pointerEvents:"none" }}>₹</span>
                  <input type="text" inputMode="numeric" value={custAmt}
                    onChange={e=>setCustomAmts({ ...customAmts, [goal.id]:e.target.value.replace(/[^0-9]/g,"") })}
                    onKeyDown={e=>e.key==="Enter"&&deposit(goal.id)}
                    placeholder="Type your deposit amount…"
                    style={{ ...iSt(C), paddingLeft:27, fontSize:14, borderColor:goal.color+"40" }}/>
                </div>
                <button onClick={()=>deposit(goal.id)} disabled={!custAmt||Number(custAmt)<=0}
                  style={{ background:Number(custAmt)>0?`linear-gradient(135deg,${goal.color},${goal.color}bb)`:C.border, color:Number(custAmt)>0?"#fff":C.dim, fontWeight:700, border:"none", borderRadius:10, padding:"10px 18px", cursor:Number(custAmt)>0?"pointer":"not-allowed", fontSize:14, whiteSpace:"nowrap" }}>
                  Deposit →
                </button>
              </div>
              {pct>=100&&<div style={{ marginTop:10, padding:"8px 12px", background:C.green+"18", border:`1px solid ${C.green}30`, borderRadius:9, textAlign:"center", color:C.green, fontWeight:700, fontSize:14 }}>🎉 Goal Achieved! Congratulations!</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// REPORT
// ─────────────────────────────────────────────────────────
function ReportPage({ C, lang, userData }) {
  const { incomeLog=[], expenseLog=[], expenses={}, name="User", personality="balanced", baseIncome=0 } = userData;
  const totalInc = incomeLog.reduce((a,b)=>a+b.amount,0);
  const totalExp = expenseLog.reduce((a,b)=>a+b.amount,0);
  const net = totalInc-totalExp;
  const sr  = totalInc>0 ? Math.round((net/totalInc)*100) : 0;
  const score = calcScore(baseIncome||totalInc, totalInc, totalExp);
  const { g, color } = getGrade(score);
  const [aiReport, setAiReport] = useState("");
  const [loading,  setLoading]  = useState(false);
  const radarData = CATS.filter(c=>expenses[c.key]).map(c=>({ subject:c.emoji+" "+TR.en.catLabels[c.key].split(/[\s/]/)[0], value:totalInc>0?Math.round((expenses[c.key]/totalInc)*100):0, fullMark:40 }));
  const li = { en:"in English", hi:"in Hindi with English in parentheses", ta:"in Tamil with English in parentheses" };
  const gen = async () => {
    setLoading(true);
    try {
      const r = await askClaude([{ role:"user", content:`Financial Report for ${name}. Base income: ₹${baseIncome}. Total income: ₹${totalInc}, Total expenses: ₹${totalExp}, Net: ₹${net} (${sr}% savings), Score: ${score}/100 Grade ${g}. Expense breakdown: ${CATS.filter(c=>expenses[c.key]).map(c=>`${TR.en.catLabels[c.key]}: ₹${expenses[c.key]}`).join(", ")}. Personality: ${personality}. Write: 1) Executive Summary 2) Top 3 Recommendations (₹ amounts) 3) Key Warnings 4) Encouragement. ${li[lang]||li.en}` }],
        "You are FinMentor, a warm professional finance coach for Indian students. Be specific and motivating.");
      setAiReport(r);
    } catch { setAiReport("Unable to generate. Please check connection."); }
    setLoading(false);
  };
  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"system-ui,sans-serif", padding:"70px 18px 60px" }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:22 }}>
          <div>
            <h1 style={{ fontFamily:"Georgia,serif", fontSize:26, margin:"0 0 4px" }}>Monthly Report</h1>
            <p style={{ color:C.dim, fontSize:13, margin:0 }}>{name} · {new Date().toLocaleDateString("en-IN",{month:"long",year:"numeric"})}</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ fontSize:36, fontWeight:900, color, fontFamily:"Georgia,serif" }}>{g}</div>
            <div style={{ fontSize:12, color:C.dim }}>Grade (vs {fmtInr(baseIncome)} base)</div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:18, marginBottom:18, alignItems:"center" }}>
          <ScoreRing score={score} C={C}/>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:18 }}>
            <div style={{ fontWeight:700, color:C.gold, marginBottom:10, fontSize:14 }}>Score Breakdown (baseline: {fmtInr(baseIncome)})</div>
            {[
              { label:"Savings Rate",   val:`${sr}%`,  flag:sr>=20?"✅":"⚠️", col:sr>=20?C.green:C.rose },
              { label:"Total Income",   val:fmtInr(totalInc), flag:"", col:C.green },
              { label:"Total Expenses", val:fmtInr(totalExp), flag:"", col:C.rose },
              { label:"Net Position",   val:(net>=0?"+":"")+fmtInr(net), flag:net>=0?"✅":"🔴", col:net>=0?C.green:C.rose },
            ].map(r=>(
              <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
                <span style={{ color:C.dim }}>{r.label}</span>
                <span style={{ fontWeight:700, color:r.col }}>{r.flag} {r.val}</span>
              </div>
            ))}
          </div>
        </div>
        {radarData.length>0&&(
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:22, marginBottom:18 }}>
            <div style={{ fontWeight:700, color:C.gold, marginBottom:10, fontSize:14 }}>Spending Profile (% of income)</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={C.border}/><PolarAngleAxis dataKey="subject" tick={{ fill:C.dim, fontSize:11 }}/>
                <Radar dataKey="value" stroke={C.gold} fill={C.gold} fillOpacity={0.13}/>
                <Tooltip contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8 }} formatter={v=>`${v}%`}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div style={{ background:C.card, border:`1px solid ${C.gold}28`, borderRadius:14, padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
            <div style={{ fontWeight:700, color:C.gold, fontSize:14 }}>🤖 AI-Generated Report</div>
            <button onClick={gen} disabled={loading} style={{ background:`linear-gradient(135deg,${C.gold},${C.gold}bb)`, color:"#000", fontWeight:700, border:"none", borderRadius:8, padding:"8px 18px", cursor:"pointer", fontSize:13 }}>{loading?"Generating…":"Generate Report"}</button>
          </div>
          {aiReport ? <div style={{ fontSize:14, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{aiReport}</div> : <div style={{ color:C.dim, textAlign:"center", padding:"24px 0", fontSize:13 }}>Click "Generate Report" for your personalised AI analysis</div>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────
export default function App() {
  const [page,     setPage]     = useState("home");
  const [lang,     setLang]     = useState("en");
  const [dark,     setDark]     = useState(true);
  const [sideOpen, setSideOpen] = useState(false);
  const [userData, setUserData] = useState({
    name:"Arjun", baseIncome:45000, income:45000,
    expenses:{ rent:12000, food_delivery:4500, groceries:3000, transport:1500, subscriptions:1200, shopping:3500, education:2000, misc:1800 },
    savings:9500, personality:"balanced",
    incomeLog:[{ id:1, label:"Monthly Salary", amount:45000, date:"Initial" }],
    expenseLog:[
      { id:2,  category:"rent",          label:"Rent/Housing",   amount:12000, date:"Initial" },
      { id:3,  category:"food_delivery", label:"Food Delivery",  amount:4500,  date:"Initial" },
      { id:4,  category:"groceries",     label:"Groceries",      amount:3000,  date:"Initial" },
      { id:5,  category:"transport",     label:"Transport",      amount:1500,  date:"Initial" },
      { id:6,  category:"subscriptions", label:"Subscriptions",  amount:1200,  date:"Initial" },
      { id:7,  category:"shopping",      label:"Shopping",       amount:3500,  date:"Initial" },
      { id:8,  category:"education",     label:"Education",      amount:2000,  date:"Initial" },
      { id:9,  category:"misc",          label:"Miscellaneous",  amount:1800,  date:"Initial" },
    ],
  });
  const C = dark ? DARK : LIGHT;

  return (
    <div style={{ background:C.bg, minHeight:"100vh", width:"100%", overflowX:"hidden" }}>
      <Sidebar C={C} lang={lang} setLang={setLang} dark={dark} setDark={setDark}
        page={page} setPage={setPage} open={sideOpen} setOpen={setSideOpen} userData={userData}/>

      {page!=="home" && <TopBar C={C} onMenu={()=>setSideOpen(true)} page={page}/>}
      {page==="home" && (
        <button onClick={()=>setSideOpen(true)} style={{ position:"fixed", top:16, left:16, zIndex:70, background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 11px", cursor:"pointer", display:"flex", flexDirection:"column", gap:4, boxShadow:`0 2px 12px rgba(0,0,0,.2)` }}>
          {[0,1,2].map(i=><div key={i} style={{ width:20, height:2, borderRadius:2, background:C.gold }}/>)}
        </button>
      )}

      {page==="home"      && <HomePage      C={C} lang={lang} setPage={setPage}/>}
      {page==="quiz"      && <QuizPage      C={C} lang={lang} setPage={setPage} setUserData={setUserData}/>}
      {page==="dashboard" && <DashboardPage C={C} lang={lang} userData={userData} setUserData={setUserData} setPage={setPage}/>}
      {page==="chat"      && <ChatPage      C={C} lang={lang} userData={userData}/>}
      {page==="goals"     && <GoalsPage     C={C} lang={lang} userData={userData}/>}
      {page==="report"    && <ReportPage    C={C} lang={lang} userData={userData}/>}
    </div>
  );
}