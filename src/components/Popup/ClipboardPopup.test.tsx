import React from 'react';
import { mount } from 'enzyme';
import ClipboardPopup from './ClipboardPopup';

describe('<ClipboardPopup />', () => {
  it('should not show when show props is false', () => {
    const wrapper = mount(
      <ClipboardPopup
        text={''}
        show={false}
        setShow={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal')).toHaveLength(0);
  });

  it('should have input and button', () => {
    const wrapper = mount(
      <ClipboardPopup
        text={'sample_url'}
        show={true}
        setShow={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal').find('input')).toHaveLength(1);
    const input = wrapper.find('div.modal').find('input').instance();
    expect(((input as unknown) as HTMLInputElement).value).toEqual(
      'sample_url'
    );
    expect(wrapper.find('div.modal').find('button')).toHaveLength(1);
  });

  it('should callback with input value when click save', () => {
    document.execCommand = jest.fn(() => true);
    const wrapper = mount(
      <ClipboardPopup
        text={'sample_url'}
        show={true}
        setShow={() => {
          return;
        }}
      />
    );
    wrapper.find('div.modal').find('button').simulate('click');
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});
