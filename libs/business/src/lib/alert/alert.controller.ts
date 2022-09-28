import { Request, Controller, Delete, Get, Patch, Post } from "@nestjs/common";

@Controller({path: 'alert'})
export class AlertController {

  @Get()
  public get(@Request() req) {
    
  }

  @Post()
  public create(@Request() req) {

  }

  @Delete()
  public delete(@Request() req) {

  }

  @Patch()
  public update(@Request() req) {

  }


}
