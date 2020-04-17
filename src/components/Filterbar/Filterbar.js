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
        const nextSeasonIndex = Object.keys(seasonList).sort().findIndex(season => season === currentSeason) + 1;
        const nextSeason = Object.keys(seasonList).sort()[nextSeasonIndex];
        filter.season = nextSeason;
        setFilter(filter);
    }

    const gotoPreviousSeason = () => {
        if (havePreviousSeason === 'invisible') return;
        const previousSeasonIndex = Object.keys(seasonList).sort().findIndex(season => season === currentSeason) - 1;
        const previousSeason = Object.keys(seasonList).sort()[previousSeasonIndex];
        filter.season = previousSeason;
        setFilter(filter);
    }

    return (
        <div className="Filterbar">
            <nav className="navbar navbar-expand-sm fixed-bottom p-0">
                <div className="text-center w-100">
                    <div className="collapse p-0 w-100 text-center" id="filterContent">
                        <div className="container">
                            <div className="row justify-content-around mx-2 bg-secondary shadow rounded w-100">
                                <div className="col m-2" style={{ minWidth: '200px' }}>
                                    <select className="form-control" id="filter-category">
                                        <option selected value="1">All Anime</option>
                                        <option value="2">Only Unseen</option>
                                        <option value="3">Only Unfinished</option>
                                        <option value="4">Only Finished</option>
                                    </select>
                                </div>
                                <div className="col m-2 w-auto" style={{ minWidth: '200px' }}>
                                    <select className="form-control" id="filter-season">

                                    </select>
                                </div>
                                <div className="col m-2 w-auto" style={{ minWidth: '200px' }}>
                                    <select className="form-control" id="filter-sort">
                                        <option selected value="1">Sort by Season</option>
                                        <option value="2">Sort by Score</option>
                                    </select>
                                </div>
                                <div className="col m-2 w-auto" style={{ minWidth: '200px' }}>
                                    <input type="text" className="form-control" id="filter-text" placeholder="Search..." />
                                </div>
                            </div>
                        </div>
                    </div>

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