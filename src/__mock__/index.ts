import 'jest';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { RedisService } from 'src/redis/redis.service';

export const getMockRedisService = () => {
  const redisServiceMockObj = {
    validationCodes: [] as { id: string; code: string }[],
    storeValidationCode: (id: string, code: string) => {
      const findIndexResult = redisServiceMockObj.validationCodes.findIndex(
        (value) => value.id == id,
      );
      if (findIndexResult == -1) {
        redisServiceMockObj.validationCodes.push({ id, code });
      } else {
        redisServiceMockObj.validationCodes[findIndexResult].code = code;
      }
    },
    getValidationCode: (id: string) =>
      redisServiceMockObj.validationCodes.find((value) => value.id == id).code,
  };
  return { provide: RedisService, useValue: redisServiceMockObj };
};

export const getMockMailerService = () => {
  const mailerServiceMockObj = {
    sendMail: (addressee: string, subject: string, content: string) => {},
    sendValidationCode: (addressee: string, code: string) => {},
  };
  return { provide: MailerService, useValue: mailerServiceMockObj };
};

export const getCreateUserDto = (
  x: 'John' | 'Johanne' | 'Steve' | 'Bill',
): any => {
  const users = {
    John: {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      hasLibrary: false,
      libraryId: null,
      password: 'password',
      confirmPassword: 'password',
    },
    Johanne: {
      name: 'Johanne Doe',
      email: 'johannedoe@gmail.com',
      hasLibrary: false,
      libraryId: null,
      password: 'password',
      confirmPassword: 'password',
    },
    Steve: {
      name: 'Steve Doe',
      email: 'stevedoe@gmail.com',
      hasLibrary: false,
      libraryId: null,
      password: 'password',
      confirmPassword: 'password',
    },
    Bill: {
      name: 'Bill Doe',
      email: 'billdoe@gmail.com',
      hasLibrary: false,
      libraryId: null,
      password: 'password',
      confirmPassword: 'password',
    },
  };
  return users[x];
};

export const getCreateBookDto = (
  x: 'Book one' | 'Book two' | 'Book three' | 'Book four',
  authorId?: string,
): CreateBookDto => {
  const books: any = {
    'Book one': {
      title: 'Once one',
      description: 'This is the desc of the book one',
      pricePerDay: 50,
      authorId: authorId,
      rating: '1',
      author: null,
    },
    'Book two': {
      title: 'Once two',
      description: 'This is the desc of the book two',
      pricePerDay: 50,
      authorId: authorId,
      rating: '1',
      author: null,
    },
    'Book three': {
      title: 'Once three',
      description: 'This is the desc of the book three',
      pricePerDay: 50,
      authorId: authorId,
      rating: '1',
      author: null,
    },
    'Book four': {
      title: 'Once four',
      description: 'This is the desc of the book four',
      pricePerDay: 50,
      authorId: authorId,
      rating: '1',
      author: null,
    },
  };
  return books[x];
};

export const getCreateAuthorDto = (
  x: 'Bob' | 'Josh' | 'Aiden' | 'Roger',
): any => {
  const authors = {
    Bob: {
      name: 'Bob Doe',
      rating: '3',
    },
    Josh: {
      name: 'Josh Doe',
      rating: '3',
    },
    Aiden: {
      name: 'Aiden Doe',
      rating: '3',
    },
    Roger: {
      name: 'Roger Doe',
      rating: '3',
    },
  };
  return authors[x];
};
