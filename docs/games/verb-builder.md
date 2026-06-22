# Verb Builder — Dakota

Select a Dakota verb root and add the correct suffix for future tense (-kte), negation (-šni), or both. Covers core grammar from Chapter 3.

<div id="vb-root"></div>

<style>
#vb-root *{box-sizing:border-box}
#vb-root{font-family:inherit;margin:1rem 0}
.vb-wrap{border:0.5px solid #ccc;border-radius:10px;overflow:hidden}
.vb-hdr{background:#8B1A1A;color:#fff;padding:12px 16px;display:flex;align-items:center;justify-content:space-between}
.vb-hdr h3{font-size:16px;font-weight:500;margin:0;color:#fff}
.vb-sub{font-size:11px;color:#F5C070}
.vb-stats{display:flex;gap:14px;font-size:13px;color:#F5C070;align-items:center}
.vb-sn{font-weight:500;font-size:16px;color:#fff}
.vb-main{padding:16px}
.vb-q-card{background:#fdf8f8;border:1px solid #e8c0c0;border-radius:10px;padding:20px;text-align:center;margin-bottom:14px}
.vb-verb-en{font-size:13px;color:#555;margin-bottom:4px}
.vb-prompt{font-size:22px;font-weight:600;color:#8B1A1A;margin-bottom:6px}
.vb-person{font-size:14px;color:#7A3A00;font-weight:500}
.vb-choices{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}
.vb-ch{padding:11px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;font-weight:500;text-align:center;font-family:inherit;transition:background .1s}
.vb-ch:hover{background:#fdf0f0;border-color:#8B1A1A}
.vb-ch.g{background:#FFF0E0;border-color:#C8860A;color:#7A3A00;pointer-events:none}
.vb-ch.r{background:#FCEBEB;border-color:#F09595;color:#A32D2D;pointer-events:none}
.vb-ch.dim{opacity:.4;pointer-events:none}
.vb-explain{background:#f8f8f8;border-left:3px solid #8B1A1A;padding:8px 12px;border-radius:0 6px 6px 0;font-size:13px;color:#555;margin-bottom:10px;display:none}
.vb-explain.show{display:block}
.vb-actions{display:flex;gap:8px}
.vb-btn{padding:7px 16px;border:1px solid #ccc;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;color:#555}
.vb-btn:hover{background:#f0f0f0}
.vb-btn.primary{background:#8B1A1A;color:#fff;border-color:#8B1A1A}
.vb-table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:14px}
.vb-table th{background:#8B1A1A;color:#fff;padding:6px 10px;text-align:left}
.vb-table td{padding:6px 10px;border-bottom:0.5px solid #eee}
.vb-table tr:nth-child(even) td{background:#fdf8f8}
.vb-result{text-align:center;padding:20px}
.vb-result h4{font-size:20px;font-weight:500;color:#8B1A1A;margin:0 0 8px}
</style>
<script>
(function(){
// Dakota verb suffix system (simpler than Ojibwe prefix system)
// Base verb + -kte (future) | + -šni (negation) | + -kte-šni (future neg)
const VERBS=[
  {dk:'yúta',en:'to eat (something)',root:'yúta',
   forms:{present:'yúta',future:'yúta-kte',neg:'yúta-šni',futneg:'yúta-kte-šni'}},
  {dk:'wóuŋsipi',en:'to work / live daily life',root:'wóuŋsipi',
   forms:{present:'wóuŋsipi',future:'wóuŋsipi-kte',neg:'wóuŋsipi-šni',futneg:'wóuŋsipi-kte-šni'}},
  {dk:'máni',en:'to walk',root:'máni',
   forms:{present:'máni',future:'máni-kte',neg:'máni-šni',futneg:'máni-kte-šni'}},
  {dk:'yá',en:'to go',root:'yá',
   forms:{present:'yá',future:'yá-kte',neg:'yá-šni',futneg:'yá-kte-šni'}},
  {dk:'eyá',en:'to say / speak',root:'eyá',
   forms:{present:'eyá',future:'eyá-kte',neg:'eyá-šni',futneg:'eyá-kte-šni'}},
  {dk:'wóčhekiye',en:'to pray',root:'wóčhekiye',
   forms:{present:'wóčhekiye',future:'wóčhekiye-kte',neg:'wóčhekiye-šni',futneg:'wóčhekiye-kte-šni'}},
  {dk:'kičhí wóuŋsipi',en:'to work together',root:'kičhí wóuŋsipi',
   forms:{present:'kičhí wóuŋsipi',future:'kičhí wóuŋsipi-kte',neg:'kičhí wóuŋsipi-šni',futneg:'kičhí wóuŋsipi-kte-šni'}},
  {dk:'bímaza',en:'to read / write',root:'bímaza',
   forms:{present:'bímaza',future:'bímaza-kte',neg:'bímaza-šni',futneg:'bímaza-kte-šni'}},
];
const FORMS=[
  {key:'present',label:'He / she ___s now (present)',note:'Base verb — no suffix needed in Dakota present tense'},
  {key:'future',label:'He / she will ___ (future)',note:'Add -kte after the verb root'},
  {key:'neg',label:'He / she does not ___ (negation)',note:'Add -šni after the verb root'},
  {key:'futneg',label:'He / she will not ___ (future negation)',note:'Add -kte then -šni: verb + -kte-šni'},
];
const SUFFIX_NOTES={'present':'no suffix (base form)','future':'-kte','neg':'-šni','futneg':'-kte-šni'};
let qs=[],qi=0,score=0,correctCount=0,answered=false;
function sh(a){return[...a].sort(()=>Math.random()-.5)}
function wrongForms(verb,formKey){
  const right=verb.forms[formKey];
  const others=Object.values(verb.forms).filter(f=>f!==right);
  const pool=sh(others);
  const picks=pool.slice(0,3);
  while(picks.length<3){
    const rv=sh(VERBS.filter(v=>v.dk!==verb.dk))[0];
    const rf=rv.forms[formKey];
    if(!picks.includes(rf))picks.push(rf);
  }
  return sh([right,...picks.slice(0,3)]);
}
function buildQs(){
  qs=[];
  VERBS.forEach(v=>{sh(FORMS).slice(0,3).forEach(f=>{qs.push({verb:v,form:f});});});
  qs=sh(qs).slice(0,15);
}
function init(){
  buildQs();qi=0;score=0;correctCount=0;
  document.getElementById('vb-root').innerHTML=`<div class="vb-wrap">
<div class="vb-hdr"><div><h3>Verb Builder — Dakota</h3><div class="vb-sub">Future -kte · Negation -šni · Future Negative -kte-šni</div></div>
<div class="vb-stats"><div>Score <span class="vb-sn" id="vb-sc">0</span></div><div>Q <span class="vb-sn" id="vb-qi">1</span>/15</div></div></div>
<div class="vb-main" id="vb-main"></div></div>`;
  showRef();showQ();
}
function showRef(){
  const m=document.getElementById('vb-main');
  const d=document.createElement('details');
  d.style.cssText='margin-bottom:14px;border:1px solid #ddd;border-radius:8px;overflow:hidden';
  d.innerHTML=`<summary style="padding:8px 12px;cursor:pointer;font-size:13px;font-weight:500;color:#8B1A1A;background:#fdf8f8">Quick reference — Dakota verb suffixes</summary>
<div style="padding:10px 12px">
<table class="vb-table"><tr><th>Meaning</th><th>Suffix</th><th>Example (yúta = to eat)</th></tr>
<tr><td>Present</td><td>none</td><td>yúta</td></tr>
<tr><td>Future "will ___"</td><td>-kte</td><td>yúta-kte</td></tr>
<tr><td>Negation "does not ___"</td><td>-šni</td><td>yúta-šni</td></tr>
<tr><td>Future negative "will not ___"</td><td>-kte-šni</td><td>yúta-kte-šni</td></tr>
</table>
<p style="font-size:12px;color:#888;margin:6px 0 0">Key rule: suffixes attach directly to the verb root. Negation (-šni) always comes last.</p>
</div>`;
  m.appendChild(d);
}
function showQ(){
  document.getElementById('vb-qi').textContent=qi+1;
  document.getElementById('vb-sc').textContent=score;
  answered=false;
  if(qi>=qs.length){showResult();return;}
  const {verb,form}=qs[qi];
  const opts=wrongForms(verb,form.key);
  const rightAns=verb.forms[form.key];
  const m=document.getElementById('vb-main');
  const ref=m.querySelector('details');
  m.innerHTML='';if(ref)m.appendChild(ref);
  const div=document.createElement('div');
  div.innerHTML=`<div class="vb-q-card">
<div class="vb-verb-en">Verb: <strong>${verb.en}</strong></div>
<div class="vb-prompt">${verb.dk}</div>
<div class="vb-person">${form.label.replace('___',verb.en.replace('to ',''))}</div>
</div>
<div class="vb-choices">${opts.map(o=>`<button class="vb-ch" onclick="vbPick('${o.replace(/'/g,"\\'")}','${rightAns.replace(/'/g,"\\'")}',this)">${o}</button>`).join('')}</div>
<div class="vb-explain" id="vb-ex"><strong>Suffix used:</strong> <code>${SUFFIX_NOTES[form.key]}</code><br>Root: <code>${verb.dk}</code> → <code>${rightAns}</code><br><em style="font-size:12px;color:#888">${form.note}</em></div>
<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="vb-btn" onclick="vbExplain()">Show breakdown</button><button class="vb-btn primary" id="vb-next" onclick="vbNext()" style="display:none">Next →</button></div>`;
  m.appendChild(div);
}
window.vbPick=function(choice,right,btn){
  if(answered)return;answered=true;
  document.querySelectorAll('.vb-ch').forEach(b=>{
    if(b.textContent===right)b.classList.add('g');
    else if(b===btn&&choice!==right)b.classList.add('r');
    else b.classList.add('dim');
  });
  if(choice===right){score+=10;correctCount++;}
  document.getElementById('vb-sc').textContent=score;
  document.getElementById('vb-ex').classList.add('show');
  const nx=document.getElementById('vb-next');if(nx)nx.style.display='inline-block';
};
window.vbExplain=function(){const e=document.getElementById('vb-ex');if(e)e.classList.add('show');};
window.vbNext=function(){qi++;showQ();};
function showResult(){
  document.getElementById('vb-main').innerHTML=`<div class="vb-result"><h4>Pidámayaye!</h4>
<p style="font-size:15px;color:#8B1A1A;font-weight:500">${correctCount} / ${qs.length} correct · Score: ${score}</p>
<p style="color:#888;font-size:13px">${correctCount>=12?'Excellent suffix mastery!':correctCount>=8?'Good progress — keep practicing the -kte and -šni rules!':'Review Chapter 3 suffix tables and try again.'}</p>
<button class="vb-btn primary" onclick="vbRestart()" style="margin-top:12px">Play again</button></div>`;
}
window.vbRestart=init;
init();
})();
</script>

---
*Back to [Games Hub](index.md)*
