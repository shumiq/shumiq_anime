import { mount } from 'enzyme';
import React from 'react';
import mockDatabase from '../../mock/database.json';
import UserDetail from '../../utils/userdetail';
import { Database } from '../../utils/firebase';
import AnimeInfoPopup from './AnimeInfoPopup';
import { Anime, Database as DatabaseType } from '../../utils/types';

jest.mock('../../utils/userdetail');
jest.mock('../../utils/firebase');
const mockAnimeList: Record<
  string,
  Anime
> = ((mockDatabase as unknown) as DatabaseType).animeList;
const mockInfo = {
  id: 107871,
  title: {
    romaji: 'Princess Connect! Re:Dive',
    english: 'Princess Connect! Re: Dive',
  },
  season: 'SPRING',
  description: 'desc',
  startDate: { year: 2020 },
  episodes: null,
  source: 'VIDEO_GAME',
  coverImage: {
    large: 'someurl',
  },
  bannerImage: null,
  genres: ['Fantasy'],
  meanScore: 68,
  averageScore: 66,
  popularity: 7462,
  relations: {
    nodes: [],
  },
  studios: {
    nodes: [{ name: 'CygamesPictures' }],
  },
  nextAiringEpisode: {
    timeUntilAiring: 547479,
    episode: 5,
  },
};

describe('<AnimeInfoPopup />', () => {
  it('should not show when show props is false', () => {
    const wrapper = mount(
      <AnimeInfoPopup
        anime={mockAnimeList['abc352']}
        info={mockInfo}
        show={false}
        key={'abc352'}
        setShow={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal')).toHaveLength(0);
  });

  it('should show correct info', () => {
    const wrapper = mount(
      <AnimeInfoPopup
        anime={mockAnimeList['abc352']}
        info={mockInfo}
        show={true}
        key={'abc352'}
        setShow={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal').text()).toContain(
      mockAnimeList['abc352'].title
    );
    expect(wrapper.find('div.modal').text()).toContain(mockInfo.title.romaji);
    expect(wrapper.find('div.modal').text()).toContain(mockInfo.startDate.year);
    expect(wrapper.find('div.modal').text()).toContain(mockInfo.season);
    expect(wrapper.find('div.modal').text()).toContain(
      mockInfo.studios.nodes[0].name
    );
    expect(wrapper.find('div.modal').text()).toContain(mockInfo.genres[0]);
    expect(wrapper.find('div.modal').text()).toContain(mockInfo.description);
    expect(wrapper.find('div.modal').text()).toContain(mockInfo.source);
  });

  it('should not show sync and incorrect button if not admin', () => {
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(false);
    const wrapper = mount(
      <AnimeInfoPopup
        anime={mockAnimeList['abc352']}
        info={mockInfo}
        show={true}
        key={'abc352'}
        setShow={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal').find('button.btn-primary').length).toBe(0);
  });

  it('should show sync and incorrect button if admin', () => {
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const wrapper = mount(
      <AnimeInfoPopup
        anime={mockAnimeList['abc352']}
        info={mockInfo}
        show={true}
        key={'abc352'}
        setShow={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal').find('button.btn-primary').length).toBe(2);
  });

  it('should sync with new info when click sync', () => {
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    (Database.update.anime as jest.Mock).mockReturnValue(null);
    const mockSetShow = () => {
      return;
    };
    const wrapper = mount(
      <AnimeInfoPopup
        anime={mockAnimeList['abc352']}
        info={mockInfo}
        show={true}
        key={'abc352'}
        setShow={mockSetShow}
      />
    );
    const syncButton = wrapper
      .find('div.modal')
      .find('button.btn-primary')
      .first();
    syncButton.simulate('click');
    const expectedResult = {
      ...mockAnimeList['abc352'],
      cover_url: 'someurl',
      info: 'desc',
      score: '6.6',
      season: 2,
    };
    expect(Database.update.anime as jest.Mock).toHaveBeenCalledWith(
      'abc352',
      expectedResult
    );
  });

  it('should add to blacklist when click incorrect', () => {
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    (Database.update.anime as jest.Mock).mockReturnValue(null);
    window.confirm = jest.fn(() => true);
    const mockSetShow = () => {
      return;
    };
    const wrapper = mount(
      <AnimeInfoPopup
        anime={mockAnimeList['abc352']}
        info={mockInfo}
        show={true}
        key={'abc352'}
        setShow={mockSetShow}
      />
    );
    const incorrectButton = wrapper
      .find('div.modal')
      .find('button.btn-primary')
      .at(1);
    incorrectButton.simulate('click');
    const expectedResult = {
      ...mockAnimeList['abc352'],
      blacklist: [mockInfo.id],
    };
    expect(Database.update.anime as jest.Mock).toHaveBeenCalledWith(
      'abc352',
      expectedResult
    );
  });
});
