import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
	message: string;
	result: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
		// const handler = context.getHandler().name;
		// if (handler === "downloadWgProfile" || handler === "downloadIkev2Profile" || handler === "downloadOpenVpnProfile") {
		// 	return next.handle();
		// }

		return next.handle().pipe(
			map((data) => ({
				status: true,
				message: data?.message || "success",
				result: data?.result || data,
			})),
		);
	}
}
