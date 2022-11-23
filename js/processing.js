/*
pattern = query's regex match
answer = output
before = function to execute before output
after = function to execute after output

If no anser, use after

TO ADD : 
 - output parameter from before function
 - text/voice function parameter
 - answer to answer...
 */

// global letiable for query : sam.query

q = [
	{
		pattern: /help/,
		after: showHelp
	},
	{
		pattern: /good (morning|afternoon|evening)|hi(?!\S)|hello/,
		answer: 'Hello'
	},
	{
		pattern: /good night/,
		answer: 'Sweet dreams',
		after: wrapper.shutdown
	},
	{
		pattern: /shut( )?down/,
		answer: 'Good bye.',
		after: wrapper.shutdown
	},
	{
		pattern: /introduce yourself|about you/,
		answer: 'My name is Samaritan and I am an artificial intelligence.',
		after: () => { output.s(q[5].answer); }
	},
	{
		pattern: /mandate|goal|mission/,
		answer: 'My primary mandate is to eliminate threats to national security.',
	},
	{
		pattern: /what are your commands/,
		before: () => {
			output.calculating({
				state: true,
				duration: 3.5,
				callback: () => {
					window.dispatchEvent(new Event('before.DONE'));
				}
			});
		},
		answer: 'Thumbs up',
	},
	{
		pattern: /(enable night( mode)?|night( mode)? on)/,
		after: night.enable
	},
	{
		pattern: /(disable night( mode)?|night( mode)? off)/,
		after: night.disable
	},
	{
		pattern: /(toggle )?night( mode)?/,
		after: night.toggle
	},
	{
		pattern: /(do|can) you (see|recognize) me|who am i/,
		answer: 'You are admin'
	},
	{
		pattern: /(can|do) you (hear|read)/,
		answer: 'Yes'
	},
	{
		pattern: /^random$/,
		before: () => {
			output.calculating({
				state: true,
				duration: 3.5,
				callback: () => {
					window.dispatchEvent(new Event('before.DONE'));
				}
			});
		},
		after: () => { output.s(phrases[Math.floor(Math.random() * phrases.length)]); }
	},
	{
		pattern: /credits/,
		after: showCredits
	},
	{
		pattern: /changelog/,
		after: showChangelog
	},
	{
		pattern: /commands/,
		after: showCommands
	},
	{
		pattern: /(close|hide) all/,
		after: sWindow.destroyAll
	},
	{
		pattern: /clock|what time is it/,
		after: clock
	},
	{
		pattern: /timer/,
		after: timer
	},
	{
		pattern: /countdown/,
		after: () => {
			let t = sam.query.replace(/countdown (from|to)?/, '');
			// countdown to 08.03.2018 00:00:00
			if(sam.query.startsWith('countdown to')){
				countdown.to(t);
			}
			// countdown from 1d 01:01:01
			else {
				let d = t.match(/[0-9]+d/);
				let hms = t.match(/([0-9]{2}:){2}[0-9]{2}/);
				if(hms !== null) hms = hms[0];
				else hms = '00:00:00';
				if(d !== null) hms = hms.replace(hms.split(':')[0], parseInt(hms.split(':')[0]) + 24 * parseInt(d[0]));
				countdown.from(hms);
			}
		}
	},
	{
		pattern: /.+/,
		answer: 'Sorry I don\'t understand'
	}
];

let phrases = [
	'I will protect you now',
	'What are your commands ?',
	'Investigation ongoing',
	'There is no alternative.',
	'Find the Machine',
	'Stop it. Now.'
];