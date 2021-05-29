import { createSlice } from '@reduxjs/toolkit';
import { AnimeFilter, AnimePartialFilter, User } from '../../models/Type';
import { FilterOption } from '../../models/Constants';
import { File } from '../../models/SynologyApi';

interface AppState {
  isSignIn: boolean;
  user: User | null;
  animeFilter: AnimeFilter;
  openedAnimeFolder: File[] | null;
  loading: boolean;
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
  loading: false,
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
      state.openedAnimeFolder = action.payload as File[];
    },
    closeAnimeFolder: (state) => {
      state.openedAnimeFolder = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload as boolean;
    },
  },
});

export const Selector = {
  isSignIn: (state: { app: AppState }) => {
    return state.app.isSignIn;
  },
  getUser: (state: { app: AppState }) => {
    return state.app.user;
  },
  isAdmin: (state: { app: AppState }) => {
    const user = Selector.getUser(state);
    return user?.email === 'iq.at.sk131@gmail.com';
  },
  getFilter: (state: { app: AppState }) => {
    return state.app.animeFilter;
  },
  isAnimeFolderOpen: (state: { app: AppState }) => {
    return state.app.openedAnimeFolder !== null;
  },
  getOpenedAnimeFolder: (state: { app: AppState }) => {
    return state.app.openedAnimeFolder;
  },
  isLoading: (state: { app: AppState }) => {
    return state.app.loading;
  },
};

export const Action = slice.actions;
export const Reducer = slice.reducer;
