import { Stream } from 'stream'

interface FileUpload {
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => Stream
}

export default FileUpload
