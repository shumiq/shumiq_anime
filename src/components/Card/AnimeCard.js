import React, { useCallback } from 'react';
import { SeasonEnum, CardLayout } from '../../utils/enum';
import UserDetail from '../../utils/userdetail';
import EditAnimePopup from '../../components/Popup/EditAnimePopup';
import { Database } from '../../utils/firebase';
import AnilistApi from '../../api/anilist';
import AnimeInfoPopup from '../Popup/AnimeInfoPopup';
import { getLocalStorage } from '../../utils/localstorage';
import GeneralPopup from '../Popup/GeneralPopup';
import AnimeFolderPopup from '../Popup/AnimeFolderPopup';
import GoogleDriveApi from '../../api/googledrive';
import GooglePhotoApi from '../../api/googlephoto';
import FilesPopup from '../Popup/FilesPopup';
import ClipboardPopup from '../Popup/ClipboardPopup';

const AnimeCard = (props) => {
  const anime = props.anime;
  const setPopup = props.setPopup;
  const layout =
    JSON.stringify(getLocalStorage('layout')) !== '{}'
      ? getLocalStorage('layout')
      : 'auto';

  const increase = useCallback(
    (field) => {
      let animeCopy = JSON.parse(JSON.stringify(anime));
      animeCopy[field] = parseInt(animeCopy[field]) + 1;
      Database.update.anime(anime.key, animeCopy);
    },
    [anime]
  );

  const share = useCallback(() => {
    const url =
      'https://shumiq-anime.netlify.app/.netlify/functions/api/v1/share/' +
      anime.key;
    if (navigator?.share) {
      navigator.share({
        title: anime.title,
        url: url,
      });
    } else {
      const showClipboardPopup = (show) => {
        setPopup(
          <ClipboardPopup text={url} show={show} setShow={showClipboardPopup} />
        );
      };
      showClipboardPopup(true);
    }
  }, [anime, setPopup]);

  const showInfo = useCallback(async () => {
    setPopup(
      <GeneralPopup show={true} message="Loading..." canClose={false} />
    );
    const response = await AnilistApi.getAnime(anime.title, anime.blacklist);
    setPopup(
      <GeneralPopup show={false} message="Loading..." canClose={false} />
    );
    const showInfoPopup = (show) => {
      setPopup(
        <AnimeInfoPopup
          anime={anime}
          info={response}
          show={show}
          setShow={showInfoPopup}
        />
      );
    };
    showInfoPopup(true);
  }, [anime, setPopup]);

  const showFolder = useCallback(async () => {
    setPopup(
      <GeneralPopup show={true} message="Loading..." canClose={false} />
    );
    const driveFiles = await GoogleDriveApi.getFiles(anime.gdriveid_public);
    const photoFiles = await GooglePhotoApi.getMedias(anime.gphotoid);
    setPopup(
      <GeneralPopup show={false} message="Loading..." canClose={false} />
    );
    let files = {};
    driveFiles.forEach((file) => {
      if (!files[file.name]) files[file.name] = {};
      files[file.name].name = file.name;
      files[file.name].driveUrl =
        'https://drive.google.com/file/d/' + file.id + '/preview?usp=drivesdk';
    });
    photoFiles.forEach((file) => {
      if (!files[file.filename]) files[file.filename] = {};
      files[file.filename].name = file.filename;
      files[file.filename].photoUrl = file.productUrl;
    });

    const showFolderPopup = (show) => {
      setPopup(
        <AnimeFolderPopup
          folderFiles={files}
          show={show}
          setShow={showFolderPopup}
        />
      );
    };
    showFolderPopup(true);
  }, [anime, setPopup]);

  const showEditPopup = useCallback(
    (show) => {
      setPopup(
        <EditAnimePopup anime={anime} show={show} setShow={showEditPopup} />
      );
    },
    [anime, setPopup]
  );

  const showFilesPopup = useCallback(
    (show) => {
      const driveUrl = anime.gdriveid_public
        ? 'http://doc.google.com/drive/folders/' + anime.gdriveid_public
        : '';
      const photoUrl = anime.url ? anime.url : '';
      setPopup(
        <FilesPopup
          driveUrl={driveUrl}
          photoUrl={photoUrl}
          show={show}
          setShow={showFilesPopup}
        />
      );
    },
    [anime, setPopup]
  );

  return (
    <div className={'anime-card p-3 ' + CardLayout[layout]}>
      <div
        className={
          'card ' +
          (UserDetail.isAdmin() &&
          anime.view.toString() !== anime.download.toString()
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
            {UserDetail.isAdmin() &&
              (!anime.gdriveid_public || !anime.gphotoid) && (
                <button
                  id="btn-folder-internal"
                  className="btn btn-outline-secondary disabled h-auto border-0"
                >
                  <i className="material-icons align-middle">folder</i>
                </button>
              )}
            {UserDetail.isAdmin() && anime.gdriveid_public && anime.gphotoid && (
              <button
                id="btn-folder-internal"
                className="btn btn-outline-light h-auto border-0"
                onClick={showFolder}
              >
                <i className="material-icons align-middle">folder</i>
              </button>
            )}

            <button
              id="btn-folder-external"
              className="btn btn-outline-light h-auto border-0"
              onClick={() => showFilesPopup(true)}
            >
              <i className="material-icons align-middle">photo_library</i>
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
