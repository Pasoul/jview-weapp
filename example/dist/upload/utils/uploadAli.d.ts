import "./hmac";
import "./sha1";
export declare function uploadFile({ tempFile, aliyunTokenURL, aliyunServerURL, callback }: {
    tempFile: any;
    aliyunTokenURL: any;
    aliyunServerURL: any;
    callback: any;
}): Promise<{}>;
declare const _default: {
    uploadFile: typeof uploadFile;
};
export default _default;
