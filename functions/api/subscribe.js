export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const formData = await request.formData();
    const email = formData.get('email');
    
    if (!email) {
      return new Response('Email is required', { status: 400 });
    }
    
    // Make API call to Beehiiv
    const response = await fetch(`https://api.beehiiv.com/v2/publications/pub_03d62407-3f9e-4c6f-8d95-d7da8f9e80fe/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.BEEHIIV_API_KEY}` // Set this in Cloudflare Pages settings
      },
      body: JSON.stringify({
        email: email,
        reactivate_existing: false,
        send_welcome_email: true
      })
    });
    
    if (!response.ok) {
      throw new Error('Subscription failed');
    }
    
    // Redirect to success page or back with success message
    return Response.redirect('https://cto4.ai/subscribe-success', 302);
    
  } catch (error) {
    console.error('Subscription error:', error);
    return new Response('Subscription failed. Please try again.', { status: 500 });
  }
}