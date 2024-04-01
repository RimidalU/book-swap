import { IsNotEmpty, IsNumber } from 'class-validator'

export class AddToFavoritesDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number
}
