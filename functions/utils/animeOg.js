const default_url = 'https://shumiq-anime.web.app/';
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

const getMeta = (org) => {
  let og = `<meta property="og:type" content="website" />\n`;
  og += `<meta property="og:title" content="${org.name}" />\n`;
  og += `<meta property="og:image" content="${org.logo_url}" />\n`;
  // og += `<meta property="og:url" content="https://shumiq-anime.netlify.app/share/${org.slug}" />\n`;
  og += `<meta property="og:description" content="${org.desc}" />\n`;
  return og;
};

export default (anime) => {
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
  indexHTML = indexHTML.replace(openGraphPlaceholder, getMeta(org));
  indexHTML = indexHTML.replace(
    '@url@',
    default_url +
      '?search=' +
      encodeURI(anime.title + ' ' + anime.year + ' ' + enumSeason[anime.season])
  );
  return indexHTML;
};
