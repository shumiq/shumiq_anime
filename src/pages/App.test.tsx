import React from 'react';
import { mount } from 'enzyme';
import App from './App';
import Anime from './Anime/Anime';

jest.mock('./Anime/Anime');

describe('router should redirect to correct path', () => {
  it('should redirect to anime as default', () => {
    (Anime as unknown as jest.Mock).mockReturnValue(null);
    const wrapper = mount(<App />);
    expect(wrapper.find(Anime)).toHaveLength(1);
  });
});
