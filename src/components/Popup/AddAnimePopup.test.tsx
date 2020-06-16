import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import AnilistApi from '../../api/anilist';
import { getLocalStorage } from '../../utils/localstorage';
import mockDatabase from '../../mock/database.json';
import { Database } from '../../utils/firebase';
import AddAnimePopup from './AddAnimePopup';

jest.mock('../../api/anilist');
jest.mock('../../utils/localstorage');
jest.mock('../../utils/firebase');

describe('<AddAnimePopup />', () => {
  const flushPromises = () => new Promise(setImmediate);

  it('should not show when show props is false', () => {
    const wrapper = mount(
      <AddAnimePopup
        show={false}
        setShow={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal')).toHaveLength(0);
  });

  it('should have input and button', () => {
    const wrapper = mount(
      <AddAnimePopup
        show={true}
        setShow={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal').find('input')).toHaveLength(1);
    expect(wrapper.find('div.modal').find('#btn-search')).toHaveLength(1);
  });

  it('should call searchAnime from anilist api after click search', async () => {
    (AnilistApi.searchAnime as jest.Mock).mockResolvedValue([
      {
        id: 1,
        title: { userPreferred: 'anime1' },
        startDate: { year: 2020 },
        season: 'SPRING',
      },
    ]);
    const wrapper = mount(
      <AddAnimePopup
        show={true}
        setShow={() => {
          return;
        }}
      />
    );
    await act(async () => {
      wrapper
        .find('div.modal')
        .find('input.form-control')
        .simulate('change', { target: { value: 'test' } });
      await flushPromises();
      wrapper.find('div.modal').find('#btn-search').simulate('click');
    });
    expect(AnilistApi.searchAnime as jest.Mock).toHaveBeenCalledWith('test');
  });

  it('should see search result after click search', async () => {
    (AnilistApi.searchAnime as jest.Mock).mockResolvedValue([
      {
        id: 1,
        title: { userPreferred: 'anime1' },
        startDate: { year: 2020 },
        season: 'SPRING',
      },
      {
        id: 2,
        title: { userPreferred: 'anime2' },
        startDate: { year: 2019 },
        season: 'WINTER',
      },
      {
        id: 3,
        title: { userPreferred: 'anime3' },
        startDate: { year: 2018 },
        season: 'SUMMER',
      },
    ]);
    const wrapper = mount(
      <AddAnimePopup
        show={true}
        setShow={() => {
          return;
        }}
      />
    );
    await act(async () => {
      wrapper.find('div.modal').find('#btn-search').simulate('click');
      await flushPromises();
    });
    wrapper.update();
    expect(wrapper.find('div.modal').find('table')).toHaveLength(2);
    const result = wrapper
      .find('div.modal')
      .find('table')
      .at(1)
      .find('tbody')
      .find('tr');
    expect(result.at(0).text()).toContain('anime1');
    expect(result.at(0).text()).toContain('2020');
    expect(result.at(0).text()).toContain('SPRING');
    expect(result.at(1).text()).toContain('anime2');
    expect(result.at(1).text()).toContain('2019');
    expect(result.at(1).text()).toContain('WINTER');
    expect(result.at(2).text()).toContain('anime3');
    expect(result.at(2).text()).toContain('2018');
    expect(result.at(2).text()).toContain('SUMMER');
  });

  it('should call Database.update.anime when click add', async () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (AnilistApi.searchAnime as jest.Mock).mockResolvedValue([
      {
        id: 1,
        title: { userPreferred: 'anime1', romaji: 'anime1_romaji' },
        startDate: { year: 2020 },
        season: 'SPRING',
        studios: { nodes: [{ name: 'studio' }] },
        description: 'description',
        genres: ['genre1', 'genre2'],
        coverImage: { large: 'cover_url' },
        averageScore: 99.1,
        episodes: 10,
      },
    ]);
    const wrapper = mount(
      <AddAnimePopup
        show={true}
        setShow={() => {
          return;
        }}
      />
    );
    await act(async () => {
      wrapper.find('div.modal').find('#btn-search').simulate('click');
      await flushPromises();
    });
    wrapper.update();
    await act(async () => {
      wrapper.find('div.modal').find('#btn-add').simulate('click');
      await flushPromises();
    });
    expect(Database.update.anime).toHaveBeenCalledWith(2, {
      all_episode: '10',
      cover_url: 'cover_url',
      download: 0,
      download_url: '',
      gdriveid: '',
      gdriveid_public: '',
      gphotoid: '',
      genres: 'genre1, genre2',
      info: 'description',
      key: 2,
      score: '9.9',
      season: 2,
      studio: 'studio',
      title: 'anime1_romaji',
      url: '',
      view: 0,
      year: 2020,
    });
  });
});
