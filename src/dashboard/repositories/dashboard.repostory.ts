import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/chat/schemas/message.schema';
import { File, FileDocument } from 'src/cases/schemas/file.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class DashboardRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
  ) {}

  async getTotalMessages() {
    return this.messageModel.countDocuments({});
  }

  async getLatestMessages() {
    return this.messageModel
      .find({})
      .sort({ createdAt: -1 })
      .populate('group')
      .lean();
  }

  async getTotalFiles() {
    return this.fileModel.countDocuments({});
  }

  async getLatestFiles() {
    return this.fileModel
      .find({})
      .sort({ createdAt: -1 })
      .populate('user')
      .lean();
  }
}
