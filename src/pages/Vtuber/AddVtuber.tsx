import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import {useSelector} from "react-redux";
import {Selector} from "../../utils/Store/AppStore";
import {Database as DatabaseType, Vtuber as VtuberType} from "../../models/Type";
import {Database} from "../../services/Firebase/Firebase";

const AddAnime = () => {
  const [input, setInput] = useState("");
  const database = useSelector(Selector.getDatabase);

  const handleAddVtuber = () => {
    const urls = input.split("\n");
    let databaseClone =  JSON.parse(JSON.stringify(database)) as DatabaseType;
    if(!databaseClone.vtuber) databaseClone.vtuber = {} as Record<string, VtuberType>
    urls.forEach(url => {
      try{
        const plainUrl = url.split("&")[0];
        const id = plainUrl.split("?v=")[1];
        databaseClone.vtuber[id] = {
          url: plainUrl, channel: "", collaboration: "", cover_url: "", id: id, like: false, tags: "", title: ""
        };
      } catch (e) {
        console.error(`Invalid url: ${url}`);
      }
    });
    Database.update.database(databaseClone);
    setInput("");
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
            endAdornment:  <InputAdornment position="end">
              <IconButton onClick={handleAddVtuber}><AddIcon /></IconButton>
            </InputAdornment>
          }}
        />
      </Container>
    </React.Fragment>
  );
};

export default AddAnime;
