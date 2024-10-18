import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Agency } from 'src/agency/schemas/agency.schema';
import { BaseSchema } from 'src/common/schemas/base-schema';
import { User } from 'src/users/schemas/user.schema';
import { Page } from './userview.schema';

export type UserViewingDocument = UserViewing & Document;

// User + Page is unique

@Schema({ timestamps: true })
export class UserViewing extends BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  user: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Agency.name })
  agency: Types.ObjectId;

  @Prop({ enum: Page })
  page: Page;

  @Prop()
  ipAddress: string;

  @Prop({
    default: 0,
  })
  views: number;

  @Prop()
  lastSeenAt: Date;
}

const UserViewingSchema = SchemaFactory.createForClass(UserViewing);

export { UserViewingSchema };
