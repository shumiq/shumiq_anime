const getParams = (name: string, query: string) => {
  return query.split(name + '=')[1].split('&')[0];
};

const Api = (props?: {
  location: {
    search: string;
  };
  match: {
    params: {
      function: string;
    };
  };
}): null => {
  const baseUrl = process.env.REACT_APP_API_ENDPOINT?.toString() || '';
  if (props?.match.params.function === 'share') {
    const animeId = getParams('anime', props.location.search);
    window.location.href = baseUrl + '/?search=' + animeId;
  }
  return null;
};

export default Api;
