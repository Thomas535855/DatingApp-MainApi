import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ConversationEntity } from "./ConversationEntity"; 
import { UserEntity } from "./UserEntity";

@Index("Message_pkey", ["id"], { unique: true })
@Entity("Message", { schema: "public" })
export class MessageEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id?: number;

  @Column("text", { name: "content" })
  content?: string;

  @Column("timestamp without time zone", {
    name: "created_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  created_date?: Date | null;

  // Foreign key to ConversationEntity (conversation_id)
  @ManyToOne(() => ConversationEntity, (conversation) => conversation.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "conversation_id", referencedColumnName: "id" }])
  conversation?: ConversationEntity;

  // Foreign key to UserEntity (user_id)
  @ManyToOne(() => UserEntity, (user) => user.messages, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user?: UserEntity;
}
