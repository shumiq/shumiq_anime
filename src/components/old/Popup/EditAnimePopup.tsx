import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'bootstrap';
import { Database } from '../../../utils/firebase';
import { Anime } from '../../../utils/types';

type Modal = {
  show: () => void;
  hide: () => void;
};

const EditAnimePopup = (props: {
  show: boolean;
  anime_key: string;
  onClose: () => void;
  anime: Anime;
}): JSX.Element => {
  const anime = props.anime;
  const key = props.anime_key;
  const state: Anime = { ...anime };

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

  const saveAnime = useCallback(() => {
    Database.update.anime(key, state);
    closePopup();
  }, [key, state, closePopup]);

  const deleteAnime = useCallback(() => {
    if (window.confirm('Do you want to delete "' + anime.title + '" ?')) {
      Database.update.anime(key, null);
      closePopup();
    }
  }, [key, anime, closePopup]);

  const updateFormData = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      state[event.target.name] = event.target.value;
    },
    [state]
  );

  return (
    <div className="EditAnimePopup">
      <div className="modal fade">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content w-auto mx-auto">
            <div className="modal-header">
              <h5 className="modal-title">Edit {anime.title}</h5>
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
              <div id="editPopup">
                <div className="form-row text-left">
                  <div className="col">
                    <small className="form-text text-muted">Title</small>

                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      defaultValue={anime.title}
                      onChange={updateFormData}
                    />
                  </div>
                  <div className="col">
                    <small className="form-text text-muted">Studio</small>

                    <input
                      type="text"
                      className="form-control"
                      name="studio"
                      defaultValue={anime.studio}
                      onChange={updateFormData}
                    />
                  </div>
                </div>
                <div className="form-row text-left">
                  <div className="col">
                    <small className="form-text text-muted">View</small>

                    <input
                      type="number"
                      className="form-control"
                      name="view"
                      defaultValue={anime.view}
                      onChange={updateFormData}
                    />
                  </div>
                  <div className="col">
                    <small className="form-text text-muted">Download</small>

                    <input
                      type="number"
                      className="form-control"
                      name="download"
                      defaultValue={anime.download}
                      onChange={updateFormData}
                    />
                  </div>
                  <div className="col">
                    <small className="form-text text-muted">All episodes</small>

                    <input
                      type="text"
                      className="form-control"
                      name="all_episode"
                      defaultValue={anime.all_episode}
                      onChange={updateFormData}
                    />
                  </div>
                </div>
                <div className="form-row text-left">
                  <div className="col">
                    <small className="form-text text-muted">Year</small>

                    <input
                      type="number"
                      className="form-control"
                      name="year"
                      defaultValue={anime.year}
                      onChange={updateFormData}
                    />
                  </div>
                  <div className="col">
                    <small className="form-text text-muted">Season</small>

                    <select
                      className="form-control"
                      name="season"
                      defaultValue={anime.season}
                      onChange={updateFormData}
                    >
                      <option value="1">Winter</option>
                      <option value="2">Spring</option>
                      <option value="3">Summer</option>
                      <option value="4">Fall</option>
                    </select>
                  </div>
                  <div className="col">
                    <small className="form-text text-muted">Score</small>

                    <input
                      type="text"
                      className="form-control"
                      name="score"
                      defaultValue={anime.score}
                      onChange={updateFormData}
                    />
                  </div>
                </div>
                <div className="form-group text-left">
                  <small className="form-text text-muted">Cover image</small>

                  <input
                    type="text"
                    className="form-control"
                    name="cover_url"
                    defaultValue={anime.cover_url}
                    onChange={updateFormData}
                  />
                  <small className="form-text text-muted">Path</small>

                  <input
                    type="text"
                    className="form-control"
                    name="path"
                    defaultValue={anime.path}
                    onChange={updateFormData}
                  />
                  <small className="form-text text-muted">Download URL</small>

                  <input
                    type="text"
                    className="form-control"
                    name="download_url"
                    defaultValue={anime.download_url}
                    onChange={updateFormData}
                  />
                  <small className="form-text text-muted">Tags</small>

                  <input
                    type="text"
                    className="form-control"
                    name="genres"
                    defaultValue={anime.genres}
                    onChange={updateFormData}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveAnime}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={deleteAnime}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAnimePopup;
