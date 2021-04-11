export interface IResponseBase<T = {}> {
    status: 'ok' | 'error';
    token?: string;
    data?: T;
    total?: number;
    page?: number;
    limit?: number;
}

export interface IRequestBase {
    sort?: string;
    page?: number;
    limit?: number;
}
