import React from 'react';
import { shallow, mount } from 'enzyme';
import { getLocalStorage } from '../../utils/localstorage';
import mockDatabase from '../../mock/database.json';
import UserDetail from '../../utils/userdetail';
import GoogleDriveApi from '../../api/googledrive';
import GooglePhotoApi from '../../api/googlephoto';
import { Database } from '../../utils/firebase';
import Conan from './Conan';

jest.mock('../../utils/localstorage');
jest.mock('../../utils/userdetail');
jest.mock('../../api/googledrive');
jest.mock('../../api/googlephoto');
jest.mock('../../utils/firebase');

describe('<Conan />', () => {
  const flushPromises = () => new Promise(setImmediate);

  it('should show correct conan list', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    const wrapper = shallow(<Conan />);
    expect(wrapper.find('tr')).toHaveLength(3);
    expect(wrapper.find('tr').at(1).find('td').at(0).text()).toContain('1');
    expect(wrapper.find('tr').at(1).find('td').at(1).text()).toContain(
      'case 1'
    );
    expect(wrapper.find('tr').at(1).find('td').at(2).find('.btn')).toHaveLength(
      3
    );
    expect(
      wrapper.find('tr').at(1).find('td').at(2).find('.btn').at(0).text()
    ).toContain('200');
    expect(
      wrapper.find('tr').at(1).find('td').at(2).find('.btn').at(1).text()
    ).toContain('201');
    expect(
      wrapper.find('tr').at(1).find('td').at(2).find('.btn').at(2).text()
    ).toContain('202');
    expect(wrapper.find('tr').at(2).find('td').at(0).text()).toContain('2');
    expect(wrapper.find('tr').at(2).find('td').at(1).text()).toContain(
      'case 2'
    );
    expect(wrapper.find('tr').at(2).find('td').at(2).find('.btn')).toHaveLength(
      2
    );
    expect(
      wrapper.find('tr').at(2).find('td').at(2).find('.btn').at(0).text()
    ).toContain('203');
    expect(
      wrapper.find('tr').at(2).find('td').at(2).find('.btn').at(1).text()
    ).toContain('204');
  });

  it('should show FilesPopup when click episode button', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    const wrapper = shallow(<Conan />);
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
    const wrapper = mount(<Conan />);
    wrapper.find('#btn-random').simulate('click');
    expect(wrapper.find('table').html()).toContain('bg-dark');
  });

  it('should not show update button when not admin', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(false);
    const wrapper = shallow(<Conan />);
    expect(wrapper.find('#btn-update')).toHaveLength(0);
  });

  it('should show update button when admin', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const wrapper = shallow(<Conan />);
    expect(wrapper.find('#btn-update')).toHaveLength(1);
  });

  it('should show loading popup when click update', async () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (GoogleDriveApi.getFiles as jest.Mock).mockResolvedValue([
      {
        name: 'conan 0002 - 0205.mp4',
        id: 'thisisid1',
      },
      {
        name: 'conan 0003 - 0206.mp4',
        id: 'thisisid2',
      },
    ]);
    (GooglePhotoApi.getMedias as jest.Mock).mockResolvedValue([
      {
        filename: 'conan 0002 - 0205.mp4',
        productUrl: 'thisisurl1',
      },
      {
        filename: 'conan 0003 - 0206.mp4',
        productUrl: 'thisisurl2',
      },
    ]);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const wrapper = shallow(<Conan />);
    wrapper.find('#btn-update').simulate('click');
    expect(
      (wrapper.find('GeneralPopup')?.props() as { show: boolean }).show
    ).toBe(true);
    await flushPromises();
    expect(
      (wrapper.find('GeneralPopup')?.props() as { show: boolean }).show
    ).toBe(false);
  });

  it('should call Database.update.conan after update', async () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (GoogleDriveApi.getFiles as jest.Mock).mockResolvedValue([
      {
        name: 'conan 0002 - 0205.mp4',
        id: 'thisisid1',
      },
      {
        name: 'conan 0003 - 0206.mp4',
        id: 'thisisid2',
      },
    ]);
    (GooglePhotoApi.getMedias as jest.Mock).mockResolvedValue([
      {
        filename: 'conan 0002 - 0205.mp4',
        productUrl: 'thisisurl1',
      },
      {
        filename: 'conan 0003 - 0206.mp4',
        productUrl: 'thisisurl2',
      },
    ]);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const wrapper = shallow(<Conan />);
    wrapper.find('#btn-update').simulate('click');
    await flushPromises();
    expect(Database.update.conan).toHaveBeenCalledWith('case2', {
      case: 2,
      episodes: {
        '203': { photoUrl: 'url', url: 'url' },
        '204': { photoUrl: 'url', url: 'url' },
        '205': {
          photoUrl: 'thisisurl1',
          url: 'https://drive.google.com/file/d/thisisid1/preview?usp=drivesdk',
        },
      },
      name: 'case 2',
    });
    expect(Database.add.conan).toHaveBeenCalledWith({
      case: 3,
      episodes: {
        '206': {
          photoUrl: 'thisisurl2',
          url: 'https://drive.google.com/file/d/thisisid2/preview?usp=drivesdk',
        },
      },
      name: 'แก้ไข',
    });
  });

  it('should not show InputPopup when click name but not admin', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(false);
    const wrapper = shallow(<Conan />);
    wrapper.find('tr').at(1).find('span').simulate('click');
    expect(wrapper.find('InputPopup')).toHaveLength(0);
  });

  it('should show InputPopup when click name and admin', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const wrapper = shallow(<Conan />);
    wrapper.find('tr').at(1).find('span').simulate('click');
    (wrapper.find('InputPopup').props() as {
      callback: (name: string) => void;
    }).callback('newName');
    expect(wrapper.find('InputPopup')).toHaveLength(1);
    expect(wrapper.find('InputPopup').props().default).toEqual('case 1');
    expect(Database.update.conan).toHaveBeenCalledWith('case1', {
      case: 1,
      episodes: {
        '200': {
          photoUrl: 'url',
          url: 'url',
        },
        '201': {
          photoUrl: 'url',
          url: 'url',
        },
        '202': {
          photoUrl: 'url',
          url: 'url',
        },
      },
      name: 'newName',
    });
  });
});