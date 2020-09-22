import { container } from 'tsyringe';
import CreateSessionService from '@modules/users/services/CreateSessionService';
import { Request, Response } from 'express';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSession = container.resolve(CreateSessionService);

    const { user, token } = await createSession.execute({
      email,
      password,
    });

    delete user.password;

    return response.json({ user, token });
  }
}
