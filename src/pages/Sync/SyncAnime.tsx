import React, { useCallback, useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import { Anime } from '../../models/Type';
import { Database } from '../../services/Firebase/Firebase';
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
import Avatar from '@material-ui/core/Avatar';
import { File, ListResponse } from '../../models/SynologyApi';
import SynologyApi from '../../services/Synology/Synology';
import CircularProgress from '@material-ui/core/CircularProgress';

const SyncAnime = ({ active }: { active: boolean }) => {
  const dispatch = useDispatch();
  const animeList = useSelector(Selector.getDatabase).anime;
  //const database = useSelector(Selector.getDatabase);
  const [loading, setLoading] = useState(false);
  const [animeFolder, setAnimeFolder] = useState<Record<string, File>>({});
  const [sortedAnimeList, setSortedAnimeList] = useState<[string, Anime][]>([]);
  const [folderList, setFolderList] = useState<ListResponse>({
    data: {},
    success: false,
  });

  useEffect(() => {
    if (active) {
      setLoading(true);
      void SynologyApi.list('Anime', false, true).then((folders) => {
        setFolderList(folders);
        setLoading(false);
      });
    }
  }, [dispatch, active]);

  useEffect(() => {
    if (folderList?.data?.files && Object.entries(animeList)) {
      const tempAnimeFolder: Record<string, File> = {};
      //const tempDatabase = JSON.parse(JSON.stringify(database)) as DatabaseType;
      Object.entries(animeList).forEach(([key, anime]) => {
        const folder = folderList.data.files?.find(
          (f) => f.name === anime.title
        );
        if (folder) {
            tempAnimeFolder[key] = folder;
        }
        //tempDatabase.anime[key].last_update = (folder?.additional?.time.mtime || 0) * 1000;
      });
      //Database.update.database(tempDatabase);
      setAnimeFolder(tempAnimeFolder);
    }
  }, [animeList, folderList]);

  useEffect(() => {
    if (Object.entries(animeList)) {
      const sortedList = Object.entries(animeList)
        .sort((entriesA, entriesB) => {
          const a = entriesA[1];
          const b = entriesB[1];
          if (
            b.year * 10 + (b.season % 10) - (a.year * 10 + (a.season % 10)) ===
            0
          )
            return a.title < b.title ? -1 : 1;
          else
            return (
              b.year * 10 + (b.season % 10) - (a.year * 10 + (a.season % 10))
            );
        })
        .filter(([key, anime]) => !anime.title.includes('Conan')); // Exclude Conan
      setSortedAnimeList(sortedList);
    }
  }, [animeList]);

  const handleUpdate = useCallback(
    async (key: string, anime: Anime) => {
      dispatch(Action.showLoading(true));
      const folder = await SynologyApi.list(`Anime${anime.path}`);
      if (!folder.data) {
        dispatch(Action.showLoading(false));
        return;
      }
      anime.download = folder.data.total || 0;
      anime.size = animeFolder[key]?.additional?.size || 0;
      anime.last_update = (animeFolder[key]?.additional?.time?.mtime || 0) * 1000 || Date.now();
      Database.update.anime(key, anime);
      dispatch(Action.showLoading(false));
    },
    [dispatch, animeFolder]
  );

  const handleSync = useCallback(
    (key: string, anime: Anime) => {
      const folder = animeFolder[key];
      if (folder) anime.path = '/' + folder.name;
      anime.size = 0;
      Database.update.anime(key, anime);
      void handleUpdate(key, anime);
    },
    [animeFolder, handleUpdate]
  );

  const onlyUpdateAnime = sortedAnimeList.filter(
    ([key, anime]) =>
      anime.path === '' ||
      (animeFolder[key]?.additional?.size || 0) > anime.size
  );

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <Typography align={'center'}>Title</Typography>
              </TableCell>
              <TableCell>
                <Typography align={'center'}>Downloaded</Typography>
              </TableCell>
              <TableCell>
                <Typography align={'center'}>Sync</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell width={4} align={'center'} colSpan={6}>
                  <CircularProgress color="inherit" />
                </TableCell>
              </TableRow>
            )}
            {onlyUpdateAnime.map(
              ([key, anime]) =>
                anime !== null && (
                  <TableRow key={key}>
                    <TableCell align={'center'}>
                      <Avatar src={anime.cover_url} />
                    </TableCell>
                    <TableCell align={'left'}>{anime.title}</TableCell>
                    <TableCell align={'center'}>{anime.download}</TableCell>
                    <TableCell align={'center'}>
                      {anime.path.length > 0 &&
                        (animeFolder[key]?.additional?.size || 0) >
                          anime.size && (
                          <IconButton
                            color={'primary'}
                            onClick={() => handleUpdate(key, { ...anime })}
                          >
                            <SyncIcon />
                          </IconButton>
                        )}
                      {anime.path === '' && animeFolder[key] && (
                        <IconButton
                          onClick={() => handleSync(key, { ...anime })}
                        >
                          <SyncIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </Container>
    </React.Fragment>
  );
};

export default SyncAnime;
