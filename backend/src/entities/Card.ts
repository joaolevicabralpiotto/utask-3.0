import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("cards") // Nome da tabela no banco de dados
export class Card {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  content!: string;

  @Column({ default: "todo" }) // Status: todo, doing, done
  status!: string;

  // Relação: Muitos cards para um usuário
  @ManyToOne(() => User, (user) => user.cards)
  user!: User;
}
