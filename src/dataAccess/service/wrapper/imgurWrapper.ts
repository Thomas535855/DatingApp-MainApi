import * as service from "../../../utils/service";
import {IImgurWrapper} from "../../../interfaces/wrappers";


export const uploadToImgur:IImgurWrapper["uploadToImgur"] = async (file:Buffer): Promise<{imageUrl:string,info:any}> => {
    let fileString = file.toString('base64')

    const form = new FormData();
    form.append('image', fileString);
    form.append('privacy', 'hidden');

    const res = await service.imgurApi('image', 'POST', form);
    let result = await res.json();
    return {
        imageUrl:result.data.link,
        info:result.data
    }
}