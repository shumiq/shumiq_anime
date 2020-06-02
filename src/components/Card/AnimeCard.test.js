import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import React from 'react';
import mockDatabase from '../../mock/database';
import UserDetail from '../../utils/userdetail';
import AnilistApi from '../../api/anilist';
import { Database } from '../../utils/firebase';
import { getLocalStorage } from '../../utils/localstorage';
import { CardLayout } from '../../utils/enum';
import GoogleDriveApi from '../../api/googledrive';
import GooglePhotoApi from '../../api/googlephoto';
import EditAnimePopup from '../Popup/EditAnimePopup';
import ClipboardPopup from '../Popup/ClipboardPopup';
import AnimeCard from './AnimeCard';

jest.mock('../../utils/userdetail');
jest.mock('../../api/anilist');
jest.mock('../../api/googledrive');
jest.mock('../../api/googlephoto');
jest.mock('../../utils/firebase');
jest.mock('../../utils/localstorage');

describe('<AnimeCard />', () => {
  it('should show correct infomation', () => {
    // Given
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    // Then
    expect(wrapper.text()).toContain(mockAnime.title);
  });

  it('should show edit button if admin', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    // Then
    expect(wrapper.find('#btn-edit')).toHaveLength(1);
  });

  it('should show edit popup when click edit button', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(popup) => {
          // Then
          expect(popup.type).toBe(EditAnimePopup);
        }}
      />
    );
    wrapper.find('#btn-edit').simulate('click');
  });

  it('should show clipboard popup when click share button and cannot share', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(popup) => {
          // Then
          expect(popup.type).toBe(ClipboardPopup);
        }}
      />
    );
    wrapper.find('#btn-share').simulate('click');
  });

  it('should not show clipboard popup when click share button and can share', () => {
    // Given
    navigator.share = jest.fn((data) => {
      expect(data).toStrictEqual({
        title: 'Princess Connect! Re:Dive',
        url: 'https://shumiq-anime.netlify.app/.netlify/functions/api/v1/share/352',
      });
    });
    UserDetail.isAdmin.mockReturnValue(true);
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    wrapper.find('#btn-share').simulate('click');
  });

  it('should not show edit button if not admin', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(false);
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    // Then
    expect(wrapper.find('#btn-edit')).toHaveLength(0);
  });

  it('should show plus button and glow border in view row if there is any unview episode and login as admin', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    // Then
    expect(wrapper.find('#btn-add-view')).toHaveLength(1);
    expect(wrapper.find('.card').find('.border')).toHaveLength(1);
  });

  it('should not show plus button and glow border in view row if all episodes are viewed', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    const mockAnime = mockDatabase.animeList[1];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    // Then
    expect(wrapper.find('#btn-add-view')).toHaveLength(0);
    expect(wrapper.find('.card').find('.border')).toHaveLength(0);
  });

  it('should not show plus button and glow border if not admin', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(false);
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    // Then
    expect(wrapper.find('#btn-add-view')).toHaveLength(0);
    expect(wrapper.find('.card').find('.border')).toHaveLength(0);
  });

  it('should show plus button in download row if there is any undownload episode and admin', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    // Then
    expect(wrapper.find('#btn-add-download')).toHaveLength(1);
  });

  it('should not show plus button in download row if all episodes are downloaded', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    const mockAnime = mockDatabase.animeList[1];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    // Then
    expect(wrapper.find('#btn-add-download')).toHaveLength(0);
  });

  it('should not show plus button in download row if not admin', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(false);
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    // Then
    expect(wrapper.find('#btn-add-download')).toHaveLength(0);
  });

  it('should enable internal folder button if there is both google drive id and google photo id', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    let mockAnime = mockDatabase.animeList[0];
    mockAnime.gdriveid_public = 'driveid';
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    const internalFolderButton = wrapper.find('#btn-folder-internal').first();
    // Then
    expect(internalFolderButton.find('.disabled')).toHaveLength(0);
  });

  it('should call googledrive api and googlephotoapi when click internal folder button', async () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    GoogleDriveApi.getFiles.mockResolvedValue([{ name: 'name', id: 'id' }]);
    GooglePhotoApi.getMedias.mockResolvedValue([
      { filename: 'name', productUrl: 'url' },
    ]);
    let mockAnime = mockDatabase.animeList[0];
    mockAnime.gdriveid_public = 'driveid';
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} setPopup={() => {}} />);
    // When
    await act(async () => {
      wrapper.find('#btn-folder-internal').simulate('click');
    });
    // Then
    expect(GoogleDriveApi.getFiles).toHaveBeenCalledWith('driveid');
    expect(GooglePhotoApi.getMedias).toHaveBeenCalledWith(mockAnime.gphotoid);
  });

  it('should disable internal folder button if there is neither google drive id nor google photo id', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    const mockAnime = mockDatabase.animeList[1];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    const internalFolderButton = wrapper.find('#btn-folder-internal').first();
    // Then
    expect(internalFolderButton.find('.disabled')).toHaveLength(1);
  });

  it('should enable download button if there is download url', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    const downloadButton = wrapper.find('#btn-download').first();
    // Then
    expect(downloadButton.find('.disabled')).toHaveLength(0);
  });

  it('should disable download button if there is no download url', () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    const mockAnime = mockDatabase.animeList[1];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    const downloadButton = wrapper.find('#btn-download').first();
    // Then
    expect(downloadButton.find('.disabled')).toHaveLength(1);
  });

  it('should call AnilistApi when click show info button', async () => {
    // Given
    const mockAnime = mockDatabase.animeList[1];
    const wrapper = mount(<AnimeCard anime={mockAnime} setPopup={() => {}} />);
    const showInfoButton = wrapper.find('#btn-show-info');
    // When
    await act(async () => {
      showInfoButton.simulate('click');
    });
    // Then
    expect(AnilistApi.getAnime).toHaveBeenCalledWith(
      mockAnime.title,
      mockAnime.blacklist
    );
  });

  it('should call Database.update.anime when click plus button to increase view', async () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    const mockAnime = mockDatabase.animeList[0];
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    const addViewButton = wrapper.find('#btn-add-view').first();
    // When
    await act(async () => {
      addViewButton.simulate('click');
    });
    // Then
    let expectedAnime = mockAnime;
    expectedAnime.view++;
    expect(Database.update.anime).toHaveBeenCalledWith(
      mockAnime.key,
      expectedAnime
    );
  });

  it('should call Database.update.anime when click plus button to increase download', async () => {
    // Given
    UserDetail.isAdmin.mockReturnValue(true);
    const mockAnime = mockDatabase.animeList[0];
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    const addViewButton = wrapper.find('#btn-add-download').first();
    // When
    await act(async () => {
      addViewButton.simulate('click');
    });
    // Then
    let expectedAnime = mockAnime;
    expectedAnime.download++;
    expect(Database.update.anime).toHaveBeenCalledWith(
      mockAnime.key,
      expectedAnime
    );
  });

  it('should set auto layout', () => {
    // Given
    getLocalStorage.mockReturnValue('auto');
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    // Then
    expect(wrapper.html()).toContain(CardLayout.auto);
  });

  it('should set small layout', () => {
    // Given
    getLocalStorage.mockReturnValue('small');
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    // Then
    expect(wrapper.html()).toContain(CardLayout.small);
  });

  it('should set medium layout', () => {
    // Given
    getLocalStorage.mockReturnValue('medium');
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    // Then
    expect(wrapper.html()).toContain(CardLayout.medium);
  });

  it('should set large layout', () => {
    // Given
    getLocalStorage.mockReturnValue('large');
    const mockAnime = mockDatabase.animeList[0];
    // When
    const wrapper = mount(<AnimeCard anime={mockAnime} />);
    // Then
    expect(wrapper.html()).toContain(CardLayout.large);
  });
});
