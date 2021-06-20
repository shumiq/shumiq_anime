import React, { useEffect, useState } from 'react';
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
import { PageSize } from '../../models/Constants';
import Pagination from '@material-ui/lab/Pagination';

const Vtuber = (): JSX.Element => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(Selector.isAdmin);
  const isRandom = useSelector(Selector.isRandom);
  const vtuberList = useSelector(Selector.getDatabase).vtuber;
  const [select, setSelect] = useState('');
  const sortedVtuberList = Object.entries(vtuberList).sort((vtuber1, vtuber2) =>
    vtuber1[1].startTime !== vtuber2[1].startTime
      ? vtuber2[1].startTime - vtuber1[1].startTime
      : vtuber2[1].endTime - vtuber1[1].endTime
  );
  const channelList = getChannelList(
    sortedVtuberList.map(([, vtuber]) => vtuber)
  );
  const collabList = getCollabList(
    sortedVtuberList.map(([, vtuber]) => vtuber)
  );
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({...defaultFilter,start: sortedVtuberList[sortedVtuberList.length-1][1].startTime, end: sortedVtuberList[0][1].endTime
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const filteredSortedVtuberList = applyFilter(sortedVtuberList, filter);
  const totalPage = Math.ceil(filteredSortedVtuberList.length / PageSize);

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

  useEffect(() => {
    if (isRandom) {
      const vtuber =
        filteredSortedVtuberList[
          Math.floor(Math.random() * filteredSortedVtuberList.length)
        ];
      window.open(vtuber[1].url, 'blank');
      const item = filteredSortedVtuberList.indexOf(vtuber) + 1;
      setPage(Math.ceil(item / PageSize));
      setSelect(vtuber[0]);
      dispatch(Action.setRandom(false));
    }
  }, [isRandom, dispatch, filteredSortedVtuberList]);

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={3}>
                <Typography align={'center'}>Title</Typography>
              </TableCell>
              <TableCell align={'right'}>
                <IconButton onClick={() => setFilterOpen(true)}>
                  <FilterIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vtuberList &&
              [...filteredSortedVtuberList]
                .splice(PageSize * (page - 1), PageSize)
                .map(([id, vtuber]) => (
                  <TableRow key={id} hover selected={select === vtuber.id}>
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
                      {vtuber.tags.split(', ').map((tag, tagId) => (
                        <Chip
                          label={tag}
                          style={{ margin: '2px' }}
                          key={id + tagId.toString()}
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
            <TableRow>
              <TableCell colSpan={4} align={'center'}>
                <Pagination
                  count={totalPage}
                  page={page}
                  onChange={(event, newPage) => {
                    setPage(newPage);
                    setSelect('');
                  }}
                  style={{ justifyContent: 'center', display: 'flex' }}
                />
              </TableCell>
            </TableRow>
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
  if (filter.keyword.trim().length > 0) {
    filteredVtuberList = filteredVtuberList.filter(([, vtuber]) =>
      filter.keyword
        .split(' ')
        .reduce(
          (isInclude, keyword) =>
            isInclude &&
            [vtuber.title, vtuber.channel, vtuber.collaboration, vtuber.tags]
              .join(' ')
              .toLowerCase()
              .includes(keyword.toLowerCase()),
          true as boolean
        )
    );
  }
  if (filter.channel.length > 0) {
    filteredVtuberList = filteredVtuberList.filter(([, vtuber]) =>
      filter.channel.includes(vtuber.channel)
    );
  }
  if (filter.collab.length > 0) {
    filteredVtuberList = filteredVtuberList.filter(([, vtuber]) =>
      filter.collab.reduce(
        (isInclude, collab) =>
          isInclude && vtuber.collaboration.includes(collab),
        true as boolean
      )
    );
  }
  if (filter.favorite) {
    filteredVtuberList = filteredVtuberList.filter(([, vtuber]) => vtuber.like);
  }
  // const oneDay = 1000*60*60*24;
  // filteredVtuberList = filteredVtuberList.filter(([, vtuber]) => vtuber.startTime > filter.start - oneDay && vtuber.endTime < filter.end + oneDay);
  return filteredVtuberList;
};

export default Vtuber;
