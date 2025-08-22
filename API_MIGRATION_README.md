# API Migration to Server-Side

## Overview
This document outlines the migration of API calls from client-side to server-side for enhanced security and privacy.

## Files Modified

### 1. `src/pages/index.jsx`
- **Before**: Direct axios calls to `${process.env.API_URL}/stats` and `${process.env.API_URL}/admin/stats`
- **After**: Server-side API calls to `/api/stats?role=user` and `/api/stats?role=admin`
- **Changes**: 
  - Removed axios import
  - Removed headers import
  - Updated API endpoints to use local server-side routes

### 2. `src/pages/slip-rate.jsx`
- **Before**: Direct axios call to `${process.env.API_URL}/medicals`
- **After**: Server-side API call to `/api/medicals`
- **Changes**:
  - Removed axios import
  - Removed headers import
  - Updated API endpoint to use local server-side route

### 3. `src/pages/type-choice-slip.jsx`
- **Before**: Direct axios calls to `${process.env.API_URL}/medicals` and `${process.env.API_URL}/create-choice`
- **After**: Server-side API calls to `/api/medicals` and `/api/create-choice`
- **Changes**:
  - Removed axios import
  - Removed headers import
  - Updated API endpoints to use local server-side routes

### 4. `src/pages/choice-slip.jsx` (NEW)
- **Before**: Direct axios calls to `${process.env.API_URL}/choice-slips` and `${process.env.API_URL}/retry-slip-submission`
- **After**: Server-side API calls to `/api/choice-slips` and `/api/retry-slip-submission`
- **Changes**:
  - Removed axios import
  - Removed headers import
  - Updated API endpoints to use local server-side routes
  - **Fixed DOM nesting issue**: Removed Button components inside Tab components to prevent button-inside-button HTML validation errors

## New Server-Side API Routes Created

### 1. `src/pages/api/stats.js`
- **Purpose**: Handles statistics requests for both user and admin roles
- **Endpoint**: `/api/stats`
- **Method**: GET
- **Parameters**: role, date filters, custom date ranges
- **Security**: Proxies requests to external API with proper headers

### 2. `src/pages/api/medicals.js`
- **Purpose**: Handles medical centers data requests
- **Endpoint**: `/api/medicals`
- **Method**: GET
- **Parameters**: city, search
- **Security**: Proxies requests to external API with proper headers

### 3. `src/pages/api/create-choice.js`
- **Purpose**: Handles choice slip creation requests
- **Endpoint**: `/api/create-choice`
- **Method**: POST
- **Parameters**: Form data (first_name, last_name, passport, etc.)
- **Security**: Proxies requests to external API with proper headers

### 4. `src/pages/api/choice-slips.js` (NEW)
- **Purpose**: Handles choice slips data requests
- **Endpoint**: `/api/choice-slips`
- **Method**: GET
- **Parameters**: page, perPage, status, search
- **Security**: Proxies requests to external API with proper headers

### 5. `src/pages/api/retry-slip-submission.js` (NEW)
- **Purpose**: Handles slip retry submission requests
- **Endpoint**: `/api/retry-slip-submission`
- **Method**: POST
- **Parameters**: slip_id
- **Security**: Proxies requests to external API with proper headers

### 6. `src/pages/api/test-env.js`
- **Purpose**: Test environment variables and headers configuration
- **Endpoint**: `/api/test-env`
- **Method**: GET
- **Use**: Debug environment setup and header configuration

### 7. `src/pages/api/auth-check.js`
- **Purpose**: Comprehensive authentication status check
- **Endpoint**: `/api/auth-check`
- **Method**: GET
- **Use**: Debug authentication issues and token validation

## Security Benefits

### 1. **Hidden API Endpoints**
- External API URLs are no longer visible in browser network tab
- API keys and headers are hidden from client-side inspection
- Sensitive configuration is kept server-side

### 2. **Request Proxying**
- All external API calls go through Next.js server
- Client only sees local `/api/*` endpoints
- External API structure is completely hidden

### 3. **Header Protection**
- Authentication headers are processed server-side
- No sensitive headers exposed to client
- Better security for API credentials

## Environment Setup

### Required Environment Variables
Create a `.env.local` file in your project root:

