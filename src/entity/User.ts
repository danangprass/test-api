import { Entity, Column } from "typeorm"
import { Base } from "./Base"

@Entity()
export class User extends Base{

    @Column()
    firstname: string
    
    @Column()
    lastname: string

    @Column({type:"date"})
    birthdate: string

    @Column()
    email: string

    @Column({default: Intl.DateTimeFormat().resolvedOptions().timeZone})
    timezone?: string
}
