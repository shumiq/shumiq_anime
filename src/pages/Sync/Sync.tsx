import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SyncAnime from './SyncAnime';

const Sync = () => {
  const [selectedTab, setTab] = React.useState(1);

  const handleChange = (_, tab: number) => {
    setTab(tab);
  };

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Paper>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            variant={'fullWidth'}
            centered
          >
            <Tab
              label={<Typography variant={'caption'}>Download</Typography>}
            />
            <Tab label={<Typography variant={'caption'}>Anime</Typography>} />
            <Tab label={<Typography variant={'caption'}>Other</Typography>} />
          </Tabs>
        </Paper>
        <Container>
          {selectedTab === 0 && <Typography>One</Typography>}
          {selectedTab === 1 && <SyncAnime active={selectedTab === 1} />}
          {selectedTab === 2 && <Typography>Three</Typography>}
        </Container>
      </Container>
    </React.Fragment>
  );
};

export default Sync;
