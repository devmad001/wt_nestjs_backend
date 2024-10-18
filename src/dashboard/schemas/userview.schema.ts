import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Agency } from 'src/agency/schemas/agency.schema';
import { BaseSchema } from 'src/common/schemas/base-schema';
import { User } from 'src/users/schemas/user.schema';

export type UserViewDocument = UserView & Document;

export enum Page {
  LOGGED_IN = 'logged_in',
  USER_MANAGEMENT = 'user_management',
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  SUBPOENAS = 'subpoenas',
}

@Schema({ timestamps: true })
export class UserView extends BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  user: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Agency.name })
  agency: Types.ObjectId;

  @Prop({ enum: Page })
  page: Page;

  @Prop()
  ipAddress: string;
}

const UserViewSchema = SchemaFactory.createForClass(UserView);

export { UserViewSchema };
