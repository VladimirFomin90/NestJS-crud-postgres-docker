import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto } from '../src/bookmark/dto';

describe('App e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
            }),
        );
        await app.init();

        await app.listen(4545);

        prisma = app.get(PrismaService);

        await prisma.cleanDb();
        pactum.request.setBaseUrl('http://localhost:4545');
    });

    afterAll(() => {
        app.close();
    });

    describe('Auth', () => {
        const dto: AuthDto = {
            email: 'potter@gmail.com',
            password: 'wrvewr22`r3f',
        };
        describe('Signup', () => {
            it('will be throw if email empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({
                        password: dto.password,
                    })
                    .expectStatus(400);
            });

            it('will be throw if password empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({
                        email: dto.email,
                    })
                    .expectStatus(400);
            });

            it('will be throw if email and password empty', () => {
                return pactum.spec().post('/auth/signup').expectStatus(400);
            });

            it('should signup', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody(dto)
                    .expectStatus(201);
            });
        });

        describe('Signin', () => {
            it('will be throw if password empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({
                        email: dto.email,
                    })
                    .expectStatus(400);
            });

            it('will be throw if email and password empty', () => {
                return pactum.spec().post('/auth/signin').expectStatus(400);
            });

            it('should signin', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody(dto)
                    .expectStatus(200)
                    .stores('userAt', 'access_token');
            });
        });
    });

    describe('User', () => {
        describe('Get me', () => {
            it('get current user', () => {
                return pactum
                    .spec()
                    .get('/user/me')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .expectStatus(200);
            });
        });
    });

    // describe('Edit user', () => {
    //     it('should edit user', () => {
    //         const dto: EditUserDto = {
    //             firstName: 'potter',
    //             email: 'potter@gmail.com',
    //         };

    //         return pactum
    //             .spec()
    //             .patch('/user')
    //             .withHeaders({
    //                 Authorization: 'Bearer $S{userAt}',
    //             })
    //             .withBody(dto)
    //             .expectStatus(200)
    //             .expectBodyContains(dto.firstName)
    //             .expectBodyContains(dto.email);
    //     });
    // });

    describe('Bookmarks', () => {
        // describe('Get empty bookmarks', () => {
        //     it('should get empty bookmarks', () => {
        //         return pactum
        //             .spec()
        //             .get('/bookmark')
        //             .withHeaders({
        //                 Authorization: 'Bearer $S{userAt}',
        //             })
        //             .expectStatus(200)
        //             .inspect()
        //             .expectBody([]);
        //     });
        // });

        describe('Create bookmark', () => {
            const dto: CreateBookmarkDto = {
                title: 'First Bookmark',
                link: 'yandex.kz',
            };
            it('should create bookmark', () => {
                return pactum
                    .spec()
                    .post('/bookmark')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .withBody(dto)
                    .expectStatus(201);
            });
        });

        describe('Get bookmarks', () => {});

        describe('Get bookmarks by id', () => {});

        describe('Edit bookmark', () => {});

        describe('Delete bookmark by id', () => {});
    });

    it.todo('should pass');
});
