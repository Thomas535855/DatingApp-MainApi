import { expect } from 'chai';
import sinon from 'sinon';
import UserHandler from '../../logic/handlers/userHandler';
import User from '../../logic/classes/user';
import Genre from '../../logic/classes/genre';
import { createUserSchema } from '../../interfaces/schemas';
import {UserDto} from "../../interfaces/dto";

describe('UserHandler class', (): void => {
    let userHandler: UserHandler;
    let userStub: sinon.SinonStubbedInstance<User>;
    let genreStub: sinon.SinonStubbedInstance<Genre>;

    beforeEach((): void => {
        userHandler = new UserHandler();
        
        userStub = sinon.createStubInstance(User as any);
        userStub.create.resolves()
        userStub.readDeep.resolves();
        
        userStub.toDto.returns({
            id: 1,
            firstName: 'John',
            location: 'Somewhere',
            dateOfBirth: new Date('1990-01-01'),
            profilePicture: 'profile.jpg',
            matches: [],
            genres: []
        } as UserDto);
        
        sinon.stub(User.prototype, 'create').callsFake(userStub.create);
        sinon.stub(User.prototype, 'readDeep').callsFake(userStub.readDeep);
        sinon.stub(User.prototype, 'toDto').callsFake(userStub.toDto);
        
        genreStub = sinon.createStubInstance(Genre as any);
        genreStub.findByName.resolves();

        sinon.stub(Genre.prototype, 'findByName').callsFake(genreStub.findByName);
    });

    afterEach((): void => {
        sinon.restore();
    });

    describe('createUser()', (): void => {
        it('should create a new user and associate genres with it', async (): Promise<void> => {
            // Mock user data and genres
            const userData: createUserSchema['userData'] = {
                firstName: 'John',
                location: 'Somewhere',
                dateOfBirth: new Date('1990-01-01')
            };

            const genres = ['Rock', 'Jazz'];

            // Act
            await userHandler.createUser(userData, genres);

            // Assert
            expect(userStub.create.calledOnce).to.be.true;
            expect(genreStub.findByName.callCount).to.equal(genres.length);
        });
    });

    describe('getUser()', (): void => {
        it('should return a user DTO when a valid userId is provided', async (): Promise<void> => {
            const userId = 1;

            // Act
            const result = await userHandler.getUser(userId);

            // Assert
            expect(userStub.readDeep.calledOnce).to.be.true;
            expect(userStub.toDto.calledOnce).to.be.true;
            expect(result).to.deep.equal({
                id: 1,
                firstName: 'John',
                location: 'Somewhere',
                dateOfBirth: new Date('1990-01-01'),
                profilePicture: 'profile.jpg',
                matches: [],
                genres: []
            });
        });

        it('should throw an error if readDeep fails', async (): Promise<void> => {
            // Simulate an error being thrown by readDeep
            userStub.readDeep.rejects(new Error('User not found'));

            try {
                await userHandler.getUser(1);
                throw new Error('Expected getUser to throw');
            } catch (e: any) {
                // Assert
                expect(e.message).to.equal('User not found');
                expect(userStub.readDeep.calledOnce).to.be.true;
            }
        });
    });
});
