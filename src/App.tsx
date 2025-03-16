import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExtractorForm } from './components/ExtractorForm';
import { VideoResult } from './components/VideoResult';
import { History } from './components/History';
import type { VideoRecord, ExtractorState } from './types';
import { getHistory, addHistoryRecord, deleteHistoryRecord } from './services/historyService';

// Placeholder for API integration
import { parseXhsLink } from './utils/parseXhsLink';

const mockExtract = async (url: string): Promise<VideoRecord> => {
  const parsed = await parseXhsLink(url);
  if (!parsed) {
    throw new Error('Failed to parse XHS link');
  }
  const response = parsed;
  return {
    id: response.id,
    url: response.url,
    thumbnailUrl: response.thumbnailUrl,
    extractedUrl: response.extractedUrl,
    timestamp: new Date().toISOString(),
    title: response.title,
    videoUrl: response.videoUrl
  };
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState<ExtractorState>({
    loading: false,
    error: null,
    currentVideo: null,
    history: []
  });

  // 加载历史记录
  useEffect(() => {
    const loadHistory = async () => {
      const history = await getHistory();
      setState(prev => ({ ...prev, history }));
    };
    
    loadHistory();
  }, []);

  const handleExtract = async (url: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await mockExtract(url);
      
      // 保存到数据库
      await addHistoryRecord(result);
      
      setState(prev => ({
        ...prev,
        loading: false,
        currentVideo: result,
        history: [result, ...prev.history]
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: '提取视频失败，请重试。'
      }));
    }
  };

  const handleCopy = () => {
    if (state.currentVideo) {
      navigator.clipboard.writeText(state.currentVideo.extractedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async (id: string) => {
    // 从数据库删除
    const success = await deleteHistoryRecord(id);
    
    if (success) {
      setState(prev => ({
        ...prev,
        history: prev.history.filter(record => record.id !== id)
      }));
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <ExtractorForm onExtract={handleExtract} loading={state.loading} />
          
          {state.error && (
            <div className="w-full max-w-2xl mx-auto bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
              {state.error}
            </div>
          )}
          
          {state.currentVideo && (
            <VideoResult
              video={state.currentVideo}
              onCopy={handleCopy}
              copied={copied}
            />
          )}
          
          <History records={state.history} onDelete={handleDelete} />
        </main>
      </div>
    </div>
  );
}

export default App;