import {MatchDto} from "../../interfaces/dto";
import Conversation from "./conversation";
import {IMatch} from "../../interfaces/classes";
import {AppDataSource} from "../../data-source";
import {MatchEntity} from "../../database/entity";

export default class Match implements IMatch {
    private _conversation?: Conversation;
    private _id?: number;
    private _user_id_one?: number;
    private _user_id_two?: number;

    constructor(match: MatchDto) {
        this._id = match.id;
        this._user_id_one = match.user_id_one;
        this._user_id_two = match.user_id_two;
        if (match.conversation) this._conversation = new Conversation(match.conversation);
    }

    // region CRUD methods

    async create(): Promise<void> {
        const matchRepository = AppDataSource.getRepository(MatchEntity);

        const match = matchRepository.create({
            user_id_one: this._user_id_one,
            user_id_two: this._user_id_two
        });

        await matchRepository.save(match);
        this._id = match.id;
    }

    async read(): Promise<void> {
        if (!this._id) {
            throw new Error("Match ID is undefined");
        }

        const matchRepository = AppDataSource.getRepository(MatchEntity);
        const match = await matchRepository.findOne({
            where: {id: this._id},
            relations: ["conversations", "conversations.messages", "conversations.messages.user"],
        });

        if (!match) {
            throw new Error("Match not found");
        }

        this._user_id_one = match.user_id_one;
        this._user_id_two = match.user_id_two;

        this._conversation = match.conversations.length
            ? new Conversation({
                id: match.conversations[0].id,
                match_id: match.id,
                messages: match.conversations[0].messages.map((message) => ({
                    id: message.id,
                    content: message.content,
                    created_date: message.created_date ?? undefined,
                    conversation_id: message.conversation?.id,
                    user_id: message.user?.id ?? undefined,
                })),
            })
            : undefined;
    }


    async update(): Promise<void> {
        if (!this._id) {
            throw new Error("Match ID is undefined");
        }

        const matchRepository = AppDataSource.getRepository(MatchEntity);
        const match = await matchRepository.findOne({where: {id: this._id}});

        if (!match) {
            throw new Error("Match not found");
        }

        match.user_id_one = this._user_id_one ?? match.user_id_one;
        match.user_id_two = this._user_id_two ?? match.user_id_two;

        await matchRepository.save(match);
    }

    async delete(): Promise<void> {
        if (!this._id) {
            throw new Error("Match ID is undefined");
        }

        const matchRepository = AppDataSource.getRepository(MatchEntity);
        const match = await matchRepository.findOne({where: {id: this._id}});

        if (!match) {
            throw new Error("Match not found");
        }

        await matchRepository.remove(match);
    }

    // Convert to DTO
    toDto(): MatchDto {
        return {
            id: this._id,
            user_id_one: this._user_id_one,
            user_id_two: this._user_id_two,
            conversation: this._conversation ? this._conversation.toDto() : undefined,
        };
    }

    // endregion

    // region getters and setters
    get conversation(): Conversation | undefined {
        return this._conversation;
    }

    set conversation(value: Conversation | undefined) {
        this._conversation = value;
    }

    get id(): number | undefined {
        return this._id;
    }

    set id(value: number | undefined) {
        this._id = value;
    }

    get user_id_one(): number | undefined {
        return this._user_id_one;
    }

    set user_id_one(value: number | undefined) {
        this._user_id_one = value;
    }

    get user_id_two(): number | undefined {
        return this._user_id_two;
    }

    set user_id_two(value: number | undefined) {
        this._user_id_two = value;
    }

    // endregion
}
