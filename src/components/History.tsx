import { Clock, Trash2 } from 'lucide-react';
// 移除未使用的React导入
import { VideoRecord } from '../types';

interface HistoryProps {
  records: VideoRecord[];
  onDelete: (id: string) => void;
}

export function History({ records, onDelete }: HistoryProps) {
  if (records.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="w-5 h-5 text-gray-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">History</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => (
          <div
            key={record.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4 relative">
              <button
                onClick={() => onDelete(record.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(record.timestamp).toLocaleString()}
              </p>
              <a
                href={record.extractedUrl}
                className="mt-2 text-pink-500 hover:text-pink-600 font-medium truncate block"
                target="_blank"
                rel="noopener noreferrer"
              >
                {record.url}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}