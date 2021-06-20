import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { useSelector } from 'react-redux';
import { Selector } from '../../utils/Store/AppStore';
import {
  Database as DatabaseType,
  Vtuber as VtuberType,
} from '../../models/Type';
import { Database } from '../../services/Firebase/Firebase';
import YoutubeApi from '../../services/Youtube/Youtube';

const AddAnime = () => {
  const [input, setInput] = useState('');
  const database = useSelector(Selector.getDatabase);

  const handleAddVtuber = async () => {
    setInput('');
    const urls = input.split('\n');
    const databaseClone = JSON.parse(JSON.stringify(database)) as DatabaseType;
    if (!databaseClone.vtuber)
      databaseClone.vtuber = {} as Record<string, VtuberType>;
    urls.forEach((url) => {
      try {
        const plainUrl = url.split('&')[0];
        if (url.length === 0) return;
        const id = plainUrl.split('?v=')[1];
        if (databaseClone.vtuber[id]) return;
        databaseClone.vtuber[id] = {
          url: plainUrl,
          channel: '',
          collaboration: '',
          cover_url: '',
          id: id,
          like: false,
          tags: '',
          title: '',
          startTime: 0,
          endTime: 0,
        };
      } catch (e) {
        console.error(`Invalid url: ${url}`);
      }
    });
    const unSyncVtuberVideo = Object.values(databaseClone.vtuber)
      .filter((vtuber) => vtuber.title === '')
      .map((vtuber) => vtuber.id);
    const youtubeVideoList = await YoutubeApi.getVideoList(unSyncVtuberVideo);
    if (!youtubeVideoList) return;
    youtubeVideoList.forEach((youtubeVideo) => {
      databaseClone.vtuber[youtubeVideo.id] = YoutubeApi.convertYoutubeToVtuber(
        youtubeVideo,
        databaseClone.vtuber[youtubeVideo.id]
      );
    });
    Database.update.database(databaseClone);
  };

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <TextField
          variant={'outlined'}
          placeholder={'Youtube Url...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          multiline
          rows={4}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleAddVtuber}>
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Container>
    </React.Fragment>
  );
};

export default AddAnime;
