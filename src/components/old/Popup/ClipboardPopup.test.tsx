import React from 'react';
import { mount } from 'enzyme';
import ClipboardPopup from './ClipboardPopup';

describe('<ClipboardPopup />', () => {
  it('should have input and button', () => {
    const wrapper = mount(
      <ClipboardPopup
        text={'sample_url'}
        show={true}
        onClose={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal').find('input')).toHaveLength(1);
    const input = wrapper.find('div.modal').find('input').instance();
    expect(((input as unknown) as HTMLInputElement).value).toEqual(
      'sample_url'
    );
    expect(wrapper.find('div.modal').find('#btn-copy')).toHaveLength(1);
  });

  it('should callback with input value when click save', () => {
    document.execCommand = jest.fn(() => true);
    const wrapper = mount(
      <ClipboardPopup
        text={'sample_url'}
        show={true}
        onClose={() => {
          return;
        }}
      />
    );
    wrapper.find('div.modal').find('#btn-copy').simulate('click');
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});
