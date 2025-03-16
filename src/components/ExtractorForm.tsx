import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface ExtractorFormProps {
  onExtract: (url: string) => void;
  loading: boolean;
}

export function ExtractorForm({ onExtract, loading }: ExtractorFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onExtract(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste video sharing link here..."
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-pink-500 transition-all"
        />
        <ExternalLink className="absolute right-3 top-3.5 text-gray-400" size={20} />
      </div>
      <button
        type="submit"
        disabled={loading || !url.trim()}
        className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium 
          ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02] transform transition-transform'}
          disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all`}
      >
        {loading ? 'Extracting...' : 'Extract Video'}
      </button>
    </form>
  );
}