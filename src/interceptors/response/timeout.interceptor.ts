import { Injectable, NestInterceptor, ExecutionContext, CallHandler, applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
	constructor(private readonly reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const response = context.switchToHttp().getResponse();
		const timeout = this.reflector.get<number>("request-timeout", context.getHandler()) || 60000;
		response.setTimeout(timeout);

		return next.handle();
	}
}

const SetTimeout = (timeout: number) => SetMetadata("request-timeout", timeout);

export function SetRequestTimeout(timeout: number = 600000) {
	return applyDecorators(SetTimeout(timeout), UseInterceptors(TimeoutInterceptor));
}
