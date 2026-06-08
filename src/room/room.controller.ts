import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { RoomService } from './room.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Room } from 'src/database/generated/prisma/client';
import { CreateRoomDto } from './dtos/create-room.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateRoomDto } from './dtos/update-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // ✅ create
  @Roles('Admin')
  @Post()
  createRoom(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomService.create(createRoomDto);
  }

  //GelAll
  @Public()
  @Get()
  findRoom() {
    return this.roomService.findAll();
  }

  //get by id
  @Public()
  @Get(':id')
  findRoomById(@Param('id') id: string) {
    return this.roomService.fineOne(Number(id));
  }

  //update
  @Roles('Admin')
  @Patch(':id')
  updateRoom(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(Number(id), updateRoomDto);
  }

  @Roles('Admin')
  @Delete(':id')
  deleteRoom(@Param('id') id: string) {
    return this.roomService.delete(Number(id));
  }
}
