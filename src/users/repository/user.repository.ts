import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { DataPagination } from 'src/common/types/base-pagination';
import { User, UserDocument, UserRole } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  private readonly defaultProjection: mongoose.ProjectionFields<UserDocument> =
    {
      hashdRt: 0,
      password: 0,
      verificationCode: 0,
    };
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: any): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByIds(ids: string[]) {
    return this.userModel
      .find({ _id: { $in: ids } }, { _id: 1, email: 1, fullName: 1 })
      .lean();
  }

  async findAllByAgency(agency: string) {
    return this.userModel
      .find({
        agency: new Types.ObjectId(agency),
      })
      .lean();
  }

  async findAllByOffice(office: string) {
    return this.userModel
      .find({
        fieldOffice: new Types.ObjectId(office),
      })
      .lean();
  }

  async findAll(
    role: string,
    agency: string,
    query: { key?: string },
    page = 1,
    limit = 10,
    shouldHidePass?: boolean,
    excludeIds?: string[],
  ): Promise<DataPagination<User>> {
    const skip = (page - 1) * limit;
    const filters: mongoose.FilterQuery<UserDocument> = {};
    if (role) {
      filters.role = role;
    }
    if (agency) {
      filters.agency = new Types.ObjectId(agency);
    }
    if (query.key) {
      filters.$or = [
        { fullName: new RegExp(query.key, 'i') },
        { email: new RegExp(query.key, 'i') },
      ];
    }

    if (excludeIds && excludeIds.length) {
      filters._id = {
        $nin: excludeIds,
      };
    }

    const [items, count] = await Promise.all([
      this.userModel
        .find(filters, shouldHidePass ? this.defaultProjection : {})
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate(['agency', 'fieldOffice', 'squad']),
      this.userModel.count(filters),
    ]);
    return new DataPagination(items, count, page, limit);
  }

  async findAgencyManager(agency: string): Promise<User> {
    return this.userModel
      .findOne({
        agency: new Types.ObjectId(agency),
        role: UserRole.SUPER_ADMIN,
      })
      .lean();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).lean();
  }

  async findByIdForAuth(id: string): Promise<User> {
    return this.userModel.findOne({ _id: new Types.ObjectId(id) }).lean();
  }

  async updateOne(userId: string, data: any) {
    return this.userModel.updateOne({ _id: userId }, { $set: data }).lean();
  }

  async findOneById(userId: string, lean?: boolean, populated?: boolean) {
    if (lean) {
      if (populated) {
        return this.userModel
          .findById(userId, this.defaultProjection)
          .populate(['agency', 'fieldOffice', 'squad'])
          .lean();
      }
      return this.userModel.findById(userId, this.defaultProjection).lean();
    }
    return this.userModel.findById(userId).exec();
  }

  async delete(id: string) {
    return this.userModel.deleteMany({ _id: id });
  }

  async findPublicKeys(userIds: string[]) {
    return this.userModel
      .find(
        {
          _id: { $in: userIds.map((v) => new Types.ObjectId(v)) },
        },
        {
          _id: 1,
          fullName: 1,
          email: 1,
          'signalKeys.registrationId': 1,
          'signalKeys.identityKey.publicKey': 1,
          'signalKeys.preKey.publicKey': 1,
          'signalKeys.preKey.keyId': 1,
          'signalKeys.signedPreKey.publicKey': 1,
          'signalKeys.signedPreKey.keyId': 1,
          'signalKeys.signedPreKey.signature': 1,
        },
      )
      .lean();
  }

  async getSameDepartmentUserIds(user: User) {
    const userIds: any[] = [];
    switch (user.role) {
      case UserRole.USER: {
        userIds.push(user._id);
        break;
      }
      case UserRole.ADMIN: {
        const usersSameOffice = await this.findAllByOffice(
          user.fieldOffice.toString(),
        );
        userIds.push(user._id, ...usersSameOffice.map((v) => v._id));
        break;
      }
      case UserRole.SUPER_ADMIN: {
        const usersSameAgency = await this.findAllByAgency(
          user.agency.toString(),
        );
        userIds.push(user._id, ...usersSameAgency.map((v) => v._id));
        break;
      }
      case UserRole.TECHOWNER: {
        break;
      }
    }
    return userIds;
  }
}
