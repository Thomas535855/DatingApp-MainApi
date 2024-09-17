import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Conversation } from "./Conversation";
import { User } from "./User";

@Index("Match_pkey", ["id"], { unique: true })
@Entity("Match", { schema: "public" })
export class Match {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @OneToMany(() => Conversation, (conversation) => conversation.match)
  conversations: Conversation[];

  @ManyToOne(() => User, (user) => user.matches, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id_one", referencedColumnName: "id" }])
  userIdOne: User;

  @ManyToOne(() => User, (user) => user.matches2, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id_two", referencedColumnName: "id" }])
  userIdTwo: User;
}
