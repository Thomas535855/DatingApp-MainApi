import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MatchEntity } from "./MatchEntity";
import { MessageEntity } from "./MessageEntity";

@Index("Conversation_pkey", ["id"], { unique: true })
@Entity("Conversation", { schema: "public" })
export class ConversationEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id?: number;

  @ManyToOne(() => MatchEntity, (match) => match.conversations, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "match_id", referencedColumnName: "id" }])
  match?: MatchEntity;
  
  @OneToMany(() => MessageEntity, (message) => message.conversation)
  messages?: MessageEntity[];
}
