import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Modal } from 'bootstrap';
import { Database } from '../../../services/Firebase/Firebase';
import AnilistApi from '../../../services/Anilist/Anilist';
import { Season } from '../../../models/Constants';
import { Anime } from '../../../models/Type';
import { AnilistInfoResponse } from '../../../models/AnilistApi';

type Modal = {
  show: () => void;
  hide: () => void;
};

const AddAnimePopup = (props: {
  show: boolean;
  onClose: () => void;
}): JSX.Element => {
  const [keyword, setKeyword] = useState<string>('');
  const [searchResult, setSearchResult] = useState<AnilistInfoResponse[]>([]);
  const onClose = useCallback(() => props.onClose(), [props]);
  const [modal, setModal] = useState<Modal>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const closePopup = useCallback(() => modal?.hide(), [modal]);
  useEffect(() => {
    const popupElement = document.querySelector('.modal');
    if (popupElement) {
      setModal(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        new Modal(popupElement) as Modal
      );
    }
  }, []);
  useEffect(() => {
    if (modal)
      if (props.show) modal.show();
      else modal.hide();
  }, [modal, props.show]);
  useEffect(() => {
    const popupElement = document.querySelector('.modal');
    if (popupElement !== null) {
      popupElement.addEventListener('hidden.bs.modal', onClose);
    }
  }, [onClose]);
  const addAnime = useCallback(
    (anime: AnilistInfoResponse): void => {
      const newAnime: Anime = {
        title: anime.title?.romaji,
        studio: anime.studios?.nodes[0]?.name,
        view: 0,
        download: 0,
        path: '',
        size: 0,
        score: anime.averageScore
          ? (anime.averageScore / 10.0).toFixed(1)
          : '0.0',
        download_url: '',
        all_episode: anime.episodes ? anime.episodes.toString() : '?',
        season: parseInt(
          Season[
            anime.season.charAt(0) + anime.season.slice(1).toLowerCase()
          ] as string
        ),
        year: anime.startDate.year,
        info: anime.description,
        genres: anime.genres.join(', '),
        cover_url: anime.coverImage.large,
      };
      Database.add.anime(newAnime);
      closePopup();
    },
    [closePopup]
  );
  const searchAnime = useCallback(async () => {
    const result = await AnilistApi.searchAnime(keyword);
    setSearchResult(result.slice(0, 5));
  }, [keyword]);
  return (
    <div className="AddAnimePopup">
      <div className="modal fade">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content w-auto mx-auto">
            <div className="modal-header">
              <h5 className="modal-title">Add anime</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-center">
              <table className="table m-0 table-borderless">
                <tbody>
                  <tr>
                    <td className="p-0 text-center w-100">
                      <input
                        type="text"
                        name="input"
                        className="form-control"
                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                          setKeyword(e.target.value)
                        }
                      />
                    </td>
                    <td className="p-0 pl-2 text-center">
                      <button
                        id="btn-search"
                        type="button"
                        className="btn btn-primary"
                        onClick={searchAnime}
                      >
                        Search
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              {searchResult && searchResult.length > 0 && (
                <table className="table m-0 table-borderless">
                  <tbody>
                    {searchResult.map(
                      (anime) =>
                        anime &&
                        anime.season && (
                          <tr key={anime.id} className="text-left">
                            <td>
                              <small>{anime.title.userPreferred}</small>
                            </td>
                            <td>
                              <small>
                                {anime.startDate.year} {anime.season}
                              </small>
                            </td>
                            <td className="text-right">
                              <button
                                id="btn-add"
                                className="btn btn-secondary"
                                onClick={() => addAnime(anime)}
                              >
                                Add
                              </button>
                            </td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAnimePopup;
