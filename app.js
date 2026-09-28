const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const subjects=[
 {name:'Database Management Systems',code:'CS2203',branch:'CSE',units:5,resources:64,icon:'DB',color:'purple',desc:'Relational models, SQL, normalization and transactions.'},
 {name:'Operating Systems',code:'CS2202',branch:'CSE',units:5,resources:58,icon:'OS',color:'coral',desc:'Processes, memory management, file systems and deadlocks.'},
 {name:'Computer Networks',code:'CS3101',branch:'CSE',units:5,resources:51,icon:'CN',color:'blue',desc:'Network layers, protocols, routing and security.'},
 {name:'Data Structures & Algorithms',code:'CS1204',branch:'CSE',units:5,resources:72,icon:'DS',color:'mint',desc:'Trees, graphs, sorting and complexity analysis.'},
 {name:'Engineering Mathematics II',code:'MA1201',branch:'EEE',units:5,resources:43,icon:'M2',color:'gold',desc:'Differential equations, transforms and vector calculus.'},
 {name:'Digital Logic Design',code:'EC2102',branch:'ECE',units:5,resources:39,icon:'DL',color:'lavender',desc:'Boolean algebra, sequential and combinational circuits.'},
 {name:'Thermodynamics',code:'ME2101',branch:'Mechanical',units:5,resources:46,icon:'TD',color:'coral',desc:'Properties, laws, cycles and energy conversion.'},
 {name:'Strength of Materials',code:'CE2201',branch:'Civil',units:5,resources:41,icon:'SM',color:'blue',desc:'Stress, strain, bending and structural behavior.'},
 {name:'Machine Learning',code:'AI3102',branch:'AI & ML',units:5,resources:48,icon:'ML',color:'mint',desc:'Regression, classification, clustering and evaluation.'}
];
const papers=[
 {subject:'Database Management Systems',year:2026,university:'NRIU',reg:'R23',semester:'II-II',type:'Model Paper',file:'papers/dbms-model-paper.pdf'},
 {subject:'Operating Systems',year:2026,university:'NRIU',reg:'R23',semester:'II-II',type:'Model Paper',file:'papers/os-model-paper.pdf'},
 {subject:'Computer Networks',year:2026,university:'NRIU',reg:'R23',semester:'III-I',type:'Model Paper',file:'papers/cn-model-paper.pdf'},
 {subject:'Database Management Systems',year:2025,university:'JNTUK',reg:'R23',semester:'II-II',type:'Supplementary'},
 {subject:'Operating Systems',year:2025,university:'JNTUK',reg:'R23',semester:'II-II',type:'Regular'},
 {subject:'Computer Networks',year:2024,university:'JNTUH',reg:'R20',semester:'III-I',type:'Supplementary'},
 {subject:'Database Management Systems',year:2024,university:'JNTUK',reg:'R20',semester:'II-II',type:'Regular'},
 {subject:'Engineering Mathematics II',year:2023,university:'AU',reg:'R21',semester:'I-II',type:'Supplementary'},
 {subject:'Data Structures & Algorithms',year:2023,university:'JNTUH',reg:'R20',semester:'II-I',type:'Regular'}
];
const quizSets={
 dbms:[
  {q:'Which normal form removes partial dependency on a composite candidate key?',o:['First Normal Form (1NF)','Second Normal Form (2NF)','Third Normal Form (3NF)','Boyce–Codd Normal Form'],a:1,e:'2NF requires a relation to be in 1NF and removes partial dependencies of non-prime attributes on part of a composite candidate key.'},
  {q:'Which SQL command removes all rows while retaining the table structure?',o:['DROP','DELETE DATABASE','TRUNCATE','REMOVE'],a:2,e:'TRUNCATE removes all rows efficiently but retains the table definition.'},
  {q:'Reading data written by an uncommitted transaction causes which anomaly?',o:['Dirty read','Phantom write','Lost schema','Index overflow'],a:0,e:'A dirty read occurs when one transaction reads uncommitted changes made by another.'}],
 os:[
  {q:'Which scheduling algorithm may cause starvation?',o:['Round Robin','First Come First Served','Priority Scheduling','FIFO paging'],a:2,e:'Low-priority processes can wait indefinitely in priority scheduling; aging helps prevent this.'},
  {q:'Which is NOT a necessary condition for deadlock?',o:['Mutual exclusion','Hold and wait','Preemption allowed','Circular wait'],a:2,e:'The necessary condition is no preemption, not preemption allowed.'},
  {q:'A page fault occurs when…',o:['The CPU overheats','A referenced page is not in memory','A file is deleted','A process terminates'],a:1,e:'The operating system handles a page fault by loading the required page into memory.'}],
 cn:[
  {q:'Which protocol translates domain names into IP addresses?',o:['HTTP','DNS','ARP','SMTP'],a:1,e:'DNS resolves human-readable domain names to IP addresses.'},
  {q:'Which transport protocol provides reliable, ordered delivery?',o:['UDP','IP','TCP','ICMP'],a:2,e:'TCP uses acknowledgements, sequencing and retransmission for reliable ordered delivery.'},
  {q:'A switch primarily operates at which OSI layer?',o:['Physical','Data Link','Transport','Application'],a:1,e:'Traditional Ethernet switches operate at the Data Link layer using MAC addresses.'}]
};
let quiz=quizSets.dbms;
const finderSteps=[
 {title:'Select your university',hint:'Choose the university your college is affiliated with.',opts:[['JNTUK','Jawaharlal Nehru Technological University Kakinada'],['JNTUH','Jawaharlal Nehru Technological University Hyderabad'],['NRI University','Andhra Pradesh'],['Andhra University','Visakhapatnam'],['SVU','Sri Venkateswara University']]},
 {title:'Select your course',hint:'Choose your engineering degree.',opts:[['B.Tech','Bachelor of Technology'],['B.E.','Bachelor of Engineering']]},
 {title:'Select your branch',hint:'Choose your engineering specialization.',opts:['CSE','ECE','EEE','Mechanical','Civil','AI & ML','Data Science','IT']},
 {title:'Select your regulation',hint:'Choose the regulation applicable to your batch.',opts:['R20','R21','R22','R23','R24']},
 {title:'Select your year',hint:'Choose your current subject year.',opts:['1st Year','2nd Year','3rd Year','4th Year']},
 {title:'Select your semester',hint:'Choose the semester for your subject.',opts:['Semester 1','Semester 2']},
 {title:'Select your subject',hint:'Almost there. Pick the subject you want to prepare.',opts:subjects.slice(0,6).map(x=>[x.name,x.code])}
];
let finderIndex=0, finderSelected=Array(7).fill(null), quizIndex=0, selectedAnswer=null, checked=false, correct=0, quizTimerId=null, secondsLeft=30;
const store={get:(k,f=[])=>{try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};

function nav(page){
  page=page||'home'; if(!$('#page-'+page)) page='home';
  $$('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+page));
  $$('#nav a').forEach(a=>a.classList.toggle('active',a.dataset.nav===page));
  $('#nav').classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'});
  history.replaceState(null,'','#'+page);
}
$$('[data-nav]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();nav(el.dataset.nav)}));
window.addEventListener('hashchange',()=>nav(location.hash.slice(1)));

function renderSubjects(list=subjects){
 const html=list.map(s=>`<article class="resource-card" data-branch="${s.branch}"><span class="subject-icon ${s.color}">${s.icon}</span><span class="kicker">${s.branch} · R23</span><h3>${s.name}</h3><p>${s.desc}</p><footer><span>${s.units} units</span><span>${s.resources} resources</span><button class="link-btn open-subject">Explore →</button></footer></article>`).join('');
 $('#subjectGrid').innerHTML=html||'<p>No subjects found. Try a different search.</p>'; $('#courseSubjects').innerHTML=subjects.slice(0,6).map(s=>`<article class="resource-card"><span class="kicker">${s.code}</span><h3>${s.name}</h3><p>${s.resources} learning resources</p><footer><span>${s.units} units</span><button class="link-btn open-subject">Open →</button></footer></article>`).join('');
 $$('.open-subject').forEach(b=>b.onclick=()=>nav('subject'));
}
function renderPapers(list=papers){
 $('#paperCount').textContent=`${list.length} paper${list.length===1?'':'s'} found`;
 $('#papersList').innerHTML=list.map(p=>`<article class="paper-card"><span class="subject-icon purple"><svg><use href="#i-file"/></svg></span><div class="paper-info"><b>${p.subject}</b><small>${p.university} · ${p.semester} Semester${p.file?' · Original practice resource':''}</small></div><div class="paper-meta"><span class="tag">${p.year}</span><span class="tag">${p.reg}</span><span class="tag">${p.type}</span></div><div class="paper-actions">${p.file?`<a class="btn ghost small paper-open" data-title="${p.subject}" href="${p.file}" target="_blank" rel="noopener">View</a><a class="btn primary small paper-open" data-title="${p.subject}" href="${p.file}" download><svg><use href="#i-download"/></svg> Download PDF</a>`:`<button class="btn ghost small paper-unavailable">View details</button>`}</div></article>`).join('')||'<p style="padding:30px;text-align:center;color:var(--muted)">No matching papers found.</p>';
 $$('.paper-unavailable').forEach(b=>b.onclick=()=>toast('This archive record needs an authorized PDF before download.'));
 $$('.paper-open').forEach(a=>a.onclick=()=>{let recent=store.get('bb-recent',[]).filter(x=>x.title!==a.dataset.title);recent.unshift({title:a.dataset.title,date:new Date().toLocaleDateString('en-IN')});store.set('bb-recent',recent.slice(0,5));renderPersonalLibrary()});
}
function filterPapers(){let q=$('#paperSearch').value.toLowerCase(),u=$('#paperUniversity').value,r=$('#paperReg').value;renderPapers(papers.filter(p=>p.subject.toLowerCase().includes(q)&&(u.startsWith('All')||p.university===u)&&(r.startsWith('All')||p.reg===r)))}
function renderFinder(){
 $('#stepNow').textContent=finderIndex+1; $('#stepBadge').textContent=`Step ${finderIndex+1}`; $('#stepTitle').textContent=finderSteps[finderIndex].title; $('#stepHint').textContent=finderSteps[finderIndex].hint;
 $('#stepper').innerHTML=finderSteps.map((_,i)=>`<i class="${i<=finderIndex?'done':''}"></i>`).join('');
 $('#optionGrid').innerHTML=finderSteps[finderIndex].opts.map((o,i)=>{let a=Array.isArray(o)?o:[o,''];return `<button class="option ${finderSelected[finderIndex]===i?'selected':''}" data-i="${i}">${a[0]}${a[1]?`<small>${a[1]}</small>`:''}</button>`}).join('');
 $$('.option',$('#optionGrid')).forEach(o=>o.onclick=()=>{finderSelected[finderIndex]=+o.dataset.i;renderFinder()});
 $('#backStep').disabled=finderIndex===0; $('#nextStep').disabled=finderSelected[finderIndex]===null; $('#nextStep').innerHTML=finderIndex===6?'Open subject <svg><use href="#i-arrow"/></svg>':'Continue <svg><use href="#i-arrow"/></svg>';
}
$('#nextStep').onclick=()=>{if(finderIndex<6){finderIndex++;renderFinder()}else{toast('Your personalized subject page is ready!');setTimeout(()=>nav('subject'),400)}};
$('#backStep').onclick=()=>{if(finderIndex>0){finderIndex--;renderFinder()}};
$('#findSubjectBtn').onclick=()=>$('#finder').scrollIntoView({behavior:'smooth'});

function renderSubjectContent(){
 const units=[['Introduction & ER Model',['Explain three-schema architecture and data independence.','Draw an ER diagram for a university database.']],['Relational Algebra & SQL',['Compare relational algebra operations with examples.','Write SQL queries using joins, nested queries and aggregation.']],['Normalization',['Explain functional dependencies and normalization up to BCNF.','Find the highest normal form of the given relation.']]];
 $('#unitQuestions').innerHTML=units.map((u,i)=>`<div class="unit" data-unit="${i}"><div class="unit-head"><span>Unit ${i+1} · ${u[0]}</span><span>${u[1].length} questions</span></div>${u[1].map((q,j)=>`<div class="question-row" data-marks="${j?'10':'5'}" data-difficulty="${j?'important':'frequent'}"><span>${q}</span><span class="badge ${j?'imp':'freq'}">${j?'Important':'Frequently asked'}</span><span class="tag">${j?'10':'5'} marks</span></div>`).join('')}</div>`).join('');
 $('#subjectPapers').innerHTML=papers.filter(p=>p.subject.includes('Database')).slice(0,3).map(p=>`<div class="paper-mini"><span class="subject-icon purple"><svg><use href="#i-file"/></svg></span><div><b>${p.year} ${p.type}</b><small>${p.university} · ${p.reg} · ${p.semester}</small></div>${p.file?`<a class="link-btn" href="${p.file}" download>Download PDF</a>`:`<button class="paper-unavailable">Details</button>`}</div>`).join('');
}
function renderDashboard(){ $('#mySubjects').innerHTML=subjects.slice(0,3).map((s,i)=>`<div class="my-subject-row"><span class="subject-icon ${s.color}">${s.icon}</span><div><b>${s.name}</b><small>${[68,42,25][i]}% prepared</small></div><div class="progress"><i style="width:${[68,42,25][i]}%"></i></div><button class="link-btn open-subject">Continue</button></div>`).join('') }

function startQuizTimer(){clearInterval(quizTimerId);$('#quizTimer').textContent='';if(!$('#timedMode').checked)return;secondsLeft=30;$('#quizTimer').textContent='00:30';quizTimerId=setInterval(()=>{secondsLeft--;$('#quizTimer').textContent=`00:${String(secondsLeft).padStart(2,'0')}`;if(secondsLeft<=0){clearInterval(quizTimerId);if(!checked){selectedAnswer=-1;$('#nextQuestion').disabled=false;$('#nextQuestion').click()}}},1000)}
function renderQuiz(){clearInterval(quizTimerId);let x=quiz[quizIndex];let names={dbms:'DBMS · Unit 3',os:'Operating Systems',cn:'Computer Networks'};$('#quizTag').textContent=names[$('#practiceSubject').value];$('#quizNumber').textContent=`Question ${quizIndex+1} of ${quiz.length}`;$('#quizQuestion').textContent=x.q;$('#quizOptions').innerHTML=x.o.map((o,i)=>`<button class="quiz-option" data-i="${i}"><b>${String.fromCharCode(65+i)}.</b> ${o}</button>`).join('');$('#explanation').className='explanation';$('#explanation').textContent='';$('#nextQuestion').disabled=true;$('#nextQuestion').textContent='Check answer';selectedAnswer=null;checked=false;$$('.quiz-option').forEach(o=>o.onclick=()=>{if(checked)return;selectedAnswer=+o.dataset.i;$$('.quiz-option').forEach(y=>y.classList.toggle('selected',y===o));$('#nextQuestion').disabled=false});startQuizTimer()}
$('#nextQuestion').onclick=()=>{let x=quiz[quizIndex];if(!checked){clearInterval(quizTimerId);checked=true;$$('.quiz-option').forEach((o,i)=>{o.classList.remove('selected');if(i===x.a)o.classList.add('correct');else if(i===selectedAnswer)o.classList.add('wrong')});if(selectedAnswer===x.a)correct++;$('#explanation').textContent=(selectedAnswer<0?'Time is up. ':'')+x.e;$('#explanation').classList.add('show');$('#nextQuestion').textContent=quizIndex===quiz.length-1?'Finish practice':'Next question';let done=quizIndex+1;$('#practiceDone').textContent=`${done} of ${quiz.length} questions answered`;let score=Math.round(correct/done*100);$('#practiceScore').textContent=score;$('.ring').style.background=`conic-gradient(var(--purple) ${score}%,var(--line) 0)`}else if(quizIndex<quiz.length-1){quizIndex++;renderQuiz()}else{let subject=$('#practiceSubject').selectedOptions[0].text,history=store.get('bb-history',[]);history.unshift({subject,score:Math.round(correct/quiz.length*100),date:new Date().toLocaleDateString('en-IN')});store.set('bb-history',history.slice(0,10));store.set('bb-total',store.get('bb-total',128)+quiz.length);toast(`Practice complete — ${correct}/${quiz.length} correct!`);quizIndex=0;correct=0;renderPracticeHistory();renderQuiz()}};

$('#hours').oninput=e=>$('#hoursOut').textContent=`${e.target.value} hour${e.target.value==='1'?'':'s'}`;
const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+21);$('#examDate').value=tomorrow.toISOString().slice(0,10);
$('#plannerForm').onsubmit=e=>{e.preventDefault();let n=+$('#backlogCount').value,h=+$('#hours').value,date=new Date($('#examDate').value+'T00:00:00'),days=Math.max(1,Math.ceil((date-new Date())/86400000)),names=subjects.slice(0,n).map(s=>s.name);let blocks=Math.max(1,Math.floor(h/1.5));$('#planResult').classList.remove('empty');$('#planResult').innerHTML=`<div class="card-heading"><div><span class="kicker">YOUR PERSONAL PLAN</span><h2>${days}-day comeback plan</h2><p>${h} hours/day · ${n} subjects · ${$('#studyTime').value}</p></div></div><div class="schedule-summary"><span>${Math.max(1,days-3)} study days</span><span>3 revision days</span><span>${blocks} focus blocks/day</span></div>${Array.from({length:Math.min(7,days)},(_,i)=>`<div class="schedule-day"><b>Day ${i+1}</b><div><b>${names[i%n]}</b><small>Unit ${(i%5)+1} concepts + ${i%2?'practice questions':'previous-paper review'}</small></div><span class="tag">${h}h</span></div>`).join('')}<button class="btn ghost full" onclick="toast('Plan saved to your dashboard!')">Save to dashboard</button><button class="btn primary full download-plan" onclick="downloadStudyPlan()"><svg><use href="#i-download"/></svg> Download study plan</button>`};

function doSearch(){let q=$('#globalSearch').value.trim().toLowerCase();if(!q)return;let hits=subjects.filter(s=>(s.name+' '+s.desc).toLowerCase().includes(q));if(q.includes('normalization')||q.includes('dbms'))hits=[subjects[0],...hits.filter(x=>x!==subjects[0])];$('#searchResults').innerHTML=(hits.length?hits.slice(0,5).map(s=>`<div class="search-result"><span class="subject-icon ${s.color}">${s.icon}</span><div><b>${s.name}</b><small>${q.includes('normalization')?'Relevant topic: Normalization · Unit 3':s.desc}</small></div></div>`).join(''):'<div class="search-result">No exact match. Try DBMS, normalization, networks or mathematics.</div>');$('#searchResults').classList.add('show');$$('.search-result').forEach(x=>x.onclick=()=>nav('subject'))}
$('#searchBtn').onclick=doSearch;$('#globalSearch').oninput=e=>{if(e.target.value.length>1)doSearch();else $('#searchResults').classList.remove('show')};document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))$('#searchResults').classList.remove('show')});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();nav('home');setTimeout(()=>$('#globalSearch').focus(),100)}});
$('#subjectSearch').oninput=e=>{let q=e.target.value.toLowerCase(),b=$('#branchFilter').value;renderSubjects(subjects.filter(s=>(s.name+' '+s.desc).toLowerCase().includes(q)&&(b==='All branches'||s.branch===b)))};$('#branchFilter').onchange=()=>$('#subjectSearch').dispatchEvent(new Event('input'));
['paperSearch','paperUniversity','paperReg'].forEach(id=>$('#'+id).addEventListener(id==='paperSearch'?'input':'change',filterPapers));
$('#themeBtn').onclick=()=>{let dark=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=dark?'dark':'light';$('#themeBtn use').setAttribute('href',dark?'#i-sun':'#i-moon');localStorage.setItem('bb-theme',dark?'dark':'light')};
if(localStorage.getItem('bb-theme')==='dark'){$('#themeBtn').click()}
$('#menuBtn').onclick=()=>$('#nav').classList.toggle('open');

