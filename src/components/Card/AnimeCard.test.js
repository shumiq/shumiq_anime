import React from 'react';
import { mount } from 'enzyme';
import AnimeCard from './AnimeCard';
import mockDatabase from '../../mock/database'
import { IsAdmin } from '../../utils/userDetail';

jest.mock('../../utils/userDetail');

describe('<AnimeCard />', () => {

    it('should show correct infomation', () => {
        const mockAnime = mockDatabase.animelist[0];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        expect(wrapper.text()).toContain(mockAnime.title);
    });

    it('should show plus button in view row if there is any unview episode and login as admin', () => {
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[0];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const expectText = mockAnime.view + '/' + mockAnime.download + '+'
        expect(wrapper.text()).toContain(expectText);
    });

    it('should not show plus button in view row if all episodes are viewed', () => {
        const mockAnime = mockDatabase.animelist[1];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const expectText = mockAnime.view + '/' + mockAnime.download + '+'
        expect(wrapper.text()).not.toContain(expectText);
    });

    it('should not show plus button if not admin', () => {
        const mockAnime = mockDatabase.animelist[0];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const expectText = mockAnime.view + '/' + mockAnime.download + '+'
        expect(wrapper.text()).not.toContain(expectText);
    });

    it('should show plus button in download row if there is any undownload episode and admin', () => {
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[0];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const expectText = mockAnime.download + '/' + mockAnime.all_episode + '+'
        expect(wrapper.text()).toContain(expectText);
    });

    it('should not show plus button in download row if all episodes are downloaded', () => {
        const mockAnime = mockDatabase.animelist[1];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const expectText = mockAnime.download + '/' + mockAnime.all_episode + '+'
        expect(wrapper.text()).not.toContain(expectText);
    });

    it('should not show plus button in download row if not admin', () => {
        const mockAnime = mockDatabase.animelist[0];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const expectText = mockAnime.download + '/' + mockAnime.all_episode + '+'
        expect(wrapper.text()).not.toContain(expectText);
    });

    it('should enable google photo button if there is google photo url', () => {
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[0];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const googlePhotoButton = wrapper.find('.btn').at(wrapper.find('.btn').length - 2);
        expect(googlePhotoButton.find('.disabled').length).toBe(0);
    });

    it('should disable google photo button if there is no google photo url', () => {
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[1];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const googlePhotoButton = wrapper.find('.btn').at(wrapper.find('.btn').length - 2);
        expect(googlePhotoButton.find('.disabled').length).toBe(1);
    });

    it('should enable download button if there is download url', () => {
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[0];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const googlePhotoButton = wrapper.find('.btn').at(wrapper.find('.btn').length - 1);
        expect(googlePhotoButton.find('.disabled').length).toBe(0);
    });

    it('should disable download button if there is no download url', () => {
        IsAdmin.mockReturnValue(true);
        const mockAnime = mockDatabase.animelist[1];
        const wrapper = mount(<AnimeCard anime={mockAnime} />);
        const googlePhotoButton = wrapper.find('.btn').at(wrapper.find('.btn').length - 1);
        expect(googlePhotoButton.find('.disabled').length).toBe(1);
    });
});
