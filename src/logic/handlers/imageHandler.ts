import * as imgurWrapper from './../../dataAccess/service/wrapper/imgurWrapper'

export default class ImageHandler {
    public async uploadImageToImgur(buffer:Buffer):Promise<string>{
        try{
            const res = await imgurWrapper.uploadToImgur(buffer);
            
            return res.imageUrl;
        }
        catch(e:Error){
            throw new Error(e.message);
        }
    }
}