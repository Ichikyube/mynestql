export interface IUser {
    readonly _id: Types.ObjectId;
    readonly email: string;
    readonly password?: string;
    readonly roles: RolesEnum[];
  }
  