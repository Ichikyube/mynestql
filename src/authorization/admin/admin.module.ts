import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminProductsController } from './admin.products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductsService } from 'src/features/products/products.service';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [AdminController, AdminProductsController],
  providers: [ProductsService, AdminService],
})
export class AdminModule {}
