import React from 'react';
import { mount } from 'enzyme';
import FilesPopup from './FilesPopup';
describe('<FilesPopup />', () => {
  it('should not show when show props is false', () => {
    const wrapper = mount(
      <FilesPopup driveUrl={''} photoUrl={''} show={false} setShow={null} />
    );
    expect(wrapper.find('div.modal')).toHaveLength(0);
  });

  it('should show both drive and photo button', () => {
    const mockDriveUrl = 'url';
    const mockPhotoUrl = 'url';
    const wrapper = mount(
      <FilesPopup
        driveUrl={mockDriveUrl}
        photoUrl={mockPhotoUrl}
        show={true}
        setShow={null}
      />
    );
    expect(wrapper.find('div.modal').find('.btn')).toHaveLength(2);
    expect(wrapper.find('div.modal').find('.disabled')).toHaveLength(0);
  });

  it('should disable drive button', () => {
    const mockDriveUrl = '';
    const mockPhotoUrl = 'url';
    const wrapper = mount(
      <FilesPopup
        driveUrl={mockDriveUrl}
        photoUrl={mockPhotoUrl}
        show={true}
        setShow={null}
      />
    );
    expect(wrapper.find('div.modal').find('.btn')).toHaveLength(2);
    expect(
      wrapper.find('div.modal').find('.btn').at(0).find('.disabled')
    ).toHaveLength(1);
  });

  it('should disable photo button', () => {
    const mockDriveUrl = 'url';
    const mockPhotoUrl = '';
    const wrapper = mount(
      <FilesPopup
        driveUrl={mockDriveUrl}
        photoUrl={mockPhotoUrl}
        show={true}
        setShow={null}
      />
    );
    expect(wrapper.find('div.modal').find('.btn')).toHaveLength(2);
    expect(
      wrapper.find('div.modal').find('.btn').at(1).find('.disabled')
    ).toHaveLength(1);
  });
});
