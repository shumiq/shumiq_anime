import React, { useState, useEffect, useCallback } from 'react';
import { Database } from '../../services/Firebase/Firebase';
import { getLocalStorage } from '../../utils/LocalStorage/LocalStorage';
import SynologyApi from '../../services/Synology/Synology';
import {
  Database as DatabaseType,
  Keyaki as KeyakiType,
} from '../../models/Type';
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

const Keyaki = (): JSX.Element => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(Selector.isAdmin);
  const [editMode, setEditMode] = useState('');
  const [keyakiList, setKeyakiList] = useState<Record<string, KeyakiType>>(
    (getLocalStorage('database') as DatabaseType)?.keyaki
  );

  useEffect(() => {
    Database.subscribe((db) => {
      setKeyakiList(db?.keyaki);
    });
  }, []);

  const showFiles = useCallback((file: string) => {
    dispatch(Action.openVideoAlt(file));
  }, []);

  const handleUpdate = (name: string, key: string) => {
    const state = { ...keyakiList[key] };
    state.name = name;
    Database.update.keyaki(key, state);
    setEditMode('');
  };

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
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keyakiList &&
              Object.entries(keyakiList)
                .sort((entryA, entryB) => entryA[1].ep - entryB[1].ep)
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
                        <Typography align={'left'} color={'textSecondary'}>
                          <TextField
                            variant={'outlined'}
                            onBlur={(e) => handleUpdate(e.target.value, key)}
                            defaultValue={keyaki.name}
                            style={{ width: '100%' }}
                            multiline
                            autoFocus
                          />
                        </Typography>
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
