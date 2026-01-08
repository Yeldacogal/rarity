import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto, CreateSubcategoryDto, UpdateSubcategoryDto } from './dto';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { UserRole } from '../../common/enums';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get('subcategories')
  findAllSubcategories(@Query('category') category?: string) {
    if (category) {
      return this.tagsService.findSubcategoriesByCategory(category);
    }
    return this.tagsService.findAllSubcategories();
  }

  @Get('subcategories/:id')
  findOneSubcategory(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.findOneSubcategory(id);
  }

  @Post('subcategories')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  createSubcategory(@Body() dto: CreateSubcategoryDto) {
    return this.tagsService.createSubcategory(dto);
  }

  @Patch('subcategories/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  updateSubcategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubcategoryDto,
  ) {
    return this.tagsService.updateSubcategory(id, dto);
  }

  @Delete('subcategories/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  removeSubcategory(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.removeSubcategory(id);
  }

  @Get()
  findAll(@Query('subcategoryId') subcategoryId?: string) {
    if (subcategoryId) {
      return this.tagsService.findBySubcategory(parseInt(subcategoryId, 10));
    }
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.remove(id);
  }
}
