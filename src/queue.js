const {Queue,Worker}=require('bullmq');
const config=require('./config');
const {redis}=require('./store');
const connection={host:redis.options.host,port:redis.options.port,password:redis.options.password};
const queueName='nexus-jobs';
const queue=new Queue(queueName,{connection,defaultJobOptions:{attempts:3,backoff:{type:'exponential',delay:2000},removeOnComplete:{age:86400,count:10000},removeOnFail:{age:604800,count:10000}}});
function createWorker(processor){return new Worker(queueName,processor,{connection,concurrency:config.MAX_CONCURRENCY,lockDuration:config.MAX_JOB_MS+30000,stalledInterval:15000});}
module.exports={queue,createWorker};
