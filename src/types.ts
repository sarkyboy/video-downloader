export interface VideoRecord {
  id: string;
  url: string;
  thumbnailUrl: string;
  extractedUrl: string;
  timestamp: string;
  title: string;
  videoUrl: string; // 添加videoUrl属性
}

export interface ExtractorState {
  loading: boolean;
  error: string | null;
  currentVideo: VideoRecord | null;
  history: VideoRecord[];
}