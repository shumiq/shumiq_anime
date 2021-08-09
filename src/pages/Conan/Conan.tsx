import React, { useCallback, useEffect, useState } from 'react';
import { Database } from '../../services/Firebase/Firebase';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Selector } from '../../utils/Store/AppStore';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import { PageSize } from '../../models/Constants';
import Pagination from '@material-ui/lab/Pagination';

const Conan = (): JSX.Element => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(Selector.isAdmin);
  const [editMode, setEditMode] = useState('');
  const conanList = useSelector(Selector.getDatabase).conan;
  const isRandom = useSelector(Selector.isRandom);
  const [select, setSelect] = useState(0);
  const [page, setPage] = useState(1);
  const totalPage = conanList ? Math.ceil(Object.entries(conanList).length / PageSize) : 0;
  const sortedConanList = conanList ? Object.entries(conanList).sort(
    (entryA, entryB) => entryA[1].case - entryB[1].case
  ) : [];
  const playList = sortedConanList.reduce((result, entry) => {
    if (!entry[1].episodes) return result;
    const eps = Object.keys(entry[1].episodes);
    eps.forEach((ep, index) => {
      result.push([
        `คดีที่ ${entry[1].case} - ` +
          entry[1].name +
          ` ${index + 1}/${eps.length} (ตอนที่ ${ep})`,
        entry[1].episodes[ep],
      ]);
    });
    return result;
  }, [] as [string, string][]);

  const showFiles = useCallback(
    (file: string) => {
      dispatch(Action.setPlaylist(playList));
      dispatch(Action.openVideo(file));
    },
    [dispatch, playList]
  );

  const handleUpdate = (name: string, key: string) => {
    const state = { ...conanList[key] };
    state.name = name;
    Database.update.conan(key, state);
    setEditMode('');
  };

  useEffect(() => {
    if (isRandom) {
      const allConan = Object.values(conanList);
      const conan = allConan[Math.floor(Math.random() * allConan.length)];
      void showFiles(Object.values(conan.episodes)[0]);
      setPage(Math.ceil(conan.case / PageSize));
      setSelect(conan.case);
      dispatch(Action.setRandom(false));
    }
  }, [isRandom, conanList, dispatch, showFiles]);

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography align={'center'}>EP</Typography>
              </TableCell>
              <TableCell>
                <Typography align={'left'}>Name</Typography>
              </TableCell>
              <TableCell align={'right'}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {conanList &&
              sortedConanList
                .filter(
                  ([key, conan]) =>
                    conan.case > PageSize * (page - 1) &&
                    conan.case <= PageSize * page
                )
                .map(([key, conan]) => (
                  <TableRow key={key} hover selected={conan.case === select}>
                    <TableCell>
                      <Typography align={'center'} color={'textSecondary'}>
                        {conan.case}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        if (editMode !== key && isAdmin) setEditMode(key);
                      }}
                    >
                      {(!isAdmin || editMode !== key) && (
                        <Typography align={'left'} color={'textSecondary'}>
                          {conan.name}
                        </Typography>
                      )}
                      {isAdmin && editMode === key && (
                        <TextField
                          variant={'outlined'}
                          onBlur={(e) => handleUpdate(e.target.value, key)}
                          defaultValue={conan.name}
                          fullWidth
                          multiline
                          autoFocus
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography align={'center'}>
                        {conan.episodes &&
                          Object.keys(conan.episodes).map(
                            (episode: string) =>
                              conanList[key].episodes[parseInt(episode)] && (
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    showFiles(conan.episodes[episode])
                                  }
                                  key={`${key}_${episode}`}
                                  style={{ margin: '2px' }}
                                >
                                  {episode}
                                </Button>
                              )
                          )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}

            <TableRow>
              <TableCell colSpan={3} align={'center'}>
                <Pagination
                  count={totalPage}
                  page={page}
                  onChange={(event, newPage) => {
                    setPage(newPage);
                    setSelect(0);
                  }}
                  style={{ justifyContent: 'center', display: 'flex' }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Container>
    </React.Fragment>
  );
};

export default Conan;
