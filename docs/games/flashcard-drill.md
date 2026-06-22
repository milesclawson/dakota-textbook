# Flashcard Drill — Dakota

Timed 4-choice quiz. Answer as fast as you can — streak multiplier boosts your score!

<div id="fd-root"></div>

<style>
#fd-root *{box-sizing:border-box}
#fd-root{font-family:inherit;margin:1rem 0}
.fd-wrap{border:0.5px solid #ccc;border-radius:10px;overflow:hidden}
.fd-hdr{background:#8B1A1A;color:#fff;padding:12px 16px;display:flex;align-items:center;justify-content:space-between}
.fd-hdr h3{font-size:16px;font-weight:500;margin:0;color:#fff}
.fd-stats{display:flex;gap:16px;font-size:13px;color:#F5C070;align-items:center}
.fd-sn{font-weight:500;font-size:16px;color:#fff}
.fd-body{padding:20px 20px 14px}
.fd-prompt{font-size:22px;font-weight:600;color:#8B1A1A;text-align:center;margin-bottom:6px;min-height:40px}
.fd-hint{font-size:12px;color:#999;text-align:center;margin-bottom:16px}
.fd-bar-wrap{height:6px;background:#f0f0f0;border-radius:3px;margin-bottom:16px}
.fd-bar{height:6px;background:#C8860A;border-radius:3px;transition:width .1s linear}
.fd-choices{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.fd-ch{padding:12px 10px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;font-size:14px;font-weight:500;text-align:center;transition:background .1s;font-family:inherit}
.fd-ch:hover:not(:disabled){background:#f0f0f0}
.fd-ch.g{background:#FFF0E0 !important;border-color:#C8860A !important;color:#7A3A00}
.fd-ch.r{background:#FCEBEB !important;border-color:#F09595 !important;color:#A32D2D}
.fd-ch:disabled{cursor:default}
.fd-dir{display:flex;gap:8px;margin-top:12px;justify-content:center}
.fd-dir button{font-size:12px;padding:4px 12px;border-radius:6px;border:1px solid #ccc;background:transparent;cursor:pointer;color:#555}
.fd-dir button.act{background:#8B1A1A;color:#fff;border-color:#8B1A1A}
.fd-streak{font-size:12px;color:#C8860A;text-align:center;min-height:18px;margin-top:8px;font-weight:500}
.fd-ov{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:40px 20px;text-align:center}
.fd-ov h4{font-size:20px;font-weight:500;color:#8B1A1A;margin:0}
.fd-ov p{font-size:14px;color:#555;margin:0}
.fd-btn{padding:8px 24px;background:#8B1A1A;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer}
</style>
<script>
(function(){
const VOCAB=[
  {dk:'Háu',en:'Hello (male)',ch:1},{dk:'Haŋ',en:'Hello (female)',ch:1},{dk:'Pidámayaye',en:'Thank you',ch:1},{dk:'Hiyá',en:'No',ch:1},{dk:'Tokhéya',en:'Goodbye',ch:1},
  {dk:'emáčiyapi',en:'my name is (they call me)',ch:1},{dk:'tiyóšpaye',en:'extended family band',ch:1},{dk:'Oyáte',en:'Nation / people',ch:1},
  {dk:'waŋží',en:'one (1)',ch:2},{dk:'núŋpa',en:'two (2)',ch:2},{dk:'yámni',en:'three (3)',ch:2},{dk:'tópa',en:'four (4)',ch:2},
  {dk:'záptaŋ',en:'five (5)',ch:2},{dk:'šákpe',en:'six (6)',ch:2},{dk:'šakówiŋ',en:'seven (7)',ch:2},{dk:'wikčémna',en:'ten (10)',ch:2},
  {dk:'šá',en:'it is red',ch:2},{dk:'tó',en:'it is blue/green',ch:2},{dk:'sápa',en:'it is black',ch:2},{dk:'sáŋ',en:'it is white',ch:2},{dk:'žiží',en:'it is yellow',ch:2},
  {dk:'wóuŋsipi',en:'daily life / work',ch:3},{dk:'yúta',en:'to eat (something)',ch:3},{dk:'-kte',en:'future tense suffix',ch:3},{dk:'-šni',en:'negation suffix',ch:3},
  {dk:'čhaŋté',en:'heart',ch:4},{dk:'mičháŋte',en:'my heart',ch:4},{dk:'mayázaŋ',en:'it hurts me / I am sick',ch:4},
  {dk:'Mitákuye Oyásʼiŋ',en:'All my relations',ch:5},{dk:'Wakȟáŋ Tȟáŋka',en:'Great Mystery / Great Spirit',ch:5},
  {dk:'wačháŋtognaka',en:'generosity',ch:5},{dk:'ohítika',en:'bravery',ch:5},{dk:'ksapá',en:'wisdom',ch:5},{dk:'wóčhekiye',en:'prayer',ch:5},
  {dk:'makóčhe',en:'land / homeland',ch:6},{dk:'wétȟo',en:'spring',ch:6},{dk:'blokétu',en:'summer',ch:6},{dk:'ptaŋyétu',en:'fall / autumn',ch:6},{dk:'waníyetu',en:'winter',ch:6},
  {dk:'Wiyóhiŋyaŋpa',en:'east',ch:6},{dk:'Wiyóhpeyata',en:'west',ch:6},{dk:'Wazíyata',en:'north',ch:6},{dk:'Itókaga',en:'south',ch:6},{dk:'Bdóte',en:'confluence — Dakota spiritual center',ch:6},
  {dk:'Iktómi',en:'Spider / trickster figure',ch:7},{dk:'wóoyake',en:'story / oral narrative',ch:7},{dk:'eháŋni',en:'long ago (narrative opener)',ch:7},
  {dk:'wokiksuye',en:'remembrance / commemoration',ch:8},{dk:'Očhéthi Šakówiŋ',en:'Seven Council Fires',ch:8},
];
let dir='dk2en',chFilter=0,score=0,streak=0,best=0,q=0,total=20,active=false,tbar=null,secs=8,cur=null,locked=false,pool=[];
function sh(a){return[...a].sort(()=>Math.random()-.5)}
function pick4(cur,pool){const others=sh(pool.filter(x=>x.dk!==cur.dk)).slice(0,3);return sh([cur,...others]);}
function hud(){const s=document.getElementById('fd-sc'),st=document.getElementById('fd-str'),b=document.getElementById('fd-best');
  if(s)s.textContent=score;if(st)st.textContent='🔥'.repeat(Math.min(streak,5))+(streak>5?'+'+streak:'');if(b)b.textContent=best;}
function nextQ(){
  if(q>=total){endGame();return;}
  locked=false;
  pool=chFilter?VOCAB.filter(x=>x.ch===chFilter):VOCAB;
  cur=pool[Math.floor(Math.random()*pool.length)];
  const choices=pick4(cur,pool);
  const prompt=dir==='dk2en'?cur.dk:cur.en;
  const hint=dir==='dk2en'?'What does this Dakota word mean?':'How do you say this in Dakota?';
  const pd=document.getElementById('fd-prompt');if(pd)pd.textContent=prompt;
  const hi=document.getElementById('fd-hint');if(hi)hi.textContent=hint;
  const qdp=document.getElementById('fd-qd');if(qdp)qdp.textContent=`${q+1}/${total}`;
  const ch=document.getElementById('fd-choices');if(ch){ch.innerHTML='';
    choices.forEach(c=>{const b=document.createElement('button');b.className='fd-ch';
      b.textContent=dir==='dk2en'?c.en:c.dk;
      b.onclick=()=>pick(c,b,choices);ch.appendChild(b);});}
  secs=8;const bar=document.getElementById('fd-bar');if(bar)bar.style.width='100%';
  clearInterval(tbar);
  tbar=setInterval(()=>{secs-=0.1;if(secs<=0){clearInterval(tbar);timeout();}else{const bar=document.getElementById('fd-bar');if(bar)bar.style.width=(secs/8*100)+'%';}},100);
}
function timeout(){
  if(locked)return;locked=true;streak=0;hud();
  const ch=document.getElementById('fd-choices');if(!ch)return;
  const correct=dir==='dk2en'?cur.en:cur.dk;
  ch.querySelectorAll('button').forEach(b=>{if(b.textContent===correct)b.classList.add('g');else b.classList.add('r');b.disabled=true;});
  const sd=document.getElementById('fd-streak');if(sd)sd.textContent='Time out!';
  setTimeout(()=>{q++;nextQ();},1000);
}
function pick(c,btn,choices){
  if(locked)return;locked=true;clearInterval(tbar);
  const correct=dir==='dk2en'?cur.dk===c.dk:cur.en===c.en;
  const allBtns=document.getElementById('fd-choices').querySelectorAll('button');
  if(correct){
    streak++;const bonus=Math.min(streak,5)*5;score+=10+bonus;if(score>best)best=score;btn.classList.add('g');
    const sd=document.getElementById('fd-streak');if(sd)sd.textContent=streak>1?`🔥 Streak x${streak}! +${10+bonus} pts`:'';
  } else {
    streak=0;btn.classList.add('r');const ans=dir==='dk2en'?cur.en:cur.dk;
    allBtns.forEach(b=>{if(b.textContent===ans)b.classList.add('g');});
    const sd=document.getElementById('fd-streak');if(sd)sd.textContent='';
  }
  allBtns.forEach(b=>b.disabled=true);hud();
  setTimeout(()=>{q++;nextQ();},correct?400:900);
}
function startGame(){q=0;score=0;streak=0;active=true;
  const ov=document.getElementById('fd-ov');if(ov)ov.style.display='none';
  const bdy=document.getElementById('fd-main');if(bdy)bdy.style.display='';
  hud();nextQ();}
function endGame(){active=false;clearInterval(tbar);if(score>best)best=score;
  const ov=document.getElementById('fd-ov');if(ov){ov.style.display='flex';
    ov.innerHTML=`<h4>Done!</h4><p>Score: ${score} · Best: ${best}<br>🔥 Longest streak — all yours!</p><button class="fd-btn" onclick="fdStart()">Play again</button>`;}
  const bdy=document.getElementById('fd-main');if(bdy)bdy.style.display='none';}
window.fdStart=startGame;
document.getElementById('fd-root').innerHTML=`<div class="fd-wrap">
<div class="fd-hdr"><div><h3>Flashcard Drill — Dakota</h3></div><div class="fd-stats"><div>Score <span class="fd-sn" id="fd-sc">0</span></div><div>Best <span class="fd-sn" id="fd-best">0</span></div><div><span id="fd-str" class="fd-sn"></span></div></div></div>
<div id="fd-ov" style="display:flex" class="fd-ov"><h4>Flashcard Drill</h4><p>4-choice timed quiz · 20 questions<br>Streaks multiply your score.</p><button class="fd-btn" onclick="fdStart()">Start</button></div>
<div id="fd-main" style="display:none">
<div class="fd-body">
<div class="fd-prompt" id="fd-prompt"></div>
<div class="fd-hint" id="fd-hint"></div>
<div class="fd-bar-wrap"><div class="fd-bar" id="fd-bar" style="width:100%"></div></div>
<div class="fd-choices" id="fd-choices"></div>
<div class="fd-streak" id="fd-streak"></div>
<div class="fd-dir">
<button class="act" id="dk2en-btn" onclick="fdDir('dk2en',this)">Dakota → English</button>
<button id="en2dk-btn" onclick="fdDir('en2dk',this)">English → Dakota</button>
<span style="margin-left:auto;font-size:12px;color:#999">Q <span id="fd-qd">1/20</span></span>
</div>
</div>
</div></div>`;
window.fdDir=function(d,btn){dir=d;document.querySelectorAll('.fd-dir button').forEach(b=>b.className='');btn.className='act';};
})();
</script>

---
*Back to [Games Hub](index.md)*
