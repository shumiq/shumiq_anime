import React, { useEffect, useState } from 'react';
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

const checkKeywords = (vtuber: VtuberType, keywords: string[]): boolean => {
  for (const keyword of keywords) {
    if (
      [vtuber.title, vtuber.tags]
        .join(' ')
        .toLowerCase()
        .includes(keyword.toLowerCase())
    )
      return true;
  }
  return false;
};

export const tagList = {
  Collab: (vtuber: VtuberType): boolean =>
    vtuber.collaboration.length > 0 ||
    checkKeywords(vtuber, ['ft.', 'feat', 'คอแลป']),
  Sing: (vtuber: VtuberType): boolean =>
    checkKeywords(vtuber, [
      'sing',
      'music',
      'song',
      'cover',
      'ร้อง',
      'เพลง',
      'ไมค์',
      'คอนเสิร์ต',
      'ลูกทุ่ง',
    ]),
  Game: (vtuber: VtuberType): boolean =>
    checkKeywords(vtuber, [
      'เกม',
      'เล่น',
      'game',
      'play',
      'ฝึก',
      'หัด',
      'ฆ่า',
      'Project Winter',
      'A Way Out',
      'Aniki',
      'It Takes Two',
      'Among',
      'Hidden Agenda',
      'Valheim',
    ]) ||
    tagList.Minecraft(vtuber) ||
    tagList.Horror(vtuber) ||
    tagList.Casual(vtuber) ||
    tagList.MOBA(vtuber),
  Horror: (vtuber: VtuberType): boolean =>
    checkKeywords(vtuber, [
      'ผี',
      'ghost',
      'ราตรี',
      'horror',
      'visage',
      'devour',
      'Penguin',
      'Phasmophobia',
      'HSH',
      'home sweet home',
      'witch',
      'outlast',
      'out last',
      'ดบดล',
      'dead',
      'dbdl',
    ]),
  Minecraft: (vtuber: VtuberType): boolean =>
    checkKeywords(vtuber, ['minecraft', 'คราฟ', 'craft', '12TimeWeCCG']),
  Casual: (vtuber: VtuberType): boolean =>
    checkKeywords(vtuber, [
      'uno',
      'ultimate',
      'Getting Over It',
      'minesweeper',
      'zuma',
      'Overcook',
      'mario',
      'Simulator',
      'ระเบิด',
      'Bunny',
      'pummel',
      'Gartic',
      'marathon',
      'ดูเอล',
      'Tools Up',
      'biped',
      'President',
      'PHOGS',
    ]),
  MOBA: (vtuber: VtuberType): boolean =>
    checkKeywords(vtuber, ['lol', 'rov', 'league', 'ป้อม']),
  Debut: (vtuber: VtuberType): boolean =>
    checkKeywords(vtuber, ['New', 'เปิดตัว', 'ครั้งแรก', 'debut', 'CYPHER']),
  'Short Clip': (vtuber: VtuberType): boolean =>
    vtuber.endTime - vtuber.startTime < 1000 * 60 * 60,
  'Free Talk': (vtuber: VtuberType): boolean =>
    checkKeywords(vtuber, [
      'พูด',
      'คุย',
      'สนทนา',
      'talk',
      'tea',
      'ดื่มชา',
      'ถาม',
      'ตอบ',
      'ทาย',
      'วาด',
      'ตามหา',
      'ล้วง',
      'ลับ',
      'เล่า',
      'รวมตัว',
      'เสปค',
      'แกง',
      'อย่างไร',
      'time',
      'ยังไง',
      'แจก',
      'วันเกิด',
      'ประชัน',
      'ควรรู้',
      'Class',
      'แฟน',
      'ไถ่บาป',
      'จดหมาย',
      'ทดสอบ',
      'แบบไหน',
      'ฉลอง',
      'ส่อง',
      'มีม',
      'meme',
      'แฟน',
    ]) || tagList.Debut(vtuber),
};

export const analystTag = (vtuber: VtuberType): string[] => {
  const availableTag = [] as string[];
  Object.entries(tagList).forEach(([tag, isInclude]) => {
    if (isInclude(vtuber)) availableTag.push(tag);
  });
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

  useEffect(() => {
    setFilter(currentFilter);
  }, [currentFilter]);

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
                {/*
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
                */}
                {Object.keys(tagList).map((tag) => (
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
