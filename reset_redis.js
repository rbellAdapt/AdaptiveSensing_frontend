const fs = require('fs');

async function clearLimits() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  let url = '';
  let token = '';

  envContent.split('\n').forEach(line => {
    if (line.startsWith('UPSTASH_REDIS_REST_URL=')) url = line.split('=')[1].trim().replace(/['"]/g, '');
    if (line.startsWith('UPSTASH_REDIS_REST_TOKEN=')) token = line.split('=')[1].trim().replace(/['"]/g, '');
  });

  if (!url || !token) {
    console.error('Could not find UPSTASH_REDIS variables.');
    return;
  }

  // 1. Get keys
  const getKeysParams = new URL(`${url}/scan/0/MATCH/gateway_limits:*`);
  const getHeaders = { Authorization: `Bearer ${token}` };

  const getRes = await fetch(getKeysParams, { headers: getHeaders });
  const getData = await getRes.json();
  
  if (getData.result && getData.result[1] && getData.result[1].length > 0) {
    const keys = getData.result[1];
    
    // 2. Delete keys
    // Upstash REST api: /del/key1/key2...
    const delUrl = new URL(`${url}/del/${keys.join('/')}`);
    const delRes = await fetch(delUrl, { method: 'POST', headers: getHeaders });
    const delData = await delRes.json();
    
    console.log(`Cleared ${delData.result} rate limit keys.`);
  } else {
    console.log('No rate limit keys found.');
  }
}

clearLimits().catch(console.error);
