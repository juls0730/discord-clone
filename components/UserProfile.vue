<template>
  <div />
</template>

<script>
import { IUser } from '~/types';

export default {
	props: {
		user: {
			type: IUser,
			required: true
		}
	}
};
</script>