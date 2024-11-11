import { expect } from 'chai';
import sinon from 'sinon';
import { AppDataSource } from '../../data-source';
import Genre from '../../logic/classes/genre';
import { GenreEntity } from '../../database/entity';
import { createMockGenreDto } from '../fixtures/userFixtures';
import {GenreDto} from "../../interfaces/dto";

describe('Genre class', ():void => {
    let genreRepositoryStub: any;
    let genre: Genre;

    beforeEach(():void => {
        const mockGenreDto:GenreDto = createMockGenreDto();
        genre = new Genre(mockGenreDto);

        genreRepositoryStub = {
            save: sinon.stub().resolves({ id: 1, name: mockGenreDto.name }),
            findOne: sinon.stub().resolves({
                id: 1,
                name: mockGenreDto.name,
            }),
            remove: sinon.stub().resolves(),
        };

        sinon.stub(AppDataSource, 'getRepository')
            .withArgs(GenreEntity).returns(genreRepositoryStub);
    });

    afterEach(():void => {
        sinon.restore();
    });

    describe('create()', ():void => {
        it('should create and save a new genre', async ():Promise<void> => {
            await genre.create();

            expect(genreRepositoryStub.save.calledOnce).to.be.true;
            const savedGenre = genreRepositoryStub.save.getCall(0).args[0];
            expect(savedGenre).to.have.property('name', genre.name);
        });
    });

    describe('read()', ():void => {
        it('should throw an error if genre ID is undefined', async ():Promise<void> => {
            genre.id = undefined;

            try {
                await genre.read();
            } catch (err: any) {
                expect(err.message).to.equal('Genre ID is undefined');
            }
        });

        it('should load genre data when ID is defined', async ():Promise<void> => {
            await genre.read();

            expect(genreRepositoryStub.findOne.calledOnce).to.be.true;
            const loadedGenre = genreRepositoryStub.findOne.getCall(0).args[0];
            expect(loadedGenre.where.id).to.equal(1);
            expect(genre.name).to.equal('someGenre');
        });
    });

    describe('update()', ():void => {
        it('should update genre data when genre is found', async ():Promise<void> => {
            await genre.update();

            expect(genreRepositoryStub.findOne.calledOnce).to.be.true;
            expect(genreRepositoryStub.save.calledOnce).to.be.true;

            const updatedGenre = genreRepositoryStub.save.getCall(0).args[0];
            expect(updatedGenre).to.have.property('name', genre.name);
        });

        it('should throw an error if genre ID is undefined', async ():Promise<void> => {
            genre.id = undefined;

            try {
                await genre.update();
            } catch (err: any) {
                expect(err.message).to.equal('Genre ID is undefined');
            }
        });
    });

    describe('delete()', ():void => {
        it('should delete the genre when ID is defined', async ():Promise<void> => {
            await genre.delete();

            expect(genreRepositoryStub.findOne.calledOnce).to.be.true;
            expect(genreRepositoryStub.remove.calledOnce).to.be.true;
        });

        it('should throw an error if genre ID is undefined', async ():Promise<void> => {
            genre.id = undefined;

            try {
                await genre.delete();
            } catch (err: any) {
                expect(err.message).to.equal('Genre ID is undefined');
            }
        });
    });

    describe('findByName()', ():void => {
        it('should create a genre if it does not exist', async ():Promise<void> => {
            genreRepositoryStub.findOne.onFirstCall().resolves(null);

            await genre.findByName();

            expect(genreRepositoryStub.save.calledOnce).to.be.true;
            expect(genreRepositoryStub.findOne.calledTwice).to.be.true;
            expect(genre.id).to.equal(1);
            expect(genre.name).to.equal('someGenre');
        });

        it('should throw an error if genre name is undefined', async ():Promise<void> => {
            genre.name = undefined;

            try {
                await genre.findByName();
            } catch (err: any) {
                expect(err.message).to.equal('Genre name is undefined');
            }
        });
    });
});
