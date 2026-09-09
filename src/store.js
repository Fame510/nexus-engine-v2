const Redis = require('ioredis');
const config = require('./config');
const redis = new Redis(config.REDIS_URL, {lazyConnect:true, maxRetriesPerRequest:1, enableReadyCheck:true, enableOfflineQueue:false, connectTimeout:3000, retryStrategy: attempts => attempts < 5 ? 250 : null});
const key = id => `nexus:job:${id}`;
const idempotencyKey = (accountId, value) => `nexus:idempotency:${accountId}:${value}`;
async function saveJob(id, patch) { const current = await redis.hgetall(key(id)); await redis.hset(key(id), {...current, ...Object.fromEntries(Object.entries(patch).map(([k,v])=>[k,typeof v==='string'?v:JSON.stringify(v)]))}); await redis.expire(key(id), 60*60*24*7); }
async function getJob(id, accountId) { const data = await redis.hgetall(key(id)); if(!data.id || (accountId && data.accountId !== accountId)) return null; for(const k of ['request','result','artifacts','error','usage']) if(data[k]) {try{data[k]=JSON.parse(data[k]);}catch{}} return data; }
async function appendEvent(id, event) { const eventKey = `${key(id)}:events`; await redis.rpush(eventKey, JSON.stringify({...event,at:new Date().toISOString()})); await redis.expire(eventKey, 60*60*24*7); }
async function getEvents(id, accountId) { if(accountId && !(await getJob(id,accountId))) return []; return (await redis.lrange(`${key(id)}:events`,0,-1)).map(v=>JSON.parse(v)); }
async function getIdempotentJob(accountId, value){const id=await redis.get(idempotencyKey(accountId,value));return id?getJob(id,accountId):null;}
async function setIdempotency(accountId,value,id){await redis.set(idempotencyKey(accountId,value),id,'EX',60*60*24*7,'NX');}
module.exports = {redis, saveJob, getJob, appendEvent, getEvents, getIdempotentJob, setIdempotency};
