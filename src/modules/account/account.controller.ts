import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { CurrentAccount } from '../../utils/decorators';
import { ICurrentAccDto } from '../auth';

import { ICreateAccDto } from './account.dtos';
import { AccountMapper } from './account.mapper';
import { AccountService } from './account.service';

import { IUpdateAccDto } from '.';

@Controller()
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  async getAll() {
    const accs = await this.accountService.findAll();

    return accs.map((a) => AccountMapper.toResponseDto(a));
  }

  @Get('me')
  async getMyAccount(@CurrentAccount() curAcc: ICurrentAccDto) {
    const acc = await this.accountService.findById(curAcc.accountId);

    return AccountMapper.toResponseDto(acc);
  }

  @Get(':id')
  async getOne(@Param('id') accountId: string) {
    const acc = await this.accountService.findById(accountId);

    return AccountMapper.toResponseDto(acc);
  }

  @Post()
  async create(@Body() createAccDto: ICreateAccDto) {
    const acc = await this.accountService.create(createAccDto);

    return AccountMapper.toResponseDto(acc);
  }

  @Post(':id')
  async update(
    @Param('id') accountId: string,
    @Body() updateAccDto: IUpdateAccDto,
  ) {
    const acc = await this.accountService.update(accountId, updateAccDto);

    return AccountMapper.toResponseDto(acc);
  }

  @Delete(':id')
  async delete(@Param('id') accountId: string) {
    return this.accountService.delete(accountId);
  }
}
