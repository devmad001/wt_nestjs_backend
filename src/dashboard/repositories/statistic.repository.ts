import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { pick } from 'lodash';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { DataPagination } from 'src/common/types/base-pagination';
import { Page, UserView, UserViewDocument } from '../schemas/userview.schema';
import { UserViewing } from '../schemas/userviewing.schema';

@Injectable()
export class StatisticRepository {
  private readonly NAMES = {
    [Page.USER_MANAGEMENT]: 'Home / User Management',
    [Page.CHAT]: 'Home / Chat',
    [Page.SUBPOENAS]: 'Home / Subpoenas',
    [Page.DASHBOARD]: 'Home / Dashboard',
  };
  constructor(
    @InjectModel(UserView.name)
    private userViewModel: Model<UserViewDocument>,
    @InjectModel(UserViewing.name)
    private userViewingModel: Model<UserViewing>,
  ) {}

  async createStatistic(dto: any) {
    await this.userViewModel.create({
      user: new Types.ObjectId(dto.user),
      page: dto.page,
      ipAddress: dto.ipAddress,
      agency: dto.agency,
    });
    await this.userViewingModel.updateOne(
      {
        user: new Types.ObjectId(dto.user),
      },
      {
        page: dto.page,
        lastSeenAt: new Date(),
        ipAddress: dto.ipAddress,
        agency: dto.agency,
        $inc: { views: 1 },
      },
      { upsert: true },
    );
  }

  async getActiveViewing() {
    return this.userViewingModel
      .find({
        lastSeenAt: {
          $gt: moment().subtract(10, 'minutes').toDate(),
        },
      })
      .sort({ lastSeenAt: -1 })
      .lean();
  }

  async getOnlineUsers(
    page = 1,
    limit = 10,
  ): Promise<DataPagination<UserViewing>> {
    const skip = (page - 1) * limit;

    const [items, count] = await Promise.all([
      this.userViewingModel
        .find({
          lastSeenAt: {
            $gt: moment().subtract(10, 'minutes').toDate(),
          },
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate(['user', 'agency'])
        .lean(),
      this.userViewingModel.count({
        lastSeenAt: {
          $gt: moment().subtract(10, 'minutes').toDate(),
        },
      }),
    ]);
    items.forEach((v: any) => {
      v.user = pick(v.user, ['_id', 'fullName']);
      v.agency = v.agency ? v.agency.name : 'Watchtower Group LLC';
      v.page = this.NAMES[v.page];
    });
    return new DataPagination(items, count, page, limit);
  }

  async getAllViews(minutes: number) {
    return this.userViewModel
      .find({
        createdAt: {
          $gt: moment().subtract(minutes, 'minutes').toDate(),
        },
      })
      .sort({ createdAt: -1 })
      .lean();
  }
}
