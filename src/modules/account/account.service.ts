import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';

import { AppError } from '../../utils/app-error';
import { ConfigModel } from '../../utils/config';

import { ICreateAccDto, IUpdateAccDto } from './account.dtos';
import { AccountEntity } from './account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepo: Repository<AccountEntity>,
    private configService: ConfigService<ConfigModel>,
  ) {}

  async findAll() {
    return this.accountRepo.find();
  }

  async findById(accountId: string) {
    const acc = await this.accountRepo.findOne(accountId);
    if (!acc) {
      throw AppError.notFound();
    }

    return acc;
  }

  async create(createAccDto: ICreateAccDto) {
    const { username, password } = createAccDto;

    const isExistsAcc = (await this.findByUsername(username)) != null;
    if (isExistsAcc) {
      throw AppError.badRequest(`username ${username} is already exists`);
    }

    const acc = new AccountEntity();
    acc.username = username;
    acc.password = password;

    const errMessage = await this.validateAccount(acc);
    if (errMessage) {
      throw AppError.badRequest(errMessage);
    }

    acc.password = await bcrypt.hash(
      acc.password,
      this.configService.get('passwordSaltRound'),
    );

    const newAcc = await this.accountRepo.save(acc);

    return newAcc;
  }

  async update(accountId: string, updateAccDto: IUpdateAccDto) {
    const { username, password } = updateAccDto;
    const acc = await this.accountRepo.findOne(accountId);
    if (!acc) {
      throw AppError.notFound();
    }

    acc.username = username;
    acc.password = password;
    const errMessage = await this.validateAccount(acc);
    if (errMessage) {
      throw AppError.badRequest(errMessage);
    }

    await this.accountRepo.save(acc);

    return acc;
  }

  async delete(accountId: string) {
    const acc = await this.accountRepo.findOne(accountId);
    if (!acc) {
      return;
    }

    acc.deletedBy = 'someone';
    this.accountRepo.softRemove(acc);
  }

  async validateAccount(acc: AccountEntity) {
    const errors = await validate(acc);
    if (errors.length > 0) {
      const message = errors.reduce((preMsg, err) => {
        const constraints = err.constraints;
        const errMsg = Object.values(constraints).join('\n');
        if (preMsg === '') {
          return errMsg;
        }

        return `${preMsg}\n${errMsg}`;
      }, '');

      return message;
    }
  }

  async findByUsername(username: string) {
    return this.accountRepo.findOne({ where: { username } });
  }
}
