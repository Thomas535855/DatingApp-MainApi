export interface UserDto{
    id?: number;
    first_name?: string;
    date_of_birth?: Date;
    location?: string;
    profile_picture?: string;
    matches: MatchDto[];
}

export interface MatchDto{
    id?: number
    user_id_one?: number;
    user_id_two?: number;
    conversation?: ConversationDto
}

export interface ConversationDto{
    id?: number;
    match_id?:number;
    messages: MessageDto[]
}

export interface MessageDto{
    id?: number;
    conversation_id?: number;
    user_id?: number;
    content?: string;
    created_date?: Date;
}

