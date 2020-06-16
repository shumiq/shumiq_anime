import React from 'react';
import { mount } from 'enzyme';
import InputPopup from './InputPopup';

describe('<InputPopup />', () => {
  it('should not show when show props is false', () => {
    const wrapper = mount(
      <InputPopup
        default={''}
        callback={() => {
          return;
        }}
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
      <InputPopup
        default={''}
        callback={() => {
          return;
        }}
        show={true}
        setShow={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal').find('input')).toHaveLength(1);
    expect(wrapper.find('div.modal').find('button')).toHaveLength(2);
  });

  it('should callback with input value when click save', () => {
    const wrapper = mount(
      <InputPopup
        default={''}
        callback={(input) => {
          expect(input).toEqual('test');
        }}
        show={true}
        setShow={() => {
          return;
        }}
      />
    );
    wrapper
      .find('div.modal')
      .find('input.form-control')
      .simulate('change', { target: { value: 'test' } });
    wrapper.find('div.modal').find('#btn-save').simulate('click');
  });
});
