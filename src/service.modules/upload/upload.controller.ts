import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { SessionRoles } from 'src/guards/rbac/role.decorator';
import { SessionRole } from 'src/guards/rbac/role.enum';
import { getMulterOptions, getMulterOptionsForOvpnFiles } from './multer.options';

// const rootPath = join(__dirname, `../../`);

const flagImagePath = 'uploads/images/flags/';
// const ovpnProfilePath = 'connections/';
const flagImageSavePath = join(__dirname, `../../${flagImagePath}`);
// const ovpnProfileSavePath = join(__dirname, `../../${ovpnProfilePath}`);

@Controller('upload')
export class UploadController {
  @SessionRoles(SessionRole.ADMIN)
  @Post('upload_flag_image')
  @UseInterceptors(FileInterceptor('file', getMulterOptions({ dest: `${flagImageSavePath}` })))
  async uploadImageInfo(@UploadedFile() file) {
    // console.log(file);
    // return gatewayLogoPath + file.filename;
    return `${flagImagePath + file.filename}`;
  }

  // @SessionRoles(SessionRole.ADMIN)
  // @Post('upload_ovpn_profile')
  // @UseInterceptors(FileInterceptor('file', getMulterOptionsForOvpnFiles({ dest: `${ovpnProfileSavePath}` })))
  // async uploadInfo(@UploadedFile() file) {
  //   // console.log(file);
  //   // return gatewayLogoPath + file.filename;
  //   return `${ovpnProfilePath + file.filename}`;
  // }
}
