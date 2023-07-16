import { Model } from 'mongoose';

import { getModelToken } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AdminModule } from './admin.module';
import { UsersModule } from 'src/features/users/users.module';

@Module({
  imports: [UsersModule, AdminModule],
})
export default class AdminPanelModule {}
