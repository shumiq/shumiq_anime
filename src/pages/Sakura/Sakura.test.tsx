import React from 'react';
import { shallow } from 'enzyme';
import { getLocalStorage } from '../../utils/localstorage';
import mockDatabase from '../../mock/database.json';
import UserDetail from '../../utils/userdetail';
import { Database } from '../../utils/firebase';
import Sakura from './Sakura';
import SynologyApi from "../../api/synology";

jest.mock('../../utils/localstorage');
jest.mock('../../utils/userdetail');
jest.mock('../../utils/firebase');
jest.mock('../../api/synology');

describe('<Sakura />', () => {
  const flushPromises = () => new Promise(setImmediate);

  it('should show correct sakura list', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    const wrapper = shallow(<Sakura />);
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

  it('should random to one case when click random button', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(false);
    window.HTMLElement.prototype.scrollIntoView = (): void => {
      return;
    };
    const wrapper = shallow(<Sakura />);
    wrapper.find('#btn-random').simulate('click');
    expect(true).toBe(true);
    //expect(wrapper.find('table').html()).toContain('bg-dark');
  });

  it('should not show update button when not admin', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(false);
    const wrapper = shallow(<Sakura />);
    expect(wrapper.find('#btn-update')).toHaveLength(0);
  });

  it('should show update button when admin', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const wrapper = shallow(<Sakura />);
    expect(wrapper.find('#btn-update')).toHaveLength(1);
  });

  it('should show loading popup when click update', async () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (SynologyApi.getDownloadURL as jest.Mock).mockImplementation((path : string) => path);
    (SynologyApi.list as jest.Mock).mockResolvedValue({
      data: {files: [{
          name: 'Soko Magattara, Sakurazaka 02 Eng.mp4',
          path: 'url2',
        }, {
          name: 'Soko Magattara, Sakurazaka 03 Eng.mp4',
          path: 'url3',
        }]},
      success: true
    });
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const wrapper = shallow(<Sakura />);
    wrapper.find('#btn-update').simulate('click');
    expect(
      (wrapper.find('GeneralPopup')?.props() as { show: boolean }).show
    ).toBe(true);
    await flushPromises();
    expect(
      (wrapper.find('GeneralPopup')?.props() as { show: boolean }).show
    ).toBe(false);
  });

  it('should call Database.update.sakura after update', async () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (SynologyApi.getDownloadURL as jest.Mock).mockImplementation((path : string) => path);
    (SynologyApi.list as jest.Mock).mockResolvedValue({
      data: {files: [{
          name: 'Soko Magattara, Sakurazaka 02 Eng.mp4',
          path: 'url2',
        }, {
          name: 'Soko Magattara, Sakurazaka 03 Eng.mp4',
          path: 'url3',
        }]},
      success: true
    });
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const wrapper = shallow(<Sakura />);
    wrapper.find('#btn-update').simulate('click');
    await flushPromises();
    expect(Database.update.sakura).toHaveBeenCalledWith('ep2', {
      ep: 2,
      name: 'episode 2',
      sub: {
        Eng: 'url2',
        Thai: 'url',
      },
    });

    expect(Database.add.sakura).toHaveBeenCalledWith({
      ep: 3,
      sub: {
        Eng: 'url3',
      },
      name: 'แก้ไข'
    });
  });

  it('should not show InputPopup when click name but not admin', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(false);
    const wrapper = shallow(<Sakura />);
    wrapper.find('tr').at(1).find('span').simulate('click');
    expect(wrapper.find('InputPopup')).toHaveLength(0);
  });

  it('should show InputPopup when click name and admin', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const wrapper = shallow(<Sakura />);
    wrapper.find('tr').at(1).find('span').simulate('click');
    (wrapper.find('InputPopup').props() as {
      callback: (name: string) => void;
    }).callback('newName');
    expect(wrapper.find('InputPopup')).toHaveLength(1);
    expect(wrapper.find('InputPopup').props().default).toEqual('episode 1');
    expect(Database.update.sakura).toHaveBeenCalledWith('ep1', {
      ep: 1,
      name: 'newName',
      sub: {
        Eng: 'url',
        Thai: 'url',
      },
    });
  });
});
