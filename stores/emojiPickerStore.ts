import { IPopupData } from '~/types';

export const useEmojiPickerStore = defineStore('emojiPickerStore', {
	state: () => ({
		emojiPickerData: {type: 'emojiPicker'} as IPopupData,
	}),
	actions: {
		openEmojiPicker(payload: IPopupData) {
			this.emojiPickerData.type = 'emojiPicker';
			this.emojiPickerData.top = payload.top;
			this.emojiPickerData.right = payload.right;
			this.emojiPickerData.openedBy = payload.openedBy;
			this.emojiPickerData.opened = true;
		},
		toggleEmojiPicker(payload: IPopupData) {
			let messageId;
			if (this.emojiPickerData.openedBy === undefined) {
				messageId = null;
			} else {
				messageId = this.emojiPickerData.openedBy.messageId || null;
			}

			console.log(new Date().getTime());
			console.log(!this.emojiPickerData.opened || payload.openedBy?.messageId !== messageId, this.emojiPickerData.opened, payload.openedBy?.messageId, messageId);

			if (!this.emojiPickerData.opened || payload.openedBy?.messageId !== messageId) {
				this.openEmojiPicker(payload);
			} else {
				this.closeEmojiPicker();
			}
		},
		closeEmojiPicker() {
			if (this.emojiPickerData.openedBy) this.emojiPickerData.openedBy.messageId = '';
			this.emojiPickerData.opened = false;
		},
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useEmojiPickerStore, import.meta.hot));
}