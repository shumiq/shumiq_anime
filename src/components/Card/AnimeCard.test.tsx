import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import React from 'react';
import mockDatabase from '../../mock/database.json';
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
  const flushPromises = () => new Promise(setImmediate);

  it('should show correct infomation', () => {
    // Given
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // Then
    expect(wrapper.text()).toContain(mockAnime.title);
  });

  it('should show edit button if admin', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // Then
    expect(wrapper.find('#btn-edit')).toHaveLength(1);
  });

  it('should show edit popup when click edit button', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(popup) => {
          // Then
          expect((popup as JSX.Element).type).toBe(EditAnimePopup);
        }}
      />
    );
    wrapper.find('#btn-edit').simulate('click');
  });

  it('should show clipboard popup when click share button and cannot share', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(popup) => {
          // Then
          expect((popup as JSX.Element).type).toBe(ClipboardPopup);
        }}
      />
    );
    wrapper.find('#btn-share').simulate('click');
  });

  it('should not show clipboard popup when click share button and can share', () => {
    // Given
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    /* eslint-disable  @typescript-eslint/no-unsafe-call */
    /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
    (navigator as any).share = jest.fn((data) => {
      expect(data).toStrictEqual({
        title: 'Princess Connect! Re:Dive',
        url:
          'https://shumiq-anime.netlify.app/.netlify/functions/api/v1/share/abc352',
      });
    });
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    wrapper.find('#btn-share').simulate('click');
  });

  it('should not show edit button if not admin', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(false);
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // Then
    expect(wrapper.find('#btn-edit')).toHaveLength(0);
  });

  it('should show plus button and glow border in view row if there is any unview episode and login as admin', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // Then
    expect(wrapper.find('#btn-add-view')).toHaveLength(1);
    expect(wrapper.find('.card').find('.border')).toHaveLength(1);
  });

  it('should not show plus button and glow border in view row if all episodes are viewed', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc350'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // Then
    expect(wrapper.find('#btn-add-view')).toHaveLength(0);
    expect(wrapper.find('.card').find('.border')).toHaveLength(0);
  });

  it('should not show plus button and glow border if not admin', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(false);
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // Then
    expect(wrapper.find('#btn-add-view')).toHaveLength(0);
    expect(wrapper.find('.card').find('.border')).toHaveLength(0);
  });

  it('should show plus button in download row if there is any undownload episode and admin', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // Then
    expect(wrapper.find('#btn-add-download')).toHaveLength(1);
  });

  it('should not show plus button in download row if all episodes are downloaded', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc350'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // Then
    expect(wrapper.find('#btn-add-download')).toHaveLength(0);
  });

  it('should not show plus button in download row if not admin', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(false);
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // Then
    expect(wrapper.find('#btn-add-download')).toHaveLength(0);
  });

  it('should enable internal folder button if there is both google drive id and google photo id', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc352'];
    mockAnime.gdriveid_public = 'driveid';
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    const internalFolderButton = wrapper.find('#btn-folder-internal').first();
    // Then
    expect(internalFolderButton.find('.disabled')).toHaveLength(0);
  });

  it('should call googledrive api and googlephotoapi when click internal folder button', async () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    (GoogleDriveApi.getFiles as jest.Mock).mockResolvedValue([
      { name: 'name', id: 'id' },
    ]);
    (GooglePhotoApi.getMedias as jest.Mock).mockResolvedValue([
      { filename: 'name', productUrl: 'url' },
    ]);
    const mockAnime = mockDatabase.animeList['abc352'];
    mockAnime.gdriveid_public = 'driveid';
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // When
    act(() => {
      wrapper.find('#btn-folder-internal').simulate('click');
    });
    await flushPromises();
    // Then
    expect(GoogleDriveApi.getFiles).toHaveBeenCalledWith('driveid');
    expect(GooglePhotoApi.getMedias).toHaveBeenCalledWith(mockAnime.gphotoid);
  });

  it('should disable internal folder button if there is neither google drive id nor google photo id', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc350'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    const internalFolderButton = wrapper.find('#btn-folder-internal').first();
    // Then
    expect(internalFolderButton.find('.disabled')).toHaveLength(1);
  });

  it('should enable download button if there is download url', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    const downloadButton = wrapper.find('#btn-download').first();
    // Then
    expect(downloadButton.find('.disabled')).toHaveLength(0);
  });

  it('should disable download button if there is no download url', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc350'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    const downloadButton = wrapper.find('#btn-download').first();
    // Then
    expect(downloadButton.find('.disabled')).toHaveLength(1);
  });

  it('should call AnilistApi when click show info button', () => {
    // Given
    const mockAnime = { ...mockDatabase.animeList['abc350'], blacklist: [1] };
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    const showInfoButton = wrapper.find('#btn-show-info');
    // When
    act(() => {
      showInfoButton.simulate('click');
    });
    // Then
    expect(AnilistApi.getAnime).toHaveBeenCalledWith(
      mockAnime.title,
      mockAnime.blacklist
    );
  });

  it('should call Database.update.anime when click plus button to increase view', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc352'];
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    const addViewButton = wrapper.find('#btn-add-view').first();
    // When
    act(() => {
      addViewButton.simulate('click');
    });
    // Then
    const expectedAnime = mockAnime;
    expectedAnime.view++;
    expect(Database.update.anime).toHaveBeenCalledWith(
      mockAnime.key,
      expectedAnime
    );
  });

  it('should call Database.update.anime when click plus button to increase download', () => {
    // Given
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const mockAnime = mockDatabase.animeList['abc352'];
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    const addViewButton = wrapper.find('#btn-add-download').first();
    // When
    act(() => {
      addViewButton.simulate('click');
    });
    // Then
    const expectedAnime = mockAnime;
    expectedAnime.download++;
    expect(Database.update.anime).toHaveBeenCalledWith(
      mockAnime.key,
      expectedAnime
    );
  });

  it('should set auto layout', () => {
    // Given
    (getLocalStorage as jest.Mock).mockReturnValue('auto');
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // Then
    expect(wrapper.html()).toContain(CardLayout.auto);
  });

  it('should set small layout', () => {
    // Given
    (getLocalStorage as jest.Mock).mockReturnValue('small');
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // Then
    expect(wrapper.html()).toContain(CardLayout.small);
  });

  it('should set medium layout', () => {
    // Given
    (getLocalStorage as jest.Mock).mockReturnValue('medium');
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // Then
    expect(wrapper.html()).toContain(CardLayout.medium);
  });

  it('should set large layout', () => {
    // Given
    (getLocalStorage as jest.Mock).mockReturnValue('large');
    const mockAnime = mockDatabase.animeList['abc352'];
    // When
    const wrapper = mount(
      <AnimeCard
        anime={mockAnime}
        setPopup={(): void => {
          return;
        }}
      />
    );
    // Then
    expect(wrapper.html()).toContain(CardLayout.large);
  });
});
