const Redis = require('ioredis');
const config = require('./config');
const redis = new Redis(config.REDIS_URL, {maxRetriesPerRequest:null, enableReadyCheck:true});
const key = id => `nexus:job:${id}`;
async function saveJob(id, patch) { const current = await redis.hgetall(key(id)); await redis.hset(key(id), {...current, ...Object.fromEntries(Object.entries(patch).map(([k,v])=>[k,typeof v==='string'?v:JSON.stringify(v)]))}); await redis.expire(key(id), 60*60*24*7); }
async function getJob(id) { const data = await redis.hgetall(key(id)); if(!data.id) return null; for(const k of ['request','result','artifacts','error']) if(data[k]) {try{data[k]=JSON.parse(data[k]);}catch{}} return data; }
async function appendEvent(id, event) { const eventKey = `${key(id)}:events`; await redis.rpush(eventKey, JSON.stringify({...event,at:new Date().toISOString()})); await redis.expire(eventKey, 60*60*24*7); }
async function getEvents(id) { return (await redis.lrange(`${key(id)}:events`,0,-1)).map(v=>JSON.parse(v)); }
module.exports = {redis, saveJob, getJob, appendEvent, getEvents};
