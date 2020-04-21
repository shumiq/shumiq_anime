import React from 'react';
import { shallow } from 'enzyme';
import Anime from './Anime';
import { getLocalStorage } from '../../utils/localstorage'
import mockDatabase from '../../mock/database'

jest.mock('../../utils/localstorage');

describe('<Anime />', () => {
    it('should show latest season anime cards', () => {
        getLocalStorage.mockReturnValue(mockDatabase);
        const wrapper = shallow(<Anime />);
        expect(wrapper.find('AnimeCard')).toHaveLength(1);
    });
});
