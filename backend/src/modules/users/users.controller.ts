import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { UserRole } from '../../common/enums';
import { User } from '../../entities';
import { IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';

class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Geçerli bir URL giriniz' })
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@CurrentUser() user: User) {
    return this.usersService.getMe(user.id);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  updateMe(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get('profile/:id')
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getProfile(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Patch(':id/ban')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  banUser(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.usersService.banUser(id, user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteUser(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.usersService.deleteUser(id, user.id);
  }
}
