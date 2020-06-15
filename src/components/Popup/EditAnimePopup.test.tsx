import React from 'react';
import { mount } from 'enzyme';
import mockDatabase from '../../mock/database.json';
import { Database } from '../../utils/firebase';
import EditAnimePopup from './EditAnimePopup';
import { Anime } from '../../utils/types';

jest.mock('../../utils/firebase');
const mockAnimeList: Anime[] = mockDatabase.animeList;

describe('<EditAnimePopup />', () => {
  it('should not show when show props is false', () => {
    const wrapper = mount(
      <EditAnimePopup
        anime={mockAnimeList[0]}
        show={false}
        setShow={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal')).toHaveLength(0);
  });

  it('should show correct default value', () => {
    const wrapper = mount(
      <EditAnimePopup
        anime={mockAnimeList[0]}
        show={true}
        setShow={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal').html()).toContain(mockAnimeList[0].title);
    expect(wrapper.find('div.modal').html()).toContain(mockAnimeList[0].studio);
    expect(wrapper.find('div.modal').html()).toContain(mockAnimeList[0].year);
    expect(wrapper.find('div.modal').html()).toContain(
      mockAnimeList[0].cover_url
    );
    expect(wrapper.find('div.modal').html()).toContain(mockAnimeList[0].url);
    expect(wrapper.find('div.modal').html()).toContain(
      mockAnimeList[0].download_url
    );
  });

  it('should save with new data when click save', () => {
    (Database.update.anime as jest.Mock).mockReturnValue(null);
    const mockSetShow = () => {
      return;
    };
    const wrapper = mount(
      <EditAnimePopup
        anime={mockAnimeList[0]}
        show={true}
        setShow={mockSetShow}
      />
    );
    const saveButton = wrapper
      .find('div.modal')
      .find('button.btn-primary')
      .first();

    wrapper
      .find('div.modal')
      .find('input.form-control')
      .first()
      .simulate('change', { target: { name: 'title', value: 'new title' } });
    wrapper
      .find('div.modal')
      .find('input.form-control')
      .at(1)
      .simulate('change', { target: { name: 'studio', value: 'new studio' } });
    wrapper
      .find('div.modal')
      .find('input.form-control')
      .at(2)
      .simulate('change', { target: { name: 'view', value: 9 } });
    wrapper
      .find('div.modal')
      .find('input.form-control')
      .at(3)
      .simulate('change', { target: { name: 'download', value: 10 } });
    wrapper
      .find('div.modal')
      .find('input.form-control')
      .at(4)
      .simulate('change', { target: { name: 'all_episode', value: '11' } });
    wrapper
      .find('div.modal')
      .find('input.form-control')
      .at(5)
      .simulate('change', { target: { name: 'year', value: 2222 } });
    wrapper
      .find('div.modal')
      .find('select.form-control')
      .simulate('change', { target: { name: 'season', value: 0 } });
    wrapper
      .find('div.modal')
      .find('input.form-control')
      .at(6)
      .simulate('change', { target: { name: 'score', value: '10' } });
    wrapper
      .find('div.modal')
      .find('input.form-control')
      .at(7)
      .simulate('change', { target: { name: 'cover_url', value: 'url1' } });
    wrapper
      .find('div.modal')
      .find('input.form-control')
      .at(8)
      .simulate('change', { target: { name: 'url', value: 'url2' } });
    wrapper
      .find('div.modal')
      .find('input.form-control')
      .at(9)
      .simulate('change', { target: { name: 'download_url', value: 'url3' } });
    wrapper
      .find('div.modal')
      .find('input.form-control')
      .at(10)
      .simulate('change', { target: { name: 'genres', value: 'genres' } });

    saveButton.simulate('click');
    const expectedResult = {
      ...mockAnimeList[0],
      title: 'new title',
      studio: 'new studio',
      view: 9,
      download: 10,
      all_episode: '11',
      year: 2222,
      season: 0,
      score: '10',
      cover_url: 'url1',
      url: 'url2',
      download_url: 'url3',
      genres: 'genres',
    };
    expect(Database.update.anime).toHaveBeenCalledWith(
      mockAnimeList[0].key,
      expectedResult
    );
  });

  it('should delete when click delete', () => {
    (Database.update.anime as jest.Mock).mockReturnValue(null);
    window.confirm = jest.fn(() => true);
    const mockSetShow = () => {
      return;
    };
    const wrapper = mount(
      <EditAnimePopup
        anime={mockAnimeList[0]}
        show={true}
        setShow={mockSetShow}
      />
    );
    const deleteButton = wrapper
      .find('div.modal')
      .find('button.btn-primary')
      .at(1);
    deleteButton.simulate('click');
    expect(Database.update.anime).toHaveBeenCalledWith(
      mockAnimeList[0].key,
      null
    );
  });
});
