import {MatchDto, UserDto, ConversationDto, MessageDto} from '../../interfaces/dto';

export const createMockUserDto = (overrides?: Partial<UserDto>): UserDto => {
  return {
    id: 1,
    first_name: 'John',
    date_of_birth: new Date('1990-01-01'),
    location: 'Somewhere',
    profile_picture: 'profile.jpg',
    matches: [],
    ...overrides 
  };
};

export const createMockConversationDto = (overrides?: Partial<ConversationDto>): ConversationDto => {
  return {
    id: 1,
    match_id: 1,
    messages: createMockMessages(),
    ...overrides
  };
};

export const createMockMessages = (): MessageDto[] => [
  {
    id: 1,
    content: 'Hello',
    created_date: new Date(),
    conversation_id: 1,
    user_id: 1,
  }
];

export const createMockMatchDto = (overrides?: Partial<MatchDto>): MatchDto => {
  return {
    id: 1,
    user_id_one: 1,
    user_id_two: 2,
    conversation: createMockConversationDto(),
    ...overrides
  };
};

export const createMockMessageDto = (overrides?: Partial<MessageDto>): MessageDto => {
  return {
    id: 1,
    content: 'Test message content',
    conversation_id: 1,
    created_date: new Date(),
    user_id: 1,
    ...overrides
  };
};