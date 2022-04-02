import { FindOptionsOrder, SelectQueryBuilder } from 'typeorm';

export const setFindOrder = <T>(
  qb: SelectQueryBuilder<T>,
  order: FindOptionsOrder<T>,
): FindOptionsOrder<T> => {
  Object.entries(order)
    .filter(([key]) => key.startsWith('__'))
    .forEach(([key, value]: [string, 'ASC' | 'DESC']) => qb.addOrderBy(key, value, 'NULLS LAST'));

  return Object.keys(order)
    .filter((key) => !key.startsWith('__'))
    .reduce((acc, key) => ((acc[key] = order[key]), acc), {});
};
