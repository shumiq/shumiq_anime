import React, { useCallback } from 'react';
import { SeasonEnum, CardLayout } from '../../../models/Constants';
import UserDetail from '../../../services/UserDetail/UserDetail';
import EditAnimePopup from '../Popup/EditAnimePopup';
import { Database } from '../../../services/Firebase/Firebase';
import AnilistApi from '../../../services/Anilist/anilist';
import AnimeInfoPopup from '../Popup/AnimeInfoPopup';
import { getLocalStorage } from '../../../utils/LocalStorage/LocalStorage';
import GeneralPopup from '../Popup/GeneralPopup';
import AnimeFolderPopup from '../Popup/AnimeFolderPopup';
import ClipboardPopup from '../Popup/ClipboardPopup';
import { Anime } from '../../../models/Type';
import SynologyApi from '../../../services/Synology/Synology';

const AnimeCard = (props: {
  anime: Anime;
  anime_key: string;
  setPopup: (popup: string | JSX.Element) => void;
}): JSX.Element => {
  const anime = props.anime;
  const key = props.anime_key;
  const setPopup = props.setPopup;
  const layout =
    JSON.stringify(getLocalStorage('layout')) !== '{}'
      ? (getLocalStorage('layout') as string)
      : 'auto';

  const increase = useCallback(
    (field: string): void => {
      const animeCopy = { ...anime };
      animeCopy[field] = parseInt(animeCopy[field]) + 1;
      Database.update.anime(key, animeCopy);
    },
    [key, anime]
  );

  const share = useCallback((): void => {
    const url =
      (process.env.REACT_APP_API_ENDPOINT?.toString() ||
        'http://localhost:3000') +
      '/api/share?anime=' +
      key.toString();
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    /* eslint-disable  @typescript-eslint/no-unsafe-call */
    /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
    if ((navigator as any).share) {
      void (navigator as any).share({
        title: anime.title,
        url: url,
      });
    } else {
      const showClipboardPopup = (show: boolean) => {
        setPopup(
          <ClipboardPopup text={url} show={show} onClose={() => setPopup('')} />
        );
      };
      showClipboardPopup(true);
    }
  }, [key, anime, setPopup]);

  const showInfo = useCallback(async (): Promise<void> => {
    setPopup(
      <GeneralPopup
        show={true}
        message="Loading..."
        canClose={false}
        onClose={() => setPopup('')}
      />
    );
    const response = await AnilistApi.getAnime(anime.title, anime.blacklist);
    setPopup(
      <GeneralPopup
        show={false}
        message="Loading..."
        canClose={false}
        onClose={() => setPopup('')}
      />
    );
    if (response != null) {
      const showInfoPopup = (show: boolean) => {
        setPopup(
          <AnimeInfoPopup
            anime={anime}
            anime_key={key}
            info={response}
            show={show}
            onClose={() => setPopup('')}
          />
        );
      };
      setTimeout(() => showInfoPopup(true), 500);
    }
  }, [key, anime, setPopup]);

  const showFolder = useCallback(async (): Promise<void> => {
    setPopup(
      <GeneralPopup
        show={true}
        message="Loading..."
        canClose={false}
        onClose={() => setPopup('')}
      />
    );
    const folder = await SynologyApi.list(`Anime${anime.path}`);
    setPopup(
      <GeneralPopup
        show={false}
        message="Loading..."
        canClose={false}
        onClose={() => setPopup('')}
      />
    );
    const showFolderPopup = (show: boolean) => {
      setPopup(
        <AnimeFolderPopup
          folderFiles={folder.data.files || []}
          show={show}
          onClose={() => setPopup('')}
        />
      );
    };
    setTimeout(() => showFolderPopup(true), 500);
  }, [anime, setPopup]);

  const showEditPopup = useCallback(
    (show: boolean) => {
      setPopup(
        <EditAnimePopup
          anime={anime}
          show={show}
          anime_key={key}
          onClose={() => setPopup('')}
        />
      );
    },
    [key, anime, setPopup]
  );

  return (
    <div className={'anime-card p-3 ' + (CardLayout[layout] as string)}>
      <div
        className={
          'card ' +
          (UserDetail.isAdmin() && anime.view !== anime.download
            ? 'border border-primary'
            : '')
        }
      >
        <div
          className="card-img-top "
          style={{
            background: 'url(' + anime.cover_url + ') center / cover',
            height: '360px',
          }}
        >
          <small
            className="position-absolute align-middle px-1 pb-0 pt-0 text-white rounded"
            style={{ top: '5px', left: '5px', background: 'rgba(0,0,0,0.5)' }}
          >
            <i
              className="material-icons"
              style={{ color: 'yellow', fontSize: '9px' }}
            >
              star
            </i>
            <b> {anime.score}</b>
          </small>
          <div
            className="position-absolute"
            style={{ top: '20px', right: '20px' }}
          >
            <button
              id="btn-share"
              className="btn btn-outline-light border-0 p-0 m-0"
              style={{ height: '24px' }}
              onClick={share}
            >
              <i className="material-icons">share</i>
            </button>
            {UserDetail.isAdmin() && (
              <button
                id="btn-edit"
                className="btn btn-outline-light border-0 p-0 m-0 ml-3"
                style={{ height: '24px' }}
                onClick={() => showEditPopup(true)}
              >
                <i className="material-icons">edit</i>
              </button>
            )}
          </div>
        </div>
        <div
          className="card-header position-absolute w-100 text-left p-2 h-auto pr-5"
          style={{
            background: 'rgba(0,0,0,0.5)',
            bottom: 'calc(100% - 360px)',
          }}
        >
          <p className="mb-0 mx-0 p-0 text-white text-left">{anime.title}</p>
          <p className="mb-0" style={{ marginTop: '-5px', minHeight: '5px' }}>
            <small className="text-white-50">{anime.genres}</small>
          </p>
          <div
            className="position-absolute"
            style={{ top: 'calc(50% - 12px)', right: '10px' }}
          >
            <button
              className="btn btn-outline-light border-0 p-0 m-0"
              style={{ height: '24px' }}
              id="btn-show-info"
              onClick={showInfo}
            >
              <i className="material-icons">info_outline</i>
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <table className="table m-0 table-borderless table-sm table-hover">
            <tbody className="text-muted">
              <tr>
                <td className="text-left px-3">
                  <small>Studio</small>
                </td>
                <td className="text-right px-3">
                  <small>{anime.studio}</small>
                </td>
              </tr>
              <tr>
                <td className="text-left px-3">
                  <small>Season</small>
                </td>
                <td className="text-right px-3">
                  <small>
                    {anime.year} {SeasonEnum[anime.season.toString()]}
                  </small>
                </td>
              </tr>
              {UserDetail.isAdmin() && (
                <tr>
                  <td className="text-left px-3">
                    <small>View</small>
                  </td>
                  <td className="text-right px-3">
                    <small>
                      {anime.view}/{anime.download}
                    </small>
                    {anime.view.toString() !== anime.download.toString() && (
                      <b
                        id="btn-add-view"
                        className="text-primary"
                        role="button"
                        style={{ cursor: 'pointer' }}
                        onClick={() => increase('view')}
                      >
                        +
                      </b>
                    )}
                  </td>
                </tr>
              )}
              <tr>
                <td className="text-left px-3">
                  <small>Download</small>
                </td>
                <td className="text-right px-3">
                  <small>
                    {anime.download}/{anime.all_episode}
                  </small>
                  {UserDetail.isAdmin() &&
                    anime.download.toString() !==
                      anime.all_episode.toString() && (
                      <b
                        id="btn-add-download"
                        className="text-primary"
                        style={{ cursor: 'pointer' }}
                        onClick={() => increase('download')}
                      >
                        +
                      </b>
                    )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card-footer p-1">
          <div className="d-flex justify-content-around w-auto">
            <button
              id="btn-folder-internal"
              className={`btn ${
                anime.path === ''
                  ? 'btn-outline-secondary disabled'
                  : 'btn-outline-light'
              } h-auto border-0`}
              onClick={showFolder}
            >
              <i className="material-icons align-middle">folder</i>
            </button>

            {UserDetail.isAdmin() && anime.download_url === '' && (
              <a
                id="btn-download"
                className="btn btn-outline-secondary disabled h-auto border-0"
                type="button"
                href={anime.download_url}
                target="blank"
              >
                <i className="material-icons align-middle">add_box</i>
              </a>
            )}
            {UserDetail.isAdmin() && anime.download_url !== '' && (
              <a
                id="btn-download"
                className="btn btn-outline-light h-auto border-0"
                role="button"
                href={anime.download_url}
                target="blank"
              >
                <i className="material-icons align-middle">add_box</i>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
