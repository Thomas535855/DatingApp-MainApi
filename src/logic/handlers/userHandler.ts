import User from "../classes/user";
import {createUserSchema} from "../../interfaces/schemas";
import Genre from "../classes/genre";

export default class UserHandler {
    
    public async createUser(userData:createUserSchema['userData'], genres:createUserSchema['genres']):Promise<void>{
        
        const user = new User({
            first_name: userData.firstName,
            location: userData.location,
            date_of_birth: userData.dateOfBirth
        });
        
        const userGenres = genres.map(genre => new Genre({
            name: genre
        }));

        await Promise.all(userGenres.map(async (genre) => {
            await genre.findByName();
        }));
        
        user.genres = userGenres;

        await user.create();
    }
}