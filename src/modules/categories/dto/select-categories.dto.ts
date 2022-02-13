import { FindManyOptionsDto } from 'src/common/dto';

import { CategoryEntity } from '../entities';

/**
 * [description]
 */
export class SelectCategoriesDto extends FindManyOptionsDto<CategoryEntity> {}
