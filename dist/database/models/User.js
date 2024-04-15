"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../../utils");
const Chat_1 = __importDefault(require("./Chat"));
const Message_1 = __importDefault(require("./Message"));
let User = class User extends sequelize_typescript_1.Model {
    comparePassword(guess) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCorrect = yield bcryptjs_1.default.compare(guess, this.password);
            return isCorrect;
        });
    }
};
User.hashPasswordOnCreationOfUserOrPasswordChange = (instance) => __awaiter(void 0, void 0, void 0, function* () {
    if (instance.changed('password')) {
        const randomBytes = yield bcryptjs_1.default.genSalt(10);
        instance.password = yield bcryptjs_1.default.hash(instance.password, randomBytes);
    }
});
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4
    }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            checkIfValidCountry(value) {
                if (!(0, utils_1.isValidCountry)(value)) {
                    throw new Error('Invalid Country');
                }
            }
        }
    }),
    __metadata("design:type", String)
], User.prototype, "country", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        validate: {
            notEmpty: true,
            maxAmountOfHobbies(hobbies) {
                if (Array.isArray(hobbies) && hobbies.length > 5) {
                    throw new Error('The maximum amount of hobbies is 5');
                }
            },
            checkIfValidHobby(hobbies) {
                if (Array.isArray(hobbies)) {
                    hobbies.forEach(hobby => {
                        if (!(0, utils_1.isValidHobby)(hobby)) {
                            throw new Error('Invalid Hobby');
                        }
                    });
                }
                else {
                    if (!(0, utils_1.isValidHobby)(hobbies)) {
                        throw new Error('Invalid Hobby');
                    }
                }
            }
        },
        defaultValue: []
    }),
    __metadata("design:type", Array)
], User.prototype, "hobbies", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        defaultValue: ''
    }),
    __metadata("design:type", String)
], User.prototype, "profilePicture", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Chat_1.default),
    __metadata("design:type", Array)
], User.prototype, "allChats", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Message_1.default),
    __metadata("design:type", Array)
], User.prototype, "allMessages", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeSave,
    __metadata("design:type", Object)
], User, "hashPasswordOnCreationOfUserOrPasswordChange", void 0);
User = __decorate([
    (0, sequelize_typescript_1.Table)({
        modelName: 'User',
        tableName: 'users',
        freezeTableName: true,
        timestamps: true
    })
], User);
exports.default = User;
