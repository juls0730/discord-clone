import { IChannel } from '~/types';

export default function parseBody(body: string, activeChannel: IChannel) {
	if (!activeChannel.id) throw new Error('No active channel');
	body = escape(body);
	const rules = [
		//bold, italics and paragragh rules
		[/&#42;&#42;\s?([^\n]+)&#42;&#42;/g, '<b>$1</b>'],
		[/&#42;\s?([^\n]+)&#42;/g, '<i>$1</i>'],
		[/&#95;&#95;\s?([^\n]+)&#95;&#95;/g, '<u>$1</u>'],
		[/&#126;&#126;\s?([^\n]+)&#126;&#126;/g, '<s>$1</s>'],

		// code lines and blocks
		[/&#96;&#96;&#96;(.+?)&#96;&#96;&#96;/g, '<pre class=\'codeblock\'><code>$1</code></pre>'],
		[/(?<!&#96;)&#96;(.+?)&#96;(?!&#96;)/g, '<code class=\'inline-code\'>$1</code>'],
	];

	rules.forEach(([rule, template]) => {
		if (!rule || !template || typeof template !== 'string') throw new Error('Rule or template is undefined or a regexp (how the actual)');
		body = body.replace(rule, template);
	});

	/*
	* Matches string in the format of: <@[cuid]>
	* for example: "<@clfhiwt920003fb4jd5dbo2sy>", "<@clfhiwiah0000fb4jenr3j6l1>", and "<@clfhizvyt000nfb4j16kjnell>" would all be matched
	*/ 
	const mentionRegex = /&#60;&#64;(([a-z]|[0-9]){25})&#62;/g;
	const mentions = body.match(mentionRegex);

	if (mentions) {
		const participants = (activeChannel.DM) ? activeChannel.dmParticipants : activeChannel.server.participants;
		if (!participants) throw new Error(`participants in channel "${activeChannel.id}" not found"`);
		mentions.forEach((e: string) => {
			const id = e.split('&#60;&#64;')[1]?.split('&#62;')[0];
			if (!id) return;
			const user = participants.find((e) => e.id === id);
			if (!user) return;
			body = body.split(e).join(`@${user.username}`);
		});
	}

	return body;
}

function escape(s: string) {
	return s.replace(
		/[^0-9A-Za-z ]/g,
		c => '&#' + c.charCodeAt(0) + ';'
	);
}