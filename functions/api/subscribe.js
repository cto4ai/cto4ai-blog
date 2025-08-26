// Handle GET requests (e.g., direct navigation to the URL)
export async function onRequestGet(context) {
  // Redirect GET requests to the subscribe page
  return Response.redirect('https://cto4.ai/subscribe', 302);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const formData = await request.formData();
    const email = formData.get('email');
    
    console.log('Email submitted:', email);
    console.log('API Key exists:', !!env.BEEHIIV_API_KEY);
    console.log('API Key length:', env.BEEHIIV_API_KEY?.length);
    
    if (!email) {
      return new Response('Email is required', { status: 400 });
    }
    
    if (!env.BEEHIIV_API_KEY) {
      throw new Error('BEEHIIV_API_KEY is not configured');
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
    
    console.log('Beehiiv API response status:', response.status);
    
    // Get the response text to see any error details
    const responseText = await response.text();
    console.log('Beehiiv API response:', responseText);
    
    if (!response.ok) {
      throw new Error(`Beehiiv API error: ${response.status} - ${responseText}`);
    }
    
    // Redirect to success page or back with success message
    return Response.redirect('https://cto4.ai/subscribe-success', 303);
    
  } catch (error) {
    console.error('Subscription error:', error.message);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}