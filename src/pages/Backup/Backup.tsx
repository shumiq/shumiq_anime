import React, { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import GeneralPopup from '../../components/Popup/GeneralPopup';
import { Database } from '../../utils/firebase';

const Backup = (): JSX.Element => {
  const [backupFiles, setBackupFiles] = useState<
    {
      name: string;
      timeCreated: number;
      generation: string;
      customMetadata: Record<string, string>;
      data: unknown;
      download: string;
    }[]
  >([]);
  const [popup, setPopup] = useState<JSX.Element | string>('');
  const [status, setStatus] = useState(Database.status());

  const showLoadingPopup = useCallback((show: boolean) => {
    setPopup(
      <GeneralPopup
        show={show}
        message="Loading..."
        canClose={false}
        onClose={() => setPopup(<div />)}
      />
    );
  }, []);

  useEffect(() => {
    Database.subscribe((db) => {
      setStatus(Database.status());
    });
  }, []);

  useEffect(() => {
    const fetchBackupFiles = async () => {
      showLoadingPopup(true);
      const files = await Database.backupFiles();
      setBackupFiles(files);
      showLoadingPopup(false);
    };
    void fetchBackupFiles();
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

  const restore = useCallback((data) => {
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
          <table className="table table-hover mt-5 table-borderless">
            <thead>
              <tr className="table-bordered">
                <th className="text-center">File</th>
                <th className="text-center">Anime</th>
                <th className="text-center">Conan</th>
                <th className="text-center">Keyaki</th>
                <th className="text-center"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-dark table-bordered border-left-0 border-right-0">
                <td className="pt-4">(current)</td>
                <td>
                  <p className="m-0 p-0 small">
                    Series: {status?.anime?.series}
                  </p>
                  <p className="m-0 p-0 small">
                    Download: {status?.anime?.files}
                  </p>
                  <p className="m-0 p-0 small">View: {status?.anime?.view}</p>
                </td>
                <td>
                  <p className="m-0 p-0 small">Cases: {status?.conan?.cases}</p>
                  <p className="m-0 p-0 small">
                    Download: {status?.conan?.files}
                  </p>
                </td>
                <td>
                  <p className="m-0 p-0 small">
                    Episodes: {status?.keyaki?.episodes}
                  </p>
                  <p className="m-0 p-0 small">
                    Download: {status?.keyaki?.files}
                  </p>
                </td>
                <td className="pt-3">
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
                  <tr
                    key={file.generation}
                    className="table-bordered border-left-0 border-right-0"
                  >
                    <td className="pt-4">{file.name}</td>
                    <td>
                      <p className="m-0 p-0 small">
                        Series: {file.customMetadata.animeSeries}
                      </p>
                      <p className="m-0 p-0 small">
                        Download: {file.customMetadata.animeFiles}
                      </p>
                      <p className="m-0 p-0 small">
                        View: {file.customMetadata.animeView}
                      </p>
                    </td>
                    <td>
                      <p className="m-0 p-0 small">
                        Cases: {file.customMetadata.conanCases}
                      </p>
                      <p className="m-0 p-0 small">
                        Download: {file.customMetadata.conanFiles}
                      </p>
                    </td>
                    <td>
                      <p className="m-0 p-0 small">
                        Episodes: {file.customMetadata.keyakiEpisodes}
                      </p>
                      <p className="m-0 p-0 small">
                        Download: {file.customMetadata.keyakiFiles}
                      </p>
                    </td>
                    <td className="pt-3">
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
