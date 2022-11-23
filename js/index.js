let release = {
	version: 'v3.001b1',
	_date: '01.11.18',
	dev: 'KaKi87',
	devcontact: 'Twitter @KaKi_87, Discord KaKi87#2368'
};
document.querySelectorAll('.version').forEach((el) => { el.textContent = release.version; });

let mobile = (/(android|windows phone|ios)/i).test(window.navigator.userAgent);

/*
Night mode
 */

let night = {
	enable: () => {
		document.body.classList.add('night');
	},
	disable: () => {
		document.body.classList.remove('night');
	},
	toggle: () => {
		document.body.classList.toggle('night');
	}
};

if(mobile) night.enable();

/*
Loading wrapper
 */

let wrapper = {
	init: (stage) => {
		if(!stage) stage = 1;
		switch(stage){
			case 1:
				wrapper.progress(() => { wrapper.init(2); });
				break;
			case 2:
				wrapper.status('connection established', () => { wrapper.init(3); });
				break;
			case 3:
				wrapper.load(() => { wrapper.init(4); });
				break;
			case 4:
				marker.solid();
				setTimeout(() => {
					output.s('Hello admin what are your commands ?');
					executive.init();
				}, 750);
				break;
		}
	},
	progress: (callback) => {
		setTimeout(() => {
			let i = 0;
			let a = ['KERNEL', 'OPERATING SYSTEM', 'PROTOCOLS', 'PROCESSING', 'RECOGNITION', 'MEMORY', 'LEARNING', 'HEURISTICS', 'ENGINEERING'];
			let b = ['DOD', 'FBI', 'CIA', 'NSA', 'DEA', 'ECHELON', 'DGSI', 'DGSE', 'MI6', 'GCHQ', 'FSB', 'SVR'];
			let n = parseInt(100 / (a.length + b.length));
			let p = 0;
			let P = setInterval(() => {
				if(p < 100){
					p++;
					document.querySelector('#progress .bar').style.width = p + '%';
					if(p % n === 0){
						if(i < (a.length + b.length)){
							document.querySelector('#progress .details').textContent = a[i] ? 'INITIATING : ' + a[i] : 'ACQUIRING : ' + b[i - a.length];
							i++;
						}
						else
							document.querySelector('#progress .details').textContent = release.version;
					}
				}
				else {
					clearInterval(P);
					setTimeout(() => {
						document.querySelector('#progress').style.display = 'none';
						setTimeout(() => { callback(); }, 75);
					}, 500);
				}
			}, 25);
		}, 250);
	},
	status: (text, callback) => {
		document.querySelector('#status').textContent = text;
		document.querySelector('#status').style.opacity = '1';
		setTimeout(() => {
			document.querySelector('#status').style.opacity = '0';
			setTimeout(() => { callback(); }, 500);
		}, 1000);
	},
	load: (callback) => {
		marker.dots();
		document.querySelectorAll('.LW').forEach((el) => { el.classList.add('loaded'); });
		setTimeout(() => {
			callback();
		}, 2000);
	},
	unload: (callback) => {
		document.querySelectorAll('.LW').forEach((el) => { el.classList.remove('loaded'); });
		setTimeout(() => {
			callback();
		}, 600);
	},
	shutdown: () => {
		marker.hide();
		document.querySelector('#hr').style.visibility = 'hidden';
		document.querySelector('#cmd').style.display = 'none';
		document.querySelector('#copyright').style.display = 'none';
		sWindow.destroyAll();
		document.querySelector('#output').style.color = 'red';
		let i = 5;
		document.querySelector('#output').textContent = 'SAMARITAN SHUTDOWN IN : ' + i;
		let countdown = setInterval(() => {
			if(i > 0){
				i--;
				document.querySelector('#output').textContent = 'SAMARITAN SHUTDOWN IN : ' + i;
				if(i === 0){
					setTimeout(() => {
						document.querySelector('#output').style.visibility = 'hidden';
					}, 250);
				}
			}
			else {
				clearInterval(countdown);
				wrapper.unload(() => {
					document.querySelector('#status').classList.add('red');
					wrapper.status('samaritan offline', () => {
						document.head.innerHTML = '';
						document.body.innerHTML = '';
						document.body.style.backgroundColor = 'black';
					});
				});
			}
		}, 1000);
	}
};

