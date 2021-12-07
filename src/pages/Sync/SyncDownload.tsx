import React, { useCallback, useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Selector } from '../../utils/Store/AppStore';
import Typography from '@material-ui/core/Typography';
import SyncIcon from '@material-ui/icons/Sync';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import FailIcon from '@material-ui/icons/Cancel';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import { File, ListResponse } from '../../models/SynologyApi';
import SynologyApi from '../../services/Synology/Synology';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import CircularProgress from '@material-ui/core/CircularProgress';
import storage from '../../utils/LocalStorage/LocalStorage';

const SyncDownload = ({ active }: { active: boolean }) => {
  const dispatch = useDispatch();
  const db = useSelector(Selector.getDatabase);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<ListResponse>({
    data: {},
    success: false,
  });
  const [targetPath, setTargetPath] = useState<
    Record<string, { target: string; candidates: string[] }>
  >({});

  const fetchFiles = useCallback(() => {
    setLoading(true);
    void SynologyApi.list('Downloads', false, true).then((folder) => {
      if (folder.data.files) {
        setFileList(folder);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (active) {
      void fetchFiles();
    }
  }, [dispatch, active, fetchFiles]);

  useEffect(() => {
    const getCandidateTarget = (file: File) => {
      let candidate: string[] = [];
      if (file.name.startsWith('Keyakitte Kakenai'))
        candidate.push('/Keyakitte Kakenai');
      if (file.name.startsWith('Soko Magattara, Sakurazaka'))
        candidate.push('/Soko Magattara Sakurazaka');
      if (file.name.startsWith('conan'))
        candidate.push('/Anime/Detective Conan');
      const animeCandidates = Object.values(db.anime)
        .filter(
          (anime) =>
            anime.path !== '' &&
            (anime.download.toString() !== anime.all_episode.toString() ||
              anime.download_url !== '') &&
            (file.name.toLowerCase().includes(anime.title.toLowerCase()) ||
              (anime.alt_title &&
                anime.alt_title.length > 0 &&
                file.name
                  .toLowerCase()
                  .includes(anime.alt_title.toLowerCase())))
        )
        .map((anime) => `/Anime${anime.path}`);
      candidate = candidate.concat(animeCandidates);
      const target = candidate.length > 0 ? candidate[0] : '';
      targetPath[file.path] = { target: target, candidates: candidate };
      setTargetPath(targetPath);
    };
    if (fileList.data.files) {
      fileList.data.files.forEach((file) => getCandidateTarget(file));
    }
  }, [fileList, db, targetPath]);

  const handleMove = async (filePath: string) => {
    if (targetPath[filePath]?.target) {
      dispatch(Action.showLoading(true));
      const success = await SynologyApi.move(
        filePath,
        targetPath[filePath].target
      );
      dispatch(Action.showLoading(false));
      if (success) fetchFiles();
      else {
        dispatch(Action.showMessage('Something wrong'));
      }
    }
  };

  const handleUpdateTarget = (path: string, target: string) => {
    if (targetPath[path]?.target) {
      targetPath[path].target = target;
      setTargetPath(targetPath);
    }
  };

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align={'center'}>File Name</TableCell>
              <TableCell align={'center'}>Sync to...</TableCell>
              <TableCell align={'center'}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell width={3} align={'center'} colSpan={6}>
                  <CircularProgress color="inherit" />
                </TableCell>
              </TableRow>
            )}
            {fileList.data.files &&
              fileList.data.files.map((file) => (
                <TableRow key={file.name}>
                  <TableCell>
                    <Typography align={'left'} variant={'caption'}>
                      {file.name}
                    </Typography>
                  </TableCell>
                  <TableCell align={'left'}>
                    {targetPath[file.path]?.candidates?.length > 0 && (
                      <Select
                        fullWidth
                        onChange={(e) =>
                          handleUpdateTarget(
                            file.path,
                            e.target.value as string
                          )
                        }
                        defaultValue={targetPath[file.path].target}
                        variant={'outlined'}
                      >
                        {targetPath[file.path].candidates.map((candidate) => (
                          <MenuItem value={candidate} key={candidate}>
                            {candidate}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </TableCell>
                  <TableCell align={'center'}>
                    {targetPath[file.path]?.candidates?.length > 0 && (
                      <IconButton onClick={() => handleMove(file.path)}>
                        <SyncIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Container>
    </React.Fragment>
  );
};

export default SyncDownload;
