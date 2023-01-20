export interface IUser {
	id: string;
	email: string;
	username: string;
	passwordhash: string;
	servers?: Array<IServer>;
	channels?: Array<IChannel>;
	roles?: Array<IRole>;
	createdAt: Date;
}

export type SafeUser = Omit<Omit<IUser, 'passwordhash'>, 'email'>

export interface IServer {
	id: string;
	name: string;
	channels: Array<IChannel>;
	participants: Array<SafeUser>;
	roles: Array<IRole>;
	inviteCode?: Array<IInviteCode>;
}

export interface IChannel {
	id: string;
	name: string;
	server: IServer;
	messages: Array<IMessage>
	DM: boolean;
	dmParticipants?: Array<SafeUser>;
	serverId: string;
}

export interface IMessage {
	id: string;
	body: string;
	creator: SafeUser;
	channel?: IChannel;
	userId: string;
	channelId: string;
	invites?: IInviteCode[];
	reactions?: IReaction[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IInviteCode {
	id: string;
	server: IServer;
	expires: boolean;
	expiryDate: Date;
	maxUses: number;
	serverId: string;
	Message: IMessage;
	messageId: string;
}

export interface IRole {
	id: string;
	name: string;
	administer: boolean;
	owner: boolean;
	users: IUser[];
	server?: IServer;
	serverId?: string;
}

export interface IReaction {
	id: string;
	emoji: {
		name: string;
		id?: string;
	};
	count: number;
	previousCount?: number;
	users: IUser[];
	Message: IMessage;
	messageId: string;
}

export interface IEmojiPickerData {
	opened: boolean;
	top: number;
	right: number;
	openedBy: {
		type: "message" | "messageInput";
		messageId?: string;
	};
}