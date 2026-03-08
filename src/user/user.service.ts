import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/database/generated/prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { BcryptService } from 'src/shared/security/services/bcrypt.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await this.bcryptService.hash(createUserDto.password);
    try {
      const user = await this.prisma.user.create({
        data: { ...createUserDto, password: hashPassword }
      });
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException({
          message: `Email: ${createUserDto.email} is already used`,
          code: 'EMAIL_ALREADY_EXISTS'
        });
      }
      throw error;
    }
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
