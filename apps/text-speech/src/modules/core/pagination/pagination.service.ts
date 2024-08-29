import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class PaginationService {
  // Default values for pagination
  private readonly defaultLimit = 20; // Or use a specific high number
  private readonly defaultPage = 1;
  private readonly defaultCountQueries = false;
  private readonly defaultPaginationType = PaginationTypeEnum.TAKE_AND_SKIP;

  // Overload signatures
  async paginate<Entity>(
    repository: Repository<Entity>,
    alias: string,
    options: IPaginationOptions,
    orderBy?: string,
    orderDirection?: 'ASC' | 'DESC',
  ): Promise<Pagination<Entity>>;

  async paginate<Entity>(
    qb: SelectQueryBuilder<Entity>,
    options: IPaginationOptions,
  ): Promise<Pagination<Entity>>;

  // Single implementation
  async paginate<Entity>(
    repositoryOrQueryBuilder: Repository<Entity> | SelectQueryBuilder<Entity>,
    aliasOrOptions: string | IPaginationOptions,
    options?: IPaginationOptions,
    orderBy = 'createdAt',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
  ): Promise<Pagination<Entity>> {
    if (repositoryOrQueryBuilder instanceof Repository) {
      const alias = aliasOrOptions as string;
      const opts = this.applyDefaultPaginationOptions(
        options as IPaginationOptions,
      );
      const qb: SelectQueryBuilder<Entity> =
        repositoryOrQueryBuilder.createQueryBuilder(alias);
      qb.orderBy(`${alias}.${orderBy}`, orderDirection);
      return paginate<Entity>(qb, opts);
    } else {
      const qb = repositoryOrQueryBuilder as SelectQueryBuilder<Entity>;
      const opts = this.applyDefaultPaginationOptions(
        aliasOrOptions as IPaginationOptions,
      );
      return paginate<Entity>(qb, opts);
    }
  }

  private applyDefaultPaginationOptions(
    options: IPaginationOptions,
  ): IPaginationOptions {
    return {
      limit: options?.limit ?? this.defaultLimit,
      page: options?.page ?? this.defaultPage,
      countQueries: Boolean(options?.countQueries) ?? this.defaultCountQueries,
      paginationType: options?.paginationType ?? this.defaultPaginationType,
    };
  }
}
