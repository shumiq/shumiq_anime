import React, { useState } from 'react';
import { Database } from '../../services/Firebase/Firebase';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Selector } from '../../utils/Store/AppStore';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import SyncIcon from '@material-ui/icons/Sync';
import LikeIcon from '@material-ui/icons/Grade';
import IconButton from '@material-ui/core/IconButton';
import YouTubeIcon from '@material-ui/icons/YouTube';
import Link from '@material-ui/core/Link';
import YoutubeApi from '../../services/Youtube/Youtube';
import { Vtuber as VtuberType, VtuberFilter } from '../../models/Type';
import DeleteIcon from '@material-ui/icons/Delete';
import Chip from '@material-ui/core/Chip';
import FilterIcon from '@material-ui/icons/FilterList';
import VtuberFilterDialog, {
  defaultFilter,
} from '../../components/Dialog/VtuberFilterDialog';

const Vtuber = (): JSX.Element => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(Selector.isAdmin);
  const vtuberList = useSelector(Selector.getDatabase).vtuber;
  const sortedVtuberList = Object.entries(vtuberList).sort((vtuber1, vtuber2) =>
    vtuber1[1].startTime !== vtuber2[1].startTime
      ? vtuber2[1].startTime - vtuber1[1].startTime
      : vtuber2[1].endTime - vtuber1[1].endTime
  );
  const monthList = getMonthList(sortedVtuberList.map(([, vtuber]) => vtuber));
  const channelList = getChannelList(
    sortedVtuberList.map(([, vtuber]) => vtuber)
  );
  const collabList = getCollabList(
    sortedVtuberList.map(([, vtuber]) => vtuber)
  );
  const [page, setPage] = useState(monthList[0]);
  const [filter, setFilter] = useState(defaultFilter);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSync = async (id: string) => {
    dispatch(Action.showLoading(true));
    const youtubeVideo = await YoutubeApi.getVideo(id);
    if (!youtubeVideo) return;
    const newVtuberVideo = YoutubeApi.convertYoutubeToVtuber(
      youtubeVideo,
      vtuberList[id]
    );
    Database.update.vtuber(id, newVtuberVideo);
    dispatch(Action.showLoading(false));
  };

  const handleLike = (vtuber: VtuberType) => {
    vtuber.like = !vtuber.like;
    Database.update.vtuber(vtuber.id, vtuber);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Delete "${vtuberList[id].title}"?`)) {
      Database.update.vtuber(id, null);
    }
  };

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <IconButton onClick={() => setFilterOpen(true)}>
                  <FilterIcon />
                </IconButton>
              </TableCell>
              <TableCell colSpan={2}>
                <Typography align={'center'}>Title</Typography>
              </TableCell>
              <TableCell align={'right'}>
                <Select
                  onChange={(e) => setPage(e.target.value as string)}
                  defaultValue={monthList[0]}
                  variant={'outlined'}
                >
                  {/* eslint-disable @typescript-eslint/no-unsafe-assignment */}
                  {monthList.map((month) => (
                    <MenuItem value={month} key={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vtuberList &&
              applyFilter(sortedVtuberList, filter)
                .filter(
                  ([, vtuber]) =>
                    page === timestampToYearMonth(vtuber.startTime)
                )
                .map(([id, vtuber]) => (
                  <TableRow
                    key={id}
                    hover
                    selected={new Date(vtuber.startTime).getDay() % 6 === 0}
                  >
                    <TableCell align={'center'} style={{ padding: '0' }}>
                      {isAdmin && (
                        <IconButton onClick={() => handleLike({ ...vtuber })}>
                          <LikeIcon
                            color={'disabled'}
                            style={vtuber.like ? { color: 'yellowgreen' } : {}}
                          />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell align={'center'}>
                      <img src={vtuber.cover_url} height={80} alt={'cover'} />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        component="p"
                      >
                        {vtuber.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        component="p"
                      >
                        {vtuber.channel} -{' '}
                        {new Date(vtuber.startTime).toDateString()},{' '}
                        {new Date(vtuber.startTime).toLocaleTimeString()}{' '}
                        {vtuber.endTime - vtuber.startTime > 1000 * 60 * 60
                          ? ` - ${new Date(
                              vtuber.endTime
                            ).toLocaleTimeString()}`
                          : ''}
                      </Typography>
                      {vtuber.tags.split(', ').map((tag) => (
                        <Chip
                          label={tag}
                          style={{ margin: '0 5px' }}
                          key={tag}
                        />
                      ))}
                    </TableCell>
                    <TableCell align={'center'}>
                      <Link href={vtuber.url} target={'blank'}>
                        <IconButton>
                          <YouTubeIcon />
                        </IconButton>
                      </Link>
                      {isAdmin && (
                        <>
                          <IconButton onClick={() => handleSync(id)}>
                            <SyncIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(id)}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </Container>
      <VtuberFilterDialog
        currentFilter={filter}
        setCurrentFilter={setFilter}
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        channelList={channelList}
        collabList={collabList}
      />
    </React.Fragment>
  );
};

const timestampToYearMonth = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const getMonthList = (vtuberList: VtuberType[]): string[] => {
  const monthList: string[] = [];
  vtuberList.forEach((vtuber) => {
    const month = timestampToYearMonth(vtuber.startTime);
    if (!monthList.find((m) => m === month)) monthList.push(month);
  });
  return monthList;
};

const getChannelList = (vtuberList: VtuberType[]): string[] => {
  const channelList: string[] = [];
  vtuberList.forEach((vtuber) => {
    const channel = vtuber.channel;
    if (!channelList.find((c) => c === channel)) channelList.push(channel);
  });
  return channelList;
};

const getCollabList = (vtuberList: VtuberType[]): string[] => {
  const collabList: string[] = [];
  vtuberList.forEach((vtuber) => {
    vtuber.collaboration.split(', ').forEach((collab) => {
      if (!collabList.find((c) => c === collab) && collab !== '')
        collabList.push(collab);
    });
  });
  return collabList;
};

const applyFilter = (
  vtuberList: [string, VtuberType][],
  filter: VtuberFilter
): [string, VtuberType][] => {
  let filteredVtuberList = [...vtuberList];
  if (filter.channel.length > 0) {
    filteredVtuberList = filteredVtuberList.filter(([, vtuber]) =>
      filter.channel.includes(vtuber.channel)
    );
  }
  if (filter.collab.length > 0) {
    filteredVtuberList = filteredVtuberList.filter(([, vtuber]) =>
        filter.collab.reduce((isInclude, collab,) => isInclude && vtuber.collaboration.includes(collab), true as boolean)
    );
  }
  return filteredVtuberList;
};

export default Vtuber;
