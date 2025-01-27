import 'jest';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

export const getMockDrizzleProvider = (opt: { fakeInsert?: boolean }) => {
  const drizzleProviderMockObj = {
    users: [
      {
        id: '1',
        name: 'Joseph Doe',
        email: 'josephdoe@gmail.com',
        password: 'password',
        hasLibrary: false,
        libraryId: null,
        accessToken: '',
      },
    ],
    insert: () => ({
      values: (data) => {
        if (!opt.fakeInsert) drizzleProviderMockObj.users.push(data);
        return { returning: () => ({ ...data, id: '1' }) };
      },
    }),
    select: () => ({
      from: () => ({
        where: (x) => {
          if (x.queryChunks[1].name === 'id') {
            const id = x.queryChunks[3].value;
            const foundUser = drizzleProviderMockObj.users.find(
              (user) => user.id === id,
            );
            const { password, email, accessToken, ...notSensibleData } =
              foundUser;
            return notSensibleData;
          } else if (x.queryChunks[1].name === 'email') {
            const email = x.queryChunks[3].value;
            const foundUser = drizzleProviderMockObj.users.find(
              (user) => user.email === email,
            );
            return foundUser || [];
          }
        },
      }),
    }),
    update: () => ({
      set: (data) => ({
        where: (x) => {
          const id = x.queryChunks[3].value;
          let foundUser = drizzleProviderMockObj.users.find(
            (user) => user.id === id,
          );
          return (foundUser = {
            ...foundUser,
            ...data,
          });
        },
      }),
    }),
    delete: () => ({
      where: (x) => {
        const id = x.queryChunks[3].value;
        drizzleProviderMockObj.users = drizzleProviderMockObj.users.filter((user) => user.id != id)
      },
    }),
  };

  return drizzleProviderMockObj;
};

export const getMockRedisService = () => {
  const redisServiceMockObj = {
    validationCodes: [] as { id: string; code: string }[],
    storeValidationCode: (id: string, code: string) => {
      redisServiceMockObj.validationCodes.push({ id, code });
    },
    getValidationCode: (id: string) => {
      return redisServiceMockObj.validationCodes.find((value) => value.id == id)
        .code;
    },
  };

  return redisServiceMockObj;
};

export const getMockMailerService = () => {
  const mailerServiceMockObj = {
    sendMail: (addressee: string, subject: string, content: string) => {},
    sendValidationCode: (addressee: string, code: string) => {},
  };
  return mailerServiceMockObj;
};

export const getCreateUserDto = (): CreateUserDto => ({
  name: 'John Doe',
  email: 'johndoe@gmail.com',
  hasLibrary: false,
  libraryId: null,
  password: 'password',
  confirmPassword: 'password',
});

export const getUpdateUserDto = (): UpdateUserDto => ({
  name: 'Jane Doe',
});
