export interface iWxResponse {
    data: {
        code: number;
        msg: string | null;
        rs: object;
        suc: boolean;
        timestamp: number;
    };
    errMsg: string;
    cookies: Array<string>;
    header: object;
    statusCode: number;
}
export declare function getAliToken(url: any): Promise<{}>;
