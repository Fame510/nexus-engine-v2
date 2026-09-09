const {redis}=require('./store');
const key=(accountId,suffix)=>`aria:${accountId}:${suffix}`;
const capabilities=[
 {id:'browser',label:'Autonomous web execution',state:'live',detail:'Run Nexus browser jobs with Playwright or Puppeteer, headless or headed.'},
 {id:'research',label:'Research workspace',state:'live',detail:'Turn live web runs into durable evidence and structured outputs.'},
 {id:'monitoring',label:'Change monitoring',state:'live',detail:'Use durable jobs, idempotency, artifacts, quotas, and event trails.'},
 {id:'brand',label:'Brand and positioning',state:'workspace',detail:'Capture real founder briefs and decisions. No invented performance data.'},
 {id:'growth',label:'Growth operating system',state:'workspace',detail:'Organize live research, launch work, and next actions around evidence.'},
 {id:'assets',label:'Media production',state:'integration',detail:'Record asset briefs here; connect a generation provider before claiming execution.'},
 {id:'capital',label:'Capital room',state:'workspace',detail:'Store fundraising questions and investor research with human review.'},
 {id:'ops',label:'Legal, HR, and operations',state:'workspace',detail:'Create first-pass operating briefs with explicit human review boundaries.'}
];
async function addActivity(accountId,event){await redis.lpush(key(accountId,'activity'),JSON.stringify({...event,at:new Date().toISOString()}));await redis.ltrim(key(accountId,'activity'),0,49);}
async function getActivity(accountId){return (await redis.lrange(key(accountId,'activity'),0,19)).map(v=>JSON.parse(v));}
async function saveBrief(accountId,brief){const id=brief.id||`brief_${Date.now().toString(36)}`;const data={...brief,id,updatedAt:new Date().toISOString()};await redis.hset(key(accountId,`brief:${id}`),Object.fromEntries(Object.entries(data).map(([k,v])=>[k,typeof v==='string'?v:JSON.stringify(v)])));await redis.sadd(key(accountId,'briefs'),id);await addActivity(accountId,{type:'brief.saved',title:`Brief saved: ${data.title}`,detail:data.kind||'Founder workspace'});return data;}
async function getBriefs(accountId){const ids=await redis.smembers(key(accountId,'briefs'));const out=[];for(const id of ids){const data=await redis.hgetall(key(accountId,`brief:${id}`));if(data.id)out.push(data);}return out.sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));}
module.exports={capabilities,addActivity,getActivity,saveBrief,getBriefs};
