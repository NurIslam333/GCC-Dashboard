export default async function handler(req, res) {
  try {
    // Get token from cookies using Next.js request object
    const token = req.cookies.token || req.headers.cookie?.split('token=')[1]?.split(';')[0];
    
    // Test environment variables
    const envInfo = {
      API_URL: process.env.API_URL,
      NODE_ENV: process.env.NODE_ENV,
      hasAPI_URL: !!process.env.API_URL,
    };

    // Test headers
    const headerInfo = {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      tokenPrefix: token ? (token.startsWith('Bearer ') ? 'Correct' : 'Incorrect') : 'No Token',
      tokenStart: token ? token.substring(0, 20) + '...' : 'No Token',
    };

    // Test authentication status
    const authInfo = {
      isAuthenticated: !!token,
      tokenStatus: token ? 'Present' : 'Missing',
      needsLogin: !token,
    };

    return res.status(200).json({
      status: 'success',
      message: 'Environment and authentication test',
      environment: envInfo,
      authentication: authInfo,
      token: headerInfo,
      recommendations: token ? [] : [
        'Token not found - please log in again',
        'Check if you are properly authenticated',
        'Verify that cookies are enabled in your browser'
      ]
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Test failed',
      error: error.message,
    });
  }
}
