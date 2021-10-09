import axios from 'axios';
import { Video, VideoList } from '../../models/YoutubeApi';
import userDetail from '../UserDetail/UserDetail';
import { Vtuber } from '../../models/Type';

const endpoint = 'https://www.googleapis.com/youtube/v3/videos';

const YoutubeApi = {
  getVideo: async (id: string): Promise<Video | null> => {
    try {
      const response: {
        data: VideoList;
      } = await axios.get(
        `${endpoint}?access_token=${userDetail.getAccessToken()}&part=snippet,liveStreamingDetails&id=${id}&maxResults=50`
      );
      const videoList = response.data;
      return videoList.items[0];
    } catch (e) {
      return null;
    }
  },
  getVideoList: async (idList: string[]): Promise<Video[] | null> => {
    try {
      if (idList.length === 0) return null;
      const response: {
        data: VideoList;
      } = await axios.get(
        `${endpoint}?access_token=${userDetail.getAccessToken()}&part=snippet,liveStreamingDetails&id=${idList.join(
          ','
        )}&maxResults=50`
      );
      const videoList = response.data;
      return videoList.items;
    } catch (e) {
      return null;
    }
  },
  convertYoutubeToVtuber: (
    youtubeVideo: Video,
    vtuberVideo: Vtuber
  ): Vtuber => {
    let startTime = new Date(youtubeVideo.snippet.publishedAt).getTime();
    let endTime = new Date(youtubeVideo.snippet.publishedAt).getTime();
    if (youtubeVideo.liveStreamingDetails) {
      startTime = new Date(
        youtubeVideo.liveStreamingDetails.actualStartTime
          ? youtubeVideo.liveStreamingDetails.actualStartTime
          : youtubeVideo.liveStreamingDetails.scheduledStartTime
      ).getTime();
      endTime = new Date(
        youtubeVideo.liveStreamingDetails.actualEndTime
          ? youtubeVideo.liveStreamingDetails.actualEndTime
          : youtubeVideo.liveStreamingDetails.scheduledStartTime
      ).getTime();
    }
    vtuberVideo = {
      id: youtubeVideo.id,
      channel: youtubeVideo.snippet.channelTitle,
      collaboration: youtubeVideo.snippet.title
        .split('@')
        .splice(1)
        .map((ch) => ch.split(' ')[0])
        .join(', '),
      cover_url:
        youtubeVideo.snippet.thumbnails?.maxres?.url ||
        youtubeVideo.snippet.thumbnails?.standard?.url ||
        youtubeVideo.snippet.thumbnails?.high?.url ||
        youtubeVideo.snippet.thumbnails?.medium?.url ||
        youtubeVideo.snippet.thumbnails?.default?.url ||
        '',
      like: false,
      tags: youtubeVideo.snippet.description
        .split('\n')
        .join(' ')
        .split('#')
        .splice(1)
        .map((ch) => ch.split(' ')[0])
        .join(', '),
      title: youtubeVideo.snippet.title,
      url: vtuberVideo.url,
      startTime: startTime,
      endTime: endTime,
    };
    return vtuberVideo;
  },
};

export default YoutubeApi;
