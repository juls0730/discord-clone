<script lang="ts" setup>
import { useUserStore } from '~/stores/userStore';

definePageMeta({  
	middleware: 'auth'
});

const user = useUserStore();
</script>

<template>
  <div>
    Hello, {{ user.user?.username }}
    <button @click="user.logout">
      Logout
    </button>
  </div>
</template>