import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createAuthDto: CreateAuthDto) {
    const userExist = await this.usersRepository.findOneBy({
      emailAddress: createAuthDto.emailAddress,
    });
    if (userExist) {
      throw new UnprocessableEntityException(
        'User Already Exist, Procced to Login',
      );
    }
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(createAuthDto.password, salt);
    createAuthDto.password = password;
    createAuthDto.role = 'NORMAL';
    const newUser = await this.usersRepository.save(createAuthDto);
    if (newUser) {
      const accessToken = sign({ ...newUser }, process.env.JWT_KEY);

      return { user: newUser, token: accessToken };
    } else {
      throw new NotFoundException('User Signup Fail');
    }
  }
  async loginUser(loginDto: LoginAuthDto) {
    const { emailAddress, password } = loginDto;
    const existUser = await this.usersRepository.findOneBy({ emailAddress });
    console.log(existUser);
    if (existUser && (await bcrypt.compare(password, existUser.password))) {
      const accessToken = sign({ ...existUser }, 'secrete');
      return { user: existUser, token: accessToken };
    } else {
      throw new NotFoundException('User Signin Fail');
    }
  }

  async findAll() {
    const users = await this.usersRepository.find();
    if (users) {
      return users;
    } else {
      throw new NotFoundException('User Signin Fail');
    }
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    } else {
      throw new NotFoundException('User Signin Fail');
    }
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
