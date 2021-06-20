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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const Sakura = (): JSX.Element => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(Selector.isAdmin);
  const [editMode, setEditMode] = useState('');
  const sakuraList = useSelector(Selector.getDatabase).sakura;
  const isRandom = useSelector(Selector.isRandom);
  const [page, setPage] = useState(1);
  const totalPage = Math.ceil(Object.entries(sakuraList).length / PageSize);
  const sortedSakuraList = Object.entries(sakuraList).sort(
    (entryA, entryB) => entryA[1].ep - entryB[1].ep
  );
  const playList = sortedSakuraList.reduce((result, entry) => {
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
    const state = { ...sakuraList[key] };
    state.name = name;
    Database.update.sakura(key, state);
    setEditMode('');
  };

  useEffect(() => {
    if (isRandom) {
      const allSakura = Object.entries(sakuraList);
      const sakura = allSakura[Math.floor(Math.random() * allSakura.length)];
      if (sakura[1].sub['Thai']) void showFiles(sakura[1].sub['Thai']);
      else if (sakura[1].sub['Eng']) void showFiles(sakura[1].sub['Eng']);
      dispatch(Action.setRandom(false));
    }
  }, [isRandom, showFiles, dispatch, sakuraList]);

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
                <Select
                  onChange={(e) =>
                    setPage(parseInt(e.target.value as string) || 1)
                  }
                  defaultValue={1}
                  variant={'outlined'}
                >
                  {/* eslint-disable @typescript-eslint/no-unsafe-assignment */}
                  {[...Array(totalPage)].map((e, i) => (
                    <MenuItem value={i + 1} key={i + 1}>
                      {PageSize * i + 1} - {PageSize * (i + 1)}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sakuraList &&
              sortedSakuraList
                .filter(
                  ([key, sakura]) =>
                    sakura.ep > PageSize * (page - 1) &&
                    sakura.ep <= PageSize * page
                )
                .map(([key, sakura]) => (
                  <TableRow key={key} hover>
                    <TableCell>
                      <Typography align={'center'} color={'textSecondary'}>
                        {sakura.ep}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        if (editMode !== key && isAdmin) setEditMode(key);
                      }}
                    >
                      {(!isAdmin || editMode !== key) && (
                        <Typography align={'left'} color={'textSecondary'}>
                          {sakura.name}
                        </Typography>
                      )}
                      {isAdmin && editMode === key && (
                        <TextField
                          variant={'outlined'}
                          onBlur={(e) => handleUpdate(e.target.value, key)}
                          defaultValue={sakura.name}
                          fullWidth
                          multiline
                          autoFocus
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography align={'right'}>
                        {sakura.sub &&
                          Object.keys(sakura.sub).map(
                            (sub) =>
                              sakura.sub[sub] && (
                                <Button
                                  variant="contained"
                                  onClick={() => showFiles(sakura.sub[sub])}
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
          </TableBody>
        </Table>
      </Container>
    </React.Fragment>
  );
};

export default Sakura;