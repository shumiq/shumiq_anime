import AnilistApi from '../../api/anilist';
import AddAnimePopup from './AddAnimePopup';
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

jest.mock('../../api/anilist');

describe('<AddAnimePopup />', () => {
  const flushPromises = () => new Promise(setImmediate);

  it('should not show when show props is false', () => {
    const wrapper = mount(<AddAnimePopup show={false} setShow={null} />);
    expect(wrapper.find('div.modal')).toHaveLength(0);
  });

  it('should have input and button', () => {
    const wrapper = mount(<AddAnimePopup show={true} setShow={null} />);
    expect(wrapper.find('div.modal').find('input')).toHaveLength(1);
    expect(wrapper.find('div.modal').find('button')).toHaveLength(1);
  });

  it('should call searchAnime from anilist api after click search', async () => {
    const wrapper = mount(<AddAnimePopup show={true} setShow={null} />);
    wrapper
      .find('div.modal')
      .find('input.form-control')
      .simulate('change', { target: { value: 'test' } });
    await act(async () => {
      wrapper.find('div.modal').find('button').simulate('click');
    });
    expect(AnilistApi.searchAnime).toHaveBeenCalledWith('test');
  });

  it('should see search result after click search', async () => {
    AnilistApi.searchAnime.mockResolvedValue([
      {
        id: 1,
        title: { userPreferred: 'anime1' },
        startDate: { year: 2020 },
        season: 'SPRING',
      },
      {
        id: 2,
        title: { userPreferred: 'anime2' },
        startDate: { year: 2019 },
        season: 'WINTER',
      },
      {
        id: 3,
        title: { userPreferred: 'anime3' },
        startDate: { year: 2018 },
        season: 'SUMMER',
      },
    ]);
    const wrapper = mount(<AddAnimePopup show={true} setShow={null} />);
    await act(async () => {
      wrapper.find('div.modal').find('button').simulate('click');
    });
    await flushPromises();
    wrapper.update();
    expect(wrapper.find('div.modal').find('table')).toHaveLength(2);
    const result = wrapper
      .find('div.modal')
      .find('table')
      .at(1)
      .find('tbody')
      .find('tr');
    expect(result.at(0).text()).toContain('anime1');
    expect(result.at(0).text()).toContain('2020');
    expect(result.at(0).text()).toContain('SPRING');
    expect(result.at(1).text()).toContain('anime2');
    expect(result.at(1).text()).toContain('2019');
    expect(result.at(1).text()).toContain('WINTER');
    expect(result.at(2).text()).toContain('anime3');
    expect(result.at(2).text()).toContain('2018');
    expect(result.at(2).text()).toContain('SUMMER');
  });
});
