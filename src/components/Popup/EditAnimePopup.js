import { Database } from '../../utils/firebase';
import React, { useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';

const EditAnimePopup = (props) => {
  const anime = props.anime;
  let state = JSON.parse(JSON.stringify(anime));

  const closePopup = useCallback(() => props.setShow(false), [props]);

  const saveAnime = useCallback(() => {
    Database.update.anime(state.key, state);
    closePopup();
  }, [state, closePopup]);

  const deleteAnime = useCallback(() => {
    if (window.confirm('Do you want to delete "' + anime.title + '" ?')) {
      Database.update.anime(state.key, null);
      closePopup();
    }
  }, [anime, state, closePopup]);

  const updateFormData = useCallback(
    (event) => {
      state[event.target.name] = event.target.value;
    },
    [state]
  );

  return (
    <div className="EditAnimePopup">
      <Modal
        show={props.show}
        centered
        backdrop={true}
        keyboard={true}
        animation={true}
        onHide={closePopup}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit (#{anime.key}) {anime.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
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
              <small className="form-text text-muted">Folder URL</small>

              <input
                type="text"
                className="form-control"
                name="url"
                defaultValue={anime.url}
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
        </Modal.Body>

        <Modal.Footer>
          <button type="button" className="btn btn-primary" onClick={saveAnime}>
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
            onClick={closePopup}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditAnimePopup;
