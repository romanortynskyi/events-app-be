import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import FileEntity from 'src/entities/file.entity'
import { FILE_NOT_FOUND } from 'src/enums/error-messages'

@Injectable()
class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async getFileById(id: number) {
    const file = await this.fileRepository.findOneBy({ id })

    if (!file) {
      throw new NotFoundException(FILE_NOT_FOUND)
    }

    return file
  }
}

export default FileService
