import React, { useState } from 'react';
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

const Sakura = (): JSX.Element => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(Selector.isAdmin);
  const [editMode, setEditMode] = useState('');
  const sakuraList = useSelector(Selector.getDatabase).sakura;

  const showFiles = (file: string) => {
    dispatch(Action.openVideoAlt(file));
  };

  const handleUpdate = (name: string, key: string) => {
    const state = { ...sakuraList[key] };
    state.name = name;
    Database.update.sakura(key, state);
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
            {sakuraList &&
              Object.entries(sakuraList)
                .sort((entryA, entryB) => entryA[1].ep - entryB[1].ep)
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
                        {Object.keys(sakura.sub).map(
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
