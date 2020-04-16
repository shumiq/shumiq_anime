import React from 'react';
import { SeasonEnum, FilterEnum } from '../../utils/enum'
import { defaultFilter } from '../../pages/Anime/Anime.filter'

const Filterbar = props => {
    const filter = Object.assign(defaultFilter, props.filter);
    const setFilter = f => props.setFilter(f);
    const seasonList = props.seasonlist;
    const currentSeason = filter?.season === FilterEnum.LATEST_SEASON ?
        Object.keys(seasonList).sort().pop() : filter.season;

    const seasonToText = season => {
        let [year, seasonNum] = season.split(',');
        return year + " " + SeasonEnum[seasonNum];
    }

    const hasNextSeason = Object.keys(seasonList).sort().pop() === currentSeason ? 'invisible' : '';

    const havePreviousSeason = Object.keys(seasonList).sort().reverse().pop() === currentSeason ? 'invisible' : '';

    const gotoNextSeason = () => {
        if (hasNextSeason === 'invisible') return;
        const nextSeasonIndex = Object.keys(seasonList).sort().findIndex(season => season === currentSeason)+1;
        const nextSeason = Object.keys(seasonList).sort()[nextSeasonIndex];
        filter.season = nextSeason;
        setFilter(filter);
    }

    const gotoPreviousSeason = () => {
        if (havePreviousSeason === 'invisible') return;
        const previousSeasonIndex = Object.keys(seasonList).sort().findIndex(season => season === currentSeason)-1;
        const previousSeason = Object.keys(seasonList).sort()[previousSeasonIndex];
        filter.season = previousSeason;
        setFilter(filter);
    }

    return (
        <div className="Filterbar">
            <nav className="navbar navbar-expand-sm fixed-bottom p-0">
                <div className="text-center w-100">
                    <button className={"btn btn-secondary p-0 pt-1 mb-2 mr-2 mt-2 " + hasNextSeason} type="button" style={{ width: '48px', height: '48px' }} onClick={gotoNextSeason} id="next-season">
                        <i className="material-icons">keyboard_arrow_left</i>
                    </button>

                    <button className="btn btn-secondary p-0 mb-2 mr-2 mt-2" type="button" data-toggle="collapse"
                        data-target="#filterContent" aria-controls="#filterContent" aria-expanded="false"
                        aria-label="Toggle navigation" style={{ width: '120px', height: '48px' }}>
                        {seasonToText(currentSeason)}
                    </button>

                    <button className={"btn btn-secondary p-0 pt-1 mb-2 mr-2 mt-2 " + havePreviousSeason} type="button" style={{ width: '48px', height: '48px' }} onClick={gotoPreviousSeason} id="previous-season">
                        <i className="material-icons">keyboard_arrow_right</i>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Filterbar;