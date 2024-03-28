import {UserEntity} from "@src/user/entities";

export type UserType = Omit<UserEntity, 'hashPassword'>
