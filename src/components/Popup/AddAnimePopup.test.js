import AddAnimePopup from './AddAnimePopup';
import React from 'react';
import { mount } from 'enzyme';

describe('<AddAnimePopup />', () => {
  it('should not show when show props is false', () => {
    const wrapper = mount(<AddAnimePopup show={false} setShow={null} />);
    expect(wrapper.find('div.modal')).toHaveLength(0);
  });

  it('should have input and button', () => {
    const wrapper = mount(<AddAnimePopup show={true} setShow={null} />);
    expect(wrapper.find('div.modal').find('input')).toHaveLength(1);
    expect(wrapper.find('div.modal').find('button')).toHaveLength(1);
  });
});
