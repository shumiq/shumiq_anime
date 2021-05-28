import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

type TParams = { search: string };

const Anime = (props?: RouteComponentProps<TParams>) => {
  return <div>Hello World</div>;
};

export default withRouter(Anime);
