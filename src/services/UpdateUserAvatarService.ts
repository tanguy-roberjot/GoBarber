import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const repository = getRepository(User);

    const user = await repository.findOne(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated user can change their avatar',
        401,
      );
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await repository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
