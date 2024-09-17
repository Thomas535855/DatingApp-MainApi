import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { MatchEntity } from "./MatchEntity";
import { MessageEntity } from "./MessageEntity";

@Entity("User", { schema: "public" })
export class UserEntity { // Just export the class
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "varchar", length: 100 })
  first_name?: string;

  @Column({ type: "date" })
  date_of_birth?: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  location?: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  profile_picture?: string | null;

  @OneToMany(() => MatchEntity, (match) => match.user_id_one)
  matches?: MatchEntity[];

  @OneToMany(() => MatchEntity, (match) => match.user_id_two)
  matches2?: MatchEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages?: MessageEntity[];
}
