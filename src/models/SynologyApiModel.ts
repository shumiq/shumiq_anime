export interface SignInResModel {
    data: {
        sid: string;
    };
    success: boolean;
}

export interface ListResponse {
    data: {
        files?: {
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
        }[];
        offset?: number;
        total?: number;
    };
    success?: boolean;
}