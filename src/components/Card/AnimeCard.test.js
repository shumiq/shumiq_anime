import React from 'react';
import { mount } from 'enzyme';
import AnimeCard from './AnimeCard';
import mockDatabase from '../../mock/database'
import { IsAdmin } from '../../utils/userDetail';
import AnilistApi from '../../api/anilist';
import { SaveAnime } from '../../utils/firebase';
import { act } from 'react-dom/test-utils';

jest.mock('../../utils/userDetail');
jest.mock('../../api/anilist');
jest.mock('../../utils/firebase');

describe('<AnimeCard />', () => {

    it('should show correct infomation', () => {
        // Given
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.text()).toContain(mockAnime.title);
    });

    it('should show plus button in view row if there is any unview episode and login as admin', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.find('#btn-add-view')).toHaveLength(1);
    });

    it('should not show plus button in view row if all episodes are viewed', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[1];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.find('#btn-add-view')).toHaveLength(0);
    });

    it('should not show plus button if not admin', () => {
        // Given
        IsAdmin.mockReturnValue(false);
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        // Then
        expect(wrapper.find('#btn-add-view')).toHaveLength(0);
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

    it('should enable google drive button if there is google drive id', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        let mockAnime = mockDatabase.animelist[0];
        mockAnime.gdriveid_public = 'driveid'
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const googleDriveButton = wrapper.find('#btn-gdrive').first();
        // Then
        expect(googleDriveButton.find('.disabled')).toHaveLength(0);
    });

    it('should disable google drive button if there is no google drive id', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[1];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const googleDriveButton = wrapper.find('#btn-gdrive').first();
        // Then
        expect(googleDriveButton.find('.disabled')).toHaveLength(1);
    });

    it('should enable google photo button if there is google photo url', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[0];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const googlePhotoButton = wrapper.find('#btn-gphoto').first();
        // Then
        expect(googlePhotoButton.find('.disabled')).toHaveLength(0);
    });

    it('should disable google photo button if there is no google photo url', () => {
        // Given
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[1];
        // When
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const googlePhotoButton = wrapper.find('#btn-gphoto').first();
        // Then
        expect(googlePhotoButton.find('.disabled')).toHaveLength(1);
    });

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
});
