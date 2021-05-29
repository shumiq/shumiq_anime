import React, { ChangeEvent, useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import {
  Anime,
  Anime as AnimeType,
  Database as DatabaseType,
} from '../../models/Type';
import { getLocalStorage } from '../../utils/LocalStorage/LocalStorage';
import { Database } from '../../services/Firebase/Firebase';
import { useDispatch } from 'react-redux';
import { Action } from '../../utils/Store/AppStore';
import Typography from '@material-ui/core/Typography';
import AddCircle from '@material-ui/icons/AddCircle';
import CheckCircle from '@material-ui/icons/CheckCircle';
import TextField from '@material-ui/core/TextField';
import AnilistApi from '../../services/Anilist/Anilist';
import { AnilistInfoResponse } from '../../models/AnilistApi';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import { Season } from '../../models/Constants';

const AddAnime = () => {
  const dispatch = useDispatch();
  const [searchResult, setSearchResult] = useState<AnilistInfoResponse[]>([]);
  const [animeList, setAnimeList] = useState<Record<string, AnimeType>>(
    (getLocalStorage('database') as DatabaseType).anime
  );

  useEffect(() => {
    Database.subscribe((db: DatabaseType) => {
      setAnimeList(db?.anime);
    });
  }, []);

  const handleSearch = async (
    e: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    if (!e.target.value) return;
    const keyword = e.target.value as string;
    if (keyword.length < 5) {
      setSearchResult([]);
      return;
    }
    dispatch(Action.showLoading(true));
    const result = await AnilistApi.searchAnime(keyword);
    dispatch(Action.showLoading(false));
    setSearchResult(result);
  };

  const isAlreadyDownload = (newAnime: AnilistInfoResponse) => {
    return Object.entries(animeList).find(
      ([_, anime]) =>
        anime.title === newAnime.title?.romaji &&
        anime.year === newAnime.startDate.year &&
        anime.season ===
          parseInt(
            Season[
              newAnime.season.charAt(0) + newAnime.season.slice(1).toLowerCase()
            ] as string
          )
    );
  };

  const handleAddAnime = (anime: AnilistInfoResponse) => {
    const newAnime: Anime = {
      title: anime.title?.romaji,
      studio: anime.studios?.nodes[0]?.name,
      view: 0,
      download: 0,
      path: '',
      size: 0,
      score: anime.averageScore
        ? (anime.averageScore / 10.0).toFixed(1)
        : '0.0',
      download_url: '',
      all_episode: anime.episodes ? anime.episodes.toString() : '?',
      season: parseInt(
        Season[
          anime.season.charAt(0) + anime.season.slice(1).toLowerCase()
        ] as string
      ),
      year: anime.startDate.year,
      info: anime.description,
      genres: anime.genres.join(', '),
      cover_url: anime.coverImage.large,
    };
    Database.add.anime(newAnime);
  };

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Typography align={'center'}>
          <TextField
            variant={'outlined'}
            placeholder={'Search...'}
            onBlur={handleSearch}
            style={{ width: '100%', maxWidth: '300px' }}
          />
        </Typography>
        {searchResult.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Typography align={'center'}>Title</Typography>
                </TableCell>
                <TableCell>
                  <Typography align={'center'}>Season</Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResult.map(
                (anime) =>
                  anime &&
                  anime.season && (
                    <TableRow key={anime.id}>
                      <TableCell>
                        <Avatar src={anime.coverImage.large} />
                      </TableCell>
                      <TableCell>
                        <Typography align={'left'}>
                          {anime.title.userPreferred}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography align={'center'}>
                          {anime.startDate.year} {anime.season}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography align={'right'}>
                          {!isAlreadyDownload(anime) && (
                            <IconButton
                              onClick={() => handleAddAnime(anime)}
                              color={'primary'}
                            >
                              <AddCircle />
                            </IconButton>
                          )}
                          {isAlreadyDownload(anime) && (
                            <IconButton disabled color={'secondary'}>
                              <CheckCircle />
                            </IconButton>
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        )}
      </Container>
    </React.Fragment>
  );
};

export default AddAnime;
