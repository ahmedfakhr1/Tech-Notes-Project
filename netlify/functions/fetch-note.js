const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const url = event.queryStringParameters.url;
  if (!url) {
    return {
      statusCode: 400,
      body: 'Missing url'
    };
  }
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
        'Accept': 'text/html'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch');
    const text = await response.text();
    const match = text.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (match) {
      return {
        statusCode: 200,
        body: match[1],
        headers: { 'Content-Type': 'text/html' }
      };
    } else {
      return {
        statusCode: 200,
        body: text,
        headers: { 'Content-Type': 'text/html' }
      };
    }
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: 'Could not fetch note content.'
    };
  }
};
