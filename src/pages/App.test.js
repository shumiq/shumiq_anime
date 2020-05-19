import App from './App';
import Anime from './Anime/Anime';
import React from 'react';
import { mount } from 'enzyme';

jest.mock('./Anime/Anime');

describe('router should redirect to correct path', () => {
  it('should redirect to anime as default', () => {
    Anime.mockReturnValue(null);
    const wrapper = mount(<App />);
    expect(wrapper.find(Anime)).toHaveLength(1);
  });
});
