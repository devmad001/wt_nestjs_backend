import { Injectable } from '@nestjs/common';
import { groupBy } from 'lodash';
import * as moment from 'moment';
import { User } from 'src/users/schemas/user.schema';
import { GetViewingUsersDto } from './dto/get-viewing-users.dto';
import { DashboardRepository } from './repositories/dashboard.repostory';
import { Page } from './schemas/userview.schema';
import { StatisticService } from './statistic.service';

@Injectable()
export class DashboardManagementService {
  private readonly NAMES = {
    [Page.USER_MANAGEMENT]: 'User Management',
    [Page.CHAT]: 'Chat',
    [Page.SUBPOENAS]: 'Subpoenas',
    [Page.DASHBOARD]: 'Dashboard',
  };
  constructor(
    private readonly dashboardRepository: DashboardRepository,
    private readonly statisticService: StatisticService,
  ) {}

  async getOnlineStatistic(ipAddress: string, user: User): Promise<any> {
    this.statisticService.createStatistic(user, Page.DASHBOARD, ipAddress);
    const allActiveViewings = await this.statisticService.getActiveViewing();
    const totalViewing = allActiveViewings.length;
    const pages = groupBy(allActiveViewings, 'page');
    const items = Object.keys(pages).map((key) => ({
      name: this.NAMES[key],
      value: Math.ceil((pages[key].length / totalViewing) * 100),
    }));
    return {
      activeUsers: totalViewing,
      items,
    };
  }

  async getOnlineUsers(dto: GetViewingUsersDto): Promise<any> {
    const data = await this.statisticService.getOnlineUsers(
      dto.page,
      dto.limit,
    );
    return data.toPaginationObject();
  }

  async getPageViews(): Promise<any> {
    const activeViewings = await this.statisticService.getAllViews(10);
    const intervals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return {
      items: intervals.reverse().map((v) => ({
        time: `-${v} minutes`,
        views: activeViewings.filter((view) => {
          return (
            moment(view.createdAt).isAfter(moment().subtract(v, 'minutes')) &&
            moment(view.createdAt).isBefore(moment().subtract(v - 1, 'minutes'))
          );
        }).length,
      })),
    };
  }

  async getMessageSent(): Promise<any> {
    const totalMesages = await this.dashboardRepository.getTotalMessages();
    const latestMessages = await this.dashboardRepository.getLatestMessages();
    const items = latestMessages.map((v: any) => ({
      from: v.sender.fullName,
      date: v.createdAt,
      to: v.group.name,
    }));
    return {
      total: totalMesages,
      items,
    };
  }

  async getFilesUploaded(): Promise<any> {
    const totalFiles = await this.dashboardRepository.getTotalFiles();
    const latestFiles = await this.dashboardRepository.getLatestFiles();
    const items = latestFiles.map((v: any) => ({
      from: v.user.fullName,
      date: v.createdAt,
      fileName: v.originalName,
    }));
    return {
      total: totalFiles,
      items,
    };
  }
}
