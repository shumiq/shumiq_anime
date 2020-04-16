import React from 'react';
import { mount } from 'enzyme';
import Filterbar from './Filterbar';

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

});