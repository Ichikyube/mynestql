"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var SignInDto = /** @class */ (function () {
    function SignInDto(body) {
        if (body === void 0) { body = null; }
        this.email = '';
        this.password = '';
        if (body) {
            this.email = body.email;
            this.password = body.password;
        }
    }
    __decorate([
        swagger_1.ApiProperty({ type: String, example: 'alice@cool.org' }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString(),
        class_validator_1.IsEmail(),
        class_validator_1.MinLength(3),
        class_validator_1.MaxLength(128)
    ], SignInDto.prototype, "email");
    __decorate([
        swagger_1.ApiProperty({ type: String, example: 'alice' }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString(),
        class_validator_1.MinLength(8),
        class_validator_1.MaxLength(64)
    ], SignInDto.prototype, "password");
    return SignInDto;
}());
exports["default"] = SignInDto;
