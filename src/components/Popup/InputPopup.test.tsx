import React from 'react';
import { mount } from 'enzyme';
import InputPopup from './InputPopup';

describe('<InputPopup />', () => {
  it('should have input and button', () => {
    const wrapper = mount(
      <InputPopup
        default={''}
        callback={() => {
          return;
        }}
        show={true}
        onClose={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal').find('input')).toHaveLength(1);
    expect(wrapper.find('div.modal').find('button')).toHaveLength(1);
  });

  it('should callback with input value when click save', () => {
    const wrapper = mount(
      <InputPopup
        default={''}
        callback={(input) => {
          expect(input).toEqual('test');
        }}
        show={true}
        onClose={() => {
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
