import GeneralPopup from './GeneralPopup';
import React from 'react';
import { mount } from 'enzyme';

describe('<GeneralPopup />', () => {
  it('should not show when show props is false', () => {
    const wrapper = mount(
      <GeneralPopup message="test_message" show={false} setShow={null} />
    );
    expect(wrapper.find('div.modal')).toHaveLength(0);
  });

  it('should show message in popup', () => {
    const wrapper = mount(
      <GeneralPopup message="test_message" show={true} setShow={null} />
    );
    expect(wrapper.find('div.modal').contains('test_message')).toBe(true);
  });
});
