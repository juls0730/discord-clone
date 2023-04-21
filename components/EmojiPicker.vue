<script lang="ts">
import emojiJson from '~/assets/json/emoji.json';

export default {
	props: {
		opened: Boolean,
	},
	emits: ['picked-emoji'],
	data() {
		return {
			emojis: emojiJson,
			categories: [
				{ name: 'people', emojis: emojiJson.filter((e) => e.category.toLowerCase().includes('smileys')).concat(emojiJson.filter((e) => e.category.toLowerCase().includes('people'))) },
				{ name: 'nature', emojis: emojiJson.filter((e) => e.category.toLowerCase().includes('nature')) },
				{ name: 'food', emojis: emojiJson.filter((e) => e.category.toLowerCase().includes('food')) },
				{ name: 'activities', emojis: emojiJson.filter((e) => e.category.toLowerCase().includes('activities')) },
				{ name: 'travel', emojis: emojiJson.filter((e) => e.category.toLowerCase().includes('travel')) },
				{ name: 'objects', emojis: emojiJson.filter((e) => e.category.toLowerCase().includes('objects')) },
				{ name: 'symbols', emojis: emojiJson.filter((e) => e.category.toLowerCase().includes('symbols')) },
				{ name: 'flags', emojis: emojiJson.filter((e) => e.category.toLowerCase().includes('flags')) }
			],
		};
	},
	methods: {
		emojiStyles(emojiShortName: string, width: number) {
			const emojis = emojiJson;
			const emoji = emojis.find((e) => e.short_names[0] === emojiShortName);
			if (!emoji) return;
			const sheet_x = (emoji.sheet_y * (width + 2));
			const sheet_y = (emoji.sheet_x * (width + 2));
			return {
				background: 'url(/32.png)',
				width: `${width}px`,
				height: `${width}px`,
				display: 'inline-block',
				'background-position': `-${sheet_y + 1}px -${sheet_x + 1}px`,
				'background-size': '6480% 6480%'
			};
		},
		scrollTo(categoryName: string) {
			const emojiPane = document.getElementById('emojiPane');
			const category = document.getElementById(categoryName);
			if (!emojiPane || !category) return;
			emojiPane.scrollTop = category.offsetTop - 96;
		}
	}
};
</script>

<template>
  <div>
    <div class="py-1.5 flex flex-col">
      <div class="flex-row gap-x-2 overflow-x-scroll">
        <button
          class="p-1.5 bg-inherit hover:backdrop-brightness-125 rounded-md transition-all"
          @click="scrollTo('people')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path d="M12 21a9 9 0 1 1 0-18a9 9 0 0 1 0 18z" />
              <path d="M10 10c-.5-1-2.5-1-3 0m10 0c-.5-1-2.5-1-3 0m.5 5a3.5 3.5 0 0 1-5 0" />
            </g>
          </svg>
        </button>
        <button
          class="p-1.5 bg-inherit hover:backdrop-brightness-125 rounded-md transition-all"
          @click="scrollTo('nature')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m16 5l3 3l-2 1l4 4l-3 1l4 4h-9m2 3v-3m-7-5l-2-2m2 1l2-2M8 21V8m-2.176 7.995a3 3 0 0 1-2.743-3.69a2.998 2.998 0 0 1 .304-4.833A3 3 0 0 1 8 3.765a3 3 0 0 1 4.614 3.707a2.997 2.997 0 0 1 .305 4.833A3 3 0 0 1 10 16H6z"
            />
          </svg>
        </button>
        <button
          class="p-1.5 bg-inherit hover:backdrop-brightness-125 rounded-md transition-all"
          @click="scrollTo('food')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 21.5V17m-4 0h8V7a4 4 0 1 0-8 0v10zm0-6.5L16 7m-8 7.5l8-3.5"
            />
          </svg>
        </button>
        <button
          class="p-1.5 bg-inherit hover:backdrop-brightness-125 rounded-md transition-all"
          @click="scrollTo('activities')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path
                d="M12 5h3.5a5 5 0 0 1 0 10H10l-4.015 4.227a2.3 2.3 0 0 1-3.923-2.035l1.634-8.173A5 5 0 0 1 8.6 5H12z"
              />
              <path d="m14 15l4.07 4.284a2.3 2.3 0 0 0 3.925-2.023l-1.6-8.232M8 9v2m-1-1h2m5 0h2" />
            </g>
          </svg>
        </button>
        <button
          class="p-1.5 bg-inherit hover:backdrop-brightness-125 rounded-md transition-all"
          @click="scrollTo('travel')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m14.5 6.5l3-2.9a2.05 2.05 0 0 1 2.9 2.9l-2.9 3L20 17l-2.5 2.55L14 13l-3 3v3l-2 2l-1.5-4.5L3 15l2-2h3l3-3l-6.5-3.5L7 4l7.5 2.5z"
            />
          </svg>
        </button>
        <button
          class="p-1.5 bg-inherit hover:backdrop-brightness-125 rounded-md transition-all"
          @click="scrollTo('objects')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path
                d="M3 14c.83.642 2.077 1.017 3.5 1c1.423.017 2.67-.358 3.5-1c.83-.642 2.077-1.017 3.5-1c1.423-.017 2.67.358 3.5 1M8 3a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2m4-4a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2"
              />
              <path d="M3 10h14v5a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-5z" />
              <path d="M16.746 16.726a3 3 0 1 0 .252-5.555" />
            </g>
          </svg>
        </button>
        <button
          class="p-1.5 bg-inherit hover:backdrop-brightness-125 rounded-md transition-all"
          @click="scrollTo('symbols')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
              />
              <path d="M12 7v5l3 3" />
            </g>
          </svg>
        </button>
        <button
          class="p-1.5 bg-inherit hover:backdrop-brightness-125 rounded-md transition-all"
          @click="scrollTo('flags')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 5v16M19 5v9M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0M5 14a5 5 0 0 1 7 0a5 5 0 0 0 7 0"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      id="emoji-pane"
      class="overflow-hidden overflow-y-scroll scroll-smooth EmojiPicker max-h-[450px]"
    >
      <div
        v-for="category in categories"
        :key="category.name"
        class="text-black flex flex-col category bg-[var(--primary-dark)]"
      >
        <h6 class="uppercase text-[var(--primary-text)] sticky top-0 bg-inherit z-10 py-1">
          {{
            category.name
          }}
        </h6>
        <div
          :id="category.name"
          class="flex flex-wrap"
        >
          <button
            v-for="emoji in category.emojis"
            :key="emoji.name.toLowerCase()"
            :aria-label="emoji.name.toLowerCase()"
            class="p-2 rounded bg-inherit hover:backdrop-brightness-[1.45] h-12 transition-all emoji"
            @click="$emit('picked-emoji', emoji.short_names[0])"
          >
            <span
              :style="emojiStyles(emoji.short_names[0], 32)"
              draggable="false"
              class="w-4"
            />
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