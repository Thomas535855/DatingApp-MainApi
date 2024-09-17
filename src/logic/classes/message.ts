import {MessageDto} from "../../interfaces/dto";
import {IMessage} from "../../interfaces/classes";
import {AppDataSource} from "../../data-source";
import {ConversationEntity, MessageEntity, UserEntity} from "../../database/entity";

export default class Message implements IMessage {
    private _content?: string;
    private _conversation_id?: number;
    private _created_date?: Date;
    private _id?: number;
    private _user_id?: number;

    constructor(message: MessageDto) {
        this._id = message.id;
        this._conversation_id = message.conversation_id;
        this._content = message.content;
        this._created_date = message.created_date;
        this._user_id = message.user_id;
    }

    // region CRUD methods
    
    async create(): Promise<void> {
        const messageRepository = AppDataSource.getRepository(MessageEntity);

        const newMessage = messageRepository.create({
            content: this._content,
            conversation: {id: this._conversation_id},
            user: {id: this._user_id},
            created_date: this._created_date || new Date(),
        });

        const savedMessage = await messageRepository.save(newMessage);

        this._id = savedMessage.id;
    }

    async read(): Promise<void> {
        if (!this._id) {
            throw new Error("Message ID is undefined");
        }

        const messageRepository = AppDataSource.getRepository(MessageEntity);
        const message = await messageRepository.findOne({
            where: {id: this._id},
            relations: ["conversation", "user"],
        });

        if (!message) {
            throw new Error("Message not found");
        }

        this._content = message.content;
        this._conversation_id = message.conversation?.id;
        this._user_id = message.user?.id;
        this._created_date = message.created_date ?? undefined;
    }
    
    async update(): Promise<void> {
        if (!this._id) {
            throw new Error("Message ID is undefined");
        }

        const messageRepository = AppDataSource.getRepository(MessageEntity);
        const message = await messageRepository.findOne({where: {id: this._id}});

        if (!message) {
            throw new Error("Message not found");
        }

        message.content = this._content ?? message.content;

        if (this._conversation_id) {
            const conversationRepository = AppDataSource.getRepository(ConversationEntity);
            const conversation = await conversationRepository.findOne({where: {id: this._conversation_id}});
            if (!conversation) {
                throw new Error("Conversation not found");
            }
            message.conversation = conversation;
        }

        if (this._user_id) {
            const userRepository = AppDataSource.getRepository(UserEntity);
            const user = await userRepository.findOne({where: {id: this._user_id}});
            if (!user) {
                throw new Error("User not found");
            }
            message.user = user;
        }

        message.created_date = this._created_date ?? message.created_date;

        await messageRepository.save(message);
    }

    async delete(): Promise<void> {
        if (!this._id) {
            throw new Error("Message ID is undefined");
        }

        const messageRepository = AppDataSource.getRepository(MessageEntity);
        const message = await messageRepository.findOne({where: {id: this._id}});

        if (!message) {
            throw new Error("Message not found");
        }

        await messageRepository.remove(message);
    }

    toDto(): MessageDto {
        return {
            id: this._id,
            content: this._content,
            conversation_id: this._conversation_id,
            created_date: this._created_date,
            user_id: this._user_id,
        };
    }

    // endregion

    // region getters and setters
    get content(): string | undefined {
        return this._content;
    }

    set content(value: string | undefined) {
        this._content = value;
    }

    get conversation_id(): number | undefined {
        return this._conversation_id;
    }

    set conversation_id(value: number | undefined) {
        this._conversation_id = value;
    }

    get created_date(): Date | undefined {
        return this._created_date;
    }

    set created_date(value: Date | undefined) {
        this._created_date = value;
    }

    get id(): number | undefined {
        return this._id;
    }

    set id(value: number | undefined) {
        this._id = value;
    }

    get user_id(): number | undefined {
        return this._user_id;
    }

    set user_id(value: number | undefined) {
        this._user_id = value;
    }

    // endregion
}
