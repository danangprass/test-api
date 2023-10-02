import { Entity, Column, OneToOne, JoinColumn } from "typeorm"
import { Base } from "./Base"
import { User } from "./User"

@Entity()
export class FailedSent extends Base{

    @OneToOne(() =>User)
    @JoinColumn()
    user:User
   
}
