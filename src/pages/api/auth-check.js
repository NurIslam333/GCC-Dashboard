export default async function handler(req, res) {
  try {
    // Get token from cookies using Next.js request object
    const token = req.cookies.token || req.headers.cookie?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No authentication token found',
        remark: 'authentication_error',
        details: {
          hasToken: false,
          tokenType: 'none',
          recommendations: [
            'Please log in to your account',
            'Check if cookies are enabled',
            'Verify your login credentials'
          ]
        }
      });
    }

    // Check if token has Bearer prefix
    const hasBearerPrefix = token.startsWith('Bearer ');
    const cleanToken = hasBearerPrefix ? token.substring(7) : token;
    
    // Basic token validation
    const tokenInfo = {
      hasToken: true,
      hasBearerPrefix,
      tokenLength: cleanToken.length,
      tokenStart: cleanToken.substring(0, 20) + '...',
      tokenEnd: '...' + cleanToken.substring(cleanToken.length - 10),
      isJWT: cleanToken.split('.').length === 3,
    };

    // Test if we can make a simple authenticated request
    try {
      const testResponse = await fetch(`${process.env.API_URL}/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const testResult = {
        canConnect: testResponse.ok,
        status: testResponse.status,
        statusText: testResponse.statusText,
        isAuthenticated: testResponse.status !== 401,
      };

      return res.status(200).json({
        status: 'success',
        message: 'Authentication check completed',
        token: tokenInfo,
        connection: testResult,
        recommendations: testResult.isAuthenticated ? [] : [
          'Token may be expired',
          'Please log in again',
          'Check if your session has timed out'
        ]
      });

    } catch (connectionError) {
      return res.status(200).json({
        status: 'partial_success',
        message: 'Token found but connection test failed',
        token: tokenInfo,
        connection: {
          canConnect: false,
          error: connectionError.message
        },
        recommendations: [
          'Token format appears correct',
          'Connection to external API failed',
          'Check if external API is accessible'
        ]
      });
    }

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Authentication check failed',
      error: error.message,
    });
  }
}
