import React from 'react';
import { shallow, mount } from 'enzyme';
import { getLocalStorage } from '../../utils/localstorage';
import mockDatabase from '../../mock/database.json';
import UserDetail from '../../utils/userdetail';
import GoogleDriveApi from '../../api/googledrive';
import GooglePhotoApi from '../../api/googlephoto';
import { Database } from '../../utils/firebase';
import Keyaki from './Keyaki';

jest.mock('../../utils/localstorage');
jest.mock('../../utils/userdetail');
jest.mock('../../api/googledrive');
jest.mock('../../api/googlephoto');
jest.mock('../../utils/firebase');

describe('<Keyaki />', () => {
  const flushPromises = () => new Promise(setImmediate);

  it('should show correct conan list', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    const wrapper = shallow(<Keyaki />);
    expect(wrapper.find('tr')).toHaveLength(3);
    expect(wrapper.find('tr').at(1).find('td').at(0).text()).toContain('1');
    expect(wrapper.find('tr').at(1).find('td').at(1).text()).toContain(
      'episode 1'
    );
    expect(wrapper.find('tr').at(1).find('td').at(2).find('.btn')).toHaveLength(
      2
    );
    expect(
      wrapper.find('tr').at(1).find('td').at(2).find('.btn').at(0).text()
    ).toContain('Thai');
    expect(
      wrapper.find('tr').at(1).find('td').at(2).find('.btn').at(1).text()
    ).toContain('Eng');
    expect(wrapper.find('tr').at(2).find('td').at(0).text()).toContain('2');
    expect(wrapper.find('tr').at(2).find('td').at(1).text()).toContain(
      'episode 2'
    );
    expect(wrapper.find('tr').at(2).find('td').at(2).find('.btn')).toHaveLength(
      1
    );
    expect(
      wrapper.find('tr').at(2).find('td').at(2).find('.btn').at(0).text()
    ).toContain('Thai');
  });

  it('should show FilesPopup when click episode button', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    const wrapper = shallow(<Keyaki />);
    const epButton = wrapper.find('.btn').at(0);
    epButton.simulate('click');
    expect(wrapper.find('FilesPopup')).toHaveLength(1);
  });

  it('should random to one case when click random button', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(false);
    window.HTMLElement.prototype.scrollIntoView = (): void => {
      return;
    };
    const wrapper = mount(<Keyaki />);
    wrapper.find('#btn-random').simulate('click');
    expect(wrapper.find('table').html()).toContain('bg-dark');
  });

  it('should not show update button when not admin', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(false);
    const wrapper = shallow(<Keyaki />);
    expect(wrapper.find('#btn-update')).toHaveLength(0);
  });

  it('should show update button when admin', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const wrapper = shallow(<Keyaki />);
    expect(wrapper.find('#btn-update')).toHaveLength(1);
  });

  it('should show loading popup when click update', async () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (GoogleDriveApi.getFiles as jest.Mock).mockResolvedValue([
      {
        name: 'Keyakitte Kakenai 02 Eng.mp4',
        id: 'thisisid1',
      },
      {
        name: 'Keyakitte Kakenai 03 Eng.mp4',
        id: 'thisisid2',
      },
    ]);
    (GooglePhotoApi.getMedias as jest.Mock).mockResolvedValue([
      {
        filename: 'Keyakitte Kakenai 02 Eng.mp4',
        productUrl: 'thisisurl1',
      },
      {
        filename: 'Keyakitte Kakenai 03 Eng.mp4',
        productUrl: 'thisisurl2',
      },
    ]);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const wrapper = shallow(<Keyaki />);
    wrapper.find('#btn-update').simulate('click');
    expect(
      (wrapper.find('GeneralPopup')?.props() as { show: boolean }).show
    ).toBe(true);
    await flushPromises();
    expect(
      (wrapper.find('GeneralPopup')?.props() as { show: boolean }).show
    ).toBe(false);
  });

  it('should call Database.update.keyaki after update', async () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (GoogleDriveApi.getFiles as jest.Mock).mockResolvedValue([
      {
        name: 'Keyakitte Kakenai 02 Eng.mp4',
        id: 'thisisid1',
      },
      {
        name: 'Keyakitte Kakenai 03 Eng.mp4',
        id: 'thisisid2',
      },
    ]);
    (GooglePhotoApi.getMedias as jest.Mock).mockResolvedValue([
      {
        filename: 'Keyakitte Kakenai 02 Eng.mp4',
        productUrl: 'thisisurl1',
      },
      {
        filename: 'Keyakitte Kakenai 03 Eng.mp4',
        productUrl: 'thisisurl2',
      },
    ]);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const wrapper = shallow(<Keyaki />);
    wrapper.find('#btn-update').simulate('click');
    await flushPromises();
    expect(Database.update.keyaki).toHaveBeenCalledWith([
      null,
      {
        ep: 1,
        sub: {
          Thai: {
            photoUrl: 'url',
            url: 'url',
          },
          Eng: {
            photoUrl: 'url',
            url: 'url',
          },
        },
        name: 'episode 1',
      },
      {
        ep: 2,
        sub: {
          Thai: {
            photoUrl: 'url',
            url: 'url',
          },
          Eng: {
            photoUrl: 'thisisurl1',
            url:
              'https://drive.google.com/file/d/thisisid1/preview?usp=drivesdk',
          },
        },
        name: 'episode 2',
      },
      {
        ep: 3,
        sub: {
          Eng: {
            photoUrl: 'thisisurl2',
            url:
              'https://drive.google.com/file/d/thisisid2/preview?usp=drivesdk',
          },
        },
        name: 'แก้ไข',
      },
    ]);
  });

  it('should not show InputPopup when click name but not admin', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(false);
    const wrapper = shallow(<Keyaki />);
    wrapper.find('tr').at(1).find('span').simulate('click');
    expect(wrapper.find('InputPopup')).toHaveLength(0);
  });

  it('should show InputPopup when click name and admin', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const wrapper = shallow(<Keyaki />);
    wrapper.find('tr').at(1).find('span').simulate('click');
    (wrapper.find('InputPopup').props() as {
      callback: (name: string) => void;
    }).callback('newName');
    expect(wrapper.find('InputPopup')).toHaveLength(1);
    expect(wrapper.find('InputPopup').props().default).toEqual('episode 1');
    expect(Database.update.keyaki).toHaveBeenCalledWith([
      null,
      {
        ep: 1,
        sub: {
          Thai: {
            photoUrl: 'url',
            url: 'url',
          },
          Eng: {
            photoUrl: 'url',
            url: 'url',
          },
        },
        name: 'newName',
      },
      {
        ep: 2,
        sub: {
          Thai: {
            photoUrl: 'url',
            url: 'url',
          },
        },
        name: 'episode 2',
      },
    ]);
  });
});
