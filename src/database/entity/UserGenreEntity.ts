import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserEntity } from "./UserEntity";
import { GenreEntity } from "./GenreEntity";

@Entity("UserGenre")
export class UserGenreEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.userGenres, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @ManyToOne(() => GenreEntity, (genre) => genre.userGenres, { onDelete: "CASCADE" })
    @JoinColumn({ name: "genreId" })
    genre: GenreEntity;

    @Column({ type: 'integer', name: "userId" })
    userId: number;

    @Column({ type: 'integer', name: "genreId" })
    genreId: number;
}
