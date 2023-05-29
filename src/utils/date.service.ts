import { Injectable } from "@nestjs/common";
import * as moment from "moment";

@Injectable()
export class DateService {
	//   constructor(
	//     private readonly UserAuthService: UserAuthService,
	//     private readonly jwtService: JwtService,
	//   ) {}
	isAccountExpired(expirationDate: Date) {
		return moment().isAfter(moment(expirationDate));
	}
}
