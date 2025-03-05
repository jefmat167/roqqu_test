import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreatePostDto {
    @IsUUID()
    userId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;
}
