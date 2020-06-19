import React, { useCallback, useState, ChangeEvent } from 'react';
import Modal from 'react-bootstrap/Modal';
import { getLocalStorage } from '../../utils/localstorage';
import { Database } from '../../utils/firebase';
import AnilistApi from '../../api/anilist';
import { SeasonEnum } from '../../utils/enum';
import {
  AnilistInfoResponse,
  Anime,
  Database as DatabaseType,
} from '../../utils/types';

const AddAnimePopup = (props: {
  show: boolean;
  setShow: (show: boolean) => void;
}): JSX.Element => {
  const [keyword, setKeyword] = useState<string>('');
  const [searchResult, setSearchResult] = useState<AnilistInfoResponse[]>([]);
  const closePopup = useCallback(() => props.setShow(false), [props]);
  const addAnime = useCallback(
    (anime: AnilistInfoResponse): void => {
      const animeList: Record<string, Anime> = (getLocalStorage(
        'database'
      ) as DatabaseType).animeList;
      if (!animeList) return;
      let keyLength = Object.keys(animeList).length;
      while (animeList['anime' + keyLength.toString()]) keyLength++;
      const key = 'anime' + keyLength.toString();
      const newAnime: Anime = {
        key: key,
        title: anime.title?.romaji,
        studio: anime.studios?.nodes[0]?.name,
        view: 0,
        download: 0,
        url: '',
        gdriveid: '',
        gdriveid_public: '',
        gphotoid: '',
        score: anime.averageScore
          ? (anime.averageScore / 10.0).toFixed(1)
          : '0.0',
        download_url: '',
        all_episode: anime.episodes ? anime.episodes.toString() : '?',
        season: parseInt(
          SeasonEnum[
            anime.season.charAt(0) + anime.season.slice(1).toLowerCase()
          ] as string
        ),
        year: anime.startDate.year,
        info: anime.description,
        genres: anime.genres.join(', '),
        cover_url: anime.coverImage.large,
      };
      Database.update.anime(key, newAnime);
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
      <Modal
        show={props.show}
        size="lg"
        centered
        backdrop={true}
        keyboard={true}
        animation={true}
        onHide={closePopup}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add anime</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <table className="table m-0">
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
            <table className="table m-0">
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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddAnimePopup;
