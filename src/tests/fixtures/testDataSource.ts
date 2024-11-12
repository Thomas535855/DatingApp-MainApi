import { DataSource } from 'typeorm';
import {UserEntity, MatchEntity, MessageEntity, ConversationEntity, GenreEntity, UserGenreEntity} from '../../database/entity'

const TestDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:', 
  entities: [UserEntity, MatchEntity, MessageEntity, ConversationEntity, GenreEntity, UserGenreEntity],
  synchronize: true, 
});

export { TestDataSource };
