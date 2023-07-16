import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private config: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri:
        this.config.get<string>('db.mongodb.uri') ||
        'mongodb://localhost:27017/mydb',
    };
  }
}
