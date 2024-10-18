import { Injectable } from '@nestjs/common';
import { DataPagination } from 'src/common/types/base-pagination';
import { User } from 'src/users/schemas/user.schema';
import { StatisticRepository } from './repositories/statistic.repository';
import { Page } from './schemas/userview.schema';
import { UserViewing } from './schemas/userviewing.schema';

@Injectable()
export class StatisticService {
  constructor(private readonly statisticRepository: StatisticRepository) {}

  async createStatistic(user: User, page: Page, ipAddress: string) {
    this.statisticRepository.createStatistic({
      user: user._id,
      page,
      ipAddress,
      agency: user.agency,
    });
  }

  async getActiveViewing() {
    return this.statisticRepository.getActiveViewing();
  }

  async getOnlineUsers(
    page = 1,
    limit = 10,
  ): Promise<DataPagination<UserViewing>> {
    return this.statisticRepository.getOnlineUsers(page, limit);
  }

  async getAllViews(minutes: number) {
    return this.statisticRepository.getAllViews(minutes);
  }
}
