import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { EmailModule } from './modules/email/email.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { PropertiesModule } from './modules/properties/properties.module.js';
import { SiteVisitsModule } from './modules/site-visits/site-visits.module.js';
import { PropertyManagementModule } from './modules/property-management/property-management.module.js';
import { HomeLoansModule } from './modules/home-loans/home-loans.module.js';
import { RentalAgreementsModule } from './modules/rental-agreements/rental-agreements.module.js';
import { OwnerBackgroundModule } from './modules/owner-background/owner-background.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EmailModule,
    AuthModule,
    PropertiesModule,
    SiteVisitsModule,
    PropertyManagementModule,
    HomeLoansModule,
    RentalAgreementsModule,
    OwnerBackgroundModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
