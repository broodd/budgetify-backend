import { PartialType } from '@nestjs/swagger';

import { CreateCategoryDto } from './create-category.dto';

/**
 * [description]
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
