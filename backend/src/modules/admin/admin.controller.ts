import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { UserRole, ReportStatus } from '../../common/enums';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('reports')
  getReports(@Query('status') status?: ReportStatus) {
    return this.adminService.getReports(status);
  }

  @Patch('reports/:id/resolve')
  resolveReport(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.resolveReport(id);
  }

  @Delete('answers/:id')
  deleteAnswer(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteAnswer(id);
  }

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }
}
