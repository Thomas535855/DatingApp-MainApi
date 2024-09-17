import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Match } from "./Match";
import { Message } from "./Message";

@Index("User_pkey", ["id"], { unique: true })
@Entity("User", { schema: "public" })
export class User {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "first_name", length: 100 })
  firstName: string;

  @Column("date", { name: "date_of_birth" })
  dateOfBirth: string;

  @Column("character varying", {
    name: "location",
    nullable: true,
    length: 255,
  })
  location: string | null;

  @Column("character varying", {
    name: "profile_picture",
    nullable: true,
    length: 255,
  })
  profilePicture: string | null;

  @OneToMany(() => Match, (match) => match.userIdOne)
  matches: Match[];

  @OneToMany(() => Match, (match) => match.userIdTwo)
  matches2: Match[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