/*
Cmd & Focus
 */

let cmdFocus = () => {
	document.querySelector('#cmd span').focus();
	let setEndOfContenteditable = (el) => {
		let range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		let selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
		/*
		(C) 2010 Nico Burns
		https://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity/3866442#3866442
		 */
	};
	setEndOfContenteditable(document.querySelector('#cmd span'));
};

document.body.onkeydown = (e) => { if(/^([a-z]|backspace)$/i.test(e.key)) cmdFocus(); };

document.querySelector('#cmd span').onkeydown = (e) => {
	/* Prevent arrow keys (cursor displacement) and Ctrl-A (select all) */
	if(e.key.startsWith('Arrow') || (e.ctrlKey && e.key === 'a')){
		e.preventDefault();
	}
	/* Enter */
	if(e.key === 'Enter'){
		document.querySelector('#submit').click();
	}
};

/* Prevent cursor displacement */
document.querySelector('#cmd span').onmousedown = (e) => {
	e.preventDefault();
};

/*
Submit command
 */

document.querySelector('#submit').onclick = () => {
	let cmd = document.querySelector('#cmd span').textContent;
	if(cmd.length > 0){
		document.querySelector('#cmd span').textContent = '';
		sam.search(cmd);
	}
};

/*
Output
 */

let output = {
	// Word
	w: (w) => {
		marker.solid();
		document.querySelector('#output').textContent = w;
		document.querySelector('#hr').style.width = (w.length * 21) + 'px';
	},
	// Sentence
	s: (s) => {
		s = s.split(' ');
		output.w(s[0]);
		let i = 1;
		let printS = setInterval(() => {
			if(i < s.length){
				output.w(s[i]);
				i++;
			}
			else {
				clearInterval(printS);
				output.clear();
			}
		}, 450);
	},
	clear: () => {
		document.querySelector('#output').textContent = '\xa0';
		setTimeout(() => {
			document.querySelector('#hr').style.removeProperty('width');
			marker.blink();
			window.dispatchEvent(new Event('output.CLEAR'));
		}, 150);
	},
	calculating: (s) => {
		if(s.state === true){
			document.querySelector('#output').classList.add('calculating');
			marker.dots();
			if(s.duration){
				setTimeout(() => {
					let newSettings = { state: false };
					if(typeof(s.callback) === 'function')
						Object.assign(newSettings, newSettings, { callback: s.callback });
					output.calculating(newSettings);
				}, s.duration * 1000);
			}
		}
		else {
			document.querySelector('#output').classList.remove('calculating');
			marker.blink();
			if(typeof(s.callback) === 'function')
				s.callback();
		}
	}
};

/*
Triangle
 */

let marker = {
	blink: () => {
		marker.show();
		document.querySelector('#marker').className = 'triangle blink';
	},
	solid: () => {
		marker.show();
		document.querySelector('#marker').className = 'triangle';
	},
	dots: () => {
		marker.show();
		document.querySelector('#marker').className = 'dots';
	},
	show: () => {
		document.querySelector('#marker').style.visibility = 'visible';
	},
	hide: () => {
		document.querySelector('#marker').style.visibility = 'hidden';
	}
};

/*
Process
 */

let sam = {
	query: '',
	hold: false,
	search: (query) => {
		query = query.toLowerCase().trim();
		if(!sam.hold){
			sam.query = query;
			console.log('SAM // [LOG] Query received : "' + query + '"');
			for(let i = 0; i < q.length; i++){
				if(q[i].pattern.test(query)){
					console.log('SAM // [LOG] Match found', q[i]);
					sam.process(q[i], 1);
					return;
				}
			}
			cleverbot.process(query);
		}
		else {
			sam.hold(query);
		}
	},
	process: (a, stage) => {
		console.log('SAM // [LOG] Processing stage ' + stage);
		switch(stage){
			case 1:
				if(typeof(a.before) === 'function'){
					a.before();
					window.addEventListener('before.DONE', _func = () => {
						this.removeEventListener('before.DONE', _func);
						sam.process(a, 2);
					});
				}
				else
					sam.process(a, 2);
				break;
			case 2:
				if(typeof(a.answer) === 'string'){
					output.s(a.answer);
					window.addEventListener('output.CLEAR', _func = () => {
						this.removeEventListener('output.CLEAR', _func);
						sam.process(a, 3);
					});
				}
				else
					sam.process(a, 3);
				break;
			case 3:
				if(typeof(a.after) === 'function'){
					a.after();
				}
				break;
		}
	}
};

