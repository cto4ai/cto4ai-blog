// Handle GET requests (e.g., direct navigation to the URL)
export async function onRequestGet(context) {
  // Redirect GET requests to the homepage instead of subscribe page to avoid confusion
  return Response.redirect('https://cto4.ai/', 302);
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
    
    // Update Attio CRM if API key is configured
    if (env.ATTIO_API_KEY) {
      try {
        console.log('Updating Attio for:', email);
        
        // Use PUT to assert (create or update) person record
        const attioUrl = new URL('https://api.attio.com/v2/objects/people/records');
        attioUrl.searchParams.append('matching_attribute', 'email_addresses');
        
        const attioResponse = await fetch(attioUrl.toString(), {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${env.ATTIO_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              values: {
                email_addresses: [{ 
                  email_address: email,
                  original_email_address: email
                }],
                // Custom attributes with correct names (with spaces)
                "Newsletter status": "Confirmed",
                "Newsletter source": "Website Signup"
              }
            }
          })
        });
        
        const attioResult = await attioResponse.text();
        console.log('Attio response status:', attioResponse.status);
        console.log('Attio response:', attioResult);
        
        if (!attioResponse.ok) {
          // Log error but don't fail the subscription
          console.error('Attio update failed:', attioResult);
        }
      } catch (attioError) {
        // Log error but don't fail the subscription
        console.error('Attio update error:', attioError.message);
      }
    }
    
    // Redirect to success page or back with success message
    return Response.redirect('https://cto4.ai/subscribe-success', 303);
    
  } catch (error) {
    console.error('Subscription error:', error.message);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}