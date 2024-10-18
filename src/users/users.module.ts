import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema, User } from './schemas/user.schema';
import { UserRepository } from './repository/user.repository';
import { AgencyRepository } from 'src/agency/repositories/agency.repostory';
import { Agency, AgencySchema } from 'src/agency/schemas/agency.schema';
import { FieldOfficeRepository } from 'src/agency/repositories/field-office.repostory';
import { SquadRepository } from 'src/agency/repositories/squad.repostory';
import {
  FieldOffice,
  FieldOfficeSchema,
} from 'src/agency/schemas/field-office.schema';
import { Squad, SquadSchema } from 'src/agency/schemas/squad.schema';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Agency.name,
        schema: AgencySchema,
      },
      {
        name: FieldOffice.name,
        schema: FieldOfficeSchema,
      },
      {
        name: Squad.name,
        schema: SquadSchema,
      },
    ]),
    StripeModule,
  ],
  exports: [
    UserRepository,
    AgencyRepository,
    FieldOfficeRepository,
    SquadRepository,
    UsersService,
  ],
  providers: [
    UsersService,
    UserRepository,
    AgencyRepository,
    FieldOfficeRepository,
    SquadRepository,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
