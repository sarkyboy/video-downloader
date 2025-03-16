import type { VideoRecord } from '../types';

// 修改为正确的 API 地址
// 从 https://sniffer.okioi.com 改为 https://videodownloader.okioi.com
const API_BASE_URL = 'https://worker-videodownload.okioi.com/api';


// 获取所有历史记录
export async function getHistory(): Promise<VideoRecord[]> {
  try {
    console.log('正在获取历史记录...');
    // 移除自定义头部，避免 CORS 问题
    const response = await fetch(`${API_BASE_URL}/history`);
    console.log('历史记录响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('获取历史记录失败, 服务器响应:', errorText);
      throw new Error(`获取历史记录失败: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('成功获取历史记录, 条目数:', data.length);
    return data;
  } catch (error) {
    console.error('获取历史记录错误:', error);
    return [];
  }
}

// 添加历史记录
export async function addHistoryRecord(record: VideoRecord): Promise<boolean> {
  try {
    console.log('正在添加历史记录:', record);
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 移除 Cache-Control 头部
      },
      body: JSON.stringify(record),
    });
    
    console.log('添加历史记录响应状态:', response.status);
    const responseText = await response.text();
    console.log('添加历史记录响应内容:', responseText);
    
    if (!response.ok) {
      throw new Error(`添加记录失败: ${response.status} ${responseText}`);
    }
    
    try {
      const result = JSON.parse(responseText);
      return result.success;
    } catch (parseError) {
      console.error('解析响应JSON失败:', parseError);
      return false;
    }
  } catch (error) {
    console.error('添加历史记录错误:', error);
    return false;
  }
}

// 删除历史记录
export async function deleteHistoryRecord(id: string): Promise<boolean> {
  try {
    console.log('正在删除历史记录, ID:', id);
    const response = await fetch(`${API_BASE_URL}/history/${id}`, {
      method: 'DELETE',
      // 移除自定义头部
    });
    
    console.log('删除历史记录响应状态:', response.status);
    const responseText = await response.text();
    console.log('删除历史记录响应内容:', responseText);
    
    if (!response.ok) {
      throw new Error(`删除记录失败: ${response.status} ${responseText}`);
    }
    
    try {
      const result = JSON.parse(responseText);
      return result.success;
    } catch (parseError) {
      console.error('解析响应JSON失败:', parseError);
      return false;
    }
  } catch (error) {
    console.error('删除历史记录错误:', error);
    return false;
  }
}