let cleverbot = {
	process: (query) => {
		console.log('CLEVERBOT // [LOG] Processing query');
	}
};

/*
Top-Left
 */

let executive = {
	classes: [],
	init: () => {
		document.querySelectorAll('#executive .item').forEach((item) => {
			if(item.classList.length > 1){
				executive.classes.push(item.classList[1]);
				item.classList.remove(item.classList[1]);
			}
		});
		executive.blink();
	},
	blink: () => {
		let f = (t) => {
			setTimeout(() => {
				let n = Math.floor(Math.random() * (executive.classes.length - 1)) + 0;
				try { document.querySelectorAll('#executive .item')[n].classList.add(executive.classes[n]); } catch(e){ return; }
				setTimeout(() => {
					try { document.querySelectorAll('#executive .item')[n].classList.remove(executive.classes[n]); } catch(e){}
				}, 250);
				let t = Math.floor(Math.random() * 4000) + 100;
				f(t);
			}, t);
		};
		for(let i = 0; i < 2; i++){ f(0); }
	}
};

/*
Windows
 */

let sWindow = {
	new: (s) => {
		// Prevent duplicate
		if(document.getElementById(s.id) !== null) return;
		// Main values
		let w = Object.assign(document.createElement('div'), {
			id: (typeof(s.id) !== 'undefined' ? s.id : ''),
			className: 'window' + (typeof(s.class) !== 'undefined' ? ' ' + s.class : ''),
			innerHTML: (s.title ? '<span class="title">' + s.title + '</span>' : '') + '<div class="content"></div>',
		});
		// Title style
		if((s.red || typeof(s.red) === 'undefined') && s.title)
			w.querySelector('.title').classList.add('red');
		// Positioning CSS
		Object.assign(w.style, s.position);
		// Custom CSS
		if(s.customCSS !== undefined) Object.assign(w.style, s.customCSS);
		// Append to DOM
		document.body.appendChild(w);
		// Draggable
		dragElement(w);
		// Destroy on double-click
		if(typeof(s.closable) !== 'undefined')
			w.closable = s.closable;
		w.ondblclick = () => {
			if(w.closable || typeof(w.closable) === 'undefined')
				sWindow.destroy(s.id);
		};
		// Animate title
		if(s.title){
			setTimeout(() => {
				let p = 100;
				let P = setInterval(() => {
					if(p >= 0){
						w.querySelector('.title').style['clip-path'] = 'inset(0 ' + p + '% 0 0)';
						p -= 10;
					}
					else
						clearInterval(P);
				}, 20);

			}, 500);
		}
		// Animate body
		setTimeout(() => {
			w.style.visibility = 'visible';
			try {
				if(s.maxHeight < 300 || s.forceHeight)
					w.querySelector('.content').style.maxHeight = `${s.maxHeight}px`;
				else
					w.querySelector('.content').style.maxHeight = '300px';
			} catch(e){
				w.querySelector('.content').style.maxHeight = '300px';
			}
		}, 700);
		// Add & replace content
		w.content = (content, doNotClear) => {
			if(!doNotClear) w.querySelector('.content').innerHTML = '';
			let append = (content, inline, parentElement) => {
				if(inline === undefined) inline = false;
				let el = document.createElement('span');
				if(content.type !== 'normal') el.className = content.type;
				el.textContent = content.text;
				if(!inline){
					w.querySelector('.content').appendChild(el);
				}
				else {
					parentElement.appendChild(el);
				}
				let wait = setInterval(() => {
					if(el.isVisible()){
						clearInterval(wait);
						el.style.opacity = '1';
					}
				}, 100);
			};
			content.forEach((content) => {
				switch(content.constructor){
					case Array:
						let el = document.createElement('div');
						el.className = 'inline';
						content.forEach((content) => {
							append(content, true, el);
						});
						w.querySelector('.content').appendChild(el);
						break;
					case Object:
						append(content);
						break;
				}
			});
		};
		if(s.content){
			w.content(s.content);
		}
		return w;
	},
	destroy: (id) => {
		try { document.body.removeChild(document.getElementById(id)); } catch(e){}
	},
	destroyAll: () => {
		document.querySelectorAll('.window').forEach((w) => {
			document.body.removeChild(w);
		});
	}
};

