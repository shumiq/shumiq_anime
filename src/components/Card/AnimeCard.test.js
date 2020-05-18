import React from 'react';
import { mount } from 'enzyme';
import AnimeCard from './AnimeCard';
import mockDatabase from '../../mock/database'
import { IsAdmin } from '../../utils/userdetail';
import AnilistApi from '../../api/anilist';
import { SaveAnime } from '../../utils/firebase';
import { act } from 'react-dom/test-utils';
import { getLocalStorage } from '../../utils/localstorage';
import { CardLayout } from '../../utils/enum';
import GoogleDriveApi from '../../api/googledrive';
import GooglePhotoApi from '../../api/googlephoto';

jest.mock('../../utils/userdetail');
jest.mock('../../api/anilist');
jest.mock('../../api/googledrive');
jest.mock('../../api/googlephoto');
jest.mock('../../utils/firebase');
jest.mock('../../utils/localstorage');

describe('<AnimeCard />', () => {

    it('should show correct infomation', () => {
        // Given
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.text()).toContain(mockAnime.title);
    });

    it('should show edit button if admin', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.find('#btn-edit')).toHaveLength(1);
    });

    it('should not show edit button if not admin', () => {
        // Given
        IsAdmin.mockReturnValue(false);
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.find('#btn-edit')).toHaveLength(0);
    });

    it('should show plus button and glow border in view row if there is any unview episode and login as admin', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.find('#btn-add-view')).toHaveLength(1);
        expect(wrapper.find('.card').find('.border')).toHaveLength(1);
    });

    it('should not show plus button and glow border in view row if all episodes are viewed', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[1];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.find('#btn-add-view')).toHaveLength(0);
        expect(wrapper.find('.card').find('.border')).toHaveLength(0);
    });

    it('should not show plus button and glow border if not admin', () => {
        // Given
        IsAdmin.mockReturnValue(false);
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.find('#btn-add-view')).toHaveLength(0);
        expect(wrapper.find('.card').find('.border')).toHaveLength(0);
    });

    it('should show plus button in download row if there is any undownload episode and admin', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.find('#btn-add-download')).toHaveLength(1);
    });

    it('should not show plus button in download row if all episodes are downloaded', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[1];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.find('#btn-add-download')).toHaveLength(0);
    });

    it('should not show plus button in download row if not admin', () => {
        // Given
        IsAdmin.mockReturnValue(false);
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.find('#btn-add-download')).toHaveLength(0);
    });

    it('should enable internal folder button if there is both google drive id and google photo id', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        let mockAnime = mockDatabase.animelist[0];
        mockAnime.gdriveid_public = 'driveid'
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const internalFolderButton = wrapper.find('#btn-folder-internal').first();
        // Then
        expect(internalFolderButton.find('.disabled')).toHaveLength(0);
    });

    it('should call googledrive api and googlephotoapi when click internal folder button', async () => {
        // Given
        IsAdmin.mockReturnValue(true);
        GoogleDriveApi.getFiles.mockResolvedValue([{ name: 'name', id: 'id' }]);
        GooglePhotoApi.getMedias.mockResolvedValue([{ filename: 'name', productUrl: 'url' }]);
        let mockAnime = mockDatabase.animelist[0];
        mockAnime.gdriveid_public = 'driveid'
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
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
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[1];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const internalFolderButton = wrapper.find('#btn-folder-internal').first();
        // Then
        expect(internalFolderButton.find('.disabled')).toHaveLength(1);
    });

    // it('should enable google photo button if there is google photo url', () => {
    //     // Given
    //     IsAdmin.mockReturnValue(true);
    //     const mockAnime = mockDatabase.animelist[0];
    //     // When
    //     const wrapper = mount(<AnimeCard anime={mockAnime} />);
    //     const googlePhotoButton = wrapper.find('#btn-gphoto').first();
    //     // Then
    //     expect(googlePhotoButton.find('.disabled')).toHaveLength(0);
    // });

    // it('should disable google photo button if there is no google photo url', () => {
    //     // Given
    //     IsAdmin.mockReturnValue(true);
    //     const mockAnime = mockDatabase.animelist[1];
    //     // When
    //     const wrapper = mount(<AnimeCard anime={mockAnime} />);
    //     const googlePhotoButton = wrapper.find('#btn-gphoto').first();
    //     // Then
    //     expect(googlePhotoButton.find('.disabled')).toHaveLength(1);
    // });

    it('should enable download button if there is download url', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const downloadButton = wrapper.find('#btn-download').first();
        // Then
        expect(downloadButton.find('.disabled')).toHaveLength(0);
    });

    it('should disable download button if there is no download url', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[1];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const downloadButton = wrapper.find('#btn-download').first();
        // Then
        expect(downloadButton.find('.disabled')).toHaveLength(1);
    });

    it('should all AnilistApi when click show info button', async () => {
        // Given
        const mockAnime = mockDatabase.animelist[1];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const showInfoButton = wrapper.find('#btn-show-info');
        // When
        await act(async () => {
            showInfoButton.simulate('click');
        });
        // Then
        expect(AnilistApi.getAnime).toHaveBeenCalledWith(mockAnime.title, mockAnime.blacklist);
    });

    it('should call SaveAnime when click plus button to increase view', async () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[0];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const addViewButton = wrapper.find('#btn-add-view').first();
        // When
        await act(async () => {
            addViewButton.simulate('click');
        });
        // Then
        let expectedAnime = mockAnime;
        expectedAnime.view++;
        expect(SaveAnime).toHaveBeenCalledWith(mockAnime.key, expectedAnime);
    });

    it('should call SaveAnime when click plus button to increase download', async () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[0];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const addViewButton = wrapper.find('#btn-add-download').first();
        // When
        await act(async () => {
            addViewButton.simulate('click');
        });
        // Then
        let expectedAnime = mockAnime;
        expectedAnime.download++;
        expect(SaveAnime).toHaveBeenCalledWith(mockAnime.key, expectedAnime);
    });

    it('should set auto layout', () => {
        // Given
        getLocalStorage.mockReturnValue('auto');
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.html()).toContain(CardLayout.auto);
    })

    it('should set small layout', () => {
        // Given
        getLocalStorage.mockReturnValue('small');
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.html()).toContain(CardLayout.small);
    })

    it('should set medium layout', () => {
        // Given
        getLocalStorage.mockReturnValue('medium');
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.html()).toContain(CardLayout.medium);
    })

    it('should set large layout', () => {
        // Given
        getLocalStorage.mockReturnValue('large');
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.html()).toContain(CardLayout.large);
    })
});
