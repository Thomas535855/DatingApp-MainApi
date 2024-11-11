export interface IImgurWrapper {
    uploadToImgur(file: Buffer): Promise<{ imageUrl: string, info: any }>;
}