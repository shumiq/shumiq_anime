import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SyncAnime from './SyncAnime';
import SyncOther from './SyncOther';
import SyncDownload from './SyncDownload';

const Sync = () => {
  const [selectedTab, setTab] = React.useState(0);

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
          {selectedTab === 0 && <SyncDownload active={selectedTab === 0} />}
          {selectedTab === 1 && <SyncAnime active={selectedTab === 1} />}
          {selectedTab === 2 && <SyncOther />}
        </Container>
      </Container>
    </React.Fragment>
  );
};

export default Sync;
