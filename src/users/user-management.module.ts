import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './schemas/user.schema';
import { UserRepository } from './repository/user.repository';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';
import { AgencyRepository } from 'src/agency/repositories/agency.repostory';
import { Agency, AgencySchema } from 'src/agency/schemas/agency.schema';
import {
  FieldOffice,
  FieldOfficeSchema,
} from 'src/agency/schemas/field-office.schema';
import { Squad, SquadSchema } from 'src/agency/schemas/squad.schema';
import { FieldOfficeRepository } from 'src/agency/repositories/field-office.repostory';
import { SquadRepository } from 'src/agency/repositories/squad.repostory';

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
  ],
  exports: [UserRepository, UserManagementService],
  providers: [
    UserManagementService,
    UserRepository,
    AgencyRepository,
    FieldOfficeRepository,
    SquadRepository,
  ],
  controllers: [UserManagementController],
})
export class UserManagementModule {}
