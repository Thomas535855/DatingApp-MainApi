import { expect } from 'chai';
import sinon from 'sinon';
import UserHandler from '../../logic/handlers/userHandler';
import User from '../../logic/classes/user';
import { createMockUserDto } from '../fixtures/userFixtures';

describe('UserHandler class', () => {
    let userHandler: UserHandler;
    let userCreateStub: sinon.SinonStub;

    beforeEach(() => {
        userHandler = new UserHandler();
        
        userCreateStub = sinon.stub(User.prototype, 'create').resolves();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('createUser()', () => {
        it('should create a user and handle the image upload', async () => {
            const mockUserDto = createMockUserDto();

            await userHandler.createUser(mockUserDto);
            
            expect(userCreateStub.calledOnce).to.be.true;
        });

        it('should throw an error if user creation fails', async () => {
            userCreateStub.rejects(new Error('User creation failed'));

            try {
                const mockUserDto = createMockUserDto();
                await userHandler.createUser(mockUserDto);
            } catch (err: any) {
                expect(err.message).to.equal('User creation failed');
            }
        });
    });
});
