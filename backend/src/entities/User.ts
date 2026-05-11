import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Card } from "./Card"; // Importe a nova entidade de Card

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  // Relação: Um usuário pode ter muitos cards
  @OneToMany(() => Card, (card) => card.user)
  cards!: Card[];
}
