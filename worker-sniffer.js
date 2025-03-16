/**
 * Video Sniffing Service - Cloudflare Worker
 * @author sarkyboy
 * @license MIT
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Handle request and extract video links
 * @param {Request} request
 */
async function handleRequest(request) {
  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
  
  // Only handle POST requests
  if (request.method !== 'POST') {
    return new Response('Please use POST method to send URL', {
      status: 405,
      headers: { 
        'Content-Type': 'text/plain;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  try {
    // Get URL from request
    const requestData = await request.json()
    const targetUrl = requestData.url

    if (!targetUrl) {
      return new Response('Please provide a URL to analyze', {
        status: 400,
        headers: { 
          'Content-Type': 'text/plain;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Get target webpage content
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    // Check response status
    if (!response.ok) {
      return new Response(`Unable to fetch target webpage, status code: ${response.status}`, {
        status: 400,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
      })
    }

    // Get response content
    const contentType = response.headers.get('content-type') || ''
    let content

    if (contentType.includes('application/json')) {
      // If JSON format, parse directly
      content = JSON.stringify(await response.json())
    } else {
      // Otherwise get text content
      content = await response.text()
    }

    // Extract video links
    const videoLinks = extractVideoLinks(content, targetUrl)

    // Return results
    return new Response(JSON.stringify({
      url: targetUrl,
      videos: videoLinks
    }), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    return new Response(`Error processing request: ${error.message}`, {
      status: 500,
      headers: { 
        'Content-Type': 'text/plain;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

/**
 * Extract video links from webpage content
 * @param {string} content - Webpage content
 * @param {string} baseUrl - Base URL for handling relative paths
 * @returns {Array} - Array of extracted video links
 */
function extractVideoLinks(content, baseUrl) {
  const videoLinks = []
  
  // Extract links from video tags
  const videoTagRegex = /<video[^>]*src=["']([^"']+)["'][^>]*>/gi
  let match
  
  while ((match = videoTagRegex.exec(content)) !== null) {
    const videoSrc = resolveUrl(match[1], baseUrl)
    if (videoSrc && !videoLinks.includes(videoSrc)) {
      videoLinks.push(videoSrc)
    }
  }
  
  // Extract video links from source tags
  const sourceTagRegex = /<source[^>]*src=["']([^"']+)["'][^>]*type=["']video\/[^"']+["'][^>]*>/gi
  
  while ((match = sourceTagRegex.exec(content)) !== null) {
    const videoSrc = resolveUrl(match[1], baseUrl)
    if (videoSrc && !videoLinks.includes(videoSrc)) {
      videoLinks.push(videoSrc)
    }
  }
  
  // Extract video links from data-src attributes
  const dataSrcRegex = /data-src=["']([^"']*\.(?:mp4|webm|ogg|mov|m3u8))["']/gi
  
  while ((match = dataSrcRegex.exec(content)) !== null) {
    const videoSrc = resolveUrl(match[1], baseUrl)
    if (videoSrc && !videoLinks.includes(videoSrc)) {
      videoLinks.push(videoSrc)
    }
  }
  
  // Generic video link regex
  const videoExtRegex = /["'](https?:\/\/[^"']+\.(?:mp4|webm|ogg|mov|m3u8)(?:\?[^"']*)?)['"]/gi
  
  while ((match = videoExtRegex.exec(content)) !== null) {
    if (!videoLinks.includes(match[1])) {
      videoLinks.push(match[1])
    }
  }
  
  // Search for links in common video player configurations
  const playerConfigRegex = /["']url["']\s*:\s*["'](https?:\/\/[^"']+)['"]/gi
  
  while ((match = playerConfigRegex.exec(content)) !== null) {
    const url = match[1]
    // Filter video file types
    if (/\.(mp4|webm|ogg|mov|m3u8)(\?|$)/i.test(url) && !videoLinks.includes(url)) {
      videoLinks.push(url)
    }
  }
  
  return videoLinks
}

/**
 * Resolve relative URL to absolute URL
 * @param {string} url - Potentially relative URL string
 * @param {string} base - Base URL
 * @returns {string} - Resolved absolute URL
 */
function resolveUrl(url, base) {
  try {
    // If already absolute URL, return directly
    if (url.match(/^https?:\/\//i)) {
      return url
    }
    
    // Create a new URL object to handle relative paths automatically
    return new URL(url, base).href
  } catch (e) {
    return null
  }
}