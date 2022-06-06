import {Body, Controller, Get, Param, Post, Request} from '@nestjs/common';
import {UpdateUserBody} from "../../../../../libs/data-access/user/UpdateUserBody";
import {UserService} from "./user.service";
import {UserDocument} from "./user.schema";

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(['', 'get'])
  public async find(@Request() req): Promise<UserDocument> {
    return this.userService.find(req.user._id);
  }

  @Post('/update')
  public async update(@Request() req, @Body() updateBody: UpdateUserBody) {
    return this.userService.updateByBody(req.user._id, updateBody);
  }

  @Get('find/id/:userId')
  public async findUser(@Param('userId') userId: string) {
    return this.userService.find(userId);
  }

  @Get('find/email/:email')
  public async findUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get('gets')
  public async findUsers() {
    return null; //Todo check if get can have a body
  }

}
