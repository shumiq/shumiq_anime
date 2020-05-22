import InputPopup from './InputPopup';
import React from 'react';
import { mount } from 'enzyme';

describe('<InputPopup />', () => {
  it('should not show when show props is false', () => {
    const wrapper = mount(
      <InputPopup
        default={''}
        callback={() => {}}
        show={false}
        setShow={null}
      />
    );
    expect(wrapper.find('div.modal')).toHaveLength(0);
  });

  it('should have input and button', () => {
    const wrapper = mount(
      <InputPopup default={''} callback={() => {}} show={true} setShow={null} />
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
        setShow={() => {}}
      />
    );
    wrapper
      .find('div.modal')
      .find('input.form-control')
      .simulate('change', { target: { value: 'test' } });
    wrapper.find('div.modal').find('button').simulate('click');
  });
});
