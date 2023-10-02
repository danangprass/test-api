import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Base {

    @PrimaryGeneratedColumn()
    id: number

    @Column({default:new Date(), name:"created_at"})
    createdAt?: Date
    
    @Column({default:new Date(), name:"updated_at"})
    updatedAt?: Date

}
