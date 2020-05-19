import { SaveAnime } from '../../utils/firebase';
import { IsAdmin } from '../../utils/userdetail';
import React from 'react';
import Modal from 'react-bootstrap/Modal';

const AnimeInfoPopup = (props) => {
  const anime = props.anime;
  const info = props.info;
  const closePopup = () => props.setShow(false);

  const syncAnime = () => {
    let state = JSON.parse(JSON.stringify(anime));
    state.studio = info.studios?.nodes[0]?.name
      ? info.studios?.nodes[0]?.name
      : 'none';
    state.all_episode = info.episodes ? info.episodes : '?';
    state.year = info.startDate.year;
    let seasonNum = [];
    seasonNum['WINTER'] = 1;
    seasonNum['SPRING'] = 2;
    seasonNum['SUMMER'] = 3;
    seasonNum['FALL'] = 4;
    state.season = seasonNum[info.season];
    state.info = info.description;
    if (info.averageScore) state.score = (info.averageScore / 10.0).toFixed(1);
    let genres = state.genres.split(', ');
    info.genres.forEach((g) => {
      if (!genres.includes(g)) genres.push(g);
    });
    state.genres = genres
      .filter((g) => g.trim() !== '')
      .sort()
      .join(', ');
    state.cover_url = info.coverImage.large;
    SaveAnime(state.key, state);
    closePopup();
  };
  const blackListResult = () => {
    if (
      window.confirm('Are you sure "' + info.title.romaji + '" is incorrect?')
    ) {
      let state = JSON.parse(JSON.stringify(anime));
      if (!state.blacklist) state.blacklist = [];
      if (!state.blacklist.includes(info.id)) state.blacklist.push(info.id);
      SaveAnime(state.key, state);
      closePopup();
    }
  };
  return (
    <div className="AnimeInfoPopup">
      <Modal
        show={props.show}
        centered
        backdrop={true}
        keyboard={true}
        animation={true}
        onHide={closePopup}
      >
        <Modal.Header closeButton>
          <Modal.Title>{anime.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {info != null && (
            <div id="infoPopup">
              <div className="text-left">
                <p className="my-0">
                  <b>Title</b>: {info.title.romaji}{' '}
                  {info.title.english &&
                    info.title.english !== info.title.romaji &&
                    '/ ' + info.title.english}
                </p>
                <p className="my-0">
                  <b>Studio</b>: {info.studios?.nodes[0]?.name}
                </p>
                <p className="my-0">
                  <b>Source</b>: {info.source}
                </p>
                <p className="my-0">
                  <b>Episides</b>: {info.episodes}
                </p>
                {info.nextAiringEpisode != null && (
                  <p className="my-0">
                    <b>Next Airing</b>: EP{info.nextAiringEpisode.episode} in{' '}
                    {secondToDuration(info.nextAiringEpisode.timeUntilAiring)}
                  </p>
                )}
                <p className="my-0">
                  <b>Season</b>: {info.startDate.year} {info.season}
                </p>
                <p className="my-0">
                  <b>Score</b>: {info.averageScore / 10.0}
                </p>
                <p className="my-0">
                  <b>Genres</b>: {info.genres.join(', ')}
                </p>
                {info.bannerImage != null && (
                  <p className="my-0">
                    <img src={info.bannerImage} width="100%" alt="banner" />
                  </p>
                )}
                <p>{info.description}</p>

                {info.relations?.nodes && (
                  <p>
                    <b>Related Media</b>:{' '}
                    {info.relations.nodes
                      .map(
                        (related) =>
                          related.title.userPreferred +
                          ' (' +
                          related.type +
                          ')'
                      )
                      .join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          {IsAdmin() && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={syncAnime}
            >
              Sync
            </button>
          )}
          {IsAdmin() && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={blackListResult}
            >
              Incorrect
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
            onClick={closePopup}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const secondToDuration = (t) => {
  const cd = 24 * 60 * 60;
  const ch = 60 * 60;
  let d = Math.floor(t / cd);
  let h = Math.floor((t - d * cd) / ch);
  let m = Math.round((t - d * cd - h * ch) / 60000);
  if (m === 60) {
    h++;
    m = 0;
  }
  if (h === 24) {
    d++;
    h = 0;
  }
  return d + ' days ' + h + ' hours ';
};

export default AnimeInfoPopup;
