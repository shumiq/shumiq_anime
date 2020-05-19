import mockDatabase from '../../mock/database';
import { IsAdmin } from '../../utils/userdetail';
import { SaveAnime } from '../../utils/firebase';
import AnimeInfoPopup from './AnimeInfoPopup';
import { mount } from 'enzyme';
import React from 'react';

jest.mock('../../utils/userdetail');
jest.mock('../../utils/firebase');
const mockAnimeList = mockDatabase.animelist;
const mockInfo = {
  id: 107871,
  title: {
    romaji: 'Princess Connect! Re:Dive',
    english: 'Princess Connect! Re: Dive',
  },
  season: 'SPRING',
  description: 'desc',
  startDate: { year: '2020' },
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
        anime={mockAnimeList[0]}
        info={mockInfo}
        show={false}
        setShow={null}
      />
    );
    expect(wrapper.find('div.modal')).toHaveLength(0);
  });

  it('should show correct info', () => {
    const wrapper = mount(
      <AnimeInfoPopup
        anime={mockAnimeList[0]}
        info={mockInfo}
        show={true}
        setShow={null}
      />
    );
    expect(wrapper.find('div.modal').text()).toContain(mockAnimeList[0].title);
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
    IsAdmin.mockReturnValue(false);
    const wrapper = mount(
      <AnimeInfoPopup
        anime={mockAnimeList[0]}
        info={mockInfo}
        show={true}
        setShow={null}
      />
    );
    expect(wrapper.find('div.modal').find('button.btn-primary').length).toBe(0);
  });

  it('should show sync and incorrect button if admin', () => {
    IsAdmin.mockReturnValue(true);
    const wrapper = mount(
      <AnimeInfoPopup
        anime={mockAnimeList[0]}
        info={mockInfo}
        show={true}
        setShow={null}
      />
    );
    expect(wrapper.find('div.modal').find('button.btn-primary').length).toBe(2);
  });

  it('should sync with new info when click sync', () => {
    IsAdmin.mockReturnValue(true);
    SaveAnime.mockReturnValue(null);
    const mockSetShow = () => {};
    const wrapper = mount(
      <AnimeInfoPopup
        anime={mockAnimeList[0]}
        info={mockInfo}
        show={true}
        setShow={mockSetShow}
      />
    );
    const syncButton = wrapper
      .find('div.modal')
      .find('button.btn-primary')
      .first();
    syncButton.simulate('click');
    const expectedResult = Object.assign(
      JSON.parse(JSON.stringify(mockAnimeList[0])),
      {
        cover_url: 'someurl',
        info: 'desc',
        score: '6.6',
        season: 2,
      }
    );
    expect(SaveAnime).toHaveBeenCalledWith(
      mockAnimeList[0].key,
      expectedResult
    );
  });

  it('should add to blacklist when click incorrect', () => {
    IsAdmin.mockReturnValue(true);
    SaveAnime.mockReturnValue(null);
    window.confirm = jest.fn(() => true);
    const mockSetShow = () => {};
    const wrapper = mount(
      <AnimeInfoPopup
        anime={mockAnimeList[0]}
        info={mockInfo}
        show={true}
        setShow={mockSetShow}
      />
    );
    const incorrectButton = wrapper
      .find('div.modal')
      .find('button.btn-primary')
      .at(1);
    incorrectButton.simulate('click');
    const expectedResult = Object.assign(
      JSON.parse(JSON.stringify(mockAnimeList[0])),
      {
        blacklist: [mockInfo.id],
      }
    );
    expect(SaveAnime).toHaveBeenCalledWith(
      mockAnimeList[0].key,
      expectedResult
    );
  });
});
