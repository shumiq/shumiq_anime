import React from 'react';
import { mount } from 'enzyme';
import Login from './Login';
import { getUser } from '../../utils/userDetail';

jest.mock('../../utils/userDetail');

describe('<Login />', () => {

    const mockUser = {
        "googleId": "114454683436583523755",
        "imageUrl": "https://lh3.googleusercontent.com/a-/AOh14GgsVLfTUYX6iP-CJgQkesmfIKifakSJc6PoOKVy-VQ=s96-c",
        "email": "iq.at.sk131@gmail.com",
        "name": "Santiphap Watcharasukchit",
        "givenName": "Santiphap",
        "familyName": "Watcharasukchit"
    };

    it('should show login button when no user', () => {
        getUser.mockReturnValue(null);
        const wrapper = mount(<Login />);
        expect(wrapper.text()).toContain('Login');
    });

    it('should not show login button when have user', () => {
        getUser.mockReturnValue(mockUser);
        const wrapper = mount(<Login />);
        expect(wrapper.text()).not.toContain('Login');
    });
});
