import { AppDataSource } from "../data-source"
import { FailedSent } from "../entity/FailedSent"
import { User } from "../entity/User"

export async function UserSeeder() {
    const users = await AppDataSource.getRepository(User).count()
    if (users === 0) {
        for (let i = 0; i < 1000; i++) {
            await AppDataSource.manager.save(
                AppDataSource.manager.create(User, {
                    firstname: `Firstname ${i}`,
                    lastname: `Lastname ${i}`,
                    email: "timber@example.com",
                    birthdate: new Date().toDateString(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                })
            )

        }
    }
}

export async function FailedSentSeeder() {
    const users = await AppDataSource.getRepository(User).createQueryBuilder('user').whereInIds([1, 2, 3, 4, 5, 6, 7]).getMany()
    console.log(users);

    users.forEach(async (user: User): Promise<void> => {
        await AppDataSource.manager.save(
            AppDataSource.manager.create(FailedSent, {
                user: user
            })
        )
    })
}