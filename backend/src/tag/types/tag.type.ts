import { TagEntity } from '@src/tag/entities'

export type TagType = Omit<TagEntity, 'convertToLowerCase'>
