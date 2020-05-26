import { getLocalStorage } from '../../utils/localstorage';
import { Database } from '../../utils/firebase';
import AnilistApi from '../../api/anilist';
import { SeasonEnum } from '../../utils/enum';
import React, { useCallback, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

const AddAnimePopup = (props) => {
  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const closePopup = useCallback(() => props.setShow(false), [props]);
  const addAnime = useCallback(
    (anime) => {
      const animeList = getLocalStorage('database')?.animeList;
      if (!animeList) return;
      let key = animeList.length;
      while (animeList[key]) key++;
      const newAnime = {
        key: key,
        title: anime.title?.romaji,
        studio: anime.studios?.nodes[0]?.name,
        view: 0,
        download: 0,
        url: '',
        score: anime.averageScore
          ? (anime.averageScore / 10.0).toFixed(1)
          : '0.0',
        download_url: '',
        all_episode: anime.episodes ? anime.episodes : '?',
        season:
          SeasonEnum[
            anime.season.charAt(0) + anime.season.slice(1).toLowerCase()
          ],
        year: anime.startDate.year,
        info: anime.description,
        genres: anime.genres.join(', '),
        cover_url: anime.coverImage.large,
      };
      Database.saveAnime(key, newAnime);
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
        size="md"
        centered
        backdrop={true}
        keyboard={true}
        animation={true}
        onHide={closePopup}
      >
        <Modal.Body className="text-center">
          <table className="table m-0">
            <tbody>
              <tr>
                <td className="p-0 text-center">
                  <input
                    type="text"
                    name="input"
                    className="form-control"
                    defaultValue={props.default}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </td>
                <td className="p-0 text-center">
                  <button
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
                        <td>
                          <button
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
