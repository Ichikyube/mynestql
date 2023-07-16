import _ from 'lodash';
import * as bcrypt from 'bcrypt';
import { ActionRequest, flat } from 'adminjs';
import { validate } from 'class-validator';

import AdminValidationException from '@exceptions/admim-validation.exception';
import { RolesEnum } from '@decorators/roles.decorator';
import CreateUserDto from '../dto/create-user.dto';
import { ICreateUser } from '../interfaces/user.interface';

const beforeCreateUser = async (request: ActionRequest) => {
  const payload = new CreateUserDto(
    flat.unflatten(request.payload) as ICreateUser,
  );

  if (!payload.verified) {
    Reflect.set(payload, 'verified', false);
  }

  const errors = await validate(payload);

  if (!_.isEmpty(errors)) {
    throw new AdminValidationException(errors);
  }

  Reflect.set(request, 'payload', flat.flatten(payload));

  return request;
};
export default (usersRepository: Repository<User>) => ({
  resource: usersRepository,
  options: {
    properties: {
      password: {
        isVisible: false,
      },
      setPassword: {
        isVisible: {
          list: false,
          edit: true,
          filter: false,
          show: false,
        },
      },
      verified: {
        isRequired: false,
      },
      roles: {
        availableValues: Object.values(RolesEnum).map((role) => ({
          label: role,
          value: role,
        })),
      },
    },
    actions: {
      new: {
        before: beforeCreateUser,
      },
      edit: {
        before: beforeCreateUser,
      },
    },
  },
  features: [
    passwordsFeature({
      properties: {
        password: 'setPassword',
        encryptedPassword: 'password',
      },
      hash: (password) => bcrypt.hash(password, 10),
    }),
  ],
});
