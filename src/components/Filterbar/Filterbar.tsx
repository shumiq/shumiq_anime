import React, { useCallback, ChangeEvent, KeyboardEvent } from 'react';
import { SeasonEnum, FilterEnum } from '../../utils/enum';
import { defaultFilter } from '../../pages/Anime/Anime.filter';
import UserDetail from '../../utils/userdetail';
import { Collapse } from 'bootstrap';

interface filterType {
  season: number | string;
  category: number;
  keyword: string;
  orderby: number;
}

interface optonalFilterType {
  season?: number | string;
  category?: number;
  keyword?: string;
  orderby?: number;
}

const Filterbar = (props: {
  filter: optonalFilterType;
  seasonlist: Record<string, number>;
  setFilter: (filter: filterType) => void;
}): JSX.Element => {
  const filter = { ...defaultFilter, ...props.filter };
  const seasonList = props.seasonlist;
  const currentSeason =
    filter.category.toString() === FilterEnum.ONLY_UNSEEN.toString() ||
    filter.category.toString() === FilterEnum.ONLY_UNFINISH.toString()
      ? FilterEnum.ALL_SEASON
      : filter?.season === FilterEnum.LATEST_SEASON
      ? Object.keys(seasonList).sort().pop() || FilterEnum.ALL_SEASON
      : filter.season;
  const hasNextSeason =
    Object.keys(seasonList).sort().pop() === currentSeason ||
    currentSeason.toString() === FilterEnum.ALL_SEASON.toString()
      ? 'invisible'
      : '';
  const havePreviousSeason =
    Object.keys(seasonList).sort().reverse().pop() === currentSeason ||
    currentSeason.toString() === FilterEnum.ALL_SEASON.toString()
      ? 'invisible'
      : '';

  const setFilter = useCallback((f: filterType): void => props.setFilter(f), [
    props,
  ]);

  const seasonToText = useCallback((season: string | number): string => {
    if (season.toString() === FilterEnum.ALL_SEASON.toString())
      return 'All Season';
    const [year, seasonNum] = season.toString().split(',');
    return year.toString() + ' ' + (SeasonEnum[seasonNum] as string);
  }, []);

  const gotoNextSeason = useCallback((): void => {
    if (hasNextSeason === 'invisible') return;
    const nextSeasonIndex =
      Object.keys(seasonList)
        .sort()
        .findIndex((season) => season === currentSeason) + 1;
    const nextSeason = Object.keys(seasonList).sort()[nextSeasonIndex];
    filter.season = nextSeason;
    setFilter(filter);
  }, [currentSeason, setFilter, hasNextSeason, seasonList, filter]);

  const gotoPreviousSeason = useCallback((): void => {
    if (havePreviousSeason === 'invisible') return;
    const previousSeasonIndex =
      Object.keys(seasonList)
        .sort()
        .findIndex((season) => season === currentSeason) - 1;
    const previousSeason = Object.keys(seasonList).sort()[previousSeasonIndex];
    filter.season = previousSeason;
    setFilter(filter);
  }, [currentSeason, setFilter, havePreviousSeason, seasonList, filter]);

  const changeCategory = useCallback(
    (event: ChangeEvent<HTMLSelectElement>): void => {
      filter.category = parseInt(event.target.value);
      setFilter(filter);
    },
    [filter, setFilter]
  );

  const changeOrder = useCallback(
    (event: ChangeEvent<HTMLSelectElement>): void => {
      filter.orderby = parseInt(event.target.value);
      setFilter(filter);
    },
    [filter, setFilter]
  );

  const changeSeason = useCallback(
    (event: ChangeEvent<HTMLSelectElement>): void => {
      filter.season = event.target.value;
      setFilter(filter);
    },
    [filter, setFilter]
  );

  const changeKey = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === 'Enter') {
        filter.keyword = (event.target as HTMLInputElement).value;
        setFilter(filter);
      }
    },
    [filter, setFilter]
  );

  const toggleFilter = useCallback(() => {
    const navBar = document.querySelector('#filterContent');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const collapse = new Collapse(navBar) as { toggle: () => void };
    collapse.toggle();
  }, []);

  return (
    <div className="Filterbar">
      <nav className="navbar navbar-expand-sm fixed-bottom p-0">
        <div className="text-center w-100">
          <div className="collapse p-0 w-100 text-center" id="filterContent">
            <div className="container">
              <div className="row justify-content-around mx-2 bg-secondary shadow rounded w-100">
                <div className="col m-2" style={{ minWidth: '200px' }}>
                  <select
                    className="form-control"
                    id="filter-category"
                    onChange={changeCategory}
                    value={filter.category}
                  >
                    <option value={FilterEnum.ALL_ANIME}>All Anime</option>
                    {UserDetail.isAdmin() && (
                      <option value={FilterEnum.ONLY_UNSEEN}>
                        Only Unseen
                      </option>
                    )}
                    {UserDetail.isAdmin() && (
                      <option value={FilterEnum.ONLY_UNFINISH}>
                        Only Unfinished
                      </option>
                    )}
                    <option value={FilterEnum.ONLY_FINISH}>
                      Only Finished
                    </option>
                  </select>
                </div>
                <div className="col m-2 w-auto" style={{ minWidth: '200px' }}>
                  <select
                    className="form-control"
                    id="filter-season"
                    onChange={changeSeason}
                    value={currentSeason}
                  >
                    <option value={FilterEnum.ALL_SEASON}>All Season</option>
                    {Object.keys(seasonList)
                      .sort()
                      .reverse()
                      .map((season) => (
                        <option key={season} value={season}>
                          {season.split(',')[0]}{' '}
                          {SeasonEnum[season.split(',')[1]]} (
                          {seasonList[season]})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col m-2 w-auto" style={{ minWidth: '200px' }}>
                  <select
                    className="form-control"
                    id="filter-sort"
                    onChange={changeOrder}
                    value={filter.orderby}
                  >
                    <option value={FilterEnum.SORT_BY_SEASON}>
                      Sort by Season
                    </option>
                    <option value={FilterEnum.SORT_BY_SCORE}>
                      Sort by Score
                    </option>
                  </select>
                </div>
                <div className="col m-2 w-auto" style={{ minWidth: '200px' }}>
                  <input
                    type="text"
                    className="form-control"
                    id="filter-text"
                    placeholder="Search..."
                    onKeyUp={changeKey}
                    defaultValue={filter.keyword}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            className={
              'btn btn-secondary p-0 pt-1 mb-2 mr-2 mt-2 ' + hasNextSeason
            }
            type="button"
            style={{ width: '48px', height: '48px' }}
            onClick={gotoNextSeason}
            id="next-season"
          >
            <i className="material-icons">keyboard_arrow_left</i>
          </button>

          <button
            className="btn btn-secondary p-0 mb-2 mr-2 mt-2"
            type="button"
            onClick={toggleFilter}
            style={{ width: '120px', height: '48px' }}
          >
            {seasonToText(currentSeason)}
          </button>

          <button
            className={
              'btn btn-secondary p-0 pt-1 mb-2 mr-2 mt-2 ' + havePreviousSeason
            }
            type="button"
            style={{ width: '48px', height: '48px' }}
            onClick={gotoPreviousSeason}
            id="previous-season"
          >
            <i className="material-icons">keyboard_arrow_right</i>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Filterbar;
