import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client } from '@opensearch-project/opensearch'

@Injectable()
class OpenSearchService {
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

  async indexExists(index: string): Promise<boolean> {
    const indexExistsResponse = await this.client.indices.exists({ index })

    return indexExistsResponse.statusCode !== 404
  }

  async ensureIndexExists(index: string, body): Promise<void> {
    const indexExists = await this.indexExists(index)

    if (!indexExists) {
      await this.client.indices.create({
        index,
        body,
      })
    }
  }

  async index(index: string, document) {
    const body = {}

    await this.ensureIndexExists(index, body)

    const response = await this.client.index({
      id: document.id,
      index,
      body: document,
      refresh: true,
    })
  
    return response
  }

  async search(index, query) {
    const indexBody = {}

    await this.ensureIndexExists(index, indexBody)

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

export default OpenSearchService