// Installable PWA, offline state, and service-worker update handling.
let deferredInstallPrompt=null,waitingWorker=null;
const installBtn=$('#installAppBtn'),offlineBanner=$('#offlineBanner'),updateBanner=$('#updateBanner');
function updateNetworkState(){offlineBanner.classList.toggle('show',!navigator.onLine)}
window.addEventListener('online',()=>{updateNetworkState();toast('You’re back online')});window.addEventListener('offline',updateNetworkState);updateNetworkState();
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;installBtn.hidden=false});
window.addEventListener('appinstalled',()=>{installBtn.hidden=true;deferredInstallPrompt=null;toast('Backlog Buddy installed successfully')});
installBtn.onclick=async()=>{if(!deferredInstallPrompt){toast('Use your browser menu and choose “Install app” or “Add to Home Screen”.');return}deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;installBtn.hidden=true};
$('#applyUpdateBtn').onclick=()=>{if(waitingWorker)waitingWorker.postMessage('SKIP_WAITING')};
if('serviceWorker' in navigator){window.addEventListener('load',async()=>{try{const registration=await navigator.serviceWorker.register('/sw.js');if(registration.waiting){waitingWorker=registration.waiting;updateBanner.classList.add('show')}registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller){waitingWorker=worker;updateBanner.classList.add('show')}})});navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload())}catch(error){console.warn('Offline mode unavailable:',error.message)}})}
function toast(msg){let t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2700)}window.toast=toast;
$('#addContent').onclick=()=>toast('Content form ready for backend integration.');

