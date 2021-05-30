import { createSlice } from '@reduxjs/toolkit';
import {
  Anime,
  AnimeFilter,
  AnimePartialFilter,
  Database as DatabaseType,
  Database,
  User,
} from '../../models/Type';
import { FilterOption } from '../../models/Constants';
import { File } from '../../models/SynologyApi';
import { AnilistInfoResponse } from '../../models/AnilistApi';
import { getLocalStorage } from '../LocalStorage/LocalStorage';

interface AppState {
  isSignIn: boolean;
  user: User | null;
  animeFilter: AnimeFilter;
  openedAnimeFolder: { key: string; anime: Anime; folder: File[] } | null;
  openedAnimeEdit: { key: string; anime: Anime } | null;
  openedAnimeInfo: {
    key: string;
    anime: Anime;
    animeInfo: AnilistInfoResponse;
  } | null;
  loading: boolean;
  message: string;
  openedVideo: string;
  openedVideoAlt: string;
  database: Database;
  random: boolean;
}

const initialState: AppState = {
  isSignIn: false,
  user: null,
  animeFilter: {
    season: FilterOption.LATEST_SEASON,
    category: FilterOption.ALL_ANIME,
    keyword: '',
    orderBy: FilterOption.SORT_BY_SEASON,
  },
  openedAnimeFolder: null,
  openedAnimeInfo: null,
  openedAnimeEdit: null,
  openedVideo: '',
  openedVideoAlt: '',
  loading: false,
  message: '',
  database: getLocalStorage('database') as DatabaseType,
  random: false,
};

const slice = createSlice({
  name: 'App',
  initialState: initialState,
  reducers: {
    signIn: (state, action) => {
      state.isSignIn = true;
      state.user = action.payload as User;
    },
    signOut: (state) => {
      state.isSignIn = false;
      state.user = null;
    },
    applyFilter: (state, action) => {
      const filter = action.payload as AnimePartialFilter;
      state.animeFilter = { ...state.animeFilter, ...filter };
    },
    openAnimeFolder: (state, action) => {
      state.openedAnimeFolder = action.payload as {
        key: string;
        anime: Anime;
        folder: File[];
      };
    },
    closeAnimeFolder: (state) => {
      state.openedAnimeFolder = null;
    },
    editAnime: (state, action) => {
      state.openedAnimeEdit = action.payload as {
        key: string;
        anime: Anime;
      };
    },
    closeEditAnime: (state) => {
      state.openedAnimeEdit = null;
    },
    openVideo: (state, action) => {
      state.openedVideo = action.payload as string;
    },
    closeVideo: (state) => {
      state.openedVideo = '';
    },
    openVideoAlt: (state, action) => {
      state.openedVideoAlt = action.payload as string;
    },
    closeVideoAlt: (state) => {
      state.openedVideoAlt = '';
    },
    openAnimeInfo: (state, action) => {
      state.openedAnimeInfo = action.payload as {
        key: string;
        anime: Anime;
        animeInfo: AnilistInfoResponse;
      };
    },
    closeAnimeInfo: (state) => {
      state.openedAnimeInfo = null;
    },
    showLoading: (state, action) => {
      state.loading = action.payload as boolean;
    },
    showMessage: (state, action) => {
      state.message = action.payload as string;
    },
    updateDatabase: (state, action) => {
      state.database = action.payload as Database;
    },
    setRandom: (state, action) => {
      state.random = action.payload as boolean;
    },
  },
});

export const Selector = {
  isSignIn: (state: { app: AppState }): boolean => {
    return state.app.isSignIn;
  },
  getUser: (state: { app: AppState }): User | null => {
    return state.app.user;
  },
  isAdmin: (state: { app: AppState }): boolean => {
    const user = Selector.getUser(state);
    return user?.email === 'iq.at.sk131@gmail.com';
  },
  getFilter: (state: { app: AppState }): AnimeFilter => {
    return state.app.animeFilter;
  },
  isAnimeFolderOpen: (state: { app: AppState }): boolean => {
    return state.app.openedAnimeFolder !== null;
  },
  getOpenedAnimeFolder: (state: {
    app: AppState;
  }): { key: string; anime: Anime; folder: File[] } | null => {
    return state.app.openedAnimeFolder;
  },
  isAnimeEditOpen: (state: { app: AppState }): boolean => {
    return state.app.openedAnimeEdit !== null;
  },
  getOpenedAnimeEdit: (state: {
    app: AppState;
  }): { key: string; anime: Anime } | null => {
    return state.app.openedAnimeEdit;
  },
  getOpenedAnimeInfo: (state: {
    app: AppState;
  }): {
    key: string;
    anime: Anime;
    animeInfo: AnilistInfoResponse;
  } | null => {
    return state.app.openedAnimeInfo;
  },
  isLoading: (state: { app: AppState }): boolean => {
    return state.app.loading;
  },
  getMessage: (state: { app: AppState }): string => {
    return state.app.message;
  },
  getVideo: (state: { app: AppState }): string => {
    return state.app.openedVideo;
  },
  getVideoAlt: (state: { app: AppState }): string => {
    return state.app.openedVideoAlt;
  },
  getDatabase: (state: { app: AppState }): Database => {
    return state.app.database;
  },
  isRandom: (state: { app: AppState }): boolean => {
    return state.app.random;
  },
};

export const Action = slice.actions;
export const Reducer = slice.reducer;
