import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Match } from "./Match";
import { Message } from "./Message";

@Entity("User", { schema: "public" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  first_name: string;

  @Column({ type: "date" })
  date_of_birth: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  location: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  profile_picture: string | null;

  @OneToMany(() => Match, (match) => match.userIdOne)
  matches: Match[];

  @OneToMany(() => Match, (match) => match.userIdTwo)
  matches2: Match[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
