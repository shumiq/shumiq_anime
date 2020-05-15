import React from 'react';
import { shallow } from 'enzyme';
import Sync from './Sync';
import { getLocalStorage } from '../../utils/localstorage'
import mockDatabase from '../../mock/database'
import GooglePhotoApi from '../../api/googlephoto';
import { SaveAnime } from '../../utils/firebase';

jest.mock('../../utils/localstorage');
jest.mock('../../api/googlephoto');
jest.mock('../../utils/firebase');
jest.mock('../../api/googledrive');

describe('<Sync />', () => {

    const flushPromises = () => new Promise(setImmediate);

    it('should show 2 rows', () => {
        // Given
        getLocalStorage.mockReturnValue(mockDatabase);
        // When
        const wrapper = shallow(<Sync />);
        // Then
        expect(wrapper.find('.row-anime')).toHaveLength(2);
    });

    it('should show correct information & buttons after load from google photo', async () => {
        // Given
        getLocalStorage.mockReturnValue(mockDatabase);
        GooglePhotoApi.getAlbums.mockResolvedValue({
            albums: [
                { id: mockDatabase.animelist[0].gphotoid, mediaItemsCount: 2 },
                { id: mockDatabase.animelist[1].gphotoid, mediaItemsCount: 2 }
            ]
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
        getLocalStorage.mockReturnValue(mockDatabase);
        GooglePhotoApi.getAlbums.mockResolvedValue({
            albums: [
                { id: mockDatabase.animelist[0].gphotoid, mediaItemsCount: 2 },
                { id: mockDatabase.animelist[1].gphotoid, mediaItemsCount: 2 }
            ]
        });
        GooglePhotoApi.getMedias.mockResolvedValue([]);
        const wrapper = shallow(<Sync />);
        // When
        wrapper.find('#btn-load-more').simulate('click');
        await flushPromises();
        wrapper.find('.row-anime').at(0).find('#btn-update').simulate('click');
        await flushPromises();
        // Then
        let updatedAnime = mockDatabase.animelist[1];
        updatedAnime.download = 2
        expect(SaveAnime).toHaveBeenCalledWith(updatedAnime.key, updatedAnime);
    });

    it('should called save anime when unsync', async () => {
        // Given
        getLocalStorage.mockReturnValue(mockDatabase);
        GooglePhotoApi.getAlbums.mockResolvedValue({
            albums: [
                { id: mockDatabase.animelist[0].gphotoid, mediaItemsCount: 2 },
                { id: mockDatabase.animelist[1].gphotoid, mediaItemsCount: 2 }
            ]
        });
        window.confirm = jest.fn(() => true);
        const wrapper = shallow(<Sync />);
        // When
        wrapper.find('.row-anime').at(0).find('#btn-unsync').simulate('click');
        await flushPromises();
        // Then
        let updatedAnime = mockDatabase.animelist[1];
        updatedAnime.gphotoid = null;
        expect(SaveAnime).toHaveBeenCalledWith(updatedAnime.key, updatedAnime);
    });
});
