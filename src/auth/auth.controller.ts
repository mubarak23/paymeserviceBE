import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async createUser(@Res() res, @Body() createAuthDto: CreateAuthDto) {
    console.log(createAuthDto);
    // return createAuthDto;
    try {
      const { token, user } = await this.authService.createUser(createAuthDto);
      // Send HTTP-only cookie
      res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: 'none',
        secure: true,
      });
      return res.status(HttpStatus.CREATED).json({ token, user });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json(error);
    }
  }

  @Post('/login')
  async loginUser(@Res() res, @Body() loginAuthDto: LoginAuthDto) {
    try {
      const { token, user } = await this.authService.loginUser(loginAuthDto);
      res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: 'none',
        secure: true,
      });
      return res.status(HttpStatus.CREATED).json({ token, user });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json(error);
    }
  }

  @Get('/logout')
  async logOutUser(@Res() res) {
    try {
      res.cookie('token', '', {
        path: '/',
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'none',
        secure: true,
      });
      return res.status(200).json({ message: 'Successfully Logged Out' });
    } catch (error) {
      return res.json(error);
    }
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
