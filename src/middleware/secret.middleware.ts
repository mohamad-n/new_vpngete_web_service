import { MethodNotAllowedException, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import cryptoTool from "src/utils/crypto.tool";
import * as moment from "moment";

@Injectable()
export class SecretValidationMiddleware implements NestMiddleware {
	async use(req: Request, res: Response, next: NextFunction) {
		try {
			const secret = req.headers["xapikey"] as string;
			// console.log("secret : ", secret);

			const decrypted = await cryptoTool.decrypt(secret, process.env.ENCRYPTION_KEY);

			if (!decrypted || !decrypted.expirationDate) {
				throw new Error();
			}
			if (moment(decrypted.expirationDate).isBefore(moment())) {
				throw new Error();
			}

			next();
		} catch (error) {
			return res.status(401).json({
				status: false,
				message: "unauthorized",
			});
		}
	}
}
