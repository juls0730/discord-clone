import { IChannel, IUser, SafeUser } from '~/types';

export const useDmStore = defineStore('dmStore', {
	state: () => ({
		dms: [] as IChannel[]
	}),
	actions: {
		setDms(dms: IChannel[]) {
			this.dms = dms;
		},
		addDM(dmChannel: IChannel) {
			if (this.dms.find((e) => e.id === dmChannel.id)) {
				const index = this.dms.findIndex((e) => e.id === dmChannel.id);
				this.dms[index] = dmChannel;
				return;
			}
			this.dms.push(dmChannel);
		},
		getById(id: string) {
			return this.dms.find((e) => e.id === id);
		},
		getByPartnerId(id: string) {
			return this.dms.find((e) => e.dmParticipants?.some((e: SafeUser) => e.id === id));
		}
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useDmStore, import.meta.hot));
}