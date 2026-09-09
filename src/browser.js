const playwright = require('playwright');
const puppeteer = require('puppeteer');
const config = require('./config');
const { browserCrashes } = require('./observability');
async function launch(engine, mode){
  const headless = mode==='headless';
  try {
    if(engine==='puppeteer') { const browser=await puppeteer.launch({headless,args:['--no-sandbox','--disable-setuid-sandbox']}); return {engine, browser, async close(){await browser.close();}, async execute(fn){const page=await browser.newPage(); try{return await fn(page);}finally{await page.close();}}}; }
    const browser=await playwright.chromium.launch({headless,args:['--no-sandbox']}); return {engine:'playwright',browser,async close(){await browser.close();},async execute(fn){const context=await browser.newContext({acceptDownloads:false}); const page=await context.newPage(); try{return await fn(page);}finally{await context.close();}}};
  } catch(error){ browserCrashes.inc({engine}); throw error; }
}
async function withBrowser({engine='auto',mode=config.DEFAULT_MODE}, fn){ const engines=engine==='auto'?[config.DEFAULT_BROWSER,config.DEFAULT_BROWSER==='playwright'?'puppeteer':'playwright']:[engine]; let last; for(const candidate of [...new Set(engines)]){let instance; try{instance=await launch(candidate,mode); return await fn(instance); }catch(error){last=error;}finally{if(instance) await instance.close().catch(()=>{});} } throw last||new Error('No browser engine available'); }
module.exports={withBrowser};
