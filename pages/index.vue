<template>
  <div v-if="user.isLoggedIn">
    Hello, {{ user.user?.username }}
		<button @click="user.logout">
			Logout
		</button>
	</div>
  <div v-else>
    <nuxt-link to="/login">
      Login
    </nuxt-link>
    or
    <nuxt-link to="/signup">
      Sign Up
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import { useUserStore } from '~/stores/userStore';

definePageMeta({  
	middleware: 'auth'
});

export default {
	setup() {
		return { user: useUserStore() };
	}
};
</script>