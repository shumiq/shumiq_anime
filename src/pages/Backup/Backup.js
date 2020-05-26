import { Database } from '../../utils/firebase';
import GeneralPopup from '../../components/Popup/GeneralPopup';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';

const Backup = () => {
  const [backupFiles, setBackupFiles] = useState([]);
  const [popup, setPopup] = useState('');
  const [status, setStatus] = useState('');

  const showLoadingPopup = useCallback((show) => {
    setPopup(
      <GeneralPopup show={show} message="Loading..." canClose={false} />
    );
  }, []);

  const currentStatus = useCallback(() => {
    const status = Database.status();
    return (
      <p className="m-0 p-0">
        Anime ({status.anime.series}/{status.anime.files}), Conan (
        {status.conan.cases}/{status.conan.files}), Keyaki (
        {status.keyaki.episodes}/{status.keyaki.files})
      </p>
    );
  }, []);

  useEffect(() => {
    Database.subscribe((db) => {
      setStatus(currentStatus());
    });
    setStatus(currentStatus());
  }, [currentStatus]);

  useEffect(() => {
    const fetchBackupFiles = async () => {
      showLoadingPopup(true);
      const files = await Database.backupFiles();
      setBackupFiles(files);
      showLoadingPopup(false);
    };
    fetchBackupFiles();
  }, [showLoadingPopup]);

  const deleteBackup = useCallback(
    async (fileName) => {
      showLoadingPopup(true);
      await Database.deleteBackup(fileName);
      const files = await Database.backupFiles();
      setBackupFiles(files);
      showLoadingPopup(false);
    },
    [showLoadingPopup]
  );

  const restore = useCallback(async (data) => {
    if (window.confirm('Do you want to restore database with this backup?')) {
      Database.update.database(data);
    }
  }, []);

  const backup = useCallback(async () => {
    showLoadingPopup(true);
    await Database.backup();
    const files = await Database.backupFiles();
    setBackupFiles(files);
    showLoadingPopup(false);
  }, [showLoadingPopup]);

  return (
    <div className="Backup">
      <div className="container p-0 my-5">
        <div className="row text-center w-100 m-0">
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="text-center">File</th>
                <th className="text-center">Status</th>
                <th className="text-center"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-dark">
                <td>(current)</td>
                <td>{status}</td>
                <td>
                  <button
                    id="btn-backup"
                    className="btn btn-outline-light border-0 p-0 m-0 ml-3"
                    style={{ height: '24px' }}
                    onClick={backup}
                  >
                    <i className="material-icons">backup</i>
                  </button>
                </td>
              </tr>
              {backupFiles &&
                backupFiles.map((file) => (
                  <tr key={file.generation}>
                    <td>{file.name}</td>
                    <td>
                      <p className="m-0 p-0">
                        Anime ({file.customMetadata.animeSeries}/
                        {file.customMetadata.animeFiles}), Conan (
                        {file.customMetadata.conanCases}/
                        {file.customMetadata.conanFiles}), Keyaki (
                        {file.customMetadata.keyakiEpisodes}/
                        {file.customMetadata.keyakiFiles})
                      </p>
                    </td>
                    <td>
                      <button
                        id="btn-restore"
                        className="btn btn-outline-light border-0 p-0 m-0 ml-3"
                        style={{ height: '24px' }}
                        onClick={() => restore(file.data)}
                      >
                        <i className="material-icons">restore</i>
                      </button>
                      <a
                        id="btn-download"
                        className="btn btn-outline-light border-0 p-0 m-0 ml-3"
                        role="button"
                        style={{ height: '24px' }}
                        href={file.download}
                        target="blank"
                      >
                        <i className="material-icons">cloud_download</i>
                      </a>
                      <button
                        id="btn-delete"
                        className="btn btn-outline-light border-0 p-0 m-0 ml-3"
                        style={{ height: '24px' }}
                        onClick={() => deleteBackup(file.name)}
                      >
                        <i className="material-icons">delete</i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {popup}
        </div>
      </div>
    </div>
  );
};

export default Backup;
