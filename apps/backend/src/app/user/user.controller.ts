import {Body, Controller, Get, Param, Post, Request} from '@nestjs/common';
import {UpdateUserBody} from "../../../../../libs/data-access/user/UpdateUserBody";
import {UserService} from "./user.service";

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(['', 'get'])
  public async find(@Request() req) {
    return this.userService.find(req.user._id);
  }

  @Post('/update')
  public async update(@Request() req, @Body() updateBody: UpdateUserBody) {
    return this.userService.updateByBody(req.user._id, updateBody);
  }

  @Get('get/:userId')
  public async findUser(@Param('userId') userId: string) {
    return this.userService.find(userId);
  }

  @Get('gets')
  public async findUsers() {
    return null; //Todo check if get can have a body
  }

}
