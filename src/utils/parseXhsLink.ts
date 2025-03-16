export async function parseXhsLink(url: string) {
  const cleanUrl = url.match(/https?:\/\/[a-zA-Z0-9\-._~:\/?#@!$&'()*+,;=%]+?(?=[\s\u4e00-\u9fa5\u3000-\u303F\u201C\u201D\uFF0C\u3002\uFF1B\uFF01]|$)/)?.[0] || url;
  console.log('Extracted clean URL:', cleanUrl);

  try {
    // 使用本地代理或 Cloudflare Worker 代理请求
    // 将请求发送到你自己的 worker-videodownload.okioi.com 而不是直接请求 sniffer.okioi.com
    const response = await fetch('https://worker-videodownload.okioi.com/proxy-sniffer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: cleanUrl })
    });

    const data = await response.json();
    console.log('视频下载地址:', data.videos[0]);

    return {
      id: new URL(cleanUrl).pathname.split('/').pop() || '',
      url: cleanUrl,
      thumbnailUrl: `https://example.com/thumbnail/${new URL(cleanUrl).pathname.split('/').pop()}.jpg`,
      extractedUrl: data.videos[0],
      title: 'Video Extracted',
      videoUrl: data.videos[0]
    };
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}