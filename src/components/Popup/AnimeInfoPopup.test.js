import React from 'react';
import { mount } from 'enzyme';
import mockDatabase from '../../mock/database'
import AnimeInfoPopup from './AnimeInfoPopup';
import { IsAdmin } from '../../utils/userDetail';
import { SaveAnime } from '../../utils/firebase';

jest.mock('../../utils/userDetail');
jest.mock('../../utils/firebase');
const mockAnimeList = mockDatabase.animelist;
const mockInfo = {
    "id": 107871,
    "title": {
        "romaji": "Princess Connect! Re:Dive",
        "english": "Princess Connect! Re: Dive",
    },
    "season": "SPRING",
    "description": "desc",
    "startDate": { "year": 2020 },
    "episodes": null,
    "source": "VIDEO_GAME",
    "coverImage": {
        "large": "someurl"
    },
    "bannerImage": null,
    "genres": ["Fantasy"],
    "meanScore": 68,
    "averageScore": 66,
    "popularity": 7462,
    "relations": {
        "nodes": []
    },
    "studios": {
        "nodes": [{ "name": "CygamesPictures" }]
    },
    "nextAiringEpisode": {
        "timeUntilAiring": 547479,
        "episode": 5
    }
}

describe('<AnimeInfoPopup />', () => {
    it('should show correct info', () => {
        mount(<AnimeInfoPopup anime={mockAnimeList[0]} info={mockInfo} show={true} setShow={null} />);
        const popupElement = document.getElementById("infoPopup");
        expect(popupElement.innerHTML).toContain(mockAnimeList[0].title);
        expect(popupElement.innerHTML).toContain(mockInfo.title.romaji);
        expect(popupElement.innerHTML).toContain(mockInfo.startDate.year);
        expect(popupElement.innerHTML).toContain(mockInfo.season);
        expect(popupElement.innerHTML).toContain(mockInfo.studios.nodes[0].name);
        expect(popupElement.innerHTML).toContain(mockInfo.genres[0]);
        expect(popupElement.innerHTML).toContain(mockInfo.description);
        expect(popupElement.innerHTML).toContain(mockInfo.source);
    });

    it('should not show sync and incorrect button if not admin', () => {
        IsAdmin.mockReturnValue(false);
        mount(<AnimeInfoPopup anime={mockAnimeList[0]} info={mockInfo} show={true} setShow={null} />);
        const syncButton = [].filter.call(document.getElementsByClassName("btn"), button => button.innerHTML === "Sync");
        const incorrectButton = [].filter.call(document.getElementsByClassName("btn"), button => button.innerHTML === "Incorrect");
        expect(syncButton.length).toBe(0);
        expect(incorrectButton.length).toBe(0);
    });

    it('should show sync and incorrect button if admin', () => {
        IsAdmin.mockReturnValue(true);
        mount(<AnimeInfoPopup anime={mockAnimeList[0]} info={mockInfo} show={true} setShow={null} />);
        const syncButton = [].filter.call(document.getElementsByClassName("btn"), button => button.innerHTML === "Sync");
        const incorrectButton = [].filter.call(document.getElementsByClassName("btn"), button => button.innerHTML === "Incorrect");
        expect(syncButton.length).toBe(1);
        expect(incorrectButton.length).toBe(1);
    });
});