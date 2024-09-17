import { expect } from 'chai';
import sinon from 'sinon';
import { AppDataSource } from '../../data-source';
import Conversation from '../../logic/classes/conversation';
import { createMockConversationDto } from '../fixtures/userFixtures';
import { ConversationEntity, MatchEntity } from '../../database/entity';

describe('Conversation class', () => {
  let conversationRepositoryStub: any;
  let matchRepositoryStub: any;
  let conversation: Conversation;

  beforeEach(() => {
    const mockConversationDto = createMockConversationDto();
    conversation = new Conversation(mockConversationDto);
    
    conversationRepositoryStub = {
      save: sinon.stub().resolves({ id: 1 }),
      findOne: sinon.stub().resolves({
        id: 1,
        match: { id: 1 },
        messages: [{
          id: 1,
          content: 'Hello',
          created_date: new Date(),
          user: { id: 1 },
        }]
      }),
      remove: sinon.stub().resolves()
    };

    matchRepositoryStub = {
      findOne: sinon.stub().resolves({ id: 1 })
    };

    sinon.stub(AppDataSource, 'getRepository')
      .withArgs(ConversationEntity).returns(conversationRepositoryStub)
      .withArgs(MatchEntity).returns(matchRepositoryStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('create()', () => {
    it('should create and save a new conversation', async () => {
      await conversation.create();

      expect(conversationRepositoryStub.save.calledOnce).to.be.true;
      const savedConversation = conversationRepositoryStub.save.getCall(0).args[0];
      expect(savedConversation.messages).to.be.empty;
      expect(savedConversation.match).to.have.property('id', 1);
    });

    it('should throw an error if the match is not found', async () => {
      matchRepositoryStub.findOne.resolves(null); // Simulate no match found

      try {
        await conversation.create();
      } catch (err: any) {
        expect(err.message).to.equal('Match not found');
      }
    });
  });

  describe('read()', () => {
    it('should throw an error if conversation ID is undefined', async () => {
      conversation.id = undefined;

      try {
        await conversation.read();
      } catch (err: any) {
        expect(err.message).to.equal('Conversation ID is undefined');
      }
    });

    it('should load conversation data when ID is defined', async () => {
      await conversation.read();

      expect(conversationRepositoryStub.findOne.calledOnce).to.be.true;
      const loadedConversation = conversationRepositoryStub.findOne.getCall(0).args[0];
      expect(loadedConversation.where.id).to.equal(1);
      expect(conversation.messages).to.have.lengthOf(1);
    });
  });

  describe('update()', () => {
    it('should update conversation data when conversation is found', async () => {
      await conversation.update();

      expect(conversationRepositoryStub.findOne.calledOnce).to.be.true;
      expect(conversationRepositoryStub.save.calledOnce).to.be.true;

      const updatedConversation = conversationRepositoryStub.save.getCall(0).args[0];
      expect(updatedConversation.match).to.have.property('id', 1);
    });

    it('should throw an error if conversation ID is undefined', async () => {
      conversation.id = undefined;

      try {
        await conversation.update();
      } catch (err: any) {
        expect(err.message).to.equal('Conversation ID is undefined');
      }
    });
  });

  describe('delete()', () => {
    it('should delete the conversation when ID is defined', async () => {
      await conversation.delete();

      expect(conversationRepositoryStub.findOne.calledOnce).to.be.true;
      expect(conversationRepositoryStub.remove.calledOnce).to.be.true;
    });

    it('should throw an error if conversation ID is undefined', async () => {
      conversation.id = undefined;

      try {
        await conversation.delete();
      } catch (err: any) {
        expect(err.message).to.equal('Conversation ID is undefined');
      }
    });
  });
});
