import React from 'react';
import { shallow } from 'enzyme';
import Navbar from './Navbar';
import { IsAdmin } from '../../utils/userdetail';
import { getLocalStorage, setLocalStorage } from '../../utils/localstorage';

jest.mock('../../utils/userdetail');
jest.mock('../../utils/localstorage');

describe('<Navbar />', () => {

    it('should render navbar links', () => {
        const wrapper = shallow(<Navbar />);
        expect(wrapper.exists('Link')).toEqual(true);
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

    it('should change layout from auto to small', () => {
        getLocalStorage.mockReturnValue('auto');
        const wrapper = shallow(<Navbar />);
        wrapper.find('#btn-layout').simulate('click');
        expect(setLocalStorage).toHaveBeenCalledWith('layout', 'small');
    });

    it('should change layout from small to medium', () => {
        getLocalStorage.mockReturnValue('small');
        const wrapper = shallow(<Navbar />);
        wrapper.find('#btn-layout').simulate('click');
        expect(setLocalStorage).toHaveBeenCalledWith('layout', 'medium');
    });

    it('should change layout from medium to large', () => {
        getLocalStorage.mockReturnValue('medium');
        const wrapper = shallow(<Navbar />);
        wrapper.find('#btn-layout').simulate('click');
        expect(setLocalStorage).toHaveBeenCalledWith('layout', 'large');
    });

    it('should change layout from large to auto', () => {
        getLocalStorage.mockReturnValue('large');
        const wrapper = shallow(<Navbar />);
        wrapper.find('#btn-layout').simulate('click');
        expect(setLocalStorage).toHaveBeenCalledWith('layout', 'auto');
    });
});
