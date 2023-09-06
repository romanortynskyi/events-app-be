import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as AWS from 'aws-sdk'
import * as path from 'path'
import { INTERNAL_SERVER_ERROR } from 'src/enums/error-messages'
import { v4 as uuid } from 'uuid'

@Injectable()
export class UploadService {
  bucket: string
  s3: AWS.S3

  constructor(private config: ConfigService) {
    this.bucket = config.get('AWS_BUCKET')
    this.s3 = new AWS.S3({
      accessKeyId: config.get('AWS_ACCESS_KEY'),
      secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
    })
  }

  _upload(
    params,
    progressCallback: (progress: AWS.S3.ManagedUpload.Progress) => void,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.s3
        .upload(params)
        .on('httpUploadProgress', progressCallback)
        .send((err, data) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        })
    })
  }

  async uploadFile(
    file,
    progressCallback: (progress: AWS.S3.ManagedUpload.Progress) => void,
  ) {
    const { originalname, buffer } = file
    const extension = path.extname(originalname)

    const key = `${uuid()}${extension}`
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    }

    try {
      const s3Response = await this._upload(params, progressCallback)

      return s3Response
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR)
    }
  }

  async deleteFile(key: string) {
    const options = {
      Bucket: this.config.get('AWS_BUCKET'),
      Key: key,
    }

    this.s3.deleteObject(options, (err, result) => {
      if (err) {
        throw new InternalServerErrorException(INTERNAL_SERVER_ERROR)
      }

      return result
    })
  }
}
