import { IsNotEmpty, IsNumber, IsNumberString, IsString, Length } from "class-validator"

export class CreateBookDto {
      @IsString()
      @IsNotEmpty()
      @Length(1, 30)
      title: string
      @IsString()
      @IsNotEmpty()
      description: string
      @IsNumber()
      @IsNotEmpty()
      pricePerDay: number
      @IsNotEmpty()
      authorId: string
      @IsNumberString()
      @IsNotEmpty()
      rating: '1' | '2' | '3' | '4' | '5';
}
