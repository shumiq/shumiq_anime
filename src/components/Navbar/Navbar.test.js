import React from 'react';
import { shallow } from 'enzyme';
import Navbar from './Navbar';
import { IsAdmin } from '../../utils/userdetail';

jest.mock('../../utils/userdetail');

describe('<Navbar />', () => {

    it('should render navbar links', () => {
        const wrapper = shallow(<Navbar />);
        expect(wrapper.exists('a')).toEqual(true);
    });

    it('should see admin link when login as admin', () => {
        IsAdmin.mockReturnValue(true);
        const wrapper = shallow(<Navbar />);
        expect(wrapper.contains('Sync Anime')).toEqual(true);
    });

    it('should not see admin link when not login as admin', () => {
        IsAdmin.mockReturnValue(false);
        const wrapper = shallow(<Navbar />);
        expect(wrapper.contains('Sync Anime')).toEqual(false);
    });

    it('should see anime related link when current page is anime related', () => {
        IsAdmin.mockReturnValue(true);
        const wrapper = shallow(<Navbar />);
        wrapper.find('#link-logo').simulate('click');
        expect(wrapper.contains('Sync Anime')).toEqual(true);
        wrapper.find('#link-anime').simulate('click');
        expect(wrapper.contains('Sync Anime')).toEqual(true);
        wrapper.find('#link-sync').simulate('click');
        expect(wrapper.contains('Sync Anime')).toEqual(true);
    });

    it('should see not anime related link when current page is not anime related', () => {
        IsAdmin.mockReturnValue(true);
        const wrapper = shallow(<Navbar />);
        wrapper.find('#link-keyaki').simulate('click');
        expect(wrapper.contains('Sync Anime')).toEqual(false);
        wrapper.find('#link-conan').simulate('click');
        expect(wrapper.contains('Sync Anime')).toEqual(false);
    });
});
