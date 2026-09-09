const crypto=require('node:crypto');
const {redis}=require('./store');
const plans={free:{name:'Community',monthlyJobs:250,price:0},starter:{name:'Starter',monthlyJobs:5000,price:49},growth:{name:'Growth',monthlyJobs:50000,price:149},pro:{name:'Pro',monthlyJobs:250000,price:399}};
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
async function createAccount(email){const accountId=`acct_${crypto.randomBytes(12).toString('base64url')}`;await redis.hset(`nexus:account:${accountId}`,{email,plan:'free',createdAt:new Date().toISOString()});return {accountId,plan:'free',apiKey:await createApiKey(accountId,'free')};}
async function createApiKey(accountId,plan='free'){const raw=`nx_${crypto.randomBytes(24).toString('base64url')}`;await redis.hset(`nexus:apikey:${digest(raw)}`,{accountId,plan,createdAt:new Date().toISOString()});return raw;}
async function resolveApiKey(raw){const data=await redis.hgetall(`nexus:apikey:${digest(raw)}`);return data.accountId?data:null;}
function period(){return new Date().toISOString().slice(0,7);}
async function usage(accountId){return Number(await redis.get(`nexus:usage:${accountId}:${period()}`)||0);}
async function consume(accountId,plan){const limit=plans[plan]?.monthlyJobs??plans.free.monthlyJobs;const key=`nexus:usage:${accountId}:${period()}`;const count=await redis.incr(key);await redis.expire(key,60*60*24*45);if(count>limit){await redis.decr(key);const error=new Error(`Monthly job limit reached for ${plans[plan]?.name||'Community'} plan`);error.statusCode=429;throw error;}return {used:count,limit};}
module.exports={plans,createAccount,createApiKey,resolveApiKey,usage,consume};
