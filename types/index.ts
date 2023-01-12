export interface IUser {
	id: string;
	email: string;
	username: string;
	passwordhash: string;
	servers?: Array<IServer>;
	channels?: Array<IChannel>;
	roles?: Array<IRole>;
}

export type SafeUser = Omit<Omit<IUser, 'passwordhash'>, 'email'>

export interface IServer {
	id: string;
	name: string;
	channels?: Array<IChannel>;
	participants: Array<IUser>;
	roles?: Array<IRole>;
	inviteCode?: Array<IInviteCode>;
}

export interface IChannel {
	id: string;
	name: string;
	server?: IServer;
	messages?: Array<IMessage>
	DM: boolean;
	dmParticipants?: Array<IUser>;
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