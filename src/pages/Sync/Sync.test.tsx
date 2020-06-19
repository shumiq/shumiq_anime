import { shallow } from 'enzyme';
import React from 'react';
import { getLocalStorage } from '../../utils/localstorage';
import mockDatabase from '../../mock/database.json';
import GooglePhotoApi from '../../api/googlephoto';
import { Database } from '../../utils/firebase';
import GoogleDriveApi from '../../api/googledrive';
import Sync from './Sync';
import { Database as DatabaseType } from '../../utils/types';

jest.mock('../../utils/localstorage');
jest.mock('../../api/googlephoto');
jest.mock('../../utils/firebase');
jest.mock('../../api/googledrive');

describe('<Sync />', () => {
  const flushPromises = () => new Promise(setImmediate);

  it('should show 2 rows', () => {
    // Given
    (getLocalStorage as jest.Mock).mockReturnValue({ ...mockDatabase });
    // When
    const wrapper = shallow(<Sync />);
    // Then
    expect(wrapper.find('.row-anime')).toHaveLength(2);
  });

  it('should call getAlbums api when click Load more...', async () => {
    // Given
    (getLocalStorage as jest.Mock).mockReturnValue({ ...mockDatabase });
    (GooglePhotoApi.getAlbums as jest.Mock).mockResolvedValue({
      albums: [
        { id: mockDatabase.anime['abc352'].gphotoid, mediaItemsCount: 2 },
        { id: mockDatabase.anime['abc350'].gphotoid, mediaItemsCount: 2 },
      ],
    });
    const wrapper = shallow(<Sync />);
    // When
    wrapper.find('#btn-load-more').simulate('click');
    // Then
    expect(
      (wrapper.find('GeneralPopup')?.props() as { show: boolean }).show
    ).toBe(true);
    await flushPromises();
    expect(
      (wrapper.find('GeneralPopup')?.props() as { show: boolean }).show
    ).toBe(false);
    expect(GooglePhotoApi.getAlbums).toHaveBeenCalled();
  });

  it('should call getAllAlbums api when click Load all and show loading popup', async () => {
    // Given
    (getLocalStorage as jest.Mock).mockReturnValue({ ...mockDatabase });
    (GooglePhotoApi.getAllAlbums as jest.Mock).mockResolvedValue({
      albums: [
        { id: mockDatabase.anime['abc352'].gphotoid, mediaItemsCount: 2 },
        { id: mockDatabase.anime['abc350'].gphotoid, mediaItemsCount: 2 },
      ],
    });
    const wrapper = shallow(<Sync />);
    // When
    wrapper.find('#btn-load-all').simulate('click');
    // Then
    expect(
      (wrapper.find('GeneralPopup')?.props() as { show: boolean }).show
    ).toBe(true);
    await flushPromises();
    expect(
      (wrapper.find('GeneralPopup')?.props() as { show: boolean }).show
    ).toBe(false);
    expect(GooglePhotoApi.getAllAlbums).toHaveBeenCalled();
  });

  it('should show correct information & buttons after load from google photo', async () => {
    // Given
    (getLocalStorage as jest.Mock).mockReturnValue({ ...mockDatabase });
    (GooglePhotoApi.getAlbums as jest.Mock).mockResolvedValue({
      albums: [
        { id: mockDatabase.anime['abc352'].gphotoid, mediaItemsCount: 2 },
        { id: mockDatabase.anime['abc350'].gphotoid, mediaItemsCount: 2 },
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
    (getLocalStorage as jest.Mock).mockReturnValue({ ...mockDatabase });
    (GooglePhotoApi.getAlbums as jest.Mock).mockResolvedValue({
      albums: [
        { id: mockDatabase.anime['abc352'].gphotoid, mediaItemsCount: 2 },
        { id: mockDatabase.anime['abc350'].gphotoid, mediaItemsCount: 2 },
      ],
    });
    (GooglePhotoApi.getMedias as jest.Mock).mockResolvedValue([]);
    (GoogleDriveApi.getPrivateFolderId as jest.Mock).mockResolvedValue('');
    (GoogleDriveApi.getPublicFolderId as jest.Mock).mockResolvedValue('');
    const wrapper = shallow(<Sync />);
    // When
    wrapper.find('#btn-load-more').simulate('click');
    await flushPromises();
    wrapper.find('.row-anime').at(0).find('#btn-update').simulate('click');
    // Then
    expect(
      (wrapper.find('GeneralPopup')?.props() as { show: boolean }).show
    ).toBe(true);
    await flushPromises();
    expect(
      (wrapper.find('GeneralPopup')?.props() as { show: boolean }).show
    ).toBe(false);
    const updatedAnime = {
      ...mockDatabase.anime['abc350'],
      download: 2,
      gdriveid_public: '',
      gdriveid: '',
    };
    expect(Database.update.anime).toHaveBeenCalledWith('abc350', updatedAnime);
  });

  it('should called save anime when unsync', async () => {
    // Given
    (getLocalStorage as jest.Mock).mockReturnValue({ ...mockDatabase });
    (GooglePhotoApi.getAlbums as jest.Mock).mockResolvedValue({
      albums: [
        { id: mockDatabase.anime['abc352'].gphotoid, mediaItemsCount: 2 },
        { id: mockDatabase.anime['abc350'].gphotoid, mediaItemsCount: 2 },
      ],
    });
    window.confirm = jest.fn(() => true);
    const wrapper = shallow(<Sync />);
    // When
    wrapper.find('.row-anime').at(0).find('#btn-unsync').simulate('click');
    await flushPromises();
    // Then
    const updatedAnime = {
      ...mockDatabase.anime['abc350'],
      gphotoid: '',
    };
    expect(Database.update.anime).toHaveBeenCalledWith('abc350', updatedAnime);
  });

  it('should see sync buttons correctly', async () => {
    // Given
    const db = JSON.parse(JSON.stringify(mockDatabase)) as DatabaseType;
    if (db.anime['abc352']) db.anime['abc352'].gphotoid = '';
    if (db.anime['abc350']) db.anime['abc350'].gphotoid = '';
    (getLocalStorage as jest.Mock).mockReturnValue(db);
    (GooglePhotoApi.getAlbums as jest.Mock).mockResolvedValue({
      albums: [
        {
          id: mockDatabase.anime['abc352'].gphotoid,
          title: '[Anime] ' + mockDatabase.anime['abc352'].title,
          productUrl: '',
          mediaItemsCount: 2,
        },
        {
          id: mockDatabase.anime['abc350'].gphotoid,
          title: '[Anime] ' + mockDatabase.anime['abc350'].title + ' SS2',
          productUrl: '',
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
    const db = JSON.parse(JSON.stringify(mockDatabase)) as DatabaseType;
    if (db.anime['abc352']) db.anime['abc352'].gphotoid = '';
    if (db.anime['abc350']) db.anime['abc350'].gphotoid = '';
    (getLocalStorage as jest.Mock).mockReturnValue(db);
    (GooglePhotoApi.getAlbums as jest.Mock).mockResolvedValue({
      albums: [
        {
          id: mockDatabase.anime['abc352'].gphotoid,
          title: '[Anime] ' + mockDatabase.anime['abc352'].title,
          productUrl: '',
          mediaItemsCount: 2,
        },
        {
          id: mockDatabase.anime['abc350'].gphotoid,
          title: '[Anime] ' + mockDatabase.anime['abc350'].title + ' SS2',
          productUrl: '',
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
    const updatedAnime = {
      ...mockDatabase.anime['abc352'],
      gphotoid: mockDatabase.anime['abc352'].gphotoid,
    };
    expect(Database.update.anime).toHaveBeenCalledWith('abc352', updatedAnime);
  });
});
