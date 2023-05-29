import { HttpException, HttpStatus, INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { CommonException } from "src/interceptors/exception/error.interceptor";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		await this.$connect();

		this.$use(async (params, next) => {
			try {
				//   // Manipulate params here
				// console.log('before hook :', params);

				const result = await next(params);
				// console.log('after hook :', params);
				return result;
			} catch (e) {
				console.log(e);
				console.log(params);

				if (e instanceof Prisma.PrismaClientKnownRequestError) {
					// console.log(e);

					throw new CommonException({ message: "Server Error" });
				}
			}
		});
	}

	async enableShutdownHooks(app: INestApplication) {
		this.$on("beforeExit", async () => {
			await app.close();
		});
	}
}
