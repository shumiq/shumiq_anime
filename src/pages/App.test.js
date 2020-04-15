import React from 'react';
import { mount } from 'enzyme';
import App from './App';
import Home from './Home/Home';

jest.mock('./Home/Home');

describe('router should redirect to correct path', () => {

    it('should redirect to homepage as default', () => {
        Home.mockReturnValue(null);
        const wrapper = mount(<App />);
        expect(wrapper.find(Home)).toHaveLength(1);
    });

});
