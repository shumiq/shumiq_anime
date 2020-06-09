import mockDatabase from '../mock/database.json';
import { Database } from './firebase';
import { getLocalStorage } from './localstorage';
import Firebase from './config/firebaseConfig';

jest.mock('./localstorage');
jest.mock('./config/firebaseConfig');

const currentDate = (): string => {
  const ts = new Date(Date.now());
  return (
    ts.getFullYear().toString() +
    ('0' + (ts.getMonth() + 1)).slice(-2) +
    ('0' + ts.getDate()).slice(-2)
  );
};

// const flushPromises = () => new Promise(setImmediate);

describe('Database', () => {
  it('should has correct status', async () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    const status = Database.status();
    expect(status).toEqual({
      anime: {
        files: 3,
        series: 2,
        view: 1,
      },
      conan: {
        cases: 2,
        files: 5,
      },
      keyaki: {
        episodes: 2,
        files: 3,
      },
    });
  });

  it('should upload file when call backup', async () => {
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    await Database.backup();
    expect(Firebase.storage.create).toHaveBeenCalledWith(
      'backup',
      currentDate() + '.json',
      JSON.stringify(mockDatabase),
      {
        customMetadata: {
          animeFiles: '3',
          animeSeries: '2',
          animeView: '1',
          conanCases: '2',
          conanFiles: '5',
          keyakiEpisodes: '2',
          keyakiFiles: '3',
        },
      }
    );
  });

  it('should backup when latest is more than 1 week', async () => {
    (Firebase.storage.list as jest.Mock).mockResolvedValue([
      { timeCreated: Date.now() - 1000 * 60 * 60 * 24 * 10 },
    ]);
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    await Database.runAutoBackup();
    expect(Firebase.storage.create).toHaveBeenCalled();
  });

  it('should not backup when latest is less than 1 week', async () => {
    (Firebase.storage.list as jest.Mock).mockResolvedValue([
      { timeCreated: Date.now() - 1000 * 60 * 60 * 24 * 5 },
    ]);
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    await Database.runAutoBackup();
    expect(Firebase.storage.create).not.toHaveBeenCalled();
  });

  it('should delete backups with older than 3 month', async () => {
    (Firebase.storage.list as jest.Mock).mockResolvedValue([
      { timeCreated: Date.now() - 1000 * 60 * 60 * 24 * 80 },
      { timeCreated: Date.now() - 1000 * 60 * 60 * 24 * 100 },
      { timeCreated: Date.now() - 1000 * 60 * 60 * 24 * 110 },
    ]);
    (getLocalStorage as jest.Mock).mockReturnValue(mockDatabase);
    await Database.runAutoDelete();
    expect(Firebase.storage.delete).toHaveBeenCalledTimes(2);
  });
});
