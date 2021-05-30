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

const Keyaki = (): JSX.Element => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(Selector.isAdmin);
  const [editMode, setEditMode] = useState('');
  const keyakiList = useSelector(Selector.getDatabase).keyaki;
  const isRandom = useSelector(Selector.isRandom);
  const [page, setPage] = useState(1);
  const totalPage = Math.ceil(Object.entries(keyakiList).length / PageSize);

  const showFiles = useCallback(
    (file: string) => {
      dispatch(Action.openVideoAlt(file));
    },
    [dispatch]
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
            {keyakiList &&
              Object.entries(keyakiList)
                .sort((entryA, entryB) => entryA[1].ep - entryB[1].ep)
                .filter(
                  ([key, keyaki]) =>
                    keyaki.ep > PageSize * (page - 1) &&
                    keyaki.ep <= PageSize * page
                )
                .map(([key, keyaki]) => (
                  <TableRow key={key} hover>
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
                        {Object.keys(keyaki.sub).map(
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
          </TableBody>
        </Table>
      </Container>
    </React.Fragment>
  );
};

export default Keyaki;
