export async function onRequestPost(context) {
  const stripeSecretKey = context.env.STRIPE_SECRET_KEY;
  const origin = new URL(context.request.url).origin;

  const body = new URLSearchParams();
  body.append("mode", "payment");
  body.append("success_url", `${origin}/success.html`);
  body.append("cancel_url", `${origin}/`);
  body.append("line_items[0][price_data][currency]", "jpy");
  body.append("line_items[0][price_data][product_data][name]", "研修用デモ商品");
  body.append("line_items[0][price_data][unit_amount]", "500");
  body.append("line_items[0][quantity]", "1");

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const data = await stripeRes.json();

  return new Response(JSON.stringify({ url: data.url, raw: data }), {
    headers: { "Content-Type": "application/json" }
  });
}