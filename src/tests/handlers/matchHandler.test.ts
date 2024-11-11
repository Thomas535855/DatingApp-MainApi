import { expect } from 'chai';
import sinon from 'sinon';
import MatchHandler from '../../logic/handlers/matchHandler';
import Match from '../../logic/classes/match';

describe('MatchHandler class', (): void => {
    let matchHandler: MatchHandler;
    let matchStub: any;

    beforeEach((): void => {
        matchHandler = new MatchHandler();
        
        matchStub = sinon.createStubInstance(Match as any);
        matchStub.create.resolves();
        matchStub.findExistingMatch = sinon.stub().resolves(undefined);
        
        sinon.stub(Match.prototype, 'create').callsFake(matchStub.create);
        
        sinon.stub(matchHandler as any, 'findExistingMatch').callsFake(matchStub.findExistingMatch);
    });

    afterEach((): void => {
        sinon.restore();
    });

    describe('createUser()', (): void => {
        it('should create a new match if no match exists', async (): Promise<void> => {
            const userOneId = 1;
            const userTwoId = 2;

            await matchHandler.createUser(userOneId, userTwoId);

            expect(matchStub.findExistingMatch.calledOnce).to.be.true;
            expect(matchStub.create.calledOnce).to.be.true;
        });

        it('should throw an error if a match already exists', async (): Promise<void> => {
            const userOneId = 1;
            const userTwoId = 2;
            
            matchStub.findExistingMatch.resolves(new Match({ user_id_one: userOneId, user_id_two: userTwoId }));

            try {
                await matchHandler.createUser(userOneId, userTwoId);
            } catch (error) {
                expect(matchStub.findExistingMatch.calledOnce).to.be.true;
                expect(matchStub.create.notCalled).to.be.true;
                expect((error as Error).message).to.equal(`A match already exists between users ${userOneId} and ${userTwoId}`);
            }
        });
    });
});
