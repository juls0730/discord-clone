<template>
  <div>
    Hello there traveler
    <nuxt-link to="/login">
      Login
    </nuxt-link>
    <nuxt-link to="/signup">
      Signup
    </nuxt-link>
  </div>
</template>

<script setup>
definePageMeta({  
	middleware: 'auth'
});
</script>