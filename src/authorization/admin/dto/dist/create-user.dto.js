"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var roles_decorator_1 = require("@decorators/roles.decorator");
var sign_in_dto_1 = require("src/authorization/auth/dto/sign-in.dto");
var CreateUserDto = /** @class */ (function (_super) {
    __extends(CreateUserDto, _super);
    function CreateUserDto(_a) {
        var email = _a.email, password = _a.password, roles = _a.roles, verified = _a.verified;
        var _this = _super.call(this, { email: email, password: password }) || this;
        _this.verified = false;
        _this.roles = roles;
        _this.verified = verified;
        return _this;
    }
    __decorate([
        swagger_1.ApiProperty({ type: [roles_decorator_1.RolesEnum], "default": [roles_decorator_1.RolesEnum.USER] }),
        class_validator_1.ArrayUnique(),
        class_validator_1.ArrayNotEmpty(),
        class_validator_1.IsArray(),
        class_validator_1.IsEnum(roles_decorator_1.RolesEnum, { each: true })
    ], CreateUserDto.prototype, "roles");
    __decorate([
        swagger_1.ApiProperty({ type: Boolean, "default": false }),
        class_validator_1.IsOptional(),
        class_validator_1.IsBoolean()
    ], CreateUserDto.prototype, "verified");
    return CreateUserDto;
}(sign_in_dto_1["default"]));
exports["default"] = CreateUserDto;
