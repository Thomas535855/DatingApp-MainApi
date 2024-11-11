import Match from "../classes/match";
import { AppDataSource } from "../../data-source";
import { MatchEntity } from "../../database/entity";
import { Repository } from "typeorm";

export default class MatchHandler {
    public async createUser(userOneId: number, userTwoId: number): Promise<void> {
        const existingMatch: Match | undefined = await this.findExistingMatch(userOneId, userTwoId);

        if (existingMatch) {
            throw new Error(`A match already exists between users ${userOneId} and ${userTwoId}`);
        }

        const match = new Match({ user_id_one: userOneId, user_id_two: userTwoId });
        await match.create();
    }

    private async findExistingMatch(userOneId: number, userTwoId: number): Promise<Match | undefined> {
        const matchRepository: Repository<MatchEntity> = AppDataSource.getRepository(MatchEntity);

        const existingMatch: MatchEntity | null = await matchRepository.findOne({
            where: [
                { user_id_one: userOneId, user_id_two: userTwoId },
                { user_id_one: userTwoId, user_id_two: userOneId }
            ]
        });

        return existingMatch ? new Match({
            id: existingMatch.id,
            user_id_one: existingMatch.user_id_one,
            user_id_two: existingMatch.user_id_two,
        }) : undefined;
    }
}
