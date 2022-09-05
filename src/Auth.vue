<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { UserInfo } from 'remult';
import App from './App.vue';

const signInUsername = ref("");
const currentUser = ref<UserInfo>();

const signIn = async () => {
    const result = await fetch('/api/signIn', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: signInUsername.value })
    });
    if (result.ok) {
        currentUser.value = await result.json();
        signInUsername.value = "";
    }
    else alert(await result.json());
}
const signOut = async () => {
    await fetch('/api/signOut', {
        method: "POST"
    });
    currentUser.value = undefined;
}

onMounted(async () => {
    currentUser.value = await fetch('/api/currentUser').then(r => r.json());
})
</script>
<template>
    <header v-if="!currentUser">
        <input v-model="signInUsername" placeholder="Username, try Steve or Jane" />
        <button @click="signIn()">Sign in</button>
    </header>
    <div v-else>
        <header>
            Hello {{ currentUser!.name }} <button @click="signOut()">Sign Out</button>
        </header>
        <App />
    </div>
</template>
