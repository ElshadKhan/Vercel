import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersController} from "./users/users.controller";
import {UsersService} from "./users/users.service";
import {UsersRepository} from "./users/users.repository";
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {User, UserSchema} from "./users/domain/users.entity";
import {UsersQueryRepository} from "./users/users.queryRepository";
import { PasswordService } from './password/password.service';
import {Blog, BlogSchema} from "./blogs/domain/blog.entity";
import {BlogsService} from "./blogs/blogs.service";
import {BlogsRepository} from "./blogs/blogs.repository";
import {BlogsQueryRepository} from "./blogs/blogs.queryRepository";
import {BlogsController} from "./blogs/blogs.controller";

const schemas = [
    {name: User.name, schema: UserSchema},
    {name: Blog.name, schema: BlogSchema},
]

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URL'),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature(schemas)
    ],
    controllers: [AppController, UsersController, BlogsController],
    providers: [AppService, UsersService, UsersRepository, UsersQueryRepository, BlogsService, BlogsRepository, BlogsQueryRepository,  PasswordService],
})
export class AppModule {
}
