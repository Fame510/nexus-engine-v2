const { z } = require('zod');
const config = z.object({
  NODE_ENV:z.string().default('development'), PORT:z.coerce.number().int().positive().default(3000), REDIS_URL:z.string().default('redis://localhost:6379'), API_KEYS:z.string().default('dev-key-change-me'), ARTIFACT_DIR:z.string().default('./data/artifacts'), MAX_CONCURRENCY:z.coerce.number().int().min(1).max(50).default(5), MAX_NAVIGATION_MS:z.coerce.number().int().min(5000).max(180000).default(45000), MAX_JOB_MS:z.coerce.number().int().min(10000).max(300000).default(90000), MAX_HTML_BYTES:z.coerce.number().int().min(100000).max(20000000).default(5000000), MAX_SCREENSHOT_BYTES:z.coerce.number().int().min(100000).max(50000000).default(12000000), DEFAULT_BROWSER:z.enum(['playwright','puppeteer','auto']).default('playwright'), DEFAULT_MODE:z.enum(['headless','headed']).default('headless'), ALLOW_PRIVATE_TARGETS:z.enum(['true','false']).default('false').transform(v=>v==='true'), LOG_LEVEL:z.string().default('info')
}).parse(process.env);
config.apiKeys = new Set(config.API_KEYS.split(',').map(v=>v.trim()).filter(Boolean));
module.exports = config;
