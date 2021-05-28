import { getLocalStorage } from '../../../utils/LocalStorage/LocalStorage';
import mockDatabase from '../../../models/mock/database.json';
import Anime from './Anime';
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Database } from '../../../models/Type';

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
