import { expect } from 'chai';
import sinon from 'sinon';
import { AppDataSource } from '../../data-source';
import User from '../../logic/classes/user';
import { UserDto } from '../../interfaces/dto';

// Mock data
const mockUserDto: UserDto = {
    id: 1,
    first_name: 'John',
    date_of_birth: new Date('1990-01-01'),
    location: 'Somewhere',
    profile_picture: 'profile.jpg',
    matches: []
};

describe('User class', () => {
    let userRepositoryStub: any;
    let user: User;

    beforeEach(() => {
        user = new User(mockUserDto);

        // Stub the getRepository method to return a fake repository
        userRepositoryStub = {
            create: sinon.stub().returns({}),
            save: sinon.stub().resolves(),
            findOne: sinon.stub().resolves({
                id: 1,
                first_name: 'John',
                date_of_birth: new Date('1990-01-01'),
                location: 'Somewhere',
                profile_picture: 'profile.jpg',
                matches: []
            }),
            remove: sinon.stub().resolves()
        };

        sinon.stub(AppDataSource, 'getRepository').returns(userRepositoryStub);
    });

    afterEach(() => {
        sinon.restore(); // Restore all stubs
    });

    describe('create()', () => {
        it('should create and save a new user', async () => {
            await user.create();

            expect(userRepositoryStub.create.calledOnce).to.be.true;
            expect(userRepositoryStub.save.calledOnce).to.be.true;

            const createdUser = userRepositoryStub.create.getCall(0).args[0];
            expect(createdUser.first_name).to.equal('John');
            expect(createdUser.location).to.equal('Somewhere');
        });
    });

    describe('read()', () => {
        it('should throw an error if user ID is not defined', async () => {
            user.id = undefined;
            try {
                await user.read();
            } catch (err:any) {
                expect(err.message).to.equal('User ID is undefined');
            }
        });

        it('should load user data if ID is defined', async () => {
            await user.read();

            expect(userRepositoryStub.findOne.calledOnce).to.be.true;
            const foundUser = userRepositoryStub.findOne.getCall(0).args[0];
            expect(foundUser.where.id).to.equal(1);
        });
    });

    describe('update()', () => {
        it('should update user data when user is found', async () => {
            await user.update();

            expect(userRepositoryStub.findOne.calledOnce).to.be.true;
            expect(userRepositoryStub.save.calledOnce).to.be.true;

            const updatedUser = userRepositoryStub.save.getCall(0).args[0];
            expect(updatedUser.first_name).to.equal('John');
            expect(updatedUser.location).to.equal('Somewhere');
        });

        it('should throw an error if user ID is not defined', async () => {
            user.id = undefined;
            try {
                await user.update();
            } catch (err:any) {
                expect(err.message).to.equal('User ID is undefined');
            }
        });
    });

    describe('delete()', () => {
        it('should delete the user when ID is defined', async () => {
            await user.delete();

            expect(userRepositoryStub.findOne.calledOnce).to.be.true;
            expect(userRepositoryStub.remove.calledOnce).to.be.true;
        });

        it('should throw an error if user ID is not defined', async () => {
            user.id = undefined;
            try {
                await user.delete();
            } catch (err:any) {
                expect(err.message).to.equal('User ID is undefined');
            }
        });
    });
});
