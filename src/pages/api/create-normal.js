export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get token from cookies using Next.js request object
    const token = req.cookies.token || req.headers.cookie?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication token not found',
        remark: 'authentication_error'
      });
    }

    const body = req.body;
    
    // Add slip type to indicate this is a normal slip
    const requestBody = {
      ...body,
      slip_type: 'normal'
    };
    
    const apiUrl = `${process.env.API_URL}/create-normal`;
    
    // Create headers dynamically with the current token
    const requestHeaders = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      // Handle authentication errors specifically
      if (response.status === 401) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication failed - token may be expired or invalid',
          remark: 'authentication_error'
        });
      }
      
      return res.status(response.status).json({ 
        status: 'error', 
        message: `External API error: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    
    if (data.status === 'success') {
      return res.status(200).json(data);
    } else {
      return res.status(400).json(data);
    }
  } catch (error) {
    console.error('Create normal slip API error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error',
      details: error.message
    });
  }
}
