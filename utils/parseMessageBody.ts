import { IChannel } from "~/types";

export default function parseBody(body: string, activeChannel: IChannel) {
	body = escape(body);
	const rules = [
		//bold, italics and paragragh rules
		[/\&#42;\&#42;\s?([^\n]+)\&#42;\&#42;/g, "<b>$1</b>"],
		[/\&#42;\s?([^\n]+)\&#42;/g, "<i>$1</i>"],
		[/\&#95;\&#95;\s?([^\n]+)\&#95;\&#95;/g, "<u>$1</u>"],
		[/\&#126;\&#126;\s?([^\n]+)\&#126;\&#126;/g, "<s>$1</s>"],

		// code lines and blocks
		[/&#96;&#96;&#96;(.+?)&#96;&#96;&#96;/g, "<pre class='codeblock'><code>$1</code></pre>"],
		[/(?<!&#96;)&#96;(.+?)&#96;(?!&#96;)/g, "<code class='inline-code'>$1</code>"],
	  ];

	rules.forEach(([rule, template]) => {
		body = body.replace(rule, template);
	})

	const mentions = body.match(/<@([a-z]|[0-9]){25}>/g);

	if (mentions) {
		const participants = (activeChannel.DM) ? activeChannel.dmParticipants : activeChannel.server.participants;
		if (!participants) throw new Error(`participants in channel "${activeChannel.id}" not found"`)
		mentions.forEach((e: string) => {
			if (!e) return
			const id = e.split('<@')[1]?.split('>')[0];
			if (!id) return;
			const user = participants.find((e) => e.id === id)
			if (!user) return;
			body = body.split(e).join(`@${user.username}`)
		});
	}

	return body
}

function escape(s: string) {
    return s.replace(
        /[^0-9A-Za-z ]/g,
        c => "&#" + c.charCodeAt(0) + ";"
    );
}