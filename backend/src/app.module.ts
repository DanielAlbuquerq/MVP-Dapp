import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [PrismaModule, RestaurantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
