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
import { PageSize } from '../../models/Constants';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import SyncIcon from '@material-ui/icons/Sync';
import LikeIcon from '@material-ui/icons/Grade';
import IconButton from '@material-ui/core/IconButton';
import YouTubeIcon from '@material-ui/icons/YouTube';
import Link from '@material-ui/core/Link';
import YoutubeApi from '../../services/Youtube/Youtube';
import { Vtuber as VtuberType } from '../../models/Type';
import DeleteIcon from '@material-ui/icons/Delete';

const Vtuber = (): JSX.Element => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(Selector.isAdmin);
  const vtuberList = useSelector(Selector.getDatabase).vtuber;
  const [page, setPage] = useState(1);
  const totalPage = Math.ceil(Object.entries(vtuberList).length / PageSize);
  const sortedVtuberList = Object.entries(vtuberList).sort((vtuber1, vtuber2) =>
    vtuber1[1].startTime !== vtuber2[1].startTime
      ? vtuber2[1].startTime - vtuber1[1].startTime
      : vtuber2[1].endTime - vtuber1[1].endTime
  );

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
              <TableCell colSpan={3}>
                <Typography align={'center'}>Title</Typography>
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
            {vtuberList &&
              sortedVtuberList
                .splice(PageSize * (page - 1), PageSize)
                .map(([id, vtuber]) => (
                  <TableRow key={id} hover>
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
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        component="p"
                      >
                        {vtuber.tags}
                      </Typography>
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
    </React.Fragment>
  );
};

export default Vtuber;