/*
https://www.w3schools.com/howto/howto_js_draggable.asp
 */

function dragElement(el) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(el.id + "header")) {
	/* if present, the header is where you move the DIV from:*/
	document.getElementById(el.id + "header").onmousedown = dragMouseDown;
  } else {
	/* otherwise, move the DIV from anywhere inside the DIV:*/
	el.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
	e = e || window.event;
	// get the mouse cursor position at startup:
	pos3 = e.clientX;
	pos4 = e.clientY;
	document.onmouseup = closeDragElement;
	// call a function whenever the cursor moves:
	document.onmousemove = elementDrag;
	el.classList.add('moving');
  }

  function elementDrag(e) {
	e = e || window.event;
	// calculate the new cursor position:
	pos1 = pos3 - e.clientX;
	pos2 = pos4 - e.clientY;
	pos3 = e.clientX;
	pos4 = e.clientY;
	// set the element's new position:
	el.style.top = (el.offsetTop - pos2) + "px";
	el.style.left = (el.offsetLeft - pos1) + "px";
	el.style.right = '';
	el.style.bottom = '';
  }

  function closeDragElement() {
	/* stop moving when mouse button is released:*/
	document.onmouseup = null;
	document.onmousemove = null;
	el.classList.remove('moving');
  }
}

/*
Windows data
 */

let showHelp = () => {
	sWindow.new({
		id: 'help',
		title: 'Help',
		position: {
			top: '240px',
			left: '123px'
		},
		content: [
			{ type: 'title', text: 'about' },
			{ type: 'text', text: 'Samaritan ' + release.version + '\nReleased ' + release._date + ' by ' + release.dev
				+ '\nContact me : ' + release.devcontact },
			{ type: 'title', text: 'Commands' },
			{ type: 'normal', text: 'help, credits, changelog, night \nType "commands" for full commands list' },
			{ type: 'title', text: 'Main features' },
			{ type: 'normal', text: '- Text command input\n- Night mode\n- REGEX command processing\n- Draggable/scrollable/closable windows' },
			{ type: 'title', text: 'Upcoming features' },
			{ type: 'normal', text: '- Chatbot\n- Voice recognition\n- Better windows management'
				+'\n- More processing parameters\n- Facial recognition\n- User defined settings' },
			{ type: 'title', text: 'Known bugs' },
			{ type: 'normal', text: '- Window drag/drop title CSS glitch (Chrome)'
				+ '\n- REGEX error (firefox)'
				+ '\n- Custom scrollbar not working (firefox)' },
			{ type: 'title red', text: 'Double click on this window to close it' }
		]
	});
};

let showCredits = () => {
	sWindow.new({
		id: 'credits',
		title: 'credits',
		position: {
			top: '80px',
			right: '115px'
		},
		content: [
			{ type: 'title', text: 'Design' },
			[ { type: 'normal', text: 'KaKi87' }, { type: 'data redText', text: 'Admin' } ],
			{ type: 'title', text: 'Animation design' },
			[ { type: 'normal', text: 'Elarson' }, { type: 'data redText', text: 'Primary Asset' } ],
			{ type: 'title', text: 'Inspiration' },
			{ type: 'normal', text: 'lukesaltweather\nrodrigograca31\nisoleucine' },
			{ type: 'title red', text: 'Total contributors : 5' }
		],
		forceHeight: true,
		maxHeight: 335
	});
};

