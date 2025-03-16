export async function parseXhsLink(url: string) {
  const cleanUrl = url.match(/https?:\/\/[a-zA-Z0-9\-._~:\/?#@!$&'()*+,;=%]+?(?=[\s\u4e00-\u9fa5\u3000-\u303F\u201C\u201D\uFF0C\u3002\uFF1B\uFF01]|$)/)?.[0] || url;
  console.log('Extracted clean URL:', cleanUrl);

  try {
    // 直接使用 Sniffer API
    console.log('正在请求 Sniffer API...');
    const response = await fetch('https://sniffer.okioi.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: cleanUrl })
    });

    console.log('Sniffer API 响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sniffer API 响应错误:', errorText);
      throw new Error(`API 请求失败: ${response.status} ${errorText}`);
    }

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