import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Match } from "./Match";
import { Message } from "./Message";

@Index("Conversation_pkey", ["id"], { unique: true })
@Entity("Conversation", { schema: "public" })
export class Conversation {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @ManyToOne(() => Match, (match) => match.conversations, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "match_id", referencedColumnName: "id" }])
  match: Match;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
