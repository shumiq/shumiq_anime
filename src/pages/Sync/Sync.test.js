import { getLocalStorage } from '../../utils/localstorage';
import mockDatabase from '../../mock/database';
import GooglePhotoApi from '../../api/googlephoto';
import { SaveAnime } from '../../utils/firebase';
import GoogleDriveApi from '../../api/googledrive';
import Sync from './Sync';
import { shallow } from 'enzyme';
import React from 'react';

jest.mock('../../utils/localstorage');
jest.mock('../../api/googlephoto');
jest.mock('../../utils/firebase');
jest.mock('../../api/googledrive');

describe('<Sync />', () => {
  const flushPromises = () => new Promise(setImmediate);

  it('should show 2 rows', () => {
    // Given
    getLocalStorage.mockReturnValue(JSON.parse(JSON.stringify(mockDatabase)));
    // When
    const wrapper = shallow(<Sync />);
    // Then
    expect(wrapper.find('.row-anime')).toHaveLength(2);
  });

  it('should call getAlbums api when click Load more...', async () => {
    // Given
    getLocalStorage.mockReturnValue(JSON.parse(JSON.stringify(mockDatabase)));
    GooglePhotoApi.getAlbums.mockResolvedValue({
      albums: [
        { id: mockDatabase.animeList[0].gphotoid, mediaItemsCount: 2 },
        { id: mockDatabase.animeList[1].gphotoid, mediaItemsCount: 2 },
      ],
    });
    const wrapper = shallow(<Sync />);
    // When
    wrapper.find('#btn-load-more').simulate('click');
    // Then
    expect(wrapper.find('GeneralPopup')?.props()?.show).toBe(true);
    await flushPromises();
    expect(wrapper.find('GeneralPopup')?.props()?.show).toBe(false);
    expect(GooglePhotoApi.getAlbums).toHaveBeenCalled();
  });

  it('should call getAllAlbums api when click Load all and show loading popup', async () => {
    // Given
    getLocalStorage.mockReturnValue(JSON.parse(JSON.stringify(mockDatabase)));
    GooglePhotoApi.getAllAlbums.mockResolvedValue({
      albums: [
        { id: mockDatabase.animeList[0].gphotoid, mediaItemsCount: 2 },
        { id: mockDatabase.animeList[1].gphotoid, mediaItemsCount: 2 },
      ],
    });
    const wrapper = shallow(<Sync />);
    // When
    wrapper.find('#btn-load-all').simulate('click');
    // Then
    expect(wrapper.find('GeneralPopup')?.props()?.show).toBe(true);
    await flushPromises();
    expect(wrapper.find('GeneralPopup')?.props()?.show).toBe(false);
    expect(GooglePhotoApi.getAllAlbums).toHaveBeenCalled();
  });

  it('should show correct information & buttons after load from google photo', async () => {
    // Given
    getLocalStorage.mockReturnValue(JSON.parse(JSON.stringify(mockDatabase)));
    GooglePhotoApi.getAlbums.mockResolvedValue({
      albums: [
        { id: mockDatabase.animeList[0].gphotoid, mediaItemsCount: 2 },
        { id: mockDatabase.animeList[1].gphotoid, mediaItemsCount: 2 },
      ],
    });
    const wrapper = shallow(<Sync />);
    // When
    wrapper.find('#btn-load-more').simulate('click');
    await flushPromises();
    // Then
    expect(wrapper.find('.row-anime').at(0).text()).toContain('1/2');
    expect(wrapper.find('.row-anime').at(0).text()).toContain('Update');
    expect(wrapper.find('.row-anime').at(1).text()).toContain('2/2');
    expect(wrapper.find('.row-anime').at(1).text()).not.toContain('Update');
  });

  it('should called save anime when update and show loading popup', async () => {
    // Given
    getLocalStorage.mockReturnValue(JSON.parse(JSON.stringify(mockDatabase)));
    GooglePhotoApi.getAlbums.mockResolvedValue({
      albums: [
        { id: mockDatabase.animeList[0].gphotoid, mediaItemsCount: 2 },
        { id: mockDatabase.animeList[1].gphotoid, mediaItemsCount: 2 },
      ],
    });
    GooglePhotoApi.getMedias.mockResolvedValue([]);
    GoogleDriveApi.getPrivateFolderId.mockResolvedValue(null);
    GoogleDriveApi.getPublicFolderId.mockResolvedValue(null);
    const wrapper = shallow(<Sync />);
    // When
    wrapper.find('#btn-load-more').simulate('click');
    await flushPromises();
    wrapper.find('.row-anime').at(0).find('#btn-update').simulate('click');
    // Then
    expect(wrapper.find('GeneralPopup')?.props()?.show).toBe(true);
    await flushPromises();
    expect(wrapper.find('GeneralPopup')?.props()?.show).toBe(false);
    let updatedAnime = JSON.parse(JSON.stringify(mockDatabase.animeList[1]));
    updatedAnime.download = 2;
    updatedAnime.gdriveid_public = null;
    updatedAnime.gdriveid = null;
    expect(SaveAnime).toHaveBeenCalledWith(updatedAnime.key, updatedAnime);
  });

  it('should called save anime when unsync', async () => {
    // Given
    getLocalStorage.mockReturnValue(JSON.parse(JSON.stringify(mockDatabase)));
    GooglePhotoApi.getAlbums.mockResolvedValue({
      albums: [
        { id: mockDatabase.animeList[0].gphotoid, mediaItemsCount: 2 },
        { id: mockDatabase.animeList[1].gphotoid, mediaItemsCount: 2 },
      ],
    });
    window.confirm = jest.fn(() => true);
    const wrapper = shallow(<Sync />);
    // When
    wrapper.find('.row-anime').at(0).find('#btn-unsync').simulate('click');
    await flushPromises();
    // Then
    let updatedAnime = JSON.parse(JSON.stringify(mockDatabase.animeList[1]));
    updatedAnime.gphotoid = null;
    expect(SaveAnime).toHaveBeenCalledWith(updatedAnime.key, updatedAnime);
  });

  it('should see sync buttons correctly', async () => {
    // Given
    let db = JSON.parse(JSON.stringify(mockDatabase));
    db.animeList[0].gphotoid = null;
    db.animeList[1].gphotoid = null;
    getLocalStorage.mockReturnValue(db);
    GooglePhotoApi.getAlbums.mockResolvedValue({
      albums: [
        {
          id: mockDatabase.animeList[0].gphotoid,
          title: '[Anime] ' + mockDatabase.animeList[0].title,
          mediaItemsCount: 2,
        },
        {
          id: mockDatabase.animeList[1].gphotoid,
          title: '[Anime] ' + mockDatabase.animeList[1].title + ' SS2',
          mediaItemsCount: 2,
        },
      ],
    });
    const wrapper = shallow(<Sync />);
    // When
    wrapper.find('#btn-load-more').simulate('click');
    await flushPromises();
    // Then
    expect(wrapper.find('.row-anime').at(0).find('#btn-unsync')).toHaveLength(
      0
    );
    expect(wrapper.find('.row-anime').at(0).find('#btn-sync')).toHaveLength(0);
    expect(wrapper.find('.row-anime').at(1).find('#btn-unsync')).toHaveLength(
      0
    );
    expect(wrapper.find('.row-anime').at(1).find('#btn-sync')).toHaveLength(1);
  });

  it('should call save anime when click sync buttons', async () => {
    // Given
    let db = JSON.parse(JSON.stringify(mockDatabase));
    db.animeList[0].gphotoid = null;
    db.animeList[1].gphotoid = null;
    getLocalStorage.mockReturnValue(db);
    GooglePhotoApi.getAlbums.mockResolvedValue({
      albums: [
        {
          id: mockDatabase.animeList[0].gphotoid,
          title: '[Anime] ' + mockDatabase.animeList[0].title,
          mediaItemsCount: 2,
        },
        {
          id: mockDatabase.animeList[1].gphotoid,
          title: '[Anime] ' + mockDatabase.animeList[1].title + ' SS2',
          mediaItemsCount: 2,
        },
      ],
    });
    const wrapper = shallow(<Sync />);
    // When
    wrapper.find('#btn-load-more').simulate('click');
    await flushPromises();
    wrapper.find('#btn-sync').simulate('click');
    await flushPromises();
    // Then
    let updatedAnime = JSON.parse(JSON.stringify(mockDatabase.animeList[0]));
    updatedAnime.gphotoid = mockDatabase.animeList[0].gphotoid;
    expect(SaveAnime).toHaveBeenCalledWith(updatedAnime.key, updatedAnime);
  });
});
