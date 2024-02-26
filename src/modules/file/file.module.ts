import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import FileService from './file.service'
import FileEntity from 'src/entities/file.entity'

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileService],
  exports: [FileService],

})
class FileModule {}

export default FileModule

