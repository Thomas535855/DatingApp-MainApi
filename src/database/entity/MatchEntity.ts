import {
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";
import {ConversationEntity} from "./ConversationEntity";
import {UserEntity} from "./UserEntity";

@Index("Match_pkey", ["id"], {unique: true})
@Entity("Match", {schema: "public"})
export class MatchEntity {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.matches, {onDelete: "CASCADE"})
    @JoinColumn([{name: "user_id_one", referencedColumnName: "id"}])
    user_id_one: number;

    @ManyToOne(() => UserEntity, (user) => user.matches2, {onDelete: "CASCADE"})
    @JoinColumn([{name: "user_id_two", referencedColumnName: "id"}])
    user_id_two: number;

    @OneToMany(() => ConversationEntity, (conversation) => conversation.match)
    conversations: ConversationEntity[];
}
