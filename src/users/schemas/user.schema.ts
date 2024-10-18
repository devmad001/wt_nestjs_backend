import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { BaseSchema } from 'src/common/schemas/base-schema';
import { SignalKeysSchema } from 'src/common/schemas/signal-key-schema';

export type UserDocument = User & Document;

export const SYSTEM_USER_ID = '000000000000000000000000';

export enum UserRole {
  TECHOWNER = 'tech_owner',
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
  BOT = 'bot',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserReviewStatus {
  IN_PROGRESS = 'in_progress',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export class StripePaymentInfo {
  @Prop()
  customerId: string;
}

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({ index: true })
  name: string;

  @Prop({ index: true })
  fullName: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Agency',
  })
  agency: Types.ObjectId;

  @Prop({
    ref: 'FieldOffice',
  })
  fieldOffice: Types.ObjectId;

  @Prop({
    ref: 'Squad',
  })
  squad: Types.ObjectId;

  @Prop()
  phone: string;

  @Prop({ unique: true, index: true })
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: 'user',
  })
  role: UserRole;

  @Prop({
    type: String,
  })
  verificationCode: string;

  @Prop({
    type: Boolean,
  })
  isVerified: boolean;

  @Prop({
    default: 'inactive',
  })
  status: string;

  @Prop({
    default: 'in_progress',
  })
  reviewStatus: string;

  @Prop({
    default: null,
  })
  signalKeys: SignalKeysSchema;

  @Prop()
  hashdRt: string;

  @Prop()
  paymentInfo: StripePaymentInfo;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
