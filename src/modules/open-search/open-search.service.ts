import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client } from '@opensearch-project/opensearch'

@Injectable()
export class OpenSearchService {
  client: Client

  constructor(private config: ConfigService) {
    this.client = new Client({
      node: this.config.get('OPENSEARCH_ENDPOINT'),
      ssl: {
        rejectUnauthorized: false,
      },
      auth: {
        username: this.config.get('OPENSEARCH_USERNAME'),
        password: this.config.get('OPENSEARCH_PASSWORD'),
      },
    })

    
  }

  async index(index, document) {
    const settings = {
      settings: {
        index: {
          number_of_shards: 4,
          number_of_replicas: 3,
        },
      },
    }

    const indexExistsResponse = await this.client.indices.exists({ index })

    if (indexExistsResponse.statusCode === 404) {
      await this.client.indices.create({
        index,
        body: settings,
      })
    }

    const response = await this.client.index({
      id: document.id,
      index,
      body: document,
      refresh: true,
    })
  
    return response
  }

  async search(index, query) {
    const response = await this.client.search({
      index,
      body: query,
    })
  
    return response.body.hits
  }

  async delete(index, id) {
    await this.client.delete({
      index,
      id,
    })
  }
}
