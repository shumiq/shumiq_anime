import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Vtuber as VtuberType, VtuberFilter } from '../../models/Type';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
// import {MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
// import DateFnsUtils from '@date-io/date-fns';

export const defaultFilter: VtuberFilter = {
  channel: [],
  collab: [],
  end: Date.now(),
  favorite: false,
  keyword: '',
  start: 0,
  tag: [],
};

export const tagList = [
  'Collab',
  'Game',
  'Minecraft',
  'Horror',
  'Sing',
  'News',
  'Short Clip',
  'Free Talk',
];

export const analystTag = (vtuber: VtuberType): string[] => {
  const availableTag = [] as string[];
  if (vtuber.collaboration.length > 0) availableTag.push('Collab');
  return availableTag;
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
              <TableCell colSpan={3}>
                <TextField
                  fullWidth
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      keyword: e.target.value.toString(),
                    })
                  }
                  value={filter.keyword}
                />
              </TableCell>
            </TableRow>
            {/*
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disableToolbar
                    label="From"
                    variant="inline"
                    format="dd MMM yyyy"
                    margin="normal"
                    onChange={(date) =>
                        setFilter({
                          ...filter,
                          start: date?.getTime() || filter.start,
                        })}
                    value={new Date(filter.start)}
                />
                </MuiPickersUtilsProvider>
              </TableCell>
              <TableCell></TableCell>
              <TableCell>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      label="To"
                      format="dd MMM yyyy"
                      margin="normal"
                      onChange={(date) =>
                          setFilter({
                            ...filter,
                            end: date?.getTime() || filter.end,
                          })}
                      value={new Date(filter.end)}
                  />
                </MuiPickersUtilsProvider>
              </TableCell>
            </TableRow>
            */}
            <TableRow>
              <TableCell>Channel</TableCell>
              <TableCell colSpan={3}>
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
              <TableCell colSpan={3}>
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
              <TableCell colSpan={3}>
                <Chip
                  color={filter.favorite ? 'primary' : 'default'}
                  label={'Favorite'}
                  style={{ margin: '2px' }}
                  onClick={() =>
                    setFilter({
                      ...filter,
                      favorite: !filter.favorite,
                    })
                  }
                />
                {tagList.map((tag) => (
                  <Chip
                    color={filter.tag.includes(tag) ? 'primary' : 'default'}
                    label={tag}
                    style={{ margin: '2px' }}
                    key={'filter_' + tag}
                    onClick={() =>
                      setFilter({
                        ...filter,
                        tag: filter.tag.includes(tag)
                          ? filter.tag.filter((t) => t !== tag)
                          : filter.tag.concat([tag]),
                      })
                    }
                  />
                ))}
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
