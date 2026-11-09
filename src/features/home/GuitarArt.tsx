export function GuitarArt() {
  return <svg className="guitar-art" viewBox="0 0 550 360" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="wood" x1="30" y1="190" x2="290" y2="340" gradientUnits="userSpaceOnUse">
        <stop stopColor="#efcf90"/><stop offset=".52" stopColor="#c98e55"/><stop offset="1" stopColor="#86513c"/>
      </linearGradient>
      <linearGradient id="neck" x1="277" y1="168" x2="498" y2="113" gradientUnits="userSpaceOnUse">
        <stop stopColor="#513931"/><stop offset="1" stopColor="#825840"/>
      </linearGradient>
      <pattern id="grain" width="12" height="7" patternUnits="userSpaceOnUse">
        <path d="M0 4q5-3 12 0" stroke="#623b32" strokeOpacity=".15" strokeWidth=".7"/>
      </pattern>
      <path id="body" d="M165 64c55-5 90 37 86 80-3 25 10 45 34 51 37 11 39 65 14 96-29 36-91 40-120 16-26-21-47-21-72-2-45 35-105 8-120-42-18-58 5-113 52-128 23-7 34-21 45-40 16-22 49-32 81-31Z"/>
    </defs>
    <circle cx="284" cy="177" r="148" stroke="#e6d6a3" strokeOpacity=".22"/>
    <circle cx="284" cy="177" r="123" stroke="#e6d6a3" strokeOpacity=".15"/>
    <path d="M284 15v325M110 177h340" stroke="#e6d6a3" strokeOpacity=".16" strokeDasharray="2 6"/>
    <circle cx="410" cy="99" r="5" fill="#ecd094"/><circle cx="135" cy="244" r="3" fill="#ecd094"/>
    <path d="M395 43v22m-11-11h22M469 240v16m-8-8h16M164 55v14m-7-7h14" stroke="#ecd094" strokeOpacity=".65"/>
    <g transform="translate(66 -12) rotate(-23 231 213) scale(.91)">
      <use href="#body" transform="translate(1 12)" fill="#663f32"/>
      <use href="#body" fill="url(#wood)" stroke="#f1cf91" strokeWidth="2"/>
      <use href="#body" fill="url(#grain)"/>
      <circle cx="220" cy="210" r="40" fill="#754738" stroke="#f5d697" strokeWidth="3"/>
      <circle cx="220" cy="210" r="33" fill="#2d2a22" stroke="#b78656" strokeWidth="2"/>
      <path d="M253 194h264v32H253Z" fill="url(#neck)" stroke="#ac7856"/>
      <path d="m490 193 26-9 39-1 7 8v38l-7 7-39-1-26-9Z" fill="#9b684e" stroke="#dfac72"/>
      {[0, 1, 2].map(i => <g key={i}><circle cx={522 + i * 14} cy="188" r="3.6" fill="#eed3a3"/><circle cx={522 + i * 14} cy="231" r="3.6" fill="#eed3a3"/></g>)}
      {[278, 307, 335, 363, 390, 416, 441, 464, 485].map(x => <path key={x} d={'M'+x+' 194v32'} stroke="#d6ae87" strokeWidth="1.4"/>)}
      <rect x="95" y="187" width="43" height="46" rx="5" fill="#543a2e"/>
      <path d="M125 191v38" stroke="#fff0cc" strokeWidth="3"/>
      {[0,1,2,3,4,5].map(i => <path key={i} d={'M109 '+(198+i*4.5)+'H548'} stroke="#fff0cc" strokeOpacity={0.55+i*.055} strokeWidth={.6+i*.12}/>)}
    </g>
    <text x="440" y="306" fill="#e5d5ad" opacity=".7" fontSize="9" letterSpacing="3">E A D G B E</text>
  </svg>
}
