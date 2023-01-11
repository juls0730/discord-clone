export interface IUser {
	id: string;
	email: string;
	username: string;
	passwordhash: string | undefined;
	servers: Array<IServer>;
	serverId?: string;
	channels: Array<IChannel>;
}

export interface IServer {
	id: string;
	name: string;
	channels: Array<IChannel>;
	participants: Array<IUser>;
}

export interface IChannel {
	id: string;
	name: string;
	server?: IServer;
	messages: Array<unknown>
	DM?: boolean;
	dmParticipants?: Array<IUser>;
	serverId: string;
}

export interface IMessage {
	id: string;
	body: string;
	creator: IUser;
	channel: IChannel;
	userId: string;
	channelId: string;
}