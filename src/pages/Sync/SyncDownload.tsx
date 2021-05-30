import React, { useEffect, useState } from 'react';
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
import { File, ListResponse } from '../../models/SynologyApi';
import SynologyApi from '../../services/Synology/Synology';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const SyncDownload = ({ active }: { active: boolean }) => {
  const dispatch = useDispatch();
  const db = useSelector(Selector.getDatabase);
  const [fileList, setFileList] = useState<ListResponse>({
    data: {},
    success: false,
  });
  const [targetPath, setTargetPath] = useState<
    Record<string, { target: string; candidates: string[] }>
  >({});

  useEffect(() => {
    if (active) {
      dispatch(Action.showLoading(true));
      void SynologyApi.list('Downloads', false, true).then((folder) => {
        if (folder.data.files) {
          setFileList(folder);
        }
        dispatch(Action.showLoading(false));
      });
    }
  }, [dispatch, active]);

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

  const handleMove = (filePath: string) => {
    if (targetPath[filePath]?.target) {
      console.log(filePath, targetPath[filePath].target);
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
              <TableCell>
                <Typography align={'left'}>File Name</Typography>
              </TableCell>
              <TableCell>
                <Typography align={'center'}>Sync to...</Typography>
              </TableCell>
              <TableCell>
                <Typography align={'center'}>Sync</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
