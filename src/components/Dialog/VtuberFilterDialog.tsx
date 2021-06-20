import React, { ChangeEvent, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Selector } from '../../utils/Store/AppStore';
import { Database } from '../../services/Firebase/Firebase';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { VtuberFilter } from '../../models/Type';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';

export const defaultFilter: VtuberFilter = {
  channel: [],
  collab: [],
  end: Date.now(),
  favorite: false,
  keyword: '',
  start: 0,
  tag: [],
};

export default function VtuberFilterDialog({
  currentFilter,
  setCurrentFilter,
  open,
  onClose,
  channelList,
  collabList,
}: {
  currentFilter: VtuberFilter;
  setCurrentFilter: (VtuberFilter) => void;
  open: boolean;
  onClose: () => void;
  channelList: string[];
  collabList: string[];
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [filter, setFilter] = useState(
    currentFilter ? currentFilter : defaultFilter
  );

  const handleClose = () => {
    onClose();
  };

  const handleApply = () => {
    setCurrentFilter(filter);
    handleClose();
  };

  const handleReset = () => {
    setFilter(defaultFilter);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle>Filter</DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Search</TableCell>
              <TableCell><TextField fullWidth onChange={(e) =>
                  setFilter({
                    ...filter,
                    keyword: e.target.value.toString()
                  })
              } value={filter.keyword} /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Channel</TableCell>
              <TableCell>
                {channelList.map((channel) => (
                  <Chip
                    color={
                      filter.channel.includes(channel) ? 'primary' : 'default'
                    }
                    label={channel}
                    style={{ margin: '2px' }}
                    key={channel}
                    onClick={() =>
                      setFilter({
                        ...filter,
                        channel: filter.channel.includes(channel)
                          ? filter.channel.filter((ch) => ch !== channel)
                          : filter.channel.concat([channel]),
                      })
                    }
                  />
                ))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Collab</TableCell>
              <TableCell>
                {collabList.map((collab) => (
                  <Chip
                    color={
                      filter.collab.includes(collab) ? 'primary' : 'default'
                    }
                    label={collab}
                    style={{ margin: '2px' }}
                    key={collab}
                    onClick={() =>
                      setFilter({
                        ...filter,
                        collab: filter.collab.includes(collab)
                          ? filter.collab.filter((col) => col !== collab)
                          : filter.collab.concat([collab]),
                      })
                    }
                  />
                ))}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Tags</TableCell>
              <TableCell>
                  <Chip
                      color={
                        filter.favorite ? 'primary' : 'default'
                      }
                      label={"Favorite"}
                      style={{ margin: '2px' }}
                      onClick={() =>
                          setFilter({
                            ...filter,
                            favorite: !filter.favorite
                          })
                      }
                  />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleApply} color="default">
          Apply
        </Button>
        <Button onClick={handleReset} color="default">
          Reset
        </Button>
        <Button autoFocus onClick={handleClose} color="default">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
