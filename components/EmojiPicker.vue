<script lang="ts">
import emojiJson from '~/assets/json/emoji.json'

export default {
	props: ['opened'],
	data() {
		return {
			emojis: emojiJson.filter((e) => e.has_img_twitter),
			categories: [
				{ name: "people", emojis: emojiJson.filter((e) => e.has_img_twitter).filter((e) => e.category.toLowerCase().includes('smileys')).concat(emojiJson.filter((e) => e.has_img_twitter).filter((e) => e.category.toLowerCase().includes('people'))) },
				{ name: "nature", emojis: emojiJson.filter((e) => e.has_img_twitter).filter((e) => e.category.toLowerCase().includes('nature')) },
				{ name: "food", emojis: emojiJson.filter((e) => e.has_img_twitter).filter((e) => e.category.toLowerCase().includes('food')) },
				{ name: "activities", emojis: emojiJson.filter((e) => e.has_img_twitter).filter((e) => e.category.toLowerCase().includes('activities')) },
				{ name: "travel", emojis: emojiJson.filter((e) => e.has_img_twitter).filter((e) => e.category.toLowerCase().includes('travel')) },
				{ name: "objects", emojis: emojiJson.filter((e) => e.has_img_twitter).filter((e) => e.category.toLowerCase().includes('objects')) },
				{ name: "symbols", emojis: emojiJson.filter((e) => e.has_img_twitter).filter((e) => e.category.toLowerCase().includes('symbols')) },
				{ name: "flags", emojis: emojiJson.filter((e) => e.has_img_twitter).filter((e) => e.category.toLowerCase().includes('flags')) }
			],
		}
	},
	methods: {
		emojiStyles(emojiShortName: string, width: number) {
			const emojis = emojiJson.filter((e) => e.has_img_twitter)
			const emoji = emojis.find((e) => e.short_name === emojiShortName)
			const sheet_x = (emoji.sheet_y * (width + 2));
			const sheet_y = (emoji.sheet_x * (width + 2));
			return {
				background: 'url(/32.png)',
				width: `${width}px`,
				height: `${width}px`,
				display: 'inline-block',
				'background-position': `-${sheet_y + 1}px -${sheet_x + 1}px`,
				'background-size': '6480% 6480%'
			}
		},
		scrollTo(categoryName: string) {
			document.getElementById('emoji-pane').scrollTop = document.getElementById(categoryName).offsetTop - 92;
		}
	}
}
</script>

<template>
	<div v-if="opened"
		class="rounded-lg shadow-md p-3 z-10 bg-[hsl(223,6.8%,19.8%)]">
		<div class="py-1.5 flex flex-col">
			<div class="flex-row gap-x-2 overflow-x-scroll">
				<button @click="scrollTo('people')"
					class="p-1.5 hover:bg-[hsl(223,6.8%,25.3%)] rounded-md transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24">
						<g fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2">
							<path d="M12 21a9 9 0 1 1 0-18a9 9 0 0 1 0 18z" />
							<path d="M10 10c-.5-1-2.5-1-3 0m10 0c-.5-1-2.5-1-3 0m.5 5a3.5 3.5 0 0 1-5 0" />
						</g>
					</svg>
				</button>
				<button @click="scrollTo('nature')"
					class="p-1.5 hover:bg-[hsl(223,6.8%,25.3%)] rounded-md transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24">
						<path fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m16 5l3 3l-2 1l4 4l-3 1l4 4h-9m2 3v-3m-7-5l-2-2m2 1l2-2M8 21V8m-2.176 7.995a3 3 0 0 1-2.743-3.69a2.998 2.998 0 0 1 .304-4.833A3 3 0 0 1 8 3.765a3 3 0 0 1 4.614 3.707a2.997 2.997 0 0 1 .305 4.833A3 3 0 0 1 10 16H6z" />
					</svg>
				</button>
				<button @click="scrollTo('food')"
					class="p-1.5 hover:bg-[hsl(223,6.8%,25.3%)] rounded-md transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24">
						<path fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 21.5V17m-4 0h8V7a4 4 0 1 0-8 0v10zm0-6.5L16 7m-8 7.5l8-3.5" />
					</svg>
				</button>
				<button @click="scrollTo('activities')"
					class="p-1.5 hover:bg-[hsl(223,6.8%,25.3%)] rounded-md transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24">
						<g fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2">
							<path
								d="M12 5h3.5a5 5 0 0 1 0 10H10l-4.015 4.227a2.3 2.3 0 0 1-3.923-2.035l1.634-8.173A5 5 0 0 1 8.6 5H12z" />
							<path d="m14 15l4.07 4.284a2.3 2.3 0 0 0 3.925-2.023l-1.6-8.232M8 9v2m-1-1h2m5 0h2" />
						</g>
					</svg>
				</button>
				<button @click="scrollTo('travel')"
					class="p-1.5 hover:bg-[hsl(223,6.8%,25.3%)] rounded-md transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24">
						<path fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m14.5 6.5l3-2.9a2.05 2.05 0 0 1 2.9 2.9l-2.9 3L20 17l-2.5 2.55L14 13l-3 3v3l-2 2l-1.5-4.5L3 15l2-2h3l3-3l-6.5-3.5L7 4l7.5 2.5z" />
					</svg>
				</button>
				<button @click="scrollTo('objects')"
					class="p-1.5 hover:bg-[hsl(223,6.8%,25.3%)] rounded-md transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24">
						<g fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2">
							<path
								d="M3 14c.83.642 2.077 1.017 3.5 1c1.423.017 2.67-.358 3.5-1c.83-.642 2.077-1.017 3.5-1c1.423-.017 2.67.358 3.5 1M8 3a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2m4-4a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2" />
							<path d="M3 10h14v5a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-5z" />
							<path d="M16.746 16.726a3 3 0 1 0 .252-5.555" />
						</g>
					</svg>
				</button>
				<button @click="scrollTo('symbols')"
					class="p-1.5 hover:bg-[hsl(223,6.8%,25.3%)] rounded-md transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24">
						<g fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2">
							<circle cx="12"
								cy="12"
								r="9" />
							<path d="M12 7v5l3 3" />
						</g>
					</svg>
				</button>
				<button @click="scrollTo('flags')"
					class="p-1.5 hover:bg-[hsl(223,6.8%,25.3%)] rounded-md transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24">
						<path fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 5v16M19 5v9M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0M5 14a5 5 0 0 1 7 0a5 5 0 0 0 7 0" />
					</svg>
				</button>
			</div>
		</div>

		<div class="max-w-[375px] max-h-[450px] overflow-hidden overflow-y-scroll scroll-smooth EmojiPicker"
			id="emoji-pane">
			<div class="text-black flex flex-col category"
				v-for="category in categories">
				<h6 class="uppercase text-[hsl(216,3.7%,73.5%)] sticky top-0 bg-[hsl(223,6.8%,19.8%)] py-1">{{
					category.name
				}}</h6>
				<div class="flex flex-wrap"
					:id="category.name">
					<button v-for="emoji in category.emojis"
						class="p-2 rounded hover:bg-[hsl(223,6.8%,28.4%)] h-12 transition-colors emoji"
						@click="$emit('pickedEmoji', emoji.short_name)"
						:aria-label='emoji.name.toLowerCase()'>
						<span :style="emojiStyles(emoji.short_name, 32)"
							draggable="false"
							class="w-4" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.emoji-image {
	border: none;
}
</style>