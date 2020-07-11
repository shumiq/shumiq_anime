const Api = (props?: {
  location: {
    pathname: string;
    search: string;
  };
}): null => {
  const url =
    (process.env.REACT_APP_API_ENDPOINT?.toString() || '') +
    (props?.location.pathname || '') +
    (props?.location.search || '');
  window.location.href = url;
  return null;
};

export default Api;
