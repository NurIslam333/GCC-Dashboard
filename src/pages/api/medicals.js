export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    const { city, search } = req.query;
    
    const apiUrl = `${process.env.API_URL}/medicals`;
    
    // Build query string from params
    const params = {};
    if (city) params.city = city;
    if (search) params.search = search;
    
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${apiUrl}?${queryString}` : apiUrl;

    // Create headers dynamically with the current token
    const requestHeaders = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: requestHeaders,
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
    console.error('Medicals API error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error',
      details: error.message
    });
  }
}
