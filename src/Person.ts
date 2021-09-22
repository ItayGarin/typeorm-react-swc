import { Column, Entity, PrimaryGeneratedColumn } from "typeorm/browser";

@Entity()
class Person {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}

export default Person