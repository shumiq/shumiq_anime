import React from 'react';
import Container from '@material-ui/core/Container';
import {
  Conan as ConanType,
  Keyaki as KeyakiType,
  Sakura as SakuraType,
} from '../../models/Type';
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
import SynologyApi from '../../services/Synology/Synology';

const SyncOther = () => {
  const dispatch = useDispatch();
  const db = useSelector(Selector.getDatabase);
  const status = {
    sakura: [
      Object.entries(db.sakura).length,
      Object.entries(db.sakura).reduce(
        (c1, [_, ep]) => c1 + Object.entries(ep.sub).length,
        0
      ),
    ],
    keyaki: [
      Object.entries(db.keyaki).length,
      Object.entries(db.keyaki).reduce(
        (c1, [_, ep]) => c1 + Object.entries(ep.sub).length,
        0
      ),
    ],
    conan: [
      Object.entries(db.conan).length,
      Object.entries(db.conan).reduce(
        (c1, [_, ep]) => c1 + Object.entries(ep.episodes).length,
        0
      ),
    ],
  };

  const handleSyncSakura = async () => {
    dispatch(Action.showLoading(true));
    const folderPath = 'Soko Magattara Sakurazaka';
    const files = await SynologyApi.list(folderPath);
    if (!files.data.files) return;
    files.data.files.forEach((file) => {
      const ep = parseInt(file.name.split(' ')[3]);
      const sub = file.name.split(' ')[4].split('.')[0];
      const url = file.path;
      if (
        Object.entries(db.sakura).filter(([key, sakura]) => sakura.ep === ep)
          .length > 0
      ) {
        Object.entries(db.sakura)
          .filter(([key, sakura]) => sakura.ep === ep)
          .forEach(([key, sakura]) => {
            sakura.sub[sub] = url;
            Database.update.sakura(key, sakura);
          });
      } else {
        const sakura: SakuraType = {
          sub: {} as Record<string, string>,
          ep: ep,
          name: 'แก้ไข',
        };
        sakura.sub[sub] = url;
        Database.add.sakura(sakura);
      }
    });
    dispatch(Action.showLoading(false));
  };

  const handleSyncKeyaki = async () => {
    dispatch(Action.showLoading(true));
    const folderPath = 'Keyakitte Kakenai';
    const files = await SynologyApi.list(folderPath);
    if (!files.data.files) return;
    files.data.files.forEach((file) => {
      const ep = parseInt(file.name.split(' ')[2]);
      const sub = file.name.split(' ')[3].split('.')[0];
      const url = file.path;
      if (
        Object.entries(db.keyaki).filter(([key, keyaki]) => keyaki.ep === ep)
          .length > 0
      ) {
        Object.entries(db.keyaki)
          .filter(([key, keyaki]) => keyaki.ep === ep)
          .forEach(([key, keyaki]) => {
            keyaki.sub[sub] = url;
            Database.update.keyaki(key, keyaki);
          });
      } else {
        const keyaki: KeyakiType = {
          sub: {} as Record<string, string>,
          ep: ep,
          name: 'แก้ไข',
        };
        keyaki.sub[sub] = url;
        Database.add.keyaki(keyaki);
      }
    });
    dispatch(Action.showLoading(false));
  };

  const handleSyncConan = async () => {
    dispatch(Action.showLoading(true));
    const folderPath = 'Anime/Detective Conan';
    const files = await SynologyApi.list(folderPath);
    if (!files.data.files) return;
    files.data.files.forEach((file) => {
      const cs = parseInt(file.name.split(' ')[1]);
      const ep = parseInt(file.name.split(' ')[3].split('.')[0]);
      const url = file.path;
      if (
        Object.entries(db.conan).filter(([key, conan]) => conan.case === cs)
          .length > 0
      ) {
        Object.entries(db.conan)
          .filter(([key, conan]) => conan.case === cs)
          .forEach(([key, conan]) => {
            conan.episodes[ep] = url;
            Database.update.conan(key, conan);
          });
      } else {
        const conan: ConanType = {
          episodes: {} as Record<number, string>,
          case: cs,
          name: 'แก้ไข',
        };
        conan.episodes[ep] = url;
        Database.add.conan(conan);
      }
    });
    dispatch(Action.showLoading(false));
  };

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <Typography align={'center'}># Eps</Typography>
              </TableCell>
              <TableCell>
                <Typography align={'center'}># Files</Typography>
              </TableCell>
              <TableCell>
                <Typography align={'center'}>Sync</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography align={'left'}>Detective Conan</Typography>
              </TableCell>
              <TableCell>
                <Typography align={'center'}>{status.conan[0]}</Typography>
              </TableCell>
              <TableCell>
                <Typography align={'center'}>{status.conan[1]}</Typography>
              </TableCell>
              <TableCell align={'center'}>
                <IconButton onClick={handleSyncConan}>
                  <SyncIcon />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography align={'left'}>Keyakitte Kakenai</Typography>
              </TableCell>
              <TableCell>
                <Typography align={'center'}>{status.keyaki[0]}</Typography>
              </TableCell>
              <TableCell>
                <Typography align={'center'}>{status.keyaki[1]}</Typography>
              </TableCell>
              <TableCell align={'center'}>
                <IconButton onClick={handleSyncKeyaki}>
                  <SyncIcon />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography align={'left'}>
                  Soko Magattara Sakurazaka
                </Typography>
              </TableCell>
              <TableCell>
                <Typography align={'center'}>{status.sakura[0]}</Typography>
              </TableCell>
              <TableCell>
                <Typography align={'center'}>{status.sakura[1]}</Typography>
              </TableCell>
              <TableCell align={'center'}>
                <IconButton onClick={handleSyncSakura}>
                  <SyncIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Container>
    </React.Fragment>
  );
};

export default SyncOther;
