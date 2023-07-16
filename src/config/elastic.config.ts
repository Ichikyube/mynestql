import { ConfigService } from '@nestjs/config';
import {
  ElasticsearchModuleOptions,
  ElasticsearchOptionsFactory,
} from '@nestjs/elasticsearch';

export default class ElasticsearchConfigService
  implements ElasticsearchOptionsFactory
{
  constructor(private readonly configService: ConfigService) {}
  createElasticsearchOptions(): ElasticsearchModuleOptions {
    return {
      node:
        this.configService.get('elasticsearch.node') || 'http://localhost:9200',
      maxRetries: 10,
      requestTimeout: 60000,
      auth: {
        username: this.configService.get('elasticsearch.username'),
        password: this.configService.get('elasticsearch.password'),
      },
    };
  }
}
