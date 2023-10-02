import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { FailedSent } from "../entity/FailedSent";

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async all(request: Request, response: Response, next: NextFunction) {
        return await this.userRepository.find({cache:60000});
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        const { firstname, lastname, birthdate, email, timezone } = request.body
        const user = await this.userRepository.update(id, {
            firstname,
            lastname,
            birthdate,
            email,
            timezone,
            updatedAt: new Date()
        })

        return user
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { firstname, lastname, birthdate, email, timezone } = request.body

        const user = Object.assign(new User(), {
            firstname,
            lastname,
            birthdate,
            email,
            timezone
        })

        return this.userRepository.save(user)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return "this user not exist"
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }

}