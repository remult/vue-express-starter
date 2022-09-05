<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { remult, type ErrorInfo } from 'remult';
import { Task } from './shared/Task';
import { TasksController } from './shared/TasksController';

const taskRepo = remult.repo(Task);
const tasks = ref<(Task & { error?: ErrorInfo<Task> })[]>([]);
const hideCompleted = ref(false);
async function fetchTasks() {
  tasks.value = await taskRepo.find({
    limit: 20,
    orderBy: { completed: "asc" },
    where: { completed: hideCompleted.value ? false : undefined }
  });
}
async function saveTask(task: (Task & { error?: ErrorInfo<Task> })) {
  try {
    const savedTask = await taskRepo.save(task);
    tasks.value = tasks.value.map(t => t === task ? savedTask : t);
  } catch (error: any) {
    alert(error.message);
    task.error = error;
  }
}
function addTask() {
  tasks.value.push(new Task());
}
async function deleteTask(task: Task) {
  await taskRepo.delete(task);
  tasks.value = tasks.value.filter(t => t !== task);
}
async function setAll(completed: boolean) {
  await TasksController.setAll(completed);
  fetchTasks();
}
onMounted(() => fetchTasks())
</script>
<template>
  <div>
    <input type="checkbox" v-model="hideCompleted" @change="fetchTasks()" /> Hide Completed
    <main>
      <div v-for="task in tasks">
        <input type="checkbox" v-model="task.completed" />
        <input v-model="task.title" />
        <button @click="saveTask(task)">Save</button>
        <button @click="deleteTask(task)">Delete</button>
        <span>{{ task.error?.modelState?.title }}</span>
      </div>
    </main>
    <button @click="addTask()">Add Task</button>
    <div>
     <button @click="setAll(true)">Set all as completed</button>
     <button @click="setAll(false)">Set all as uncompleted</button>
   </div>
  </div>
</template>