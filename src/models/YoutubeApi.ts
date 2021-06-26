export interface VideoList {
  items: Video[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface Video {
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      maxres: {
        url: string;
      };
    };
    channelTitle: string;
  };
  liveStreamingDetails?: {
    actualStartTime: string;
    actualEndTime?: string;
    scheduledStartTime: string;
  };
}
