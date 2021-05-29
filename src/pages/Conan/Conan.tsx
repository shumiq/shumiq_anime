import React, { useState, useEffect, useCallback } from 'react';
import { Database } from '../../services/Firebase/Firebase';
import { getLocalStorage } from '../../utils/LocalStorage/LocalStorage';
import SynologyApi from '../../services/Synology/Synology';
import {
  Conan as ConanType,
  Database as DatabaseType,
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

const Conan = (): JSX.Element => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(Selector.isAdmin);
  const [editMode, setEditMode] = useState('');
  const [conanList, setConanList] = useState<Record<string, ConanType>>(
    (getLocalStorage('database') as DatabaseType)?.conan
  );

  useEffect(() => {
    Database.subscribe((db: DatabaseType) => {
      setConanList(db?.conan);
    });
  }, []);

  const showFiles = useCallback((file: string) => {
    dispatch(Action.openVideoAlt(file));
  }, []);

  const handleUpdate = (name: string, key: string) => {
    const state = { ...conanList[key] };
    state.name = name;
    Database.update.conan(key, state);
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
            {conanList &&
              Object.entries(conanList)
                .sort((entryA, entryB) => entryA[1].case - entryB[1].case)
                .map(([key, conan]) => (
                  <TableRow key={key} hover>
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
                        <Typography align={'left'} color={'textSecondary'}>
                          <TextField
                            variant={'outlined'}
                            onBlur={(e) => handleUpdate(e.target.value, key)}
                            defaultValue={conan.name}
                            style={{ width: '100%' }}
                            multiline
                            autoFocus
                          />
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography align={'right'}>
                        {Object.keys(conan.episodes).map(
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
          </TableBody>
        </Table>
      </Container>
    </React.Fragment>
  );
};

export default Conan;
