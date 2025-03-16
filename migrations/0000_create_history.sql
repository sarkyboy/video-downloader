CREATE TABLE history (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  thumbnailUrl TEXT NOT NULL,
  extractedUrl TEXT NOT NULL,
  videoUrl TEXT NOT NULL,
  title TEXT NOT NULL,
  timestamp TEXT NOT NULL
);