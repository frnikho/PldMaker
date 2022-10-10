import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UpdateUserBody, AddFavourBody, User, Favour, UpdatePreference } from "@pld/shared";
import { UserService } from "./user.service";
import { UserPipe } from "./user.pipe";
import { FavourPipe } from "./favour.pipe";
import { CalendarService } from "../organization/calendar/calendar.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express'
import {Multer} from "multer";

/**
 * @author Nicolas SANS
 * @date 06/09/2022
 */
@Controller('user')
export class UserController {
  constructor(private userService: UserService, private calendarService: CalendarService) {}

  /**
   * Get logged User information
   * @param req NestJS Request
   */
  @Get()
  public async get(@Request() req) {
    return req.user;
  }

  @Delete()
  public async delete(@Request() req) {
    return this.userService.delete(req.user);
  }

  /**
   * Update user information
   * @param req NestJS Request
   * @param updateBody UpdateUserBody
   */
  @Patch('update')
  public async update(@Request() req, @Body() updateBody: UpdateUserBody) {
    return this.userService.updateByBody(req.user, updateBody);
  }

  /**
   * Update user preference
   * @param req NestJS Request
   * @param body UpdatePreference
   */
  @Patch('preference')
  public async updatePreference(@Request() req, @Body() body: UpdatePreference) {
    return this.userService.updatePreference(req.user, body);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  public changePictureProfile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadProfilePicture(req.user, file);
  }

  /**
   * Remove all recent device of logged user
   * @param req NestJS Request
   */
  @Post('devices/clean')
  public async removeAllDevice(@Request() req) {
    return this.userService.cleanDevices(req.user);
  }

  /**
   * Get logged User favours
   * @param req NestJS Request
   */
  @Get('favours')
  public async getFavour(@Request() req) {
    return this.userService.findFavour(req.user);
  }

  /**
   * Get all user events
   * @param req NestJS Request
   */
  @Get('events')
  public async getEvents(@Request() req) {
    return this.calendarService.getAllEvents(req.user);
  }

  /**
   * Add favour for logged user
   * @param req NestJS Request
   * @param body AddFavourBody
   */
  @Post('favours')
  public async addFavour(@Request() req, @Body() body: AddFavourBody) {
    return this.userService.addFavour(req.user, body);
  }

  /**
   * Remove favour for logged user
   * @param req NestJS Request
   * @param favour Favour
   * @param itemToDelete ObjectID to delete from user favour
   */
  @Delete('favours/:favourId')
  public async removeFavour(@Request() req, @Param('favourId', FavourPipe) favour: Favour, @Param('favourId') itemToDelete: string) {
    return this.userService.removeFavour(req.user, favour, itemToDelete);
  }

  /**
   * Find a user by Id
   * //TODO Check user permission to get user info
   * @param req NestJS Request
   * @param user User
   */
  @Get(':userId')
  public async findUser(@Request() req, @Param('userId', UserPipe) user: User) {
    return this.userService.findUser(req.user, user);
  }

  /**
   * Find a user by email
   * //TODO Check user permission to get user info
   * @param email Email string
   */
  @Get('find/email/:email')
  public async findUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

}
