import { Database } from '../../utils/firebase';
import Backup from './Backup';
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

jest.mock('../../utils/firebase');

describe('<Backup />', () => {
  const flushPromises = () => new Promise(setImmediate);

  beforeEach(() => {
    Database.status.mockReturnValue({
      anime: {
        series: 3,
        files: 2,
        view: 2,
      },
      conan: {
        cases: 5,
        files: 8,
      },
      keyaki: {
        episodes: 6,
        files: 6,
      },
    });
    Database.backupFiles.mockResolvedValue([
      {
        generation: 10,
        name: '20200526.json',
        customMetadata: {
          animeSeries: 2,
          animeFiles: 1,
          animeView: 1,
          conanCases: 4,
          conanFiles: 7,
          keyakiEpisodes: 5,
          keyakiFiles: 5,
        },
        data: 1,
      },
      {
        generation: 9,
        name: '20200520.json',
        customMetadata: {
          animeSeries: 1,
          animeFiles: 0,
          animeView: 0,
          conanCases: 3,
          conanFiles: 6,
          keyakiEpisodes: 4,
          keyakiFiles: 4,
        },
      },
    ]);
  });

  it('should show current database status', async () => {
    const wrapper = mount(<Backup />);
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('tr').at(1).text()).toContain('Series: 3');
    expect(wrapper.find('tr').at(1).text()).toContain('Download: 2');
    expect(wrapper.find('tr').at(1).text()).toContain('View: 2');
    expect(wrapper.find('tr').at(1).text()).toContain('Cases: 5');
    expect(wrapper.find('tr').at(1).text()).toContain('Download: 8');
    expect(wrapper.find('tr').at(1).text()).toContain('Episodes: 6');
    expect(wrapper.find('tr').at(1).text()).toContain('Download: 6');
  });

  it('should backup when click backup button', async () => {
    const wrapper = mount(<Backup />);
    await act(async () => {
      await flushPromises();
      wrapper.update();
      await wrapper.find('#btn-backup').simulate('click');
      await flushPromises();
      wrapper.update();
    });
    expect(Database.backup).toHaveBeenCalled();
  });

  it('should show backup files', async () => {
    const wrapper = mount(<Backup />);
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.find('tr')).toHaveLength(4);
    expect(wrapper.find('tr').at(2).text()).toContain('20200526.json');
    expect(wrapper.find('tr').at(2).text()).toContain('Series: 2');
    expect(wrapper.find('tr').at(2).text()).toContain('Download: 1');
    expect(wrapper.find('tr').at(2).text()).toContain('View: 1');
    expect(wrapper.find('tr').at(2).text()).toContain('Cases: 4');
    expect(wrapper.find('tr').at(2).text()).toContain('Download: 7');
    expect(wrapper.find('tr').at(2).text()).toContain('Episodes: 5');
    expect(wrapper.find('tr').at(2).text()).toContain('Download: 5');
    expect(wrapper.find('tr').at(3).text()).toContain('20200520.json');
    expect(wrapper.find('tr').at(3).text()).toContain('Series: 1');
    expect(wrapper.find('tr').at(3).text()).toContain('Download: 0');
    expect(wrapper.find('tr').at(3).text()).toContain('View: 0');
    expect(wrapper.find('tr').at(3).text()).toContain('Cases: 3');
    expect(wrapper.find('tr').at(3).text()).toContain('Download: 6');
    expect(wrapper.find('tr').at(3).text()).toContain('Episodes: 4');
    expect(wrapper.find('tr').at(3).text()).toContain('Download: 4');
  });

  it('should update database when click restore', async () => {
    window.confirm = jest.fn(() => true);
    const wrapper = mount(<Backup />);
    await act(async () => {
      await flushPromises();
      wrapper.update();
      await wrapper.find('#btn-restore').first().simulate('click');
      await flushPromises();
      wrapper.update();
    });
    expect(Database.update.database).toHaveBeenCalledWith(1);
  });

  it('should delete backup when click delete', async () => {
    const wrapper = mount(<Backup />);
    await act(async () => {
      await flushPromises();
      wrapper.update();
      await wrapper.find('#btn-delete').first().simulate('click');
      await flushPromises();
      wrapper.update();
    });
    expect(Database.deleteBackup).toHaveBeenCalledWith('20200526.json');
  });
});
