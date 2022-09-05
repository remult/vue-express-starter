import { BackendMethod, remult } from "remult";
import { Task } from "./Task";

export class TasksController {
    @BackendMethod({ allowed: true })
    static async setAll(completed: boolean) {
        const taskRepo = remult.repo(Task);

        for (const task of await taskRepo.find()) {
            await taskRepo.save({ ...task, completed });
        }
    }
}