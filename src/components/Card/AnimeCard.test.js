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

const mockAnilistApiGetAnime = { "id": 110547, "title": { "romaji": "Arte", "english": "Arte", "native": "\u30a2\u30eb\u30c6", "userPreferred": "Arte" }, "season": "SPRING", "description": "Florence, early 16th century. The birthplace of the renaissance era, where art is thriving. In one small corner of this vast city, one sheltered girl\u2019s journey begins. She dreams of becoming an artist, an impossible career for a girl born into a noble family. In those days, art was an exclusively male profession, with woman facing strong discrimination. In spite of these challenges, Arte perseveres with hard work and a positive attitude!<br>\n<br>\n(Source: Silent Manga Audition)", "startDate": { "year": 2020 }, "episodes": 12, "source": "MANGA", "coverImage": { "large": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx110547-TjB8wJRdnSaw.jpg", "medium": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx110547-TjB8wJRdnSaw.jpg" }, "bannerImage": "https://s4.anilist.co/file/anilistcdn/media/anime/banner/110547-uB6fv50H0hFU.jpg", "genres": ["Drama", "Romance"], "meanScore": 67, "averageScore": 66, "popularity": 8954, "relations": { "nodes": [{ "title": { "userPreferred": "Arte" }, "type": "MANGA" }] }, "studios": { "nodes": [{ "name": "Seven Arcs" }] }, "nextAiringEpisode": { "timeUntilAiring": 279225, "episode": 7 } }

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
        AnilistApi.getAnime.mockResolvedValue(mockAnilistApiGetAnime);
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
});