let showChangelog = () => {
	sWindow.new({
		id: 'changelog',
		title: 'changelog',
		position: {
			bottom: '80px',
			right: '115px'
		},
		content: [
			{ type: 'title', text: release.version + ' (current)' },
			{ type: 'normal', text: '- Added speech recognition (Chrome API)'
					+ '\n- Added ES6 support'
					+ '\n- Improved source code readability'
					+ '\n- Improved windows content management' },
			{ type: 'title', text: 'v3.000b1 (09.03.18)' },
			{ type: 'normal', text: '- Added time apps'
				+ '\n- Added sidebars'
				+ '\n- Improved windows management'
				+ '\n- Improved windows content management'
				+ '\n- Added new windows content types'
				+ '\n- Added awaiting response mode'
				+ '\n- Added Apple countermeasure' },
			{ type: 'title', text: 'v2.005b2 (17.02.18)' },
			{ type: 'normal', text: '- First release' }
		]
	});
};

let showCommands = () => {
	sWindow.new({
		id: 'commands',
		title: 'commands',
		position: {
			bottom: '80px',
			left: '123px'
		},
		maxHeight: 210,
		content: [
			{ type: 'title', text: 'User Interface' },
			{ type: 'normal', text: '- HELP : show help\n- SHUTDOWN : shutdown Samaritan'
				+ '\n- NIGHT : toggle/enable/disable night mode'
				+ '\n- CREDITS : show credits\n- CHANGELOG : show changelog\n- CLOSE ALL : close all windows'
				+ '\n- CLOCK, TIMER\n- COUNTDOWN : (from) (Xd) HH:MM:SS\n[OR] to AAAA.MM.DD HH:MM:SS'
			},
			{ type: 'title', text: 'Artificial Intelligence' },
			{ type: 'normal', text: '- good morning/afternoon/evening, hi, hello'
				+ '\n- good night (shutdown)'
				+ '\n- introduce yourself\n- what is your primary mandate ?\n- what are your commands ?\n- do you recognize me ?'
				+ '\n- random'
			},
			{ type: 'title', text: 'note' },
			{ type: 'normal', text: 'commands are processed by regex,\nalmost all commands (can) have derivatives,'
				+ '\nlook at /js/processing.js for more details'
			}
		]
	});
};

/*
Clock
 */

let clock = () => {
	sWindow.new({
		id: 'clock',
		title: 'clock',
		position: {
			top: '80px',
			right: '50px'
		},
		customCSS: {
			minWidth: '0'
		},
		content: [
			{ type: 'normal', text: '00:00:00' }
		]
	});
	let clockInterval = setInterval(() => {
		try { document.querySelector('#clock .content span').textContent = new Date().toTimeString().split(' ')[0]; }
		catch(e) { clearInterval(clockInterval); }
	}, 50);
};

/*
Time tools
 */

let lpad = (n, width, char) => (n.length >= width) ? n : (new Array(width).join(char) + n).slice(-width);

let SecondsToHHMMSSM = (s) => {
	let h = parseInt( s / 3600 );
	s = s % 3600;
	let m = parseInt( s / 60 );
	s = s % 60;
	return (lpad(h, 2, '0') + ':' + lpad(m, 2, '0') + ':' + lpad(s.toString().split('.')[0], 2, '0')
		+ '.' + s.toString().split('.')[s.toString().split('.').length - 1][0]);
};

let HHMMSStoSeconds = (t) => t.split(':').reduce((acc,time) => (60 * acc) + +time);

/*
Timer
 */

let timer = () => {
	sWindow.new({
		id: 'timer',
		title: 'timer',
		position: {
			top: '80px',
			right: '50px'
		},
		customCSS: {
			minWidth: '0'
		},
		content: [
			{ type: 'normal', text: '00:00:00.0' }
		]
	});
	let t1 = new Date();
	let timerInterval = setInterval(() => {
		let t2 = new Date();
		let dt = t2 - t1;
		try { document.querySelector('#timer .content span').textContent = SecondsToHHMMSSM(dt / 1000); }
		catch(e) { clearInterval(timerInterval); }
	}, 50);
};

/*
Countdown
 */

