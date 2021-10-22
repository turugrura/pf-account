import { IAccResponseDto } from './account.dtos';
import { AccountEntity } from './account.entity';

export class AccountMapper {
  static toResponseDto(entity: AccountEntity): IAccResponseDto {
    const {
      id,
      username,
      createdBy,
      createdDate,
      updatedBy,
      updatedDate,
      version,
    } = entity;

    return {
      accountId: id,
      username,
      createdDate: createdDate.toISOString(),
      createdBy,
      updatedDate: updatedDate.toISOString(),
      updatedBy,
      version,
    };
  }
}
