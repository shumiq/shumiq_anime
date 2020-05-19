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

  it('should show correct information & buttons after load from google photo', async () => {
    // Given
    getLocalStorage.mockReturnValue(JSON.parse(JSON.stringify(mockDatabase)));
    GooglePhotoApi.getAlbums.mockResolvedValue({
      albums: [
        { id: mockDatabase.animelist[0].gphotoid, mediaItemsCount: 2 },
        { id: mockDatabase.animelist[1].gphotoid, mediaItemsCount: 2 },
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

  it('should called save anime when update', async () => {
    // Given
    getLocalStorage.mockReturnValue(JSON.parse(JSON.stringify(mockDatabase)));
    GooglePhotoApi.getAlbums.mockResolvedValue({
      albums: [
        { id: mockDatabase.animelist[0].gphotoid, mediaItemsCount: 2 },
        { id: mockDatabase.animelist[1].gphotoid, mediaItemsCount: 2 },
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
    await flushPromises();
    // Then
    let updatedAnime = JSON.parse(JSON.stringify(mockDatabase.animelist[1]));
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
        { id: mockDatabase.animelist[0].gphotoid, mediaItemsCount: 2 },
        { id: mockDatabase.animelist[1].gphotoid, mediaItemsCount: 2 },
      ],
    });
    window.confirm = jest.fn(() => true);
    const wrapper = shallow(<Sync />);
    // When
    wrapper.find('.row-anime').at(0).find('#btn-unsync').simulate('click');
    await flushPromises();
    // Then
    let updatedAnime = JSON.parse(JSON.stringify(mockDatabase.animelist[1]));
    updatedAnime.gphotoid = null;
    expect(SaveAnime).toHaveBeenCalledWith(updatedAnime.key, updatedAnime);
  });

  it('should see sync buttons correctly', async () => {
    // Given
    let db = JSON.parse(JSON.stringify(mockDatabase));
    db.animelist[0].gphotoid = null;
    db.animelist[1].gphotoid = null;
    getLocalStorage.mockReturnValue(db);
    GooglePhotoApi.getAlbums.mockResolvedValue({
      albums: [
        {
          id: mockDatabase.animelist[0].gphotoid,
          title: '[Anime] ' + mockDatabase.animelist[0].title,
          mediaItemsCount: 2,
        },
        {
          id: mockDatabase.animelist[1].gphotoid,
          title: '[Anime] ' + mockDatabase.animelist[1].title + ' SS2',
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
    db.animelist[0].gphotoid = null;
    db.animelist[1].gphotoid = null;
    getLocalStorage.mockReturnValue(db);
    GooglePhotoApi.getAlbums.mockResolvedValue({
      albums: [
        {
          id: mockDatabase.animelist[0].gphotoid,
          title: '[Anime] ' + mockDatabase.animelist[0].title,
          mediaItemsCount: 2,
        },
        {
          id: mockDatabase.animelist[1].gphotoid,
          title: '[Anime] ' + mockDatabase.animelist[1].title + ' SS2',
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
    let updatedAnime = JSON.parse(JSON.stringify(mockDatabase.animelist[0]));
    updatedAnime.gphotoid = mockDatabase.animelist[0].gphotoid;
    expect(SaveAnime).toHaveBeenCalledWith(updatedAnime.key, updatedAnime);
  });
});
