import { D1Database } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS 头部
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // 简单的路由处理
      if (path === '/api/history' && request.method === 'GET') {
        // 获取历史记录
        try {
          const { results } = await env.DB.prepare(
            'SELECT * FROM history ORDER BY timestamp DESC'
          ).all();
          
          return new Response(JSON.stringify(results || []), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        } catch (error: any) {
          console.error('获取历史记录失败:', error);
          return new Response(JSON.stringify({ 
            error: '获取历史记录失败', 
            details: error.message 
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }
      
      if (path === '/api/history' && request.method === 'POST') {
        // 添加历史记录
        try {
          const record = await request.json();
          
          if (!record.id || !record.url || !record.extractedUrl) {
            return new Response(JSON.stringify({ error: '缺少必要字段' }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            });
          }
          
          await env.DB.prepare(
            'INSERT INTO history (id, url, thumbnailUrl, extractedUrl, videoUrl, title, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)'
          )
          .bind(
            record.id,
            record.url,
            record.thumbnailUrl || '',
            record.extractedUrl,
            record.videoUrl || '',
            record.title || '',
            record.timestamp
          )
          .run();
          
          return new Response(JSON.stringify({ success: true }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        } catch (error: any) {
          console.error('添加历史记录失败:', error);
          return new Response(JSON.stringify({ 
            error: '添加历史记录失败', 
            details: error.message 
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }
      
      if (path.startsWith('/api/history/') && request.method === 'DELETE') {
        // 删除历史记录
        try {
          const id = path.split('/').pop();
          
          if (!id) {
            return new Response(JSON.stringify({ error: '缺少ID参数' }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            });
          }
          
          await env.DB.prepare('DELETE FROM history WHERE id = ?').bind(id).run();
          
          return new Response(JSON.stringify({ success: true }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        } catch (error: any) {
          console.error('删除历史记录失败:', error);
          return new Response(JSON.stringify({ 
            error: '删除历史记录失败', 
            details: error.message 
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }
      
      // 处理未匹配的路由
      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders
      });
    } catch (error: any) {
      // 处理全局错误
      console.error('Worker 错误:', error);
      return new Response(JSON.stringify({ 
        error: '服务器错误', 
        details: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};