import {
    Column,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    OneToMany,
} from "typeorm";
import { UserGenreEntity } from "./UserGenreEntity";

@Index("Genre_pkey", ["id"], { unique: true })
@Entity("Genre", { schema: "public" })
export class GenreEntity {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id?: number;

    @Column("text", { name: "name" })
    name?: string;
    
    @OneToMany(() => UserGenreEntity, (userGenre) => userGenre.genre)
    userGenres?: UserGenreEntity[];
}
