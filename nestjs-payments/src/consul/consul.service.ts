import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import Consul from 'consul';
import * as crypto from 'crypto';

@Injectable()
export class ConsulService implements OnModuleInit, OnModuleDestroy {
  private consul: Consul;
  private serviceId: string;
  private readonly logger = new Logger(ConsulService.name);

  constructor() {
    this.consul = new Consul({
      host: process.env.CONSUL_HOST || 'localhost',
      port: Number(process.env.CONSUL_PORT) || 8500,
    });
  }

  async onModuleInit() {
    const serviceName = 'payments-service';
    this.serviceId = `${serviceName}-${crypto.randomUUID()}`;

    const discoveryHost = process.env.DISCOVERY_HOST || 'localhost';
    const port = Number(process.env.PORT) || 7777;

    const registrationOptions = {
      id: this.serviceId,
      name: serviceName,
      address: discoveryHost,
      port: port,
      check: {
        name: `${serviceName}-health`,
        http: `http://${discoveryHost}:${port}/health`,
        interval: '10s',
        timeout: '5s',
        deregistercriticalserviceafter: '1m',
      },
    };

    try {
      await this.consul.agent.service.register(registrationOptions);
      this.logger.log(
        `Registered in Consul as: ${this.serviceId} at ${discoveryHost}:${port}`,
      );
    } catch (err) {
      this.logger.error(`Failed to register in Consul`, err);
    }
  }

  async onModuleDestroy() {
    if (this.serviceId) {
      try {
        await this.consul.agent.service.deregister(this.serviceId);
        this.logger.log(`Deregistered from Consul: ${this.serviceId}`);
      } catch (err) {
        this.logger.error(`Failed to deregister`, err);
      }
    }
  }
}
