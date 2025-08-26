export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Set cache headers for better performance
  res.setHeader('Cache-Control', 'private, max-age=60, stale-while-revalidate=300');
  res.setHeader('Vary', 'Authorization, Cookie');

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

    const { page = 1, perPage = 25, status, search, start_date, end_date, slip_type } = req.query;
    
    // Validate and sanitize parameters
    const currentPage = Math.max(1, parseInt(page));
    const itemsPerPage = Math.max(1, Math.min(100, parseInt(perPage))); // Limit max to 100
    
    // Enhanced date validation and formatting
    let validatedStartDate = null;
    let validatedEndDate = null;
    
    if (start_date) {
      try {
        const startDate = new Date(start_date);
        if (isNaN(startDate.getTime())) {
          return res.status(422).json({
            status: 'error',
            message: 'Invalid start_date format. Use YYYY-MM-DD format.',
            remark: 'validation_error',
            details: `Provided start_date: ${start_date}`
          });
        }
        validatedStartDate = startDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      } catch (error) {
        return res.status(422).json({
          status: 'error',
          message: 'Invalid start_date format',
          remark: 'validation_error',
          details: error.message
        });
      }
    }
    
    if (end_date) {
      try {
        const endDate = new Date(end_date);
        if (isNaN(endDate.getTime())) {
          return res.status(422).json({
            status: 'error',
            message: 'Invalid end_date format. Use YYYY-MM-DD format.',
            remark: 'validation_error',
            details: `Provided end_date: ${end_date}`
          });
        }
        validatedEndDate = endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      } catch (error) {
        return res.status(422).json({
          status: 'error',
          message: 'Invalid end_date format',
          remark: 'validation_error',
          details: error.message
        });
      }
    }
    
    // Validate date range logic
    if (validatedStartDate && validatedEndDate) {
      if (validatedStartDate > validatedEndDate) {
        return res.status(422).json({
          status: 'error',
          message: 'start_date cannot be after end_date',
          remark: 'validation_error',
          details: `start_date: ${validatedStartDate}, end_date: ${validatedEndDate}`
        });
      }
    }
    
    const apiUrl = `${process.env.API_URL}/choice-slips`;
    
    // Build query string from params with proper mapping
    const params = {
      page: currentPage,
      per_page: itemsPerPage
    };
    
    // Add search parameter if provided
    if (search && search.trim()) {
      params.search = search.trim();
    }

    // Add enhanced date filtering parameters
    if (validatedStartDate) {
      params.start_date = validatedStartDate;
    }
    if (validatedEndDate) {
      params.end_date = validatedEndDate;
    }

    // Add slip_type if provided
    if (slip_type && slip_type.trim()) {
      params.slip_type = slip_type.trim();
    }

    // Create headers dynamically with the current token
    const requestHeaders = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
    };

    // Handle status parameter - external API requires it
    if (status && status !== 'all') {
      // Specific status provided - make single API call
      // Map frontend status values to external API expected values
      // Try multiple possible status values that external API might expect
      const statusMapping = {
        'pending': 'pending',
        'complete': 'complete', 
        'failed': 'failed',
        'PENDING': 'pending',
        'COMPLETE': 'complete',
        'FAILED': 'failed',
        // Additional variations that external APIs might expect
        'completed': 'completed',
        'success': 'success',
        'error': 'error',
        'rejected': 'rejected'
      };
      
      const mappedStatus = statusMapping[status] || status;
      
      // Enhanced status parameter handling
      
      // Try multiple status parameter names that external APIs commonly use
      const possibleStatusParams = ['status', 'state', 'type', 'condition'];
      let successfulResponse = null;
      
      // First try with the mapped status
      for (const paramName of possibleStatusParams) {
        const testParams = { ...params };
        testParams[paramName] = mappedStatus;
        
        const testQueryString = new URLSearchParams(testParams).toString();
        const testUrl = `${apiUrl}?${testQueryString}`;
        

        
        try {
          const testResponse = await fetch(testUrl, {
            method: 'GET',
            headers: requestHeaders,
            signal: controller.signal,
          });
          
          if (testResponse.ok) {
            const testData = await testResponse.json();
            if (testData.status === 'success') {

              successfulResponse = testData;
              break;
            }
          }
        } catch (error) {
          // Silent error handling
        }
      }
      
      // If that failed, try alternative status values for "complete" and "failed"
      if (!successfulResponse && (status === 'complete' || status === 'failed')) {
        const alternativeStatuses = status === 'complete' 
          ? ['completed', 'success', 'done', 'finished']
          : ['error', 'rejected', 'declined', 'unsuccessful'];
        
        for (const altStatus of alternativeStatuses) {
          for (const paramName of possibleStatusParams) {
            const testParams = { ...params };
            testParams[paramName] = altStatus;
            
            const testQueryString = new URLSearchParams(testParams).toString();
            const testUrl = `${apiUrl}?${testQueryString}`;
            

            
            try {
              const testResponse = await fetch(testUrl, {
                method: 'GET',
                headers: requestHeaders,
                signal: controller.signal,
              });
              
              if (testResponse.ok) {
                const testData = await testResponse.json();
                if (testData.status === 'success') {

                  successfulResponse = testData;
                  break;
                }
              }
            } catch (error) {
              // Silent error handling
            }
          }
          if (successfulResponse) break;
        }
      }
      
      if (successfulResponse) {
        return res.status(200).json(successfulResponse);
      }
      
      // If all attempts failed, proceed with original status parameter
      params.status = mappedStatus;
      
      const queryString = new URLSearchParams(params).toString();
      const fullUrl = `${apiUrl}?${queryString}`;
      

      
      // Use AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      try {
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: requestHeaders,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

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
          // Ensure proper pagination metadata
          const responseData = {
            ...data,
            slips: {
              ...data.slips,
              current_page: currentPage,
              per_page: itemsPerPage,
              from: data.slips?.data?.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0,
              to: Math.min(currentPage * itemsPerPage, data.slips?.total || 0)
            },
            // Add filter metadata for debugging and UI feedback
            filter_meta: {
              applied_filters: {
                status: mappedStatus,
                start_date: validatedStartDate,
                end_date: validatedEndDate,
                search: search?.trim(),
                slip_type: slip_type?.trim(),
                page: currentPage,
                per_page: itemsPerPage
              },
              total_filtered: data.slips?.total || 0,
              date_range: validatedStartDate && validatedEndDate ? {
                start: validatedStartDate,
                end: validatedEndDate,
                days: Math.ceil((new Date(validatedEndDate) - new Date(validatedStartDate)) / (1000 * 60 * 60 * 24)) + 1
              } : null
            }
          };
          
          return res.status(200).json(responseData);
        } else {
          return res.status(400).json(data);
        }
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          return res.status(408).json({
            status: 'error',
            message: 'Request timeout - external API took too long to respond',
            remark: 'timeout_error'
          });
        }
        
        throw fetchError;
      }
      
    } else {
      // If no status is provided or status is "all", we need to handle this
      // Make multiple API calls to get all statuses and combine results
      
      try {
        const allStatuses = ['pending', 'complete', 'failed'];
        const allResults = [];
        let totalRecords = 0;
        
        // Use Promise.allSettled for parallel API calls with better performance
        const statusPromises = allStatuses.map(async (statusType) => {
          const statusParams = { ...params };
          statusParams.status = statusType;
          
          const statusQueryString = new URLSearchParams(statusParams).toString();
          const statusUrl = `${apiUrl}?${statusQueryString}`;
          
          try {
            const statusResponse = await fetch(statusUrl, {
              method: 'GET',
              headers: requestHeaders,
            });
            
            if (statusResponse.ok) {
              const statusData = await statusResponse.json();
              
              if (statusData.status === 'success' && statusData.slips && statusData.slips.data) {
                return {
                  status: 'success',
                  data: statusData.slips.data,
                  total: statusData.slips.total || statusData.slips.data.length
                };
              }
            }
            return { status: 'error', data: [], total: 0 };
          } catch (error) {
            console.error(`Failed to fetch ${statusType} data:`, error);
            return { status: 'error', data: [], total: 0 };
          }
        });
        
        const statusResults = await Promise.allSettled(statusPromises);
        
        // Process results
        statusResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value.status === 'success') {
            allResults.push(...result.value.data);
            totalRecords += result.value.total;
          }
        });
        
        // Sort combined results by creation date (newest first)
        allResults.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // Calculate proper pagination
        const totalPages = Math.ceil(allResults.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedResults = allResults.slice(startIndex, endIndex);
        
        // Return combined results with proper pagination metadata
        return res.status(200).json({
          status: 'success',
          slips: {
            data: paginatedResults,
            current_page: currentPage,
            last_page: totalPages,
            per_page: itemsPerPage,
            total: allResults.length,
            from: allResults.length > 0 ? startIndex + 1 : 0,
            to: Math.min(endIndex, allResults.length),
            // Additional metadata for better UX
            has_more_pages: currentPage < totalPages,
            has_previous_pages: currentPage > 1
          },
          // Add filter metadata for debugging and UI feedback
          filter_meta: {
            applied_filters: {
              status: 'all',
              start_date: validatedStartDate,
              end_date: validatedEndDate,
              search: search?.trim(),
              slip_type: slip_type?.trim(),
              page: currentPage,
              per_page: itemsPerPage
            },
            total_filtered: allResults.length,
            date_range: validatedStartDate && validatedEndDate ? {
              start: validatedStartDate,
              end: validatedEndDate,
              days: Math.ceil((new Date(validatedEndDate) - new Date(validatedStartDate)) / (1000 * 60 * 60 * 24)) + 1
            } : null
          }
        });
        
      } catch (error) {
        console.error('Error fetching all statuses:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Failed to fetch data for all statuses',
          remark: 'internal_error',
          details: error.message
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
