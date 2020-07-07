require('dotenv').config({ path: '.env.local' });
const default_url = process.env.ENDPOINT;
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

const getMeta = (org: {
  name: string;
  logo_url: string;
  desc: string;
}): string => {
  let og = `<meta property="og:type" content="website" />\n`;
  og += `<meta property="og:title" content="${org.name}" />\n`;
  og += `<meta property="og:image" content="${org.logo_url}" />\n`;
  og += `<meta property="og:description" content="${org.desc}" />\n`;
  return og;
};

export default (anime: {
  title: string;
  score: string;
  year: number;
  season: number;
  download: number;
  info: string;
  cover_url: string;
}): string => {
  let indexHTML = opengraphTemplate;
  const enumSeason = ['', 'Winter', 'Spring', 'Summer', 'Fall'];
  const openGraphPlaceholder = '<meta name="functions-insert-dynamic-og">';
  const org = {
    name: anime.title.split('"').join('&quot;') + ' (★' + anime.score + ')',
    desc:
      anime.year.toString() +
      ' ' +
      enumSeason[anime.season] +
      ' (' +
      anime.download.toString() +
      ' Episodes) – ' +
      anime.info.split('"').join('&quot;').split('\n').join('\\n'),
    logo_url: anime.cover_url,
  };
  indexHTML = indexHTML.replace(openGraphPlaceholder, getMeta(org));
  indexHTML = indexHTML.replace(
    '@url@',
    default_url +
      '?search=' +
      encodeURI(
        anime.title +
          ' ' +
          anime.year.toString() +
          ' ' +
          enumSeason[anime.season]
      )
  );
  return indexHTML;
};
