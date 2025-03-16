import { Download, Copy, Check } from 'lucide-react';
import { VideoRecord } from '../types';

interface VideoResultProps {
  video: VideoRecord;
  onCopy: () => void;
  copied: boolean;
}

export function VideoResult({ video, onCopy, copied }: VideoResultProps) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {video.title || 'Extracted Video'}
            </h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={onCopy}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <a
                href={video.extractedUrl}
                download
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}