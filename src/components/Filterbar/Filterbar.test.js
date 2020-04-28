import React from 'react';
import { mount } from 'enzyme';
import Filterbar from './Filterbar';
import { FilterEnum } from '../../utils/enum';

describe('<Filterbar />', () => {

    const seasonList = {
        '2020,2': 1,
        '2020,1': 1,
        '2019,4': 1
    }

    it('should show latest season as default', () => {
        const wrapper = mount(<Filterbar filter={{}} seasonlist={seasonList} setFilter={null} />);
        expect(wrapper.text()).toContain('2020 Spring');
    });

    it('should show correct season', () => {
        const wrapper = mount(<Filterbar filter={{season:'2019,4'}} seasonlist={seasonList} setFilter={null} />);
        expect(wrapper.text()).toContain('2019 Fall');
    });

    it('should not show next season for latest season', () => {
        const wrapper = mount(<Filterbar filter={{season:'2020,2'}} seasonlist={seasonList} setFilter={null} />);
        expect(wrapper.find('.invisible')).toHaveLength(1);
        expect(wrapper.find('.invisible').first().text()).toContain('keyboard_arrow_left');
    });

    it('should not show next season for latest season', () => {
        const wrapper = mount(<Filterbar filter={{season:'2019,4'}} seasonlist={seasonList} setFilter={null} />);
        expect(wrapper.find('.invisible')).toHaveLength(1);
        expect(wrapper.find('.invisible').first().text()).toContain('keyboard_arrow_right');
    });

    it('should show both next and previous season for intermediate season', () => {
        const wrapper = mount(<Filterbar filter={{season:'2020,1'}} seasonlist={seasonList} setFilter={null} />);
        expect(wrapper.find('.invisible')).toHaveLength(0);
    });

    it('should go to previous season', () => {
        let mockSetFilter = filter => {
            expect(filter.season).toBe('2019,4');
        };
        const wrapper = mount(<Filterbar filter={{season:'2020,1'}} seasonlist={seasonList} setFilter={mockSetFilter} />);
        wrapper.find('#previous-season').simulate('click');
    });

    it('should go to next season', () => {
        let mockSetFilter = filter => {
            expect(filter.season).toBe('2020,2');
        };
        const wrapper = mount(<Filterbar filter={{season:'2020,1'}} seasonlist={seasonList} setFilter={mockSetFilter} />);
        wrapper.find('#next-season').simulate('click');
    });

    it('should show all anime category', () => {
        let mockSetFilter = filter => {
            expect(filter.category).toBe(FilterEnum.ALL_ANIME);
        };
        const wrapper = mount(<Filterbar filter={{category:FilterEnum.ONLY_FINISH}} seasonlist={seasonList} setFilter={mockSetFilter} />);
        wrapper.find('#filter-category').simulate('change', { target: { value: FilterEnum.ALL_ANIME } });
    });

    it('should show only unseen anime category', () => {
        let mockSetFilter = filter => {
            expect(filter.category).toBe(FilterEnum.ONLY_UNSEEN);
        };
        const wrapper = mount(<Filterbar filter={{category:FilterEnum.ALL_ANIME}} seasonlist={seasonList} setFilter={mockSetFilter} />);
        wrapper.find('#filter-category').simulate('change', { target: { value: FilterEnum.ONLY_UNSEEN } });
    });

    it('should show only unfinish anime category', () => {
        let mockSetFilter = filter => {
            expect(filter.category).toBe(FilterEnum.ONLY_UNFINISH);
        };
        const wrapper = mount(<Filterbar filter={{category:FilterEnum.ALL_ANIME}} seasonlist={seasonList} setFilter={mockSetFilter} />);
        wrapper.find('#filter-category').simulate('change', { target: { value: FilterEnum.ONLY_UNFINISH } });
    });

    it('should show only finish anime category', () => {
        let mockSetFilter = filter => {
            expect(filter.category).toBe(FilterEnum.ONLY_FINISH);
        };
        const wrapper = mount(<Filterbar filter={{category:FilterEnum.ALL_ANIME}} seasonlist={seasonList} setFilter={mockSetFilter} />);
        wrapper.find('#filter-category').simulate('change', { target: { value: FilterEnum.ONLY_FINISH } });
    });

    it('should order by season', () => {
        let mockSetFilter = filter => {
            expect(filter.orderby).toBe(FilterEnum.SORT_BY_SEASON);
        };
        const wrapper = mount(<Filterbar filter={{orderby:FilterEnum.SORT_BY_SCORE}} seasonlist={seasonList} setFilter={mockSetFilter} />);
        wrapper.find('#filter-sort').simulate('change', { target: { value: FilterEnum.SORT_BY_SEASON } });
    });

    it('should order by season', () => {
        let mockSetFilter = filter => {
            expect(filter.orderby).toBe(FilterEnum.SORT_BY_SCORE);
        };
        const wrapper = mount(<Filterbar filter={{orderby:FilterEnum.SORT_BY_SEASON}} seasonlist={seasonList} setFilter={mockSetFilter} />);
        wrapper.find('#filter-sort').simulate('change', { target: { value: FilterEnum.SORT_BY_SCORE } });
    });

    it('should show all season', () => {
        let mockSetFilter = filter => {
            expect(filter.season).toBe(FilterEnum.ALL_SEASON);
        };
        const wrapper = mount(<Filterbar filter={{}} seasonlist={seasonList} setFilter={mockSetFilter} />);
        wrapper.find('#filter-season').simulate('change', { target: { value: FilterEnum.ALL_SEASON } });
    });

    it('should show correct season', () => {
        let mockSetFilter = filter => {
            expect(filter.season).toBe('2020,1');
        };
        const wrapper = mount(<Filterbar filter={{}} seasonlist={seasonList} setFilter={mockSetFilter} />);
        wrapper.find('#filter-season').simulate('change', { target: { value: '2020,1' } });
    });

    it('should show anime with match keyword', () => {
        let mockSetFilter = filter => {
            expect(filter.keyword).toBe('Hello, World');
        };
        const wrapper = mount(<Filterbar filter={{}} seasonlist={seasonList} setFilter={mockSetFilter} />);
        wrapper.find('#filter-text').simulate('keyup', { key: 'Enter', target: { value: 'Hello, World' } });
    });

});