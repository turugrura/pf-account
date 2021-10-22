export interface ICreateAccDto {
  username: string;
  password: string;
}

export interface IUpdateAccDto {
  username: string;
  password: string;
}

export interface IAccResponseDto {
  accountId: string;
  username: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  version: number;
}
