import React from 'react';
import { shallow } from 'enzyme';
import Home from './Home';
import { getLocalStorage } from '../../utils/localstorage'
import mockDatabase from '../../mock/database'

jest.mock('../../utils/localstorage');

describe('<Home />', () => {
    it('should show correct anime card', () => {
        getLocalStorage.mockReturnValue(JSON.stringify(mockDatabase));
        const wrapper = shallow(<Home />);
        expect(wrapper.find('AnimeCard')).toHaveLength(2);
    });
});
