/* eslint-disable @typescript-eslint/ban-types */
import { IsDefined, IsOptional, IsString } from "class-validator";
import { Expose, Type, Transform } from "class-transformer";

export class errorDto {
	@IsDefined()
	@Expose()
	@Transform(({ value }) => {
		return value || "Unknown Error";
	})
	message: string;
	@IsDefined()
	@Expose()
	@Transform(({ value }) => {
		return value || 0;
	})
	errorCode: number;
}
