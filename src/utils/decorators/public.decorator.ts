import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE_TOKEN = Symbol();

export const Public = () => SetMetadata(PUBLIC_ROUTE_TOKEN, true);
