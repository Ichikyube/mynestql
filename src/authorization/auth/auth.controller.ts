import { AuthExceptionsFilter } from '@filters/auth-exceptions/auth-exceptions.filter';
import Auth from '@decorators/auth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import AuthBearer from '@decorators/auth-bearer.decorator';
import { DecodedUser } from 'src/authorization/auth/interfaces/decoded-user.interface';
import { UsersService } from 'src/features/users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import AuthService from './auth.service';
import { JwtService } from '@nestjs/jwt';
import SignInDto from './dto/sign-in.dto';

@Controller('auth')
@UseFilters(AuthExceptionsFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @Auth()
  @Post('/signin')
  @UseGuards(LocalAuthGuard)
  async connect(@Body() body: SignInDto, @Req() req, @Res() res) {
    const toValidate: string[] = ['email', 'password'];
    const errors: string[] = UserValidator.validate(body, toValidate);
    const { email, password } = body;
    if (errors.length > 0) {
      req.flash('error', errors);
      return res.redirect('/signin');
    } else {
      const user = await this.usersService.validateUser(email, password);
      if (user) {
        req.session.user = {
          id: user.getId(),
          name: user.getName(),
          role: user.getRole(),
        };
        return res.redirect('/home');
      } else {
        return res.redirect('/signin');
      }
    }
  }

  @Post('/signup')
  async register(
    @Body() body,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const toValidate: string[] = ['username', 'email', 'password'];
    const errors: string[] = UserValidator.validate(body, toValidate);
    const { email, password, username } = body;
    if (errors.length > 0) {
      req.flash('error', errors);
      return res.redirect('/signup');
    } else {
      const newUser = new User();
      newUser.setEmail(email);
      newUser.setPassword(password);
      newUser.setName(username);
      newUser.setRole('client');
      newUser.setBalance(1000);
      const { message } = await this.usersService.createUser(newUser);
      req.flash('registerMessage', message);
      return res.redirect('/');
    }
  }

  // @Get('/logout')
  // @Redirect('/')
  // logout(@Req() req) {
  //   req.session.destroy();
  //   return { msg: 'The user session has ended' };
  // }

  // @ApiBody({ type: SignInDto })
  // @ApiOkResponse({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       data: {
  //         $ref: getSchemaPath(JwtTokensDto),
  //       },
  //     },
  //   },
  //   description: 'Returns jwt tokens',
  // })
  // @ApiBadRequestResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       message: [
  //         {
  //           target: {
  //             email: 'string',
  //             password: 'string',
  //           },
  //           value: 'string',
  //           property: 'string',
  //           children: [],
  //           constraints: {},
  //         },
  //       ],
  //       error: 'Bad Request',
  //     },
  //   },
  //   description: '400. ValidationException',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       message: 'string',
  //       details: {},
  //     },
  //   },
  //   description: '500. InternalServerError',
  // })
  // @ApiBearerAuth()
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(LocalAuthGuard)
  // @Post('sign-in')
  // async signIn(@Request() req: ExpressRequest): Promise<JwtTokensDto> {
  //   const user = req.user as User;

  //   return this.authService.login(user);
  // }

  // @ApiBody({ type: SignUpDto })
  // @ApiOkResponse({
  //   description: '201, Success',
  // })
  // @ApiBadRequestResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       message: [
  //         {
  //           target: {
  //             email: 'string',
  //             password: 'string',
  //           },
  //           value: 'string',
  //           property: 'string',
  //           children: [],
  //           constraints: {},
  //         },
  //       ],
  //       error: 'Bad Request',
  //     },
  //   },
  //   description: '400. ValidationException',
  // })
  // @ApiConflictResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       message: 'string',
  //     },
  //   },
  //   description: '409. ConflictResponse',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       message: 'string',
  //       details: {},
  //     },
  //   },
  //   description: '500. InternalServerError',
  // })
  // @HttpCode(HttpStatus.CREATED)
  // @Post('sign-up')
  // async signUp(@Body() user: SignUpDto): Promise<any> {
  //   const { _id, email } = await this.usersService.create(user) as UserDocument;

  //   const token = this.authService.createVerifyToken(_id);

  //   await this.mailerService.sendMail({
  //     to: email,
  //     from: this.configService.get<string>('MAILER_FROM_EMAIL'),
  //     subject: authConstants.mailer.verifyEmail.subject,
  //     template: `${process.cwd()}/src/templates/verify-password`,
  //     context: {
  //       token,
  //       email,
  //       host: this.configService.get<number>('SERVER_HOST'),
  //     },
  //   });

  //   return { message: 'Success! please verify your email' };
  // }

  // @ApiOkResponse({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       data: {
  //         $ref: getSchemaPath(JwtTokensDto),
  //       },
  //     },
  //   },
  //   description: '200, returns new jwt tokens',
  // })
  // @ApiUnauthorizedResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       message: 'string',
  //     },
  //   },
  //   description: '401. Token has been expired',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       message: 'string',
  //       details: {},
  //     },
  //   },
  //   description: '500. InternalServerError ',
  // })
  // @ApiBearerAuth()
  // @Post('refresh-token')
  // async refreshToken(
  //   @Body() refreshTokenDto: RefreshTokenDto,
  // ): Promise<JwtTokensDto | never> {
  //   const decodedUser = this.jwtService.decode(
  //     refreshTokenDto.refreshToken,
  //   ) as DecodedUser;

  //   if (!decodedUser) {
  //     throw new ForbiddenException('Incorrect token');
  //   }

  //   const oldRefreshToken:
  //     | string
  //     | null = await this.authService.getRefreshTokenByEmail(decodedUser.email);

  //   // if the old refresh token is not equal to request refresh token then this user is unauthorized
  //   if (!oldRefreshToken || oldRefreshToken !== refreshTokenDto.refreshToken) {
  //     throw new UnauthorizedException(
  //       'Authentication credentials were missing or incorrect',
  //     );
  //   }

  //   const payload = {
  //     _id: decodedUser._id,
  //     email: decodedUser.email,
  //     roles: decodedUser.roles,
  //   };

  //   return this.authService.login(payload);
  // }

  // @ApiNoContentResponse({
  //   description: 'No content. 204',
  // })
  // @ApiNotFoundResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       message: 'string',
  //       error: 'Not Found',
  //     },
  //   },
  //   description: 'User was not found',
  // })
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Get('verify/:token')
  // async verifyUser(@Param('token') token: string): Promise<User | null> {
  //   const { id } = await this.authService.verifyEmailVerToken(
  //     token,
  //     this.configService.get<string>('ACCESS_TOKEN') || '283f01ccce922bcc2399e7f8ded981285963cec349daba382eb633c1b3a5f282',
  //   );
  //   const foundUser = await this.usersService.getUnverifiedUserById(id) as UserDocument;

  //   if (!foundUser) {
  //     throw new NotFoundException('The user does not exist');
  //   }

  //   return this.usersService.update(foundUser._id, { verified: true });
  // }

  // @ApiNoContentResponse({
  //   description: 'no content',
  // })
  // @ApiUnauthorizedResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       message: 'string',
  //     },
  //   },
  //   description: 'Token has been expired',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       message: 'string',
  //       details: {},
  //     },
  //   },
  //   description: 'InternalServerError',
  // })
  // @ApiBearerAuth()
  // @Auth()
  // @Delete('logout/:token')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async logout(@Param('token') token: string): Promise<{} | never> {
  //   const decodedUser: DecodedUser | null = await this.authService.verifyToken(
  //     token,
  //     this.configService.get<string>('ACCESS_TOKEN') || '283f01ccce922bcc2399e7f8ded981285963cec349daba382eb633c1b3a5f282',
  //   );

  //   if (!decodedUser) {
  //     throw new ForbiddenException('Incorrect token');
  //   }

  //   const deletedUsersCount = await this.authService.deleteTokenByEmail(
  //     decodedUser.email,
  //   );

  //   if (deletedUsersCount === 0) {
  //     throw new NotFoundException();
  //   }

  //   return {};
  // }

  // @ApiNoContentResponse({
  //   description: 'no content',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       message: 'string',
  //       details: {},
  //     },
  //   },
  //   description: '500. InternalServerError',
  // })
  // @ApiBearerAuth()
  // @Delete('logout-all')
  // @Auth(RolesEnum.ADMIN)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async logoutAll(): Promise<{}> {
  //   return this.authService.deleteAllTokens();
  // }

  // @ApiOkResponse({
  //   type: User,
  //   description: '200, returns a decoded user from access token',
  // })
  // @ApiUnauthorizedResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       message: 'string',
  //     },
  //   },
  //   description: '403, says you Unauthorized',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       message: 'string',
  //       details: {},
  //     },
  //   },
  //   description: '500. InternalServerError',
  // })
  // @ApiBearerAuth()
  // @Auth()
  // @Get('token')
  // async getUserByAccessToken(
  //   @AuthBearer() token: string,
  // ): Promise<DecodedUser | never> {
  //   const decodedUser: DecodedUser | null = await this.authService.verifyToken(
  //     token,
  //     this.configService.get<string>('ACCESS_TOKEN') || '283f01ccce922bcc2399e7f8ded981285963cec349daba382eb633c1b3a5f282',
  //   );

  //   if (!decodedUser) {
  //     throw new ForbiddenException('Incorrect token');
  //   }

  //   const { exp, iat, ...user } = decodedUser;

  //   return user;
  // }
}
