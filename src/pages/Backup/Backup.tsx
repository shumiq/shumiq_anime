import React, { useCallback, useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import { Database as DatabaseType } from '../../models/Type';
import { Database } from '../../services/Firebase/Firebase';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Selector } from '../../utils/Store/AppStore';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import BackupIcon from '@material-ui/icons/Backup';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import GetAppIcon from '@material-ui/icons/GetApp';

const Backup = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
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
  const database = useSelector(Selector.getDatabase);
  const currentDatabaseStatus = Database.status(database);
  useEffect(() => {
    const fetchBackupFiles = async () => {
      setLoading(true);
      const files = await Database.backupFiles();
      setBackupFiles(files);
      setLoading(false);
    };
    void fetchBackupFiles();
  }, [dispatch]);

  const handleDelete = useCallback(
    async (fileName) => {
      dispatch(Action.showLoading(true));
      await Database.deleteBackup(fileName);
      dispatch(Action.showLoading(false));
      setLoading(true);
      const files = await Database.backupFiles();
      setBackupFiles(files);
      setLoading(false);
    },
    [dispatch]
  );

  const handleRestore = useCallback((data: DatabaseType) => {
    if (window.confirm('Do you want to restore database with this backup?')) {
      Database.update.database(data);
    }
  }, []);

  const handleBackup = useCallback(
    async (db: DatabaseType) => {
      dispatch(Action.showLoading(true));
      await Database.backup(db);
      const files = await Database.backupFiles();
      setBackupFiles(files);
      dispatch(Action.showLoading(false));
    },
    [dispatch]
  );

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align={'left'}>Filename</TableCell>
              <TableCell align={'left'}>Anime</TableCell>
              <TableCell align={'left'}>Conan</TableCell>
              <TableCell align={'left'}>Keyakizaka46</TableCell>
              <TableCell align={'left'}>Sakurazaka46</TableCell>
              <TableCell align={'center'}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align={'left'}>
                <Typography
                  variant={'caption'}
                  color={'textSecondary'}
                  display={'block'}
                >
                  Current
                </Typography>
              </TableCell>
              <TableCell align={'left'}>
                <Typography
                  variant={'caption'}
                  color={'textSecondary'}
                  display={'block'}
                >
                  Series: {currentDatabaseStatus.anime?.series}
                </Typography>
                <Typography
                  variant={'caption'}
                  color={'textSecondary'}
                  display={'block'}
                >
                  Downloads: {currentDatabaseStatus.anime?.files}
                </Typography>
                <Typography
                  variant={'caption'}
                  color={'textSecondary'}
                  display={'block'}
                >
                  Views: {currentDatabaseStatus.anime?.view}
                </Typography>
              </TableCell>
              <TableCell align={'left'}>
                <Typography
                  variant={'caption'}
                  color={'textSecondary'}
                  display={'block'}
                >
                  Cases: {currentDatabaseStatus.conan?.cases}
                </Typography>
                <Typography
                  variant={'caption'}
                  color={'textSecondary'}
                  display={'block'}
                >
                  Downloads: {currentDatabaseStatus.conan?.files}
                </Typography>
              </TableCell>
              <TableCell align={'left'}>
                <Typography
                  variant={'caption'}
                  color={'textSecondary'}
                  display={'block'}
                >
                  Episodes: {currentDatabaseStatus.keyaki?.episodes}
                </Typography>
                <Typography
                  variant={'caption'}
                  color={'textSecondary'}
                  display={'block'}
                >
                  Downloads: {currentDatabaseStatus.keyaki?.files}
                </Typography>
              </TableCell>
              <TableCell align={'left'}>
                <Typography
                  variant={'caption'}
                  color={'textSecondary'}
                  display={'block'}
                >
                  Episodes: {currentDatabaseStatus.sakura?.episodes}
                </Typography>
                <Typography
                  variant={'caption'}
                  color={'textSecondary'}
                  display={'block'}
                >
                  Downloads: {currentDatabaseStatus.sakura?.files}
                </Typography>
              </TableCell>
              <TableCell align={'center'}>
                <IconButton onClick={() => handleBackup(database)}>
                  <BackupIcon />
                </IconButton>
              </TableCell>
            </TableRow>
            {loading && (
              <TableRow>
                <TableCell width={6} align={'center'} colSpan={6}>
                  <CircularProgress color="inherit" />
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              backupFiles.map((backupFile) => (
                <TableRow key={backupFile.name}>
                  <TableCell align={'left'}>
                    <Typography
                      variant={'caption'}
                      color={'textSecondary'}
                      display={'block'}
                    >
                      {backupFile.name}
                    </Typography>
                  </TableCell>
                  <TableCell align={'left'}>
                    <Typography
                      variant={'caption'}
                      color={'textSecondary'}
                      display={'block'}
                    >
                      Series: {backupFile.customMetadata.animeSeries}
                    </Typography>
                    <Typography
                      variant={'caption'}
                      color={'textSecondary'}
                      display={'block'}
                    >
                      Downloads: {backupFile.customMetadata.animeFiles}
                    </Typography>
                    <Typography
                      variant={'caption'}
                      color={'textSecondary'}
                      display={'block'}
                    >
                      Views: {backupFile.customMetadata.animeView}
                    </Typography>
                  </TableCell>
                  <TableCell align={'left'}>
                    <Typography
                      variant={'caption'}
                      color={'textSecondary'}
                      display={'block'}
                    >
                      Cases: {backupFile.customMetadata.conanCases}
                    </Typography>
                    <Typography
                      variant={'caption'}
                      color={'textSecondary'}
                      display={'block'}
                    >
                      Downloads: {backupFile.customMetadata.conanFiles}
                    </Typography>
                  </TableCell>
                  <TableCell align={'left'}>
                    <Typography
                      variant={'caption'}
                      color={'textSecondary'}
                      display={'block'}
                    >
                      Episodes: {backupFile.customMetadata.keyakiEpisodes}
                    </Typography>
                    <Typography
                      variant={'caption'}
                      color={'textSecondary'}
                      display={'block'}
                    >
                      Downloads: {backupFile.customMetadata.keyakiFiles}
                    </Typography>
                  </TableCell>
                  <TableCell align={'left'}>
                    <Typography
                      variant={'caption'}
                      color={'textSecondary'}
                      display={'block'}
                    >
                      Episodes: {backupFile.customMetadata.sakuraEpisodes}
                    </Typography>
                    <Typography
                      variant={'caption'}
                      color={'textSecondary'}
                      display={'block'}
                    >
                      Downloads: {backupFile.customMetadata.sakuraFiles}
                    </Typography>
                  </TableCell>
                  <TableCell align={'center'}>
                    <IconButton
                      onClick={() => window.open(backupFile.download)}
                    >
                      <GetAppIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleRestore(backupFile.data as DatabaseType)
                      }
                    >
                      <SettingsBackupRestoreIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(backupFile.name)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Container>
    </React.Fragment>
  );
};

export default Backup;
