const Stripe=require('stripe');
const priceIds={starter:process.env.STRIPE_PRICE_STARTER||'',growth:process.env.STRIPE_PRICE_GROWTH||'',pro:process.env.STRIPE_PRICE_PRO||''};
function stripe(){if(!process.env.STRIPE_SECRET_KEY)throw new Error('Stripe is not configured; add STRIPE_SECRET_KEY and price IDs');return new Stripe(process.env.STRIPE_SECRET_KEY);}
async function checkout({accountId,plan,origin}){const price=priceIds[plan];if(!price)throw new Error(`No Stripe price configured for ${plan}`);const session=await stripe().checkout.sessions.create({mode:'subscription',line_items:[{price,quantity:1}],client_reference_id:accountId,metadata:{accountId,plan},success_url:`${origin}/?checkout=success`,cancel_url:`${origin}/?checkout=cancelled`,allow_promotion_codes:true});return {url:session.url};}
function webhook(raw,signature){const event=stripe().webhooks.constructEvent(raw,signature,process.env.STRIPE_WEBHOOK_SECRET||'');return {received:true,type:event.type};}
module.exports={checkout,webhook};
