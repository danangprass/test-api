import { CronJob } from "cron";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import axios from "axios";
import { FailedSent } from "../entity/FailedSent";
import { json } from "stream/consumers";

export function cron() {
    new CronJob('0 * * * *', birthdayWish, null, true);  //sending berthday wish
    new CronJob('* * * * *', resentBirthdayWish, null, true); //resent filed sent birthday wish every minute 10 in every hours
}

async function birthdayWish() {
    console.log('sent greeting');

    const users: User[] = await AppDataSource.getRepository(User).createQueryBuilder('user').where('user.birthdate = :birthdate', { birthdate: new Date().toDateString() }).getMany()
    if (users) {
        users?.forEach(async (user: User) => {
            if (isCurrentTime9AM(user.timezone)) {
                sentBirthdayWish(user).then(async (response) => {
                    if (response?.status !== "sent") {
                        await failedSent(user)
                    }
                })
            }
        })
    }

}

async function resentBirthdayWish() {
    console.log('resent greeting');

    const filedAttempts: FailedSent[] = await AppDataSource.getRepository(FailedSent).find({ relations: { user: true } })
    if (filedAttempts) {
        filedAttempts.forEach(async (filedAttempt: FailedSent) => {
            const nextDate = new Date(filedAttempt.user.birthdate);
            const isNextDay = new Date().getDate() == new Date(filedAttempt.user.birthdate).setDate(nextDate.getDate() + 1);
            if (isNextDay) {
                sentBirthdayWish(filedAttempt.user).then(async (response) => {
                    if (response?.status === "sent") {
                        await AppDataSource.getRepository(FailedSent).createQueryBuilder('failed_sent').where("id = :id", { id: filedAttempt.id }).delete().execute()
                    }
                })
            }

        });

    }

}

function isCurrentTime9AM(timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone) {
    const now = new Date();
    const melbourneTimezone = timeZone;
    const melbourneTime = new Date(now.toLocaleString('en-US', { timeZone: melbourneTimezone }));

    return melbourneTime.getHours() === 9 && melbourneTime.getMinutes() === 0;
}

// function oneDayAfter(date: string) {
//     return new Date() == new Date(date);
// }

async function failedSent(users: User) {
    await AppDataSource.getRepository(FailedSent).createQueryBuilder().insert().into(FailedSent).values({ user: users })
        .orUpdate(
            ["userId"],
            ["userId"],
            {
                skipUpdateIfNoValuesChanged: true,
            }
        ).
        execute()
}

async function sentBirthdayWish(user: User) {
    try {
        const response = await axios.post('https://email-service.digitalenvision.com.au/send-email', {
            "email": user.email,
            "message": `Hi ${user.firstname + " " + user.lastname}, nice to meet you.`
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })

        return response.data;
    } catch (error) {
        return {
            status: "failed"
        }
    }

}