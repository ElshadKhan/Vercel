import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDbType = HydratedDocument<User>;

@Schema()
export class User {

    @Prop({ require: true })
    id: string;

    @Prop({ require: true })
    login: string;

    @Prop({ require: true })
    email: string;

    @Prop({ require: true })
    createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);