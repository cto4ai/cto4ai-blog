import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email');
    
    console.log('Email submitted:', email);
    console.log('API Key from env:', import.meta.env.BEEHIIV_API_KEY ? 'exists' : 'missing');
    
    if (!email) {
      return new Response('Email is required', { status: 400 });
    }
    
    // Get API key from environment variable
    const apiKey = import.meta.env.BEEHIIV_API_KEY || process.env.BEEHIIV_API_KEY;
    
    if (!apiKey) {
      console.error('BEEHIIV_API_KEY is not configured');
      // For local testing, we'll still redirect to success to test the flow
      console.warn('Simulating success for local testing (no API key)');
      return Response.redirect('http://localhost:4331/subscribe-success', 303);
    }
    
    // Make API call to Beehiiv
    const response = await fetch(`https://api.beehiiv.com/v2/publications/pub_03d62407-3f9e-4c6f-8d95-d7da8f9e80fe/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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
    
    // Redirect to success page
    return Response.redirect('http://localhost:4331/subscribe-success', 303);
    
  } catch (error) {
    console.error('Subscription error:', error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
};