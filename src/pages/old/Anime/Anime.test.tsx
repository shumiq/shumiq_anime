import { getLocalStorage } from '../../../utils/localstorage';
import mockDatabase from '../../../mock/database.json';
import Anime from './Anime';
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Database } from '../../../utils/types';

jest.mock('../../utils/localstorage');

describe('<Anime />', () => {
  it('should show latest season anime cards', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(
      (mockDatabase as unknown) as Database
    );
    const wrapper = mount(
      <MemoryRouter>
        <Anime />
      </MemoryRouter>
    );
    expect(wrapper.find('AnimeCard')).toHaveLength(1);
  });
});
