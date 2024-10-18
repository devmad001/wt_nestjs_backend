// imports
import * as mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    if (process.env.DATABASE_DEBUG) {
      mongoose.set('debug', true);
    }
    return {
      uri: process.env.DATABASE_HOST,
    };
  }
}
