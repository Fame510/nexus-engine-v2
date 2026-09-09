const pino = require('pino');
const prom = require('prom-client');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const registry = new prom.Registry();
prom.collectDefaultMetrics({ register: registry });
const jobs = new prom.Counter({name:'nexus_jobs_total',help:'Jobs by terminal status',labelNames:['status','engine','mode'],registers:[registry]});
const jobDuration = new prom.Histogram({name:'nexus_job_duration_seconds',help:'Job duration',labelNames:['status','engine','mode'],buckets:[.1,.5,1,2,5,10,30,60,120],registers:[registry]});
const browserCrashes = new prom.Counter({name:'nexus_browser_crashes_total',help:'Browser launch or execution failures',labelNames:['engine'],registers:[registry]});
module.exports = { logger, registry, jobs, jobDuration, browserCrashes };
