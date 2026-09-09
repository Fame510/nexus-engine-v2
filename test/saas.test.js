const test=require('node:test'); const assert=require('node:assert/strict'); const {plans}=require('../src/saas');
test('public plans have clear monthly job limits',()=>{assert.equal(plans.free.monthlyJobs,250);assert.equal(plans.starter.monthlyJobs,5000);assert.equal(plans.growth.monthlyJobs,50000);assert.equal(plans.pro.monthlyJobs,250000);});
test('hosted tiers are priced above community',()=>{assert.equal(plans.free.price,0);assert.ok(plans.starter.price>0);assert.ok(plans.growth.price>plans.starter.price);});
