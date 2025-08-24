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

    const { page, perPage, status, search } = req.query;
    
    const apiUrl = `${process.env.API_URL}/choice-slips`;
    
    // Build query string from params with proper mapping
    const params = {};
    
    // Map frontend parameters to external API parameters
    if (page) params.page = page;
    if (perPage) params.per_page = perPage; // Common API parameter name
    if (search) params.search = search;
    
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${apiUrl}?${queryString}` : apiUrl;

    // Create headers dynamically with the current token
    const requestHeaders = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };



    // Handle status parameter - external API requires it
    if (status) {
      // Specific status provided - make single API call
      // Map frontend status values to external API expected values
      const statusMapping = {
        'pending': 'pending',
        'complete': 'complete', 
        'failed': 'failed',
        'PENDING': 'pending',
        'COMPLETE': 'complete',
        'FAILED': 'failed'
      };
      
      const mappedStatus = statusMapping[status] || status;
      params.status = mappedStatus;
      
      const queryString = new URLSearchParams(params).toString();
      const fullUrl = `${apiUrl}?${queryString}`;
      

      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: requestHeaders,
      });



      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        console.error('Error details:', {
          status: response.status,
          statusText: response.statusText,
          url: fullUrl,
          params: params,
          headers: requestHeaders
        });
        
        // Try alternative status parameter names if the first attempt fails
        if (response.status === 400 || response.status === 422) {
          
          // Try different parameter names that external APIs commonly use
          const alternativeParams = { ...params };
          delete alternativeParams.status;
          
          // Try 'state' instead of 'status'
          alternativeParams.state = mappedStatus;
          const altQueryString = new URLSearchParams(alternativeParams).toString();
          const altUrl = `${apiUrl}?${altQueryString}`;
          
          const altResponse = await fetch(altUrl, {
            method: 'GET',
            headers: requestHeaders,
          });
          
          if (altResponse.ok) {
            const altData = await altResponse.json();
            if (altData.status === 'success') {
              return res.status(200).json(altData);
            }
          } else {
            
          }
          
          // Try 'type' instead of 'status'
          delete alternativeParams.state;
          alternativeParams.type = mappedStatus;
          const altQueryString2 = new URLSearchParams(alternativeParams).toString();
          const altUrl2 = `${apiUrl}?${altQueryString2}`;
          
          const altResponse2 = await fetch(altUrl2, {
            method: 'GET',
            headers: requestHeaders,
          });
          
          if (altResponse2.ok) {
            const altData2 = await altResponse2.json();
            if (altData2.status === 'success') {
              return res.status(200).json(altData2);
            }
          } else {
            
          }
        }
        
        // Handle authentication errors specifically
        if (response.status === 401) {
          return res.status(401).json({
            status: 'error',
            message: 'Authentication failed - token may be expired or invalid',
            remark: 'authentication_error'
          });
        }
        
        // Handle validation errors specifically
        if (response.status === 422) {
          return res.status(422).json({
            status: 'error',
            message: 'Validation error from external API',
            remark: 'validation_error',
            details: errorText,
            suggestion: 'Check the parameters being sent to the external API.',
            debug: {
              url: fullUrl,
              params: params,
              status: status
            }
          });
        }
        
        return res.status(response.status).json({ 
          status: 'error', 
          message: `External API error: ${response.status} ${response.statusText}`,
          details: errorText,
          debug: {
            url: fullUrl,
            params: params,
            status: status
          }
        });
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        return res.status(200).json(data);
      } else {
        return res.status(400).json(data);
      }
      
    } else {
      // If no status is provided (e.g., "all" tab), we need to handle this
      // Make multiple API calls to get all statuses and combine results
      
      try {
        const allStatuses = ['pending', 'complete', 'failed'];
        const allResults = [];
        let totalPages = 0;
        
        // Fetch data for each status
        for (const statusType of allStatuses) {
          const statusParams = { ...params };
          statusParams.status = statusType;
          
          const statusQueryString = new URLSearchParams(statusParams).toString();
          const statusUrl = `${apiUrl}?${statusQueryString}`;
          
          const statusResponse = await fetch(statusUrl, {
            method: 'GET',
            headers: requestHeaders,
          });
          
          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            
            if (statusData.status === 'success' && statusData.slips && statusData.slips.data) {
              allResults.push(...statusData.slips.data);
              // Use the highest total pages for pagination
              if (statusData.slips.last_page > totalPages) {
                totalPages = statusData.slips.last_page;
              }
            }
          } else {
            console.error(`Failed to fetch ${statusType} data:`, statusResponse.status);
          }
        }
        
        // Combine and paginate results
        const startIndex = (parseInt(page) - 1) * parseInt(perPage);
        const endIndex = startIndex + parseInt(perPage);
        const paginatedResults = allResults.slice(startIndex, endIndex);
        
        // Return combined results
        return res.status(200).json({
          status: 'success',
          slips: {
            data: paginatedResults,
            current_page: parseInt(page),
            last_page: Math.ceil(allResults.length / parseInt(perPage)),
            per_page: parseInt(perPage),
            total: allResults.length,
            from: startIndex + 1,
            to: Math.min(endIndex, allResults.length)
          }
        });
        
      } catch (error) {
        console.error('Error fetching all statuses:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Failed to fetch data for all statuses',
          remark: 'internal_error'
        });
      }
    }
    
  } catch (error) {
    console.error('Choice slips API error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error',
      details: error.message
    });
  }
}
