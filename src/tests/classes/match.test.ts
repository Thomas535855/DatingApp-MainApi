import { expect } from 'chai';
import sinon from 'sinon';
import { AppDataSource } from '../../data-source';
import Match from '../../logic/classes/match';
import { createMockMatchDto } from '../fixtures/userFixtures';
import Conversation from '../../logic/classes/conversation';

describe('Match class', () => {
  let matchRepositoryStub: any;
  let match: Match;

  beforeEach(() => {
    const mockMatchDto = createMockMatchDto();
    match = new Match(mockMatchDto);

    // Mock repositories
    matchRepositoryStub = {
      create: sinon.stub().returns({
        id: 1,
        user_id_one: 1,
        user_id_two: 2
      }),
      save: sinon.stub().resolves({
        id: 1,
        user_id_one: 1,
        user_id_two: 2
      }),
      findOne: sinon.stub().resolves({
        id: 1,
        user_id_one: 1,
        user_id_two: 2,
        conversations: [{
          id: 1,
          messages: [
            { id: 1, content: 'Test message', created_date: new Date(), user: { id: 1 } }
          ]
        }]
      }),
      remove: sinon.stub().resolves()
    };

    sinon.stub(AppDataSource, 'getRepository').returns(matchRepositoryStub);
  });


  afterEach(() => {
    sinon.restore();
  });

  describe('create()', () => {
    it('should create and save a new match', async () => {
      await match.create();

      expect(matchRepositoryStub.create.calledOnce).to.be.true;
      expect(matchRepositoryStub.save.calledOnce).to.be.true;

      const savedMatch = matchRepositoryStub.save.getCall(0).args[0];
      expect(savedMatch).to.have.property('user_id_one', 1);
      expect(savedMatch).to.have.property('user_id_two', 2);
    });
  });

  describe('read()', () => {
    it('should throw an error if match ID is undefined', async () => {
      match.id = undefined;

      try {
        await match.read();
      } catch (err: any) {
        expect(err.message).to.equal('Match ID is undefined');
      }
    });

    it('should load match data when ID is defined', async () => {
      await match.read();

      expect(matchRepositoryStub.findOne.calledOnce).to.be.true;
      const loadedMatch = matchRepositoryStub.findOne.getCall(0).args[0];
      expect(loadedMatch.where.id).to.equal(1);
      expect(match.conversation).to.be.instanceOf(Conversation);
      expect(match.conversation?.messages).to.have.lengthOf(1);
    });
  });

  describe('update()', () => {
    it('should update match data when match is found', async () => {
      await match.update();

      expect(matchRepositoryStub.findOne.calledOnce).to.be.true;
      expect(matchRepositoryStub.save.calledOnce).to.be.true;

      const updatedMatch = matchRepositoryStub.save.getCall(0).args[0];
      expect(updatedMatch).to.have.property('user_id_one', 1);
      expect(updatedMatch).to.have.property('user_id_two', 2);
    });

    it('should throw an error if match ID is undefined', async () => {
      match.id = undefined;

      try {
        await match.update();
      } catch (err: any) {
        expect(err.message).to.equal('Match ID is undefined');
      }
    });
  });

  describe('delete()', () => {
    it('should delete the match when ID is defined', async () => {
      await match.delete();

      expect(matchRepositoryStub.findOne.calledOnce).to.be.true;
      expect(matchRepositoryStub.remove.calledOnce).to.be.true;
    });

    it('should throw an error if match ID is undefined', async () => {
      match.id = undefined;

      try {
        await match.delete();
      } catch (err: any) {
        expect(err.message).to.equal('Match ID is undefined');
      }
    });
  });
});
