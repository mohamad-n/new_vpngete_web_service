import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Request, Response } from "express";
import { errorDto } from "./error.dto";

export class CommonException extends HttpException {
	constructor(response?: any, type?: HttpStatus) {
		super(response, type || HttpStatus.BAD_REQUEST);
	}
}

@Catch(HttpException)
export class CustomHttpException implements ExceptionFilter {
	catch(exception: CommonException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		const responseToTransform = status === 429 ? { message: "Too Many Requests" } : exception.getResponse();
		const exceptionResponse = plainToClass(errorDto, responseToTransform, {
			excludeExtraneousValues: true,
		});

		if (process.env.NODE_ENV === "development") {
			console.log(exceptionResponse);
			console.log(request.originalUrl);
		}

		return response.status(status).json({
			status: false,
			...exceptionResponse,

			...(process.env.NODE_ENV === "development" && {
				path: request.url,
				stack: exception.stack,
			}),
		});
	}
}

//------ using template -------
// throw new HttpException(message, statusCode);
// throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
