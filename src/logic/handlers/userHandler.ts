import User from "../classes/user";
import {createUserSchema} from "../../interfaces/schemas";
import Genre from "../classes/genre";
import {UserDto} from "../../interfaces/dto";

export default class UserHandler {
    
    public async createUser(userData:createUserSchema['userData'], genres:createUserSchema['genres']):Promise<void>{
        try {
            const user = new User({
                first_name: userData.firstName,
                location: userData.location,
                date_of_birth: userData.dateOfBirth,
                profile_picture: userData.profilePicture
            });

            const userGenres:Genre[] = genres.map(genre => new Genre({
                name: genre
            }));

            await Promise.all(userGenres.map(async (genre:Genre):Promise<void> => {
                await genre.findByName();
            }));

            user.genres = userGenres;

            await user.create();
        }
        catch(e:Error){
            throw new Error(e.message);
        }
    }
    
    public async getUser(userId:number):Promise<UserDto>{
        try{
            const user = new User({
                id: userId
            });
            await user.readDeep();
            
            return user.toDto();
        }
        catch (e:Error) {
            throw new Error(e.message)
        }
    }
}