import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentModule } from './payment/payment.module';
import { HealthController } from './health/health.controller';
import { ConsulService } from './consul/consul.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_ADDRESS'),
      }),
    }),
    PaymentModule,
  ],
  controllers: [HealthController],
  providers: [ConsulService],
})
export class AppModule {}
