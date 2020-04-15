import React from 'react';
import { shallow } from 'enzyme';
import Navbar from './Navbar';

describe('<Navbar />', () => {

    it('should render navbar links', () => {
        const wrapper = shallow(<Navbar />);
        expect(wrapper.exists('Link')).toEqual(true);
    });

    //   describe('not logged in', () => {

    //   });

    //   describe('logged in user', () => {

    //   });

    //   describe('logged in admin', () => {

    //   });
});
