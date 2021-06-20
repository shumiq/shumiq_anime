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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { PageSize } from '../../models/Constants';
import Pagination from "@material-ui/lab/Pagination";

const Keyaki = (): JSX.Element => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(Selector.isAdmin);
  const [editMode, setEditMode] = useState('');
  const keyakiList = useSelector(Selector.getDatabase).keyaki;
  const isRandom = useSelector(Selector.isRandom);
  const [select, setSelect] = useState(0);
  const [page, setPage] = useState(1);
  const totalPage = Math.ceil(Object.entries(keyakiList).length / PageSize);
  const sortedKeyakiList = Object.entries(keyakiList).sort(
    (entryA, entryB) => entryA[1].ep - entryB[1].ep
  );
  const playList = sortedKeyakiList.reduce((result, entry) => {
    if (!entry[1].sub) return result;
    if (entry[1].sub['Thai'])
      result.push([
        `Ep:${entry[1].ep} ` + entry[1].name + ' [ซับไทย]',
        entry[1].sub['Thai'],
      ]);
    if (entry[1].sub['Eng'])
      result.push([
        `Ep:${entry[1].ep} ` + entry[1].name + ' [ซับอังกฤษ]',
        entry[1].sub['Eng'],
      ]);
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
    const state = { ...keyakiList[key] };
    state.name = name;
    Database.update.keyaki(key, state);
    setEditMode('');
  };

  useEffect(() => {
    if (isRandom) {
      const allKeyaki = Object.entries(keyakiList);
      const keyaki = allKeyaki[Math.floor(Math.random() * allKeyaki.length)];
      if (keyaki[1].sub['Thai']) void showFiles(keyaki[1].sub['Thai']);
      else if (keyaki[1].sub['Eng']) void showFiles(keyaki[1].sub['Eng']);
      setPage(Math.ceil(keyaki[1].ep/PageSize));
      setSelect(keyaki[1].ep);
      dispatch(Action.setRandom(false));
    }
  }, [isRandom, showFiles, dispatch, keyakiList]);

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
              <TableCell align={'right'}>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keyakiList &&
              sortedKeyakiList
                .filter(
                  ([key, keyaki]) =>
                    keyaki.ep > PageSize * (page - 1) &&
                    keyaki.ep <= PageSize * page
                )
                .map(([key, keyaki]) => (
                  <TableRow key={key} hover selected={keyaki.ep === select}>
                    <TableCell>
                      <Typography align={'center'} color={'textSecondary'}>
                        {keyaki.ep}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        if (editMode !== key && isAdmin) setEditMode(key);
                      }}
                    >
                      {(!isAdmin || editMode !== key) && (
                        <Typography align={'left'} color={'textSecondary'}>
                          {keyaki.name}
                        </Typography>
                      )}
                      {isAdmin && editMode === key && (
                        <TextField
                          variant={'outlined'}
                          onBlur={(e) => handleUpdate(e.target.value, key)}
                          defaultValue={keyaki.name}
                          fullWidth
                          multiline
                          autoFocus
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography align={'right'}>
                        {keyaki.sub &&
                          Object.keys(keyaki.sub).map(
                            (sub) =>
                              keyaki.sub[sub] && (
                                <Button
                                  variant="contained"
                                  onClick={() => showFiles(keyaki.sub[sub])}
                                  key={`${key}_${sub}`}
                                  style={{ margin: '2px' }}
                                >
                                  {sub}
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
                    onChange={(event, newPage) => {setPage(newPage); setSelect(0);}}
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

export default Keyaki;