function filterQuestions(){let u=$('#unitFilter').value,m=$('#marksFilter').value,d=$('#difficultyFilter').value;$$('.unit',$('#unitQuestions')).forEach(unit=>{let unitMatch=u==='all'||unit.dataset.unit===u,visible=0;$$('.question-row',unit).forEach(q=>{let show=unitMatch&&(m==='all'||q.dataset.marks===m)&&(d==='all'||q.dataset.difficulty===d);q.style.display=show?'flex':'none';if(show)visible++});unit.style.display=visible?'block':'none'})}
['unitFilter','marksFilter','difficultyFilter'].forEach(id=>$('#'+id).onchange=filterQuestions);
$('#saveAllQuestions').onclick=()=>{let saved=store.get('bb-saved',[]);$$('.question-row').filter(q=>q.style.display!=='none').forEach(q=>{let text=q.querySelector('span').textContent;if(!saved.includes(text))saved.push(text)});store.set('bb-saved',saved);renderPersonalLibrary();toast('Visible questions saved to your library')};
$('#saveQuizQuestion').onclick=()=>{let saved=store.get('bb-saved',[]),text=quiz[quizIndex].q;if(!saved.includes(text))saved.unshift(text);store.set('bb-saved',saved);renderPersonalLibrary();toast('Question saved')};
function renderPracticeHistory(){let h=store.get('bb-history',[]);$('#practiceHistory').innerHTML=h.length?h.map(x=>`<div class="history-row"><b>${x.subject}</b><span>${x.score}% · <small>${x.date}</small></span></div>`).join(''):'<p>No completed tests yet.</p>';$('#totalPracticed').textContent=store.get('bb-total',128)}
$('#practiceHistoryBtn').onclick=()=>{$('#practiceHistory').classList.toggle('show');renderPracticeHistory()};
$('#practiceSubject').onchange=e=>{quiz=quizSets[e.target.value];quizIndex=0;correct=0;renderQuiz()};$('#timedMode').onchange=renderQuiz;
function renderPersonalLibrary(){let saved=store.get('bb-saved',[]),recent=store.get('bb-recent',[]);$('#savedCount').textContent=saved.length;$('#dashboardSaved').innerHTML=saved.length?saved.slice(0,4).map(x=>`<div><span>${x}</span><small>Saved</small></div>`).join(''):'<div><span>No saved questions yet</span></div>';$('#dashboardRecent').innerHTML=recent.length?recent.map(x=>`<div><span>${x.title}</span><small>${x.date}</small></div>`).join(''):'<div><span>No recently viewed papers</span></div>'}
function downloadStudyPlan(){let text=$('#planResult').innerText,blob=new Blob([text],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='backlog-buddy-study-plan.txt';a.click();URL.revokeObjectURL(a.href)}window.downloadStudyPlan=downloadStudyPlan;
function toggleRequest(open){$('#paperRequestModal').classList.toggle('open',open);$('#paperRequestModal').setAttribute('aria-hidden',String(!open))}$('#requestPaperBtn').onclick=()=>toggleRequest(true);$$('[data-close-request]').forEach(x=>x.onclick=()=>toggleRequest(false));$('#paperRequestForm').onsubmit=e=>{e.preventDefault();let requests=store.get('bb-paper-requests',[]);requests.push({university:$('#requestUniversity').value,subject:$('#requestSubject').value,exam:$('#requestExam').value,email:$('#requestEmail').value,date:new Date().toISOString()});store.set('bb-paper-requests',requests);e.target.reset();toggleRequest(false);toast('Paper request submitted for review')};

// Supabase authentication and live catalog loading (falls back to prototype data when unconfigured/offline).
let authMode='signin';
function setAuthUI(){const user=bbSupabase.session?.user;$('#accountLabel').textContent=user?'Dashboard':'Sign in';$('#signOutBtn').style.display=user?'block':'none';$('#authForm').style.display=user?'none':'block';$('#authSwitch').style.display=user?'none':'block';$('#authTitle').textContent=user?'Account connected':(authMode==='signup'?'Create your account':'Welcome back');$('#authSubtitle').textContent=user?(user.email||'Your progress sync is active.'):(authMode==='signup'?'Start saving your preparation progress.':'Sign in to save subjects, progress and study plans.');$('#nameField').style.display=authMode==='signup'?'flex':'none';$('#authSubmit').textContent=authMode==='signup'?'Create account':'Sign in'}
function openAuth(){if(bbSupabase.session){nav('dashboard');return}setAuthUI();$('#authModal').classList.add('open');$('#authModal').setAttribute('aria-hidden','false')}
function closeAuth(){$('#authModal').classList.remove('open');$('#authModal').setAttribute('aria-hidden','true')}
$('#accountBtn').onclick=openAuth;$$('[data-close-auth]').forEach(x=>x.onclick=closeAuth);
$('#authSwitch').onclick=()=>{authMode=authMode==='signin'?'signup':'signin';$('#authSwitch').textContent=authMode==='signin'?'New to Backlog Buddy? Create an account':'Already have an account? Sign in';setAuthUI()};
$('#authForm').onsubmit=async e=>{e.preventDefault();if(!bbSupabase.enabled){$('#authError').textContent='Supabase will be enabled after deployment credentials are configured.';return}$('#authError').textContent='';$('#authSubmit').disabled=true;try{if(authMode==='signup'){const data=await bbSupabase.signUp($('#authEmail').value,$('#authPassword').value,$('#authName').value);if(!data.access_token)toast('Check your email to confirm your account.');else{closeAuth();toast('Account created!')}}else{await bbSupabase.signIn($('#authEmail').value,$('#authPassword').value);closeAuth();toast('Signed in successfully!')}setAuthUI()}catch(err){$('#authError').textContent=err.message}finally{$('#authSubmit').disabled=false}};
$('#signOutBtn').onclick=async()=>{await bbSupabase.signOut();closeAuth();nav('home');toast('Signed out')};window.addEventListener('bb-auth-change',setAuthUI);
async function loadLiveCatalog(){if(!bbSupabase.enabled)return;try{const rows=await bbSupabase.getSubjects();if(rows?.length){const live=rows.map((s,i)=>({name:s.name,code:s.code,branch:s.branches?.code||'CSE',units:s.units?.[0]?.count||5,resources:0,icon:s.code.slice(0,2),color:['purple','coral','blue','mint','gold'][i%5],desc:s.description||'Engineering subject resources and preparation material.'}));renderSubjects(live)}}catch(err){console.warn('Using sample catalog:',err.message)}}
renderSubjects();renderPapers();renderFinder();renderSubjectContent();renderDashboard();renderPersonalLibrary();renderPracticeHistory();renderQuiz();setAuthUI();loadLiveCatalog();nav(location.hash.slice(1)||'home');
