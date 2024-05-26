import { Table, Column, Model, Unique, AllowNull, BeforeCreate, BeforeUpdate, PrimaryKey, DataType } from 'sequelize-typescript'
import { Optional } from "sequelize";

export type UserAttributes = {
  id: string;
  fullName: string;
  email: string;
  university: string;
  dateOfBirth: Date;
  phoneNumber: string;
  gender: string;
  region : string;
  imgUrl : string ;
};

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;

@Table
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;


  @Column
  university: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dateOfBirth!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  region!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imgUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  gender!: string;
}

export default User;
