import {ConversationDto, MessageDto} from "../../interfaces/dto";
import Message from "./message";
import {IConversation} from "../../interfaces/classes";
import {AppDataSource} from "../../data-source";
import {ConversationEntity} from "../../database/entity";
import {MatchEntity} from "../../database/entity";

export default class Conversation implements IConversation {
    private _id?: number;
    private _match_id?: number;
    private _messages: Message[];

    constructor(conversation: ConversationDto) {
        this._id = conversation.id;
        this._match_id = conversation.match_id;
        this._messages = conversation.messages?.map((message) => new Message(message)) || [];
    }

    // region CRUD methods

    // Create operation
    async create(): Promise<void> {
        const conversationRepository = AppDataSource.getRepository(ConversationEntity);

        const newConversation = new ConversationEntity();
        newConversation.messages = [];
        if (this._match_id) {
            const matchRepository = AppDataSource.getRepository(MatchEntity);
            const match = await matchRepository.findOne({where: {id: this._match_id}});
            if (!match) {
                throw new Error("Match not found");
            }
            newConversation.match = match;
        }

        const savedConversation = await conversationRepository.save(newConversation);
        this._id = savedConversation.id;
    }

    async read(): Promise<void> {
        if (!this._id) {
            throw new Error("Conversation ID is undefined");
        }

        const conversationRepository = AppDataSource.getRepository(ConversationEntity);
        const conversation = await conversationRepository.findOne({
            where: {id: this._id},
            relations: ["match", "messages", "messages.user"],
        });

        if (!conversation) {
            throw new Error("Conversation not found");
        }

        this._match_id = conversation.match.id;

        this._messages = conversation.messages.map((message) => {
            const messageDto: MessageDto = {
                id: message.id,
                content: message.content,
                created_date: message.created_date ?? undefined,
                conversation_id: conversation.id,
                user_id: message.user?.id ?? undefined,
            };
            return new Message(messageDto);
        });
    }

    async update(): Promise<void> {
        if (!this._id) {
            throw new Error("Conversation ID is undefined");
        }

        const conversationRepository = AppDataSource.getRepository(ConversationEntity);
        const conversation = await conversationRepository.findOne({where: {id: this._id}});

        if (!conversation) {
            throw new Error("Conversation not found");
        }

        if (this._match_id) {
            const matchRepository = AppDataSource.getRepository(MatchEntity);
            const match = await matchRepository.findOne({where: {id: this._match_id}});
            if (!match) {
                throw new Error("Match not found");
            }
            conversation.match = match;
        }

        await conversationRepository.save(conversation);
    }

    async delete(): Promise<void> {
        if (!this._id) {
            throw new Error("Conversation ID is undefined");
        }

        const conversationRepository = AppDataSource.getRepository(ConversationEntity);
        const conversation = await conversationRepository.findOne({where: {id: this._id}});

        if (!conversation) {
            throw new Error("Conversation not found");
        }

        await conversationRepository.remove(conversation);
    }

    toDto(): ConversationDto {
        return {
            id: this._id,
            match_id: this._match_id,
            messages: this._messages.map((message) => message.toDto()),
        };
    }

    // endregion

    // region getters and setters
    get id(): number | undefined {
        return this._id;
    }

    set id(value: number | undefined) {
        this._id = value;
    }

    get match_id(): number | undefined {
        return this._match_id;
    }

    set match_id(value: number | undefined) {
        this._match_id = value;
    }

    get messages(): Message[] {
        return this._messages;
    }

    set messages(value: Message[]) {
        this._messages = value;
    }

    // endregion
}
