import { Module, Global } from "@nestjs/common";
import { AxiosService } from "./axios.service";
@Global()
@Module({
	providers: [AxiosService],
	exports: [AxiosService],
})
export class AxiosModule {}
