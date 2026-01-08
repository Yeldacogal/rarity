import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsOptional()
  parentId?: number;
}

export class UpdateAnswerDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
