// Mask email for logging (show first 2 chars + domain)
function maskEmail(email) {
  if (!email) return '[none]';
  const [local, domain] = email.split('@');
  if (!domain) return email.substring(0, 2) + '***';
  return local.substring(0, 2) + '***@' + domain;
}

// Handle GET requests for one-click subscribe (e.g., from Attio permission pass emails)
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  let email = url.searchParams.get('email');
  const attioRecordId = url.searchParams.get('id');

  // If record ID provided, look up email from Attio
  if (attioRecordId && !email) {
    // Validate record ID format (UUID)
    if (!/^[a-f0-9-]{36}$/i.test(attioRecordId)) {
      console.error('Invalid Attio record ID format');
      return Response.redirect('https://cto4.ai/?subscribe_error=1', 302);
    }

    if (!env.ATTIO_API_KEY) {
      console.error('ATTIO_API_KEY not configured for record ID lookup');
      return Response.redirect('https://cto4.ai/?subscribe_error=1', 302);
    }

    try {
      console.log('Looking up Attio record:', attioRecordId);
      const attioResponse = await fetch(`https://api.attio.com/v2/objects/people/records/${attioRecordId}`, {
        headers: {
          Authorization: `Bearer ${env.ATTIO_API_KEY}`,
        },
      });

      if (!attioResponse.ok) {
        const errorText = await attioResponse.text();
        console.error('Attio lookup failed:', attioResponse.status, errorText);
        return Response.redirect('https://cto4.ai/?subscribe_error=1', 302);
      }

      const attioData = await attioResponse.json();
      const emailAddresses = attioData?.data?.values?.email_addresses;
      console.log('Attio record found, email count:', emailAddresses?.length || 0);

      // Extract primary email (first in the list)
      if (emailAddresses && emailAddresses.length > 0) {
        email = emailAddresses[0].email_address;
        console.log('Found email from Attio:', maskEmail(email));
      } else {
        console.error('No email found in Attio record');
        return Response.redirect('https://cto4.ai/?subscribe_error=1', 302);
      }
    } catch (lookupError) {
      console.error('Attio lookup error:', lookupError.message);
      return Response.redirect('https://cto4.ai/?subscribe_error=1', 302);
    }
  }

  // If no email (and no record ID), redirect to homepage
  if (!email) {
    return Response.redirect('https://cto4.ai/', 302);
  }

  try {
    if (!env.BEEHIIV_API_KEY) {
      throw new Error('BEEHIIV_API_KEY is not configured');
    }

    console.log('One-click subscribe for:', maskEmail(email));

    // Make API call to Beehiiv with double_opt_override for true one-click
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/pub_03d62407-3f9e-4c6f-8d95-d7da8f9e80fe/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          reactivate_existing: true,
          send_welcome_email: true,
          double_opt_override: 'off',
          utm_source: 'permission_pass',
        }),
      }
    );

    console.log('Beehiiv API response status:', response.status);
    const responseText = await response.text();

    if (!response.ok) {
      console.error('Beehiiv API error response:', responseText);
      throw new Error(`Beehiiv API error: ${response.status}`);
    }

    // Update Attio CRM if API key is configured
    if (env.ATTIO_API_KEY) {
      try {
        console.log('Updating Attio for:', maskEmail(email));

        const attioUrl = new URL('https://api.attio.com/v2/objects/people/records');
        attioUrl.searchParams.append('matching_attribute', 'email_addresses');

        const attioResponse = await fetch(attioUrl.toString(), {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${env.ATTIO_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              values: {
                email_addresses: [{ email_address: email }],
                newsletter_status: 'Subscribed',
                newsletter_source: 'Permission Pass',
              },
            },
          }),
        });

        console.log('Attio update response status:', attioResponse.status);

        if (!attioResponse.ok) {
          const attioResult = await attioResponse.text();
          console.error('Attio update failed:', attioResponse.status, attioResult);
        }
      } catch (attioError) {
        console.error('Attio update error:', attioError.message);
      }
    }

    // Redirect to success page
    return Response.redirect('https://cto4.ai/subscribe-success', 303);
  } catch (error) {
    console.error('One-click subscription error:', error.message);
    // Redirect to homepage with error (could create an error page later)
    return Response.redirect('https://cto4.ai/?subscribe_error=1', 302);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const email = formData.get('email');

    console.log('Email submitted:', maskEmail(email));
    console.log('API Key exists:', !!env.BEEHIIV_API_KEY);

    if (!email) {
      return new Response('Email is required', { status: 400 });
    }

    if (!env.BEEHIIV_API_KEY) {
      throw new Error('BEEHIIV_API_KEY is not configured');
    }

    // Make API call to Beehiiv
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/pub_03d62407-3f9e-4c6f-8d95-d7da8f9e80fe/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.BEEHIIV_API_KEY}`, // Set this in Cloudflare Pages settings
        },
        body: JSON.stringify({
          email: email,
          reactivate_existing: false,
          send_welcome_email: true,
        }),
      }
    );

    console.log('Beehiiv API response status:', response.status);

    // Get the response text to see any error details
    const responseText = await response.text();

    if (!response.ok) {
      console.error('Beehiiv API error response:', responseText);
      throw new Error(`Beehiiv API error: ${response.status}`);
    }

    // Update Attio CRM if API key is configured
    if (env.ATTIO_API_KEY) {
      try {
        console.log('Updating Attio for:', maskEmail(email));

        // Use PUT to assert (create or update) person record
        const attioUrl = new URL('https://api.attio.com/v2/objects/people/records');
        attioUrl.searchParams.append('matching_attribute', 'email_addresses');

        const attioResponse = await fetch(attioUrl.toString(), {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${env.ATTIO_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              values: {
                email_addresses: [
                  {
                    email_address: email,
                  },
                ],
                // Custom attributes using slugs (lowercase with underscores)
                newsletter_status: 'Subscribed',
                newsletter_source: 'Website',
              },
            },
          }),
        });

        console.log('Attio update response status:', attioResponse.status);

        if (!attioResponse.ok) {
          const attioResult = await attioResponse.text();
          // Log error but don't fail the subscription
          console.error('Attio update failed:', attioResponse.status, attioResult);
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
