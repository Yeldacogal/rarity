import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadsService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      throw new BadRequestException('Only image files are allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'qa-platform',
          resource_type: 'image',
          transformation: [
            { width: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new BadRequestException('Failed to upload image: ' + error.message));
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            reject(new BadRequestException('Upload failed'));
          }
        },
      ).end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }
  }
}