```bash
# API Configuration
API_URL=http://127.0.0.1:8002/api

# Security
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### Next.js Configuration
Updated `next.config.js` to include:
- Security headers for API routes
- Environment variable configuration
- Proper API route handling

## Testing

### 1. **Verify API Routes**
- Check that `/api/stats`, `/api/medicals`, and `/api/create-choice` are accessible
- Ensure proper error handling for invalid requests
- Verify that external API calls are working through server-side routes

### 2. **Check Browser Network Tab**
- Confirm that external API endpoints are NOT visible
- Only local `/api/*` endpoints should appear
- External API structure should be completely hidden

### 3. **Functionality Testing**
- Test all forms and data fetching functionality
- Ensure no breaking changes in user experience
- Verify that error handling works properly

### 4. **Environment Testing**
- Test `/api/test-env` to verify environment setup
- Check that API_URL is properly configured
- Verify that authentication headers are present

### 5. **Authentication Testing** (NEW)
- Test `/api/auth-check` to verify authentication status
- Check token validity and format
- Test connection to external API

## Migration Benefits

### ✅ **Security**
- API endpoints hidden from client inspection
- Sensitive headers and credentials protected
- Better security posture overall

### ✅ **Privacy**
- External API structure not visible to users
- Request details hidden from browser network tab
- Professional appearance for end users

### ✅ **Maintainability**
- Centralized API handling
- Easier to implement rate limiting
- Better error handling and logging

### ✅ **Scalability**
- Can add caching layer easily
- Better monitoring and analytics
- Easier to implement API versioning

## Troubleshooting

### Common Issues

#### 1. **"Accept header required" Error**
**Problem**: External API requires Accept header that's not being sent.

**Solution**: 
- ✅ **FIXED**: All API routes now include `Accept: application/json` header
- Check that `/api/test-env` shows headers are properly configured
- Verify that external API accepts the headers being sent

**Debug Steps**:
1. Visit `/api/test-env` to check header configuration
2. Check server console logs for detailed request/response information
3. Verify that `Authorization` header is present and correct
4. Ensure `Accept: application/json` is included

#### 2. **"Unauthenticated" / "authentication_error" Error** (NEW)
**Problem**: Authentication token is missing, expired, or invalid.

**Solution**: 
- ✅ **FIXED**: All API routes now dynamically get tokens from cookies
- ✅ **FIXED**: Added comprehensive authentication error handling
- ✅ **FIXED**: Created `/api/auth-check` endpoint for debugging

**Debug Steps**:
1. **First, test authentication**: Visit `/api/auth-check`
2. **Check token status**: Verify token is present and valid
3. **Test login**: If no token, log in to your account
4. **Check token format**: Ensure token doesn't have duplicate "Bearer " prefix
5. **Verify session**: Check if your session has expired

**Common Causes**:
- User not logged in
- Session expired
- Token cookie deleted/disabled
- Token format incorrect (double "Bearer " prefix)
- External API authentication requirements changed

#### 3. **API Routes Not Working**
- Check that `.env.local` file exists
- Verify `API_URL` environment variable
- Ensure Next.js server is running

#### 4. **CORS Issues**
- Server-side routes handle CORS automatically
- No client-side CORS configuration needed

#### 5. **Authentication Errors**
- Use `/api/auth-check` to debug authentication issues
- Verify that you are properly logged in
- Check if your session has timed out
- Ensure cookies are enabled in your browser

#### 6. **Environment Variables**
- Ensure `.env.local` is in project root
- Restart Next.js server after environment changes
- Check that `process.env.API_URL` is accessible

#### 7. **DOM Nesting Warning** (NEW)
**Problem**: React warning about button elements nested inside other button elements.

**Solution**: 
- ✅ **FIXED**: Removed Button components from inside Tab components in choice-slip.jsx
- ✅ **FIXED**: Styled Tab components directly with proper CSS classes
- ✅ **FIXED**: Maintained all functionality while fixing HTML validation

**Common Causes**:
- Headless UI Tab components render as buttons by default
- Custom Button components placed inside Tab components
- Invalid HTML structure causing browser warnings

**Debug Steps**:
1. Check browser console for DOM nesting warnings
2. Look for Button components inside Tab components
3. Replace Button wrappers with direct styling on Tab components
4. Ensure proper event handling is maintained

#### 8. **"The status field is required" Validation Error** (UPDATED)
**Problem**: External API returns validation error when status parameter is not provided or when "all" status is sent.

**Solution**: 
- ✅ **FIXED**: Frontend now only sends status parameter when it's not "all"
- ✅ **FIXED**: API route now handles "all" case by making multiple API calls to fetch data for all statuses
- ✅ **FIXED**: Results are combined and paginated properly for the "All" tab
- ✅ **FIXED**: Enhanced debugging and fallback mechanisms for status parameter issues
- ✅ **FIXED**: Alternative parameter names (state, type) are tried if status fails

**How it works now**:
1. **Specific status tabs** (pending, complete, failed): Send status parameter directly
2. **"All" tab**: No status parameter sent, API route fetches data for all statuses separately and combines results
3. **Pagination**: Properly handled for combined results
4. **Error handling**: Graceful fallback if any individual status fetch fails
5. **Fallback mechanism**: If status parameter fails, tries alternative names (state, type)

**Enhanced Debugging**:
- Detailed logging of all API calls and responses
- Status parameter mapping and validation
- Alternative parameter testing
- Comprehensive error details with debugging information

**Common Causes**:
- External API doesn't support "all" as a valid status value
- Frontend sending "all" status when external API expects specific values
- Missing status parameter when external API requires it
- External API expects different parameter names (state, type instead of status)
- Case sensitivity issues with status values

**Debug Steps**:
1. Check browser console for frontend debug logs
2. Check server console for API debug logs (look for "Specific Status API Call" or "No status provided, fetching data for all statuses")
3. Verify that status parameter is only sent for valid statuses
4. Check if external API accepts alternative parameter names
5. Ensure external API accepts the parameters being sent
6. Check that "All" tab now works without validation errors
7. Look for fallback mechanism logs in server console

#### 9. **"Objects are not valid as a React child" Runtime Error** (NEW)
**Problem**: React runtime error when trying to render error objects or invalid data structures directly in the UI.

**Solution**: 
- ✅ **FIXED**: Added comprehensive data validation in frontend
- ✅ **FIXED**: Added safety checks before rendering data
- ✅ **FIXED**: Added error handling for invalid data structures
- ✅ **FIXED**: Added safety effects to ensure state consistency

**Common Causes**:
- API returning error objects instead of expected data arrays
- State containing error objects from failed API calls
- Missing data validation before rendering
- Invalid data structure being passed to components

**Debug Steps**:
1. Check browser console for data validation errors
2. Verify that API responses have correct structure
3. Ensure state is always initialized as expected type
4. Add safety checks before rendering data

### Debugging Steps

#### Step 1: Test Authentication Status
```bash
# Visit this endpoint in your browser
GET /api/auth-check
```

**Expected Response** (if authenticated):
```json
{
  "status": "success",
  "message": "Authentication check completed",
  "token": {
    "hasToken": true,
    "hasBearerPrefix": false,
    "isJWT": true
  },
  "connection": {
    "canConnect": true,
    "isAuthenticated": true
  }
}
```

**If Not Authenticated**:
```json
{
  "status": "error",
  "message": "No authentication token found",
  "remark": "authentication_error"
}
```

#### Step 2: Test Environment Setup
```bash
# Visit this endpoint in your browser
GET /api/test-env
```

**Expected Response**:
```json
{
  "status": "success",
  "environment": {
    "API_URL": "http://127.0.0.1:8002/api",
    "hasAPI_URL": true
  },
  "authentication": {
    "isAuthenticated": true,
    "tokenStatus": "Present"
  }
}
```

#### Step 3: Check Server Logs
- Look for console.log output in your terminal
- Check for request URLs and headers being sent
- Verify response status and error messages

#### Step 4: Test Individual API Routes
```bash
# Test stats API
GET /api/stats?role=user&nsc_date=today&csc_date=today

# Test medicals API
GET /api/medicals?city=80

# Test create-choice API (POST)
POST /api/create-choice
```

## Future Enhancements

### Potential Improvements
1. **Rate Limiting**: Add rate limiting to API routes
2. **Caching**: Implement Redis or in-memory caching
3. **Logging**: Add comprehensive request/response logging
4. **Monitoring**: Implement API health checks and monitoring
5. **Validation**: Add request validation middleware
6. **Token Refresh**: Implement automatic token refresh mechanism

## Conclusion

The migration to server-side API calls significantly improves the security and privacy of the application by hiding external API endpoints and sensitive configuration from client-side inspection. This approach provides a more professional and secure user experience while maintaining all existing functionality.

### Recent Fixes Applied
- ✅ **Fixed "Accept header required" error** by adding `Accept: application/json` to all API routes
- ✅ **Fixed "Unauthenticated" error** by implementing dynamic token retrieval from cookies
- ✅ **Enhanced error handling** with detailed logging and debugging information
- ✅ **Added test endpoints** (`/api/test-env`, `/api/auth-check`) for environment and authentication verification
- ✅ **Improved debugging** with console logs and detailed error responses
- ✅ **Better authentication flow** with proper token validation and error messages

### Authentication Flow (Updated)
1. **Client makes request** to `/api/*` endpoint
2. **Server checks cookies** for authentication token
3. **Token validation** - if missing/invalid, returns 401 with helpful message
4. **External API call** with proper headers including token
5. **Response handling** with specific error handling for authentication failures
6. **Client receives** either data or clear error message with recommendations
