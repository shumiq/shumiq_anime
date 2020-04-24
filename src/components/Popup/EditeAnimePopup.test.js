import React from 'react';
import { mount } from 'enzyme';
import mockDatabase from '../../mock/database'
import EditAnimePopup from './EditAnimePopup';

const mockAnimeList = mockDatabase.animelist;

describe('<EditAnimePopup />', () => {

    it('should show correct default value', () => {
        mount(<EditAnimePopup anime={mockAnimeList[0]} show={true} setShow={null} />);
        const popupElement = document.getElementById("editPopup");
        expect(popupElement.innerHTML).toContain(mockAnimeList[0].title);
        expect(popupElement.innerHTML).toContain(mockAnimeList[0].studio);
        expect(popupElement.innerHTML).toContain(mockAnimeList[0].year);
        expect(popupElement.innerHTML).toContain(mockAnimeList[0].cover_url);
        expect(popupElement.innerHTML).toContain(mockAnimeList[0].url);
        expect(popupElement.innerHTML).toContain(mockAnimeList[0].download_url);
    });
});