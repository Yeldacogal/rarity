import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  tagIds?: number[];
}

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class UpdateQuestionTagsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  tagIds: number[];
}

export class QuestionQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  sortBy?: 'newest' | 'oldest' | 'mostAnswers' | 'noAnswers';

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
