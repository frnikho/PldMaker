import {Body, Controller, Get, Param, Patch, Post, Request} from '@nestjs/common';
import {UpdateUserBody, AddFavourBody, RemoveFavourBody, AddDeviceBody} from "@pld/shared";
import {UserService} from "./user.service";
import {UserDocument} from "./user.schema";

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(['', 'get'])
  public async find(@Request() req): Promise<UserDocument> {
    return this.userService.find(req.user._id);
  }

  @Patch('update')
  public async update(@Request() req, @Body() updateBody: UpdateUserBody) {
    return this.userService.updateByBody(req.user._id, updateBody);
  }

  @Post('devices/add')
  public async addDevices(@Request() req, @Body() body: AddDeviceBody) {
    console.log('IP', req.clientIp);
  }


  @Get('favours')
  public async getFavour(@Request() req) {
    return this.userService.findFavour(req.user._id);
  }

  @Post('favours/add')
  public async addFavour(@Request() req, @Body() body: AddFavourBody) {
    return this.userService.addFavour(req.user._id, body);
  }

  @Post('favours/remove')
  public async removeFavour(@Request() req, @Body() body: RemoveFavourBody) {
    return this.userService.removeFavour(req.user._id, body.favourId);
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
