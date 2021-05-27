export interface SignInResModel {
  data: {
    sid: string;
  };
  success: boolean;
}

export interface ListResponse {
  data: {
    files?: File[];
    offset?: number;
    total?: number;
  };
  success?: boolean;
}

export interface File {
  additional?: {
    size: number;
    time: {
      atime: number;
      crtime: number;
      ctime: number;
      mtime: number;
    };
  };
  isdir?: boolean;
  name: string;
  path: string;
}
