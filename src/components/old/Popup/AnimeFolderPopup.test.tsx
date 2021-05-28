import React from 'react';
import { mount } from 'enzyme';
import AnimeFolderPopup from './AnimeFolderPopup';

const mockupFiles = {
  file1: {
    name: 'file1',
    photoUrl: 'url1.1',
    driveUrl: 'url1.2',
  },
  file2: {
    name: 'file2',
    photoUrl: 'url2.1',
  },
  file3: {
    name: 'file3',
    driveUrl: 'url3.2',
  },
};

describe('<AnimeFolderPopup />', () => {
  it('should have 3 files', () => {
    const wrapper = mount(
      <AnimeFolderPopup
        folderFiles={mockupFiles}
        show={true}
        onClose={() => {
          return;
        }}
      />
    );
    expect(wrapper.find('div.modal').find('tr')).toHaveLength(4);
  });

  it('should show correct information in first file', () => {
    const wrapper = mount(
      <AnimeFolderPopup
        folderFiles={mockupFiles}
        show={true}
        onClose={() => {
          return;
        }}
      />
    );
    expect(
      wrapper
        .find('div.modal')
        .find('tr')
        .at(1)
        .find('td')
        .at(0)
        .contains('file1')
    ).toBe(true);
    expect(
      wrapper
        .find('div.modal')
        .find('tr')
        .at(1)
        .find('td')
        .at(2)
        .html()
        .includes('url1.1')
    ).toBe(true);
    expect(
      wrapper
        .find('div.modal')
        .find('tr')
        .at(1)
        .find('td')
        .at(2)
        .html()
        .includes('disabled')
    ).not.toBe(true);
    expect(
      wrapper
        .find('div.modal')
        .find('tr')
        .at(1)
        .find('td')
        .at(3)
        .html()
        .includes('url1.2')
    ).toBe(true);
    expect(
      wrapper
        .find('div.modal')
        .find('tr')
        .at(1)
        .find('td')
        .at(3)
        .html()
        .includes('disabled')
    ).not.toBe(true);
  });

  it('should show correct information in second file', () => {
    const wrapper = mount(
      <AnimeFolderPopup
        folderFiles={mockupFiles}
        show={true}
        onClose={() => {
          return;
        }}
      />
    );
    expect(
      wrapper
        .find('div.modal')
        .find('tr')
        .at(2)
        .find('td')
        .at(0)
        .contains('file2')
    ).toBe(true);
    expect(
      wrapper
        .find('div.modal')
        .find('tr')
        .at(2)
        .find('td')
        .at(2)
        .html()
        .includes('url2.1')
    ).toBe(true);
    expect(
      wrapper
        .find('div.modal')
        .find('tr')
        .at(2)
        .find('td')
        .at(2)
        .html()
        .includes('disabled')
    ).not.toBe(true);
    expect(
      wrapper
        .find('div.modal')
        .find('tr')
        .at(2)
        .find('td')
        .at(3)
        .html()
        .includes('disabled')
    ).toBe(true);
  });

  it('should show correct information in third file', () => {
    const wrapper = mount(
      <AnimeFolderPopup
        folderFiles={mockupFiles}
        show={true}
        onClose={() => {
          return;
        }}
      />
    );
    expect(
      wrapper
        .find('div.modal')
        .find('tr')
        .at(3)
        .find('td')
        .at(0)
        .contains('file3')
    ).toBe(true);
    expect(
      wrapper
        .find('div.modal')
        .find('tr')
        .at(3)
        .find('td')
        .at(2)
        .html()
        .includes('disabled')
    ).toBe(true);
    expect(
      wrapper
        .find('div.modal')
        .find('tr')
        .at(3)
        .find('td')
        .at(3)
        .html()
        .includes('url3.2')
    ).toBe(true);
    expect(
      wrapper
        .find('div.modal')
        .find('tr')
        .at(3)
        .find('td')
        .at(3)
        .html()
        .includes('disabled')
    ).not.toBe(true);
  });
});
