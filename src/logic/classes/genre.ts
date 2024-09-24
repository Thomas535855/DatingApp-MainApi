import { IGenre } from "../../interfaces/classes";
import { GenreDto } from "../../interfaces/dto";
import { AppDataSource } from "../../data-source";
import { GenreEntity } from "../../database/entity";

export default class Genre implements IGenre {
    private _id?: number;
    private _name?: string;

    constructor(genre: GenreDto) {
        this._id = genre.id;
        this._name = genre.name?.toLowerCase(); //Ensure that names are always .toLowerCase because of inconsistency in SpotifyAPI
    }

    // region CRUD methods
    
    async create(): Promise<void> {
        const genreRepository = AppDataSource.getRepository(GenreEntity);
        const newGenre = new GenreEntity();
        newGenre.name = this._name;

        const savedGenre = await genreRepository.save(newGenre);
        this._id = savedGenre.id;
    }

    async read(): Promise<void> {
        if (!this._id) {
            throw new Error("Genre ID is undefined");
        }

        const genreRepository = AppDataSource.getRepository(GenreEntity);
        const genre = await genreRepository.findOne({ where: { id: this._id } });

        if (!genre) {
            throw new Error("Genre not found");
        }

        this._name = genre.name;
    }

    async update(): Promise<void> {
        if (!this._id) {
            throw new Error("Genre ID is undefined");
        }

        const genreRepository = AppDataSource.getRepository(GenreEntity);
        const genre = await genreRepository.findOne({ where: { id: this._id } });

        if (!genre) {
            throw new Error("Genre not found");
        }

        genre.name = this._name;
        await genreRepository.save(genre);
    }

    async delete(): Promise<void> {
        if (!this._id) {
            throw new Error("Genre ID is undefined");
        }

        const genreRepository = AppDataSource.getRepository(GenreEntity);
        const genre = await genreRepository.findOne({ where: { id: this._id } });

        if (!genre) {
            throw new Error("Genre not found");
        }

        await genreRepository.remove(genre);
    }

    toDto(): GenreDto {
        return {
            id: this._id,
            name: this._name,
        };
    }

    // endregion
    
    // region public functions
    public async findByName(): Promise<void> {
        if (!this._name) {
            throw new Error("Genre name is undefined");
        }

        const genreRepository = AppDataSource.getRepository(GenreEntity);
        
        let genre = await genreRepository.findOne({
            where: {
                name: this._name.toLowerCase(),
            },
        });

        if (!genre) {
            await this.create();  
            
            genre = await genreRepository.findOne({
                where: {
                    name: this._name,
                },
            });

            if (!genre) {
                throw new Error("Failed to create and fetch the new genre");
            }
        }
        
        this._id = genre.id;
        this._name = genre.name;
    }
    
    // endregion

    // region getters and setters
    get id(): number | undefined {
        return this._id;
    }

    set id(value: number | undefined) {
        this._id = value;
    }

    get name(): string | undefined {
        return this._name;
    }

    set name(value: string | undefined) {
        this._name = value;
    }
    // endregion
}
