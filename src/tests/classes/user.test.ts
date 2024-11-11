import { expect } from 'chai';
import sinon from 'sinon';
import { AppDataSource } from '../../data-source';
import User from '../../logic/classes/user';
import { createMockUserDto } from '../fixtures/userFixtures';
import { UserGenreEntity } from '../../database/entity';
import {UserDto} from "../../interfaces/dto";

describe('User class', ():void => {
    let userRepositoryStub: any;
    let userGenreRepositoryStub: any;
    let user: User;

    beforeEach(():void => {
        const mockUserDto:UserDto = createMockUserDto();
        user = new User(mockUserDto);

        userRepositoryStub = {
            create: sinon.stub().returns({}),
            save: sinon.stub().resolves(),
            findOne: sinon.stub().resolves({
                id: 1,
                first_name: 'John',
                date_of_birth: new Date('1990-01-01'),
                location: 'Somewhere',
                profile_picture: 'profile.jpg',
                matches: [],
                userGenres: []
            }),
            remove: sinon.stub().resolves()
        };

        userGenreRepositoryStub = {
            save: sinon.stub().resolves(),
            delete: sinon.stub().resolves()
        };

        sinon.stub(AppDataSource, 'getRepository').callsFake((entity):any => {
            if (entity === UserGenreEntity) {
                return userGenreRepositoryStub;
            }
            return userRepositoryStub;
        });
    });

    afterEach(():void => {
        sinon.restore();
    });

    describe('create()', ():void => {
        it('should create and save a new user along with genres', async ():Promise<void> => {
            await user.create();

            expect(userRepositoryStub.create.calledOnce).to.be.true;
            expect(userRepositoryStub.save.calledOnce).to.be.true;

            const createdUser = userRepositoryStub.create.getCall(0).args[0];
            expect(createdUser.first_name).to.equal('John');
            expect(createdUser.location).to.equal('Somewhere');

            // Check if genres are saved when available
            if (user.genres.length > 0) {
                expect(userGenreRepositoryStub.save.calledOnce).to.be.true;
                const savedGenres = userGenreRepositoryStub.save.getCall(0).args[0];
                expect(savedGenres.length).to.equal(user.genres.length);
            }
        });
    });

    describe('readDeep()', ():void => {
        it('should throw an error if user ID is not defined', async ():Promise<void> => {
            user.id = undefined;
            try {
                await user.readDeep();
            } catch (err:any) {
                expect(err.message).to.equal('User ID is undefined');
            }
        });

        it('should load user data, including genres, if ID is defined', async ():Promise<void> => {
            await user.readDeep();

            expect(userRepositoryStub.findOne.calledOnce).to.be.true;
            const foundUser = userRepositoryStub.findOne.getCall(0).args[0];
            expect(foundUser.where.id).to.equal(1);

            // Verify genres are loaded
            expect(user.genres.length).to.equal(0); // Since mock data has no genres
        });
    });

    describe('update()', ():void => {
        it('should update user data when user is found', async ():Promise<void> => {
            await user.update();

            expect(userRepositoryStub.findOne.calledOnce).to.be.true;
            expect(userRepositoryStub.save.calledOnce).to.be.true;

            const updatedUser = userRepositoryStub.save.getCall(0).args[0];
            expect(updatedUser.first_name).to.equal('John');
            expect(updatedUser.location).to.equal('Somewhere');
        });

        it('should throw an error if user ID is not defined', async ():Promise<void> => {
            user.id = undefined;
            try {
                await user.update();
            } catch (err:any) {
                expect(err.message).to.equal('User ID is undefined');
            }
        });
    });

    describe('delete()', ():void => {
        it('should delete the user and associated genres when ID is defined', async ():Promise<void> => {
            await user.delete();

            expect(userRepositoryStub.findOne.calledOnce).to.be.true;
            expect(userRepositoryStub.remove.calledOnce).to.be.true;
            
            expect(userGenreRepositoryStub.delete.calledOnce).to.be.true;
        });

        it('should throw an error if user ID is not defined', async ():Promise<void> => {
            user.id = undefined;
            try {
                await user.delete();
            } catch (err:any) {
                expect(err.message).to.equal('User ID is undefined');
            }
        });
    });
});
