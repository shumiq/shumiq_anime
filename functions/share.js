import axios from 'axios';

const default_url = 'https://shumiq-anime.web.app/';
const rest_url = 'https://shumiq-anime.firebaseio.com/database/animeList/';
const opengraphTemplate = `<!doctype html>
<html lang="en">
  <head>
    <!-- 
    Gets replaced by URL specific meta tags via Firebase Functions
    -->
    <meta name="functions-insert-dynamic-meta">
    <meta name="functions-insert-dynamic-og">

    <script>
        window.location.href = "@url@";
    </script>
  </head>
  <body>
  </body>
</html>`;

exports.handler = async (event, context) => {
  const path = event.path.split('/');
  const api = 'share';
  const key = path[path.length - 1] === api ? null : path[path.length - 1];
  let res = '';
  if (key) {
    const response = await axios.get(rest_url + key + '.json');
    const anime = response.data;
    res = opengraphGenerator(anime);
  }
  context.clientContext = res;
  // TODO implement
  const response = {
    statusCode: 200,
    body: res,
  };
  return response;
};

const opengraphGenerator = (anime) => {
  let indexHTML = opengraphTemplate;
  let enumSeason = ['', 'Winter', 'Spring', 'Summer', 'Fall'];
  const openGraphPlaceholder = '<meta name="functions-insert-dynamic-og">';
  const org = {
    name: anime.title.split('"').join('&quot;') + ' (★' + anime.score + ')',
    desc:
      anime.year +
      ' ' +
      enumSeason[anime.season] +
      ' (' +
      anime.download +
      ' Episodes) – ' +
      anime.info.split('"').join('&quot;').split('\n').join('\\n'),
    slug: anime.key,
    logo_url: anime.cover_url,
  };
  indexHTML = indexHTML.replace(openGraphPlaceholder, getOpenGraph(org));
  indexHTML = indexHTML.replace(
    '@url@',
    default_url +
      '?search=' +
      encodeURI(anime.title + ' ' + anime.year + ' ' + enumSeason[anime.season])
  );
  return indexHTML;
};

const getOpenGraph = (org) => {
  let og = `<meta property="og:type" content="website" />\n`;
  og += `<meta property="og:title" content="${org.name}" />\n`;
  og += `<meta property="og:image" content="${org.logo_url}" />\n`;
  // og += `<meta property="og:url" content="https://shumiq-anime.netlify.app/share/${org.slug}" />\n`;
  og += `<meta property="og:description" content="${org.desc}" />\n`;
  return og;
};
