import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsService {
	getUniqUrlForClient(id: string) {
		return `${process.env.CLIENT_HOST}/user/${id}`;
	}
}