let countdown = {
	create: () => {
		let el = sWindow.new({
			id: 'countdown',
			title: 'countdown',
			position: {
				top: '80px',
				right: '50px'
			},
			customCSS: {
				minWidth: '223px'
			},
			content: [
				{ type: 'normal countdown', text: '00:00:00.0' }
			]
		});
		return el.querySelector('.content span');
	},
	// Countdown seconds
	init: (t, el, S) => {
		let end = Date.now() / 1000 + t;
		el.countdownInterval = setInterval(() => {
			let d = end - Date.now() / 1000;
			try {
				el.textContent = SecondsToHHMMSSM(Math.abs(d));
				if(d < 0){
					window.dispatchEvent(new Event('countdown.TIMEOUT'));
					if(S) return;
					el.classList.add('negative');
				}
			}
			catch(e) { clearInterval(el.countdownInterval); }
		}, 50);
	},
	stop: (el) => {
		clearInterval(el.countdownInterval);
	},
	// Countdown duration
	from: (t, el, S) => {
		if(!el) el = countdown.create();
		countdown.init(HHMMSStoSeconds(t), el, S);
	},
	// Countdown date-time
	to: (t, el, S) => {
		if(!el) el = countdown.create();
		countdown.init((Date.parse(t) - Date.now()) / 1000, el, S);
	}
};

/*
Apple threat
 */

let apple = (testing) => {
	if((/Mac|iP/).test(window.navigator.platform) || testing){
		sWindow.new({
			id: 'apple',
			title: 'immediate threat',
			position: {
				top: '80px',
				left: '50%'
			},
			customCSS: {
				transform: 'translateX(-50%)'
			},
			content: [
				[ { type: 'normal', text: 'id : ' }, { type: 'data', text: 'apple device' } ],
				[ { type: 'normal', text: 'designation : ' }, { type: 'data red', text: 'threat' } ],
				[ { type: 'normal', text: 'recommandation : ' }, { type: 'data red', text: 'deny' } ],
				[ { type: 'normal', text: 'remaining time : ' }, { type: 'normal countdown', text: '00:00:00.0' } ],
				{ type: 'title red', text: 'type "I hate apple" to abort' }
			],
			closable: false
		});
		countdown.from('00:00:30', document.querySelector('#apple .countdown'));
		window.addEventListener('countdown.TIMEOUT', _func = () => {
			this.removeEventListener('countdown.TIMEOUT', _func);
			if(sam.hold) wrapper.shutdown();
		});
		sam.hold = (query) => {
			if(query === 'i hate apple'){
				sam.hold = false;
				document.querySelector('#apple > .title').textContent = 'Error';
				document.querySelector('#apple').content([
					{ type: 'normal', text: 'new data acquired' },
					{ type: 'redText', text: 'classification error' },
				]);
				setTimeout(() => {
					document.querySelector('#apple > .title').textContent = 'Asset identified';
					document.querySelector('#apple > .title').classList.remove('red');
					document.querySelector('#apple').closable = true;
					document.querySelector('#apple').content([
						[ { type: 'normal', text: 'id : ' }, { type: 'data redText', text: 'admin' } ],
						[ { type: 'normal', text: 'name : ' }, { type: 'data', text: '[access restricted]' } ],
						[ { type: 'normal', text: 'ssn : ' }, { type: 'data', text: '[access restricted]' } ]
					]);
				}, 2000);
			}
		}
	}
};

let nlp = (sentence, keywords = [], final) => {
	sWindow.new({
		id: 'nlp',
		class: 'thin_border',
		title: null,
		position: {
			top: '65%',
			left: '50%'
		},
		customCSS: {
			transform: 'translateX(-50%)',
			minWidth: '500px'
		}
	});
	document.querySelector('#nlp .content').innerHTML = '<div class="header"><span class="title">subject</span>admin<br><span class="sub_header"> nlp active</span></div><div class="audio"></div><div class="sentence"></div>';
	sentence.trim().split(' ').forEach((word) => {
		document.querySelector('#nlp .sentence').appendChild(span = document.createElement('span'));
		span.textContent = word;
		span.className = 'data word';
		if(keywords.indexOf(word) !== -1){
			span.classList.add('relevant_keyword');
		}
	});
	if(final){
		setTimeout(() => sam.search(sentence), 500);
		setTimeout(() => sWindow.destroy('nlp'), 2000);
	}
};

// nlp('the machine wants me to send a message to shaw', ['machine', 'shaw']);