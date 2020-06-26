import React from 'react';
import { mount } from 'enzyme';
import GeneralPopup from './GeneralPopup';

describe('<GeneralPopup />', () => {
  it('should show message in popup', () => {
    const wrapper = mount(
      <GeneralPopup
        message="test_message"
        show={true}
        onClose={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal').contains('test_message')).toBe(true);
  });
});