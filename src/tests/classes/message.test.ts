import { expect } from 'chai';
import sinon from 'sinon';
import { AppDataSource } from '../../data-source';
import Message from '../../logic/classes/message';
import { createMockMessageDto } from '../fixtures/userFixtures';
import { MessageEntity, ConversationEntity, UserEntity } from '../../database/entity';
import {MessageDto} from "../../interfaces/dto";

describe('Message class', ():void => {
  let messageRepositoryStub: any;
  let conversationRepositoryStub: any;
  let userRepositoryStub: any;
  let message: Message;

  beforeEach(():void => {
    const mockMessageDto:MessageDto = createMockMessageDto();
    message = new Message(mockMessageDto);

    // Mock repositories
    messageRepositoryStub = {
      create: sinon.stub().returns({ id: 1 }),
      save: sinon.stub().resolves({ id: 1 }),
      findOne: sinon.stub().resolves({
        id: 1,
        content: 'Test message content',
        conversation: { id: 1 },
        user: { id: 1 },
        created_date: new Date()
      }),
      remove: sinon.stub().resolves()
    };

    conversationRepositoryStub = {
      findOne: sinon.stub().resolves({ id: 1 })
    };

    userRepositoryStub = {
      findOne: sinon.stub().resolves({ id: 1 })
    };

    sinon.stub(AppDataSource, 'getRepository')
      .withArgs(MessageEntity).returns(messageRepositoryStub)
      .withArgs(ConversationEntity).returns(conversationRepositoryStub)
      .withArgs(UserEntity).returns(userRepositoryStub);
  });

  afterEach(():void => {
    sinon.restore();
  });

  describe('create()', ():void => {
    it('should create and save a new message', async ():Promise<void> => {
      await message.create();

      expect(messageRepositoryStub.create.calledOnce).to.be.true;
      expect(messageRepositoryStub.save.calledOnce).to.be.true;

      const createdMessage = messageRepositoryStub.create.getCall(0).args[0];
      expect(createdMessage).to.have.property('content', 'Test message content');
      expect(createdMessage).to.have.property('conversation').that.deep.equals({ id: 1 });
      expect(createdMessage).to.have.property('user').that.deep.equals({ id: 1 });
    });
  });

  describe('read()', ():void => {
    it('should throw an error if message ID is undefined', async ():Promise<void> => {
      message.id = undefined;

      try {
        await message.read();
      } catch (err: any) {
        expect(err.message).to.equal('Message ID is undefined');
      }
    });

    it('should load message data when ID is defined', async ():Promise<void> => {
      await message.read();

      expect(messageRepositoryStub.findOne.calledOnce).to.be.true;
      const loadedMessage = messageRepositoryStub.findOne.getCall(0).args[0];
      expect(loadedMessage.where.id).to.equal(1);
      expect(message.content).to.equal('Test message content');
      expect(message.conversation_id).to.equal(1);
    });
  });

  describe('update()', ():void => {
    it('should update message data when message is found', async ():Promise<void> => {
      await message.update();

      expect(messageRepositoryStub.findOne.calledOnce).to.be.true;
      expect(messageRepositoryStub.save.calledOnce).to.be.true;

      const updatedMessage = messageRepositoryStub.save.getCall(0).args[0];
      expect(updatedMessage).to.have.property('content', 'Test message content');
    });

    it('should throw an error if message ID is undefined', async ():Promise<void> => {
      message.id = undefined;

      try {
        await message.update();
      } catch (err: any) {
        expect(err.message).to.equal('Message ID is undefined');
      }
    });

    it('should throw an error if conversation ID is not found', async ():Promise<void> => {
      conversationRepositoryStub.findOne.resolves(null); // Simulate no conversation found
      message.conversation_id = 999;

      try {
        await message.update();
      } catch (err: any) {
        expect(err.message).to.equal('Conversation not found');
      }
    });

    it('should throw an error if user ID is not found', async ():Promise<void> => {
      userRepositoryStub.findOne.resolves(null);
      message.user_id = 999;

      try {
        await message.update();
      } catch (err: any) {
        expect(err.message).to.equal('User not found');
      }
    });
  });

  describe('delete()', ():void => {
    it('should delete the message when ID is defined', async ():Promise<void> => {
      await message.delete();

      expect(messageRepositoryStub.findOne.calledOnce).to.be.true;
      expect(messageRepositoryStub.remove.calledOnce).to.be.true;
    });

    it('should throw an error if message ID is undefined', async ():Promise<void> => {
      message.id = undefined;

      try {
        await message.delete();
      } catch (err: any) {
        expect(err.message).to.equal('Message ID is undefined');
      }
    });
  });
});
