import * as dto from './dto'

export interface IUser{
    id?: number;
    first_name?: string;
    date_of_birth?: Date;
    location?: string;
    profile_picture?: string;
    matches: IMatch[];
    genres: IGenre[];
    
    toDto(): dto.UserDto
    create(): Promise<void>
    read(): Promise<void>
    update(): Promise<void>
    delete(): Promise<void>
}

export interface IMatch{
    id?: number
    user_id_one?: number;
    user_id_two?: number;
    conversation?: IConversation

    toDto(): dto.MatchDto
    create(): Promise<void>
    read(): Promise<void>
    update(): Promise<void>
    delete(): Promise<void>
}

export interface IConversation{
    id?: number;
    match_id?:number;
    messages: IMessage[]

    toDto(): dto.ConversationDto
    create(): Promise<void>
    read(): Promise<void>
    update(): Promise<void>
    delete(): Promise<void>
}

export interface IMessage{
    id?: number;
    conversation_id?: number;
    user_id?: number;
    content?: string;
    created_date?: Date;

    toDto(): dto.MessageDto
    create(): Promise<void>
    read(): Promise<void>
    update(): Promise<void>
    delete(): Promise<void>
}

export interface IGenre{
    id?: number;
    name?: string;

    toDto(): dto.MessageDto
    create(): Promise<void>
    read(): Promise<void>
    update(): Promise<void>
    delete(): Promise<void>
    
    findByName(): Promise<void>
}

