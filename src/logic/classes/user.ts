import {IUser} from "../../interfaces/classes";
import {UserDto} from "../../interfaces/dto";
import Match from "./match";
import {AppDataSource} from "../../data-source";
import {UserEntity, UserGenreEntity} from "../../database/entity";
import Genre from "./genre";
export default class User implements IUser {
    // region properties

    private _date_of_birth?: Date;
    private _first_name?: string;
    private _id?: number;
    private _location?: string;
    private _profile_picture?: string;
    private _matches: Match[];
    private _genres: Genre[];

    //endregion

    constructor(user: UserDto) {
        this._id = user.id;
        this._location = user.location
        this._profile_picture = user.profile_picture;
        this._first_name = user.first_name;
        this._date_of_birth = user.date_of_birth
        this._matches = user.matches?.map(match => new Match(match)) || [];
        this._genres = user.genres?.map(genre => new Genre(genre)) || []
    }

    //region CRUD
    async create(): Promise<void> {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const userGenreRepository = AppDataSource.getRepository(UserGenreEntity);
        
        const user = userRepository.create({
            first_name: this._first_name,
            date_of_birth: this._date_of_birth,
            location: this._location,
            profile_picture: this._profile_picture,
        });

        const savedUser = await userRepository.save(user);
        
        if (this._genres && this._genres.length > 0) {
            const userGenreEntities = this._genres.map(genre => {
                const userGenre = new UserGenreEntity();
                
                userGenre.user = savedUser; 
                userGenre.genre = genre; 
                userGenre.userId = savedUser.id!;
                userGenre.genreId = genre.id!; 
                
                return userGenre;
            });
            
            await userGenreRepository.save(userGenreEntities);
        }
    }

    async read(): Promise<void> {
        if (!this._id) {
            throw new Error("User ID is undefined");
        }

        const userRepository = AppDataSource.getRepository(UserEntity);
        const user = await userRepository.findOne({where: {id: this._id}, relations: ["matches", "messages"]});

        if (!user) {
            throw new Error("User not found");
        }

        this._first_name = user.first_name ?? undefined;
        this._date_of_birth = user.date_of_birth ?? undefined;
        this._location = user.location ?? undefined;
        this._profile_picture = user.profile_picture ?? undefined;
        this._matches = user.matches?.map((match) => new Match(match)) || [];
        this._genres = user.userGenres?.map(genre => new Genre(genre)) || [];
    }
    
    async update(): Promise<void> {
        if (!this._id) {
            throw new Error("User ID is undefined");
        }

        const userRepository = AppDataSource.getRepository(UserEntity);
        const user = await userRepository.findOne({where: {id: this._id}});

        if (!user) {
            throw new Error("User not found");
        }
        
        user.first_name = this._first_name ?? user.first_name;
        user.date_of_birth = this._date_of_birth ?? user.date_of_birth;
        user.location = this._location ?? user.location;
        user.profile_picture = this._profile_picture ?? user.profile_picture;
        
        await userRepository.save(user);
    }

    async delete(): Promise<void> {
        if (!this._id) {
            throw new Error("User ID is undefined");
        }

        const userGenreRepository = AppDataSource.getRepository(UserGenreEntity);
        await userGenreRepository.delete({ userId: this._id });
        
        const userRepository = AppDataSource.getRepository(UserEntity);
        const user = await userRepository.findOne({ where: { id: this._id } });

        if (!user) {
            throw new Error("User not found");
        }

        await userRepository.remove(user);
    }
    
    toDto(): UserDto {
        return {
            id: this._id,
            first_name: this._first_name,
            date_of_birth: this._date_of_birth,
            location: this._location,
            profile_picture: this._profile_picture,
            matches: this._matches.map((match) => match.toDto()),
            genres: this._genres.map((genre) => genre.toDto())
        };
    }

    //endregion

    //region public functions

    //endregion

    //region private functions

    //endregion

    // region getters and setters
    get id(): number | undefined {
        return this._id;
    }

    set id(value: number | undefined) {
        this._id = value;
    }

    get first_name(): string | undefined {
        return this._first_name;
    }

    set first_name(value: string | undefined) {
        this._first_name = value;
    }

    get date_of_birth(): Date | undefined {
        return this._date_of_birth;
    }

    set date_of_birth(value: Date | undefined) {
        this._date_of_birth = value;
    }

    get location(): string | undefined {
        return this._location;
    }

    set location(value: string | undefined) {
        this._location = value;
    }

    get profile_picture(): string | undefined {
        return this._profile_picture;
    }

    set profile_picture(value: string | undefined) {
        this._profile_picture = value;
    }

    get matches(): Match[] {
        return this._matches;
    }

    set matches(value: Match[]) {
        this._matches = value;
    }
    
    get genres() :Genre[]{
        return this._genres;
    }
    
    set genres(value: Genre[]){
        this._genres = value;
    }

    //endregion
}