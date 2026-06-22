# Sentence Scramble — Dakota

Drag the scrambled words into the correct SOV order to build a valid Dakota sentence.

<div id="ss-root"></div>

<style>
#ss-root *{box-sizing:border-box}
#ss-root{font-family:inherit;margin:1rem 0}
.ss-wrap{border:0.5px solid #ccc;border-radius:10px;overflow:hidden}
.ss-hdr{background:#8B1A1A;color:#fff;padding:12px 16px;display:flex;align-items:center;justify-content:space-between}
.ss-hdr h3{font-size:16px;font-weight:500;margin:0;color:#fff}
.ss-stats{display:flex;gap:14px;font-size:13px;color:#F5C070;align-items:center}
.ss-sn{font-weight:500;font-size:16px;color:#fff}
.ss-main{padding:16px}
.ss-prog{font-size:12px;color:#888;margin-bottom:12px;text-align:right}
.ss-slot-row{min-height:54px;border:2px dashed #e8c0c0;border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;padding:8px;margin-bottom:10px;background:#fdf8f8;transition:border-color .2s}
.ss-slot-row.over{border-color:#8B1A1A;background:#F9EBEB}
.ss-bank{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;min-height:44px;padding:6px;border:1px solid #eee;border-radius:8px;background:#fff}
.ss-chip{padding:8px 14px;background:#8B1A1A;color:#fff;border-radius:6px;cursor:grab;font-size:14px;font-weight:500;user-select:none;border:none;transition:transform .1s,opacity .1s}
.ss-chip:hover{transform:scale(1.04)}
.ss-chip.in-slot{background:#7A3A00}
.ss-chip.dragging{opacity:.4}
.ss-en{font-size:13px;color:#888;margin-bottom:10px;padding:8px;background:#f8f8f8;border-radius:6px;border-left:3px solid #8B1A1A;display:none}
.ss-en.show{display:block}
.ss-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.ss-btn{padding:7px 16px;border:1px solid #ccc;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;color:#555}
.ss-btn:hover{background:#f0f0f0}
.ss-btn.primary{background:#8B1A1A;color:#fff;border-color:#8B1A1A}
.ss-btn.primary:hover{background:#A32020}
.ss-feedback{margin-top:10px;padding:10px 14px;border-radius:8px;font-size:14px;display:none}
.ss-feedback.ok{background:#FFF0E0;color:#7A3A00;border:1px solid #C8860A;display:block}
.ss-feedback.bad{background:#FCEBEB;color:#A32D2D;border:1px solid #F09595;display:block}
.ss-result{text-align:center;padding:20px}
.ss-result h4{font-size:20px;font-weight:500;color:#8B1A1A;margin:0 0 8px}
</style>
<script>
(function(){
const SENTENCES=[
  {words:['Wičhášta','kiŋ','wóuŋsipi-kte'],en:'The man will work.',note:'SOV: Subject (wičhášta kiŋ) + Object — + Verb (wóuŋsipi) + future suffix (-kte)'},
  {words:['Šúŋka','waŋ','sápa','yá'],en:'A dog is black / goes.',note:'šúŋka waŋ = a dog; sápa = it is black (stative verb at end)'},
  {words:['James','emáčiyapi'],en:'My name is James.',note:'emáčiyapi = "they call me" — the subject (James) comes first'},
  {words:['Wiŋyaŋ','kiŋ','waníyetu','yúta-kte-šni'],en:'The woman will not eat in winter.',note:'Double suffix: -kte (future) + -šni (negation) on the verb'},
  {words:['Makóčhe','kiŋ','uŋkítawapi'],en:'The land belongs to us.',note:'uŋkítawapi = it is ours; verb comes last'},
  {words:['Mitákuye','Oyásʼiŋ'],en:'All my relations.',note:'A complete phrase — not subject-verb, but a sacred relational statement'},
  {words:['Mičháŋte','mayázaŋ'],en:'My heart hurts.',note:'mičháŋte = my heart (subject); mayázaŋ = it pains me (verb last)'},
  {words:['Bdewákhaŋthuŋwaŋ','etáŋhaŋ','waúŋ'],en:'I am from Bdewakanton.',note:'etáŋhaŋ = from; waúŋ = I am/exist — verb last'},
  {words:['Wiyóhiŋyaŋpa','etáŋhaŋ','áŋpetu','kiŋ','hí'],en:'The day comes from the east.',note:'hí = arrives/comes; direction phrase precedes subject'},
  {words:['Iktómi','wóoyake','kiŋ','eyápi'],en:'They tell the Iktomi story.',note:'eyápi = they say/tell — verb always last in Dakota'},
];
let qi=0,score=0,hintsUsed=0,slotWords=[],bankWords=[],dragging=null;
function sh(a){return[...a].sort(()=>Math.random()-.5)}
function init(){
  document.getElementById('ss-root').innerHTML=`<div class="ss-wrap">
<div class="ss-hdr"><div><h3>Sentence Scramble — Dakota</h3></div><div class="ss-stats"><div>Score <span class="ss-sn" id="ss-sc">0</span></div><div>Q <span class="ss-sn" id="ss-qi">1</span>/${SENTENCES.length}</div></div></div>
<div class="ss-main" id="ss-main"></div></div>`;
  showQ();
}
function showQ(){
  hintsUsed=0;slotWords=[];
  const s=SENTENCES[qi];
  bankWords=sh([...s.words]);
  renderQ(s);
}
function renderQ(s){
  const m=document.getElementById('ss-main');
  m.innerHTML=`<div class="ss-prog">Sentence ${qi+1} of ${SENTENCES.length} · Score: <strong>${score}</strong></div>
<p style="font-size:13px;color:#555;margin-bottom:6px">Arrange into correct Dakota (SOV) order:</p>
<div class="ss-slot-row" id="ss-slots" ondragover="event.preventDefault();this.classList.add('over')" ondragleave="this.classList.remove('over')" ondrop="ssDrop(event,'slot')"></div>
<div class="ss-bank" id="ss-bank" ondragover="event.preventDefault()" ondrop="ssDrop(event,'bank')"></div>
<div class="ss-en" id="ss-en"><strong>English:</strong> ${s.en}<br><span style="font-size:12px;color:#888">${s.note}</span></div>
<div class="ss-actions">
<button class="ss-btn" onclick="ssHint()">Hint (-3 pts)</button>
<button class="ss-btn" onclick="ssShowEn()">Show English (-2 pts)</button>
<button class="ss-btn primary" onclick="ssCheck()">Check ✓</button>
</div>
<div class="ss-feedback" id="ss-fb"></div>`;
  renderBank();renderSlots();
  document.getElementById('ss-sc').textContent=score;
  document.getElementById('ss-qi').textContent=qi+1;
}
function chip(word,from){
  const d=document.createElement('div');
  d.className='ss-chip'+(from==='slot'?' in-slot':'');
  d.textContent=word;d.draggable=true;d.dataset.word=word;d.dataset.from=from;
  d.addEventListener('dragstart',()=>{dragging={word,from};d.classList.add('dragging')});
  d.addEventListener('dragend',()=>d.classList.remove('dragging'));
  return d;
}
function renderBank(){const b=document.getElementById('ss-bank');if(!b)return;b.innerHTML='';bankWords.forEach(w=>b.appendChild(chip(w,'bank')));}
function renderSlots(){const s=document.getElementById('ss-slots');if(!s)return;s.innerHTML='';slotWords.forEach(w=>s.appendChild(chip(w,'slot')));}
window.ssDrop=function(e,target){
  e.preventDefault();
  const el=document.getElementById('ss-slots');if(el)el.classList.remove('over');
  if(!dragging)return;
  const {word,from}=dragging;dragging=null;
  if(from===target)return;
  if(from==='bank'&&target==='slot'){
    const idx=bankWords.indexOf(word);if(idx>-1)bankWords.splice(idx,1);slotWords.push(word);
  } else if(from==='slot'&&target==='bank'){
    const idx=slotWords.indexOf(word);if(idx>-1)slotWords.splice(idx,1);bankWords.push(word);
  }
  renderBank();renderSlots();
};
window.ssHint=function(){
  hintsUsed++;
  const s=SENTENCES[qi];
  const nextCorrect=s.words[slotWords.length];
  if(!nextCorrect)return;
  const bi=bankWords.indexOf(nextCorrect);
  if(bi>-1){bankWords.splice(bi,1);slotWords.push(nextCorrect);}
  renderBank();renderSlots();
};
window.ssShowEn=function(){hintsUsed++;const e=document.getElementById('ss-en');if(e)e.classList.add('show');};
window.ssCheck=function(){
  const s=SENTENCES[qi];
  const correct=JSON.stringify(slotWords)===JSON.stringify(s.words);
  const fb=document.getElementById('ss-fb');if(!fb)return;
  if(correct){
    const pts=Math.max(5,20-hintsUsed*5);score+=pts;
    fb.className='ss-feedback ok';fb.innerHTML=`✓ Háŋ — correct! +${pts} points<br><em style="font-size:12px">${s.en}</em>`;
    document.getElementById('ss-sc').textContent=score;
    qi++;
    setTimeout(()=>{if(qi>=SENTENCES.length)showResult();else showQ();},1200);
  } else {
    fb.className='ss-feedback bad';fb.textContent='Hiyá — not quite. Check the SOV order and try again.';
  }
};
function showResult(){
  document.getElementById('ss-main').innerHTML=`<div class="ss-result"><h4>Pidámayaye! All done!</h4>
<p style="font-size:15px;color:#8B1A1A;font-weight:500">Final score: ${score} / ${SENTENCES.length*20}</p>
<p style="color:#888;font-size:13px">You completed all ${SENTENCES.length} Dakota sentences.</p>
<button class="ss-btn primary" onclick="ssRestart()" style="margin-top:12px">Play again</button></div>`;
}
window.ssRestart=function(){qi=0;score=0;init();};
init();
})();
</script>

---
*Back to [Games Hub](index.md)*
