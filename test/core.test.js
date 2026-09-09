const test=require('node:test'); const assert=require('node:assert/strict'); const {validateTarget,validateActions}=require('../src/policy'); const {extractBySelectors}=require('../src/extractor');
test('blocks private targets',async()=>{await assert.rejects(()=>validateTarget('http://127.0.0.1:3000/health'),/Private/);await assert.rejects(()=>validateTarget('file:///etc/passwd'),/Only HTTP/);});
test('rejects arbitrary script actions',()=>assert.throws(()=>validateActions([{type:'evaluate',script:'process.env'}]),/disabled/));
test('extracts structured values',()=>assert.deepEqual(extractBySelectors('<html><h1>Widget</h1><span class="price">$12.50</span></html>',{name:{selector:'h1'},price:{selector:'.price',transform:'number'}}),{name:'Widget',price:12.5}));
