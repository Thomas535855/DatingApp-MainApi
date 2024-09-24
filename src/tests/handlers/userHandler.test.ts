import { expect } from 'chai';
import sinon from 'sinon';
import UserHandler from '../../logic/handlers/userHandler';
import User from '../../logic/classes/user';
import Genre from '../../logic/classes/genre';
import { createUserSchema } from '../../interfaces/schemas';

describe('UserHandler class', () => {
    let userHandler: UserHandler;
    let userStub: any;
    let genreStub: any;

    beforeEach(() => {
        userHandler = new UserHandler();
        
        userStub = sinon.createStubInstance(User as any);
        userStub.create.resolves();
        
        sinon.stub(User.prototype, 'create').callsFake(userStub.create);
        
        genreStub = sinon.createStubInstance(Genre as any);
        genreStub.findByName.resolves();

        sinon.stub(Genre.prototype, 'findByName').callsFake(genreStub.findByName);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('createUser()', () => {
        it('should create a new user and associate genres with it', async () => {
            // Mock user data and genres
            const userData: createUserSchema['userData'] = {
                firstName: 'John',
                location: 'Somewhere',
                dateOfBirth: new Date('1990-01-01')
            };

            const genres = ['Rock', 'Jazz'];
            
            await userHandler.createUser(userData, genres);
            
            expect(userStub.create.calledOnce).to.be.true;
            expect(genreStub.findByName.callCount).to.equal(genres.length);
        });
    });
});
