
const
	body = document.querySelector('body'),
	html = document.querySelector('html'),
	menu = document.querySelectorAll('.header__burger, .header__nav, body'),
	headerNav = document.querySelector('.header__nav'),
	burger = document.querySelector('.header__burger'),
	aside = document.querySelector('.aside'),
	header = document.querySelector('.header');



function Popup(arg) {

	let body = document.querySelector('body'),
		html = document.querySelector('html'),
		saveHref = (typeof arg == 'object') ? (arg['saveHref']) ? true : false : false,
		popupCheck = true,
		popupCheckClose = true;

	const removeHash = function () {
		let uri = window.location.toString();
		if (uri.indexOf("#") > 0) {
			let clean_uri = uri.substring(0, uri.indexOf("#"));
			window.history.replaceState({}, document.title, clean_uri);
		}
	}

	const open = function (id, initStart) {

		if (popupCheck) {
			popupCheck = false;

			let popup = document.querySelector(id);

			if (popup) {

				if(popup.classList.contains('popup')) {

					popup.style.display = 'flex';

					body.classList.remove('_popup-active');
					html.style.setProperty('--popup-padding', window.innerWidth - body.offsetWidth + 'px');
					body.classList.add('_popup-active');

					if (saveHref) history.pushState('', "", id);

					setTimeout(() => {
						if (!initStart) {
							popup.classList.add('_active');
							function openFunc() {
								popupCheck = true;
								popup.removeEventListener('transitionend', openFunc);
							}
							popup.addEventListener('transitionend', openFunc)
						} else {
							popup.classList.add('_transition-none');
							popup.classList.add('_active');
							popup.style.display = 'flex';
							popupCheck = true;
						}

					}, 0)
				}

			} else {
				return new Error(`Not found "${id}"`)
			}
		}
	}

	const close = function (popupClose) {
		if (popupCheckClose) {
			popupCheckClose = false;

			let popup
			if (typeof popupClose === 'string') {
				popup = document.querySelector(popupClose)
			} else {
				popup = popupClose.closest('.popup');
			}

			if (popup.classList.contains('_transition-none')) popup.classList.remove('_transition-none')

			setTimeout(() => {
				popup.classList.remove('_active');
				function closeFunc() {
					const activePopups = document.querySelectorAll('.popup._active');

					if (activePopups.length < 1) {
						body.classList.remove('_popup-active');
						html.style.setProperty('--popup-padding', '0px');
					}

					if (saveHref) {
						removeHash();
						if (activePopups[activePopups.length - 1]) {
							history.pushState('', "", "#" + activePopups[activePopups.length - 1].getAttribute('id'));
						}
					}

					popupCheckClose = true;
					setTimeout(() => {
						popup.style.display = 'none';
					},100)
					popup.removeEventListener('transitionend', closeFunc)
				}

				popup.addEventListener('transitionend', closeFunc)

			}, 0)

		}
	}

	return {

		open: function (id) {
			open(id);
		},

		close: function (popupClose) {
			close(popupClose)
		},

		init: function () {

			let thisTarget
			body.addEventListener('click', function (event) {

				thisTarget = event.target;

				let popupOpen = thisTarget.closest('.open-popup');
				if (popupOpen) {
					event.preventDefault();
					open(popupOpen.getAttribute('href'))
				}

				let popupClose = thisTarget.closest('.popup-close');
				if (popupClose) {
					close(popupClose)
				}

			});

			if (saveHref) {
				let url = new URL(window.location);
				if (url.hash) {
					open(url.hash, true);
				}
			}
		},

	}
}

const popup = new Popup({
	saveHref: true, // false
});

popup.init()

// =-=-=-=-=-=-=-=-=-=- <image-aspect-ratio> -=-=-=-=-=-=-=-=-=-=-

const imageAspectRatio = document.querySelectorAll('.image-aspect-ratio, figure');
imageAspectRatio.forEach(imageAspectRatio => {
	const img = imageAspectRatio.querySelector('img'), style = getComputedStyle(imageAspectRatio);
	if (img) {
		if (img.getAttribute('width') && img.getAttribute('height') && style.position == "relative")
			imageAspectRatio.style.setProperty('--padding-aspect-ratio', Number(img.getAttribute('height')) / Number(img.getAttribute('width')) * 100 + '%');
	}

})


// =-=-=-=-=-=-=-=-=-=- <Get-device-type> -=-=-=-=-=-=-=-=-=-=-

const getDeviceType = () => {

	const ua = navigator.userAgent;
	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		return "tablet";
	}

	if (
		/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
			ua
		)
	) {
		return "mobile";
	}
	return "desktop";

};

// =-=-=-=-=-=-=-=-=-=- </Get-device-type> -=-=-=-=-=-=-=-=-=-=-


// =-=-=-=-=-=-=-=-=-=-=-=- <get-coords> -=-=-=-=-=-=-=-=-=-=-=-=

function getCoords(elem) {
	let box = elem.getBoundingClientRect();

	return {
		top: box.top + window.pageYOffset,
		right: box.right + window.pageXOffset,
		bottom: box.bottom + window.pageYOffset,
		left: box.left + window.pageXOffset
	};
}

// =-=-=-=-=-=-=-=-=-=-=-=- </get-coords> -=-=-=-=-=-=-=-=-=-=-=-=


// =-=-=-=-=-=-=-=-=-=- </image-aspect-ratio> -=-=-=-=-=-=-=-=-=-=-

document.querySelectorAll('.header__nav--list > li').forEach(li => {
	if (li.querySelector('ul')) li.classList.add('has-sub');
})

// =-=-=-=-=-=-=-=-=-=- <click events> -=-=-=-=-=-=-=-=-=-=-

body.addEventListener('click', function (event) {

	function $(elem) {
		return event.target.closest(elem)
	}

	// =-=-=-=-=-=-=-=-=-=- <open menu in header> -=-=-=-=-=-=-=-=-=-=-

	if ($('.header__burger') || $('.header__nav--background')) {
		menu.forEach(element => {
			element.classList.toggle('_mob-menu-active')
		})

		if (body.classList.contains('_mob-menu-active')) {
			headerNav.classList.remove('fade-out');
			headerNav.classList.add('fade-in');
		} else {
			headerNav.classList.add('fade-out');
			headerNav.classList.remove('fade-in');
		}
	}

	// =-=-=-=-=-=-=-=-=-=- </open menu in header> -=-=-=-=-=-=-=-=-=-=-



	// =-=-=-=-=-=-=-=-=-=-=-=- <header-drop-down> -=-=-=-=-=-=-=-=-=-=-=-=

	const headerNavListLink = $(".header__nav--list > li.has-sub > a")
	if (headerNavListLink) {

		if (getDeviceType() != "desktop" && !headerNavListLink.parentElement.classList.contains('_active')) {
			event.preventDefault();

			headerNavListLink.parentElement.classList.add('_active')
		}

	} else if (!$('.header__nav--list > li.has-sub')) {
		document.querySelectorAll('.header__nav--list > li._active').forEach(li => {
			li.classList.remove('_active')
		})
	}

	// =-=-=-=-=-=-=-=-=-=-=-=- </header-drop-down> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <change-theme> -=-=-=-=-=-=-=-=-=-=-=-=

	const changeThemeToDark = $(".change-theme-to-dark")
	if (changeThemeToDark) {

		localStorage.setItem('zatara-theme', 'dark');
		localStorage.setItem('zatara-theme-stroke', '#CCD0DE');
		html.classList.remove('light-theme')
		document.querySelectorAll('.change-theme-to-dark').forEach(changeThemeToDarkItem => {
			changeThemeToDarkItem.classList.add('_active')
		})

		document.querySelectorAll('.change-theme-to-light').forEach(changeThemeToLightItem => {
			changeThemeToLightItem.classList.remove('_active')
		})

		document.querySelectorAll('[data-change-string-on-dark]').forEach(changeString => {
			changeString.textContent = changeString.dataset.changeStringOnDark;
		})

	}

	const changeThemeToLight = $(".change-theme-to-light")
	if (changeThemeToLight) {

		localStorage.setItem('zatara-theme', 'light');
		localStorage.setItem('zatara-theme-stroke', '#CCD0DE');
		html.classList.add('light-theme')
		document.querySelectorAll('.change-theme-to-dark').forEach(changeThemeToDarkItem => {
			changeThemeToDarkItem.classList.remove('_active')
		})

		document.querySelectorAll('.change-theme-to-light').forEach(changeThemeToLightItem => {
			changeThemeToLightItem.classList.add('_active')
		})

		document.querySelectorAll('[data-change-string-on-light]').forEach(changeString => {
			changeString.textContent = changeString.dataset.changeStringOnLight;
		})

	}

	// =-=-=-=-=-=-=-=-=-=-=-=- </change-theme> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <change-lang> -=-=-=-=-=-=-=-=-=-=-=-=

	const changeLangTarget = $(".change-lang__target")
	if (changeLangTarget) {

		changeLangTarget.classList.toggle('_active')

	} else if (!$(".change-lang")) {
		document.querySelectorAll('.change-lang__target._active').forEach(activeChangeLang => {
			activeChangeLang.classList.remove('_active');
		})
	}

	// =-=-=-=-=-=-=-=-=-=-=-=- </change-lang> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <add-to-favorite-btn> -=-=-=-=-=-=-=-=-=-=-=-=

	const coinsTableAddToFavoriteBtn = $(".coins-table__add-to-favorite--btn")
	if (coinsTableAddToFavoriteBtn) {

		coinsTableAddToFavoriteBtn.classList.toggle('_active')

	}

	// =-=-=-=-=-=-=-=-=-=-=-=- </add-to-favorite-btn> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <FAQ> -=-=-=-=-=-=-=-=-=-=-=-=

	const faqQuestion = $(".faq__question")
	if (faqQuestion) {

		if (faqQuestion.parentElement.classList.contains('_active')) {
			faqQuestion.parentElement.classList.remove('_active');
		} else {
			document.querySelectorAll('.faq__item._active').forEach(item => {
				item.classList.remove('_active')
			});

			faqQuestion.parentElement.classList.add('_active');
		}

	}


	const faqNavItemLink = $('.faq__nav--item a');
	if (faqNavItemLink) {
		event.preventDefault();
		const block = document.querySelector(faqNavItemLink.getAttribute('href'));
		window.scrollTo({
			left: 0, top: getCoords(block).top - header.offsetHeight, behavior: "smooth"
		})
		//block.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
	}

	// =-=-=-=-=-=-=-=-=-=-=-=- </FAQ> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <switch> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const forgotPasswordSwitchBtn = $(".forgot-password__switch--btn")
	if(forgotPasswordSwitchBtn) {

		event.preventDefault();
	
		if(!forgotPasswordSwitchBtn.classList.contains('_active')) {

			forgotPasswordSwitchBtn.parentElement.querySelector('.forgot-password__switch--btn._active').classList.remove('_active');
			forgotPasswordSwitchBtn.classList.add('_active')

			const target = document.querySelector(forgotPasswordSwitchBtn.getAttribute('href')),
			activeTarget = target.parentElement.querySelector('._active');

			target.classList.add('_active');
			activeTarget.classList.remove('_active');

		}
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </switch> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <header-account-drop-down> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const headerAccountTarget = $(".header__account--target")
	if(headerAccountTarget) {
	
		headerAccountTarget.parentElement.classList.toggle('_active');
	
	} else if(!$(".header__account")) {
		if(document.querySelector(".header__account._active")) document.querySelector(".header__account._active").classList.remove('_active')
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </header-account-drop-down> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <coins-table-nav> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const coinsTable2NavArrow = $(".coins-table-2__nav--arrow")
	if(coinsTable2NavArrow) {
	
		const td = coinsTable2NavArrow.closest('.coins-table-2').querySelector('tbody tr').querySelectorAll('td');
		let scrollNextCheck = false, scrollPrevCheck = false;
		if(coinsTable2NavArrow.classList.contains('_next')) {
			td.forEach(td => {
				if(getCoords(td).left > 1 && !scrollNextCheck) {
					scrollNextCheck = true;
					td.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
				}
			})
		} else if(coinsTable2NavArrow.classList.contains('_prev')) {
			Array.from(td).reverse().forEach(td => {
				
				if(getCoords(td).left <= -10 && !scrollPrevCheck && !td.classList.contains('visible-on-desktop')) {
					scrollPrevCheck = true;
					td.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
				}
			})
		}

	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </coins-table-nav> -=-=-=-=-=-=-=-=-=-=-=-=

	

})

// =-=-=-=-=-=-=-=-=-=- </click events> -=-=-=-=-=-=-=-=-=-=-







if (localStorage.getItem('zatara-theme') != "light") {

	document.querySelectorAll('.change-theme-to-dark').forEach(changeThemeToDark => {
		changeThemeToDark.classList.add('_active')
	})

	document.querySelectorAll('[data-change-string-on-dark]').forEach(changeString => {
		changeString.textContent = changeString.dataset.changeStringOnDark;
	})

} else {

	document.querySelectorAll('.change-theme-to-light').forEach(changeThemeToLight => {
		changeThemeToLight.classList.add('_active')
	})

	document.querySelectorAll('[data-change-string-on-light]').forEach(changeString => {
		changeString.textContent = changeString.dataset.changeStringOnLight;
	})

}


// =-=-=-=-=-=-=-=-=-=-=-=- <resize> -=-=-=-=-=-=-=-=-=-=-=-=

let resizeCheck = {}, windowSize;

function resizeCheckFunc(size, minWidth, maxWidth) {
	if (windowSize <= size && (resizeCheck[String(size)] == true || resizeCheck[String(size)] == undefined) && resizeCheck[String(size)] != false) {
		resizeCheck[String(size)] = false;
		maxWidth(); // < size
	}

	if (windowSize >= size && (resizeCheck[String(size)] == false || resizeCheck[String(size)] == undefined) && resizeCheck[String(size)] != true) {
		resizeCheck[String(size)] = true;
		minWidth(); // > size
	}
}

const appendToOnTablet = document.querySelectorAll("[data-append-to]"),
	appendToOnTabletArray = [];

appendToOnTablet.forEach(appendToOnTablet => {
	appendToOnTablet.style.display = "none";
	appendToOnTabletArray.push({
		element: appendToOnTablet,
		parent: appendToOnTablet.parentElement,
		appendAddress: document.querySelector(appendToOnTablet.dataset.appendTo),
	})
})

let toRegistrationSlider;



function resize() {

	if(aside) html.style.setProperty('--height-aside', aside.offsetHeight + 'px');
	html.style.setProperty("--height-header", header.offsetHeight + "px");
	html.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
	if (windowSize != window.innerWidth) {
		html.style.setProperty("--svh", window.innerHeight * 0.01 + "px");
	}

	windowSize = window.innerWidth

	resizeCheckFunc(992,
		function () {  // screen > 992px

			Array.from(appendToOnTabletArray).forEach(appendElement => {
				appendElement["element"].style.display = "none";
				appendElement["parent"].append(appendElement["element"]);
				appendElement["element"].style.removeProperty('display');
			})



		},
		function () {  // screen < 992px

			Array.from(appendToOnTabletArray).forEach(appendElement => {
				appendElement["element"].style.display = "none";
				appendElement["appendAddress"].append(appendElement["element"]);
				appendElement["element"].style.removeProperty('display');
			})

		}
	);

}

resize();

window.onresize = resize;

html.style.setProperty("--height-header", header.offsetHeight + "px");

// =-=-=-=-=-=-=-=-=-=-=-=- <FAQ> -=-=-=-=-=-=-=-=-=-=-=-=

const faqNavItemLink = document.querySelectorAll('.faq__nav--item a');



// =-=-=-=-=-=-=-=-=-=-=-=- </FAQ> -=-=-=-=-=-=-=-=-=-=-=-=


// =-=-=-=-=-=-=-=-=-=-=-=- </resize> -=-=-=-=-=-=-=-=-=-=-=-=

let customSelectsArray = [];

document.querySelectorAll('form').forEach(form => {
	form.addEventListener('reset', function () {
		//console.log(customSelectsArray)
		Array.from(customSelectsArray).forEach((customSelectItem, index) => {
			if(customSelectItem['selectEl'].closest('form') == form) {
				customSelectItem.setSelected(customSelectItem.getData()[0]['value'])
			}
		})
		/* const customSelects = form.querySelectorAll('.custom-select, .custom-select-2');
		customSelects.forEach(customSelect => {
			new SlimSelect({
				select: customSelect,
				settings: {
					showSearch: false,
				}
			})
		}) */
	})
})


document.querySelectorAll('.custom-select, .custom-select-2, .custom-select-3').forEach((select, index) => {
	customSelectsArray[index] = new SlimSelect({
		select: select,
		settings: {
			showSearch: false,
		}
	})
})

document.querySelectorAll('[data-simplebar]').forEach(customScrollbar => {
	new SimpleBar(customScrollbar, {
		autoHide: false
	})
})

let scrollProgress = window.pageYOffset, faqItemCheck = [];

function scroll() {
	scrollProgress = window.pageYOffset;
	if (scrollProgress && header.classList.contains('_on-top')) {
		header.classList.remove('_on-top');
	} else if (scrollProgress <= 0 && !header.classList.contains('_on-top')) {
		header.classList.add('_on-top');
	}

	faqNavItemLink.forEach((link, index) => {
		const block = document.querySelector(link.getAttribute('href'));
		if (block.getBoundingClientRect().y <= header.offsetHeight) {
			block.classList.add('_scrolled');
		} else {
			block.classList.remove('_scrolled');
		}
	})

	if (document.querySelector('._scrolled')) {

		const blocks = document.querySelectorAll('._scrolled');
		if (!document.querySelector(`#${blocks[blocks.length - 1].getAttribute('id')}`).classList.contains('_current')) {
			faqNavItemLink.forEach(link => {
				link.classList.remove('_current');
			})
			document.querySelector(`a[href="#${blocks[blocks.length - 1].getAttribute('id')}"]`).classList.add('_current');
		}
	}
}

scroll();

window.addEventListener('scroll', scroll)

// =-=-=-=-=-=-=-=-=-=-=-=- <slider> -=-=-=-=-=-=-=-=-=-=-=-=

if (document.querySelector('.footer__marquee')) {

	const footerMarquee = new Splide('.footer__marquee', {
		type: 'loop',
		drag: false,
		focus: 'center',
		perPage: 4,
		gap: 4,
		autoScroll: {
			speed: 0.5,
		},
		arrows: false,
		pagination: false,

		breakpoints: {
			1100: {
				perPage: 3,
			},
			768: {
				perPage: 2,
			},
			550: {
				perPage: 1,
			}
		}

	});

	footerMarquee.mount(window.splide.Extensions);

}

if (document.querySelector('.to-registration__slider')) {

	const toRegistrationSlider = new Splide('.to-registration__slider', {
		updateOnMove: true,
		perPage: 1,
		gap: 4,
		arrows: false,
		pagination: false,
		mediaQuery: 'min',
		destroy: false,

		breakpoints: {
			550: {
				perPage: 2,
			},
			992: {
				//perPage: 2,
				destroy: true,
			},
		}

	});

	const bar = document.querySelector('.to-registration__slider-progress--bar');

	toRegistrationSlider.on('mounted move', function () {
		var end = toRegistrationSlider.Components.Controller.getEnd() + 1;
		var rate = Math.min((toRegistrationSlider.index + 1) / end, 1);
		bar.style.width = String(100 * rate) + '%';
	});

	toRegistrationSlider.mount();

}

if (document.querySelector('.faq__nav')) {

	const faqNav = new Splide('.faq__nav', {

		//perPage: "auto",
		autoWidth: true,
		mediaQuery: "min",
		arrows: false,
		pagination: false,

		breakpoints: {
			992: {
				destroy: true
			}
		}

	});

	faqNav.mount();

}

// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <arrows-draw> -=-=-=-=-=-=-=-=-=-=-=-=


const arrowCanvas = document.querySelectorAll('.arrow-canvas');

function drawArrowIcon(x, y, ctx, dir) {
	if(dir == "left") {
		ctx.moveTo(x+5, y-5);
		ctx.lineTo(x+5, y-5);
		ctx.lineTo(x, y);
		ctx.lineTo(x+5, y+5);
	} else if(dir == "right") {
		ctx.moveTo(x-5, y-5);
		ctx.lineTo(x-5, y-5);
		ctx.lineTo(x, y);
		ctx.lineTo(x-5, y+5);
	} else if(dir == "bottom") {
		ctx.moveTo(x-5, y-5);
		ctx.lineTo(x-5, y-5);
		ctx.lineTo(x, y);
		ctx.lineTo(x+5, y-5);
	} else if(dir == "top") {
		ctx.moveTo(x-5, y+5);
		ctx.lineTo(x-5, y+5);
		ctx.lineTo(x, y);
		ctx.lineTo(x+5, y+5);
	}
}

function drawStartIcon(x, y, ctx) {
	ctx.moveTo(x+5, y);
	ctx.arc(x, y, 4, 0, 2 * Math.PI);
	ctx.moveTo(x+5, y);
}

function drawArrow(arg) {
	let canvas = arg.canvas,
		arrowItems = arg.arrowItems;
	if (canvas.getContext) {

		let width = canvas.offsetWidth,
			height = canvas.offsetHeight;

		let ctx = canvas.getContext('2d');

		ctx.canvas.width = canvas.offsetWidth;
		ctx.canvas.height = canvas.offsetHeight;

		let lineWidth = 2/* , 
		angleSize = (arg.angleSize) ? arg.angleSize : 55, outerCircleSize = 20, 
		dashArray = (arg.dashArray) ? arg.dashArray : [10, 10],
		lastLine = (arg.lastLine) ? arg.lastLine : 1 */;

		//lastLine = lastLine / 100 * canvas.offsetHeight;
		
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = localStorage.getItem('zatara-theme-stroke') ? localStorage.getItem('zatara-theme-stroke') : '#C7C7C7';

		arrowItems.forEach(arrowItem => {
			
			ctx.beginPath();

			const arrowItemCoords = {
				x: arrowItem.offsetLeft,
				y: arrowItem.offsetTop,
				width: arrowItem.offsetWidth,
				height: arrowItem.offsetHeight,
			};

			if(windowSize >= 992 && arrowItem.dataset.arrowTo) {

				let arrowToArray = arrowItem.dataset.arrowTo.split('; ');

				for(let index = 0; index < arrowToArray.length; index++) {

					arrowToArray[index] = arrowToArray[index].substring(1);
					arrowToArray[index] = arrowToArray[index].slice(0,-1);
					arrowToArray[index] = arrowToArray[index].split(', ')					

					const arrowTo = document.querySelector(`[data-arrow-id="${arrowToArray[index][0]}"]`);		
					
		
					const arrowToCoords = {
						x: arrowTo.offsetLeft,
						y: arrowTo.offsetTop,
						width: arrowTo.offsetWidth,
						height: arrowTo.offsetHeight,
					};
		
					if (arrowToArray[index][1] == 'right') {
						ctx.moveTo(arrowItemCoords['x'] + arrowItemCoords['width']+5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2)
						ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']+5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
						if (arrowToArray[index][2] == 'left' && Math.floor(arrowItemCoords['y'] + arrowItemCoords['height'] / 2) == Math.floor(arrowToCoords['y'] + arrowToCoords['height'] / 2)) {
							ctx.lineTo(arrowToCoords['x'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
							drawArrowIcon(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "right")
							if(arrowToArray[index][3] == "doubleArrows") {
								drawArrowIcon(arrowItemCoords['x'] + arrowItemCoords['width'] + 5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx, "left")
							} else {
								drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
							}
						} else if(arrowToArray[index][2] == 'right') {
							if(arrowItemCoords['y'] < arrowToCoords['y']) {
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] + 20, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] + 20, 
								arrowItemCoords['y'] + arrowItemCoords['height'] / 2 + 5, 
								5, 
								getRadians(270), getRadians(360), false);
		
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] + 20 + 5, arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5);
		
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] + 20, 
								arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5, 
								5, 
								getRadians(360), getRadians(90), false);
		
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "left")
								if(arrowToArray[index][3] != "noneStartPoint") {
									drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
								}

							} else if(arrowItemCoords['y'] > arrowToCoords['y']) {
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] + 20, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] + 20, 
								arrowItemCoords['y'] + arrowItemCoords['height'] / 2 - 5, 
								5, 
								getRadians(90), getRadians(360), true);
		
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] + 20 + 5, arrowToCoords['y'] + 10 + arrowToCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] + 20, 
								arrowToCoords['y'] + arrowToCoords['height'] / 2 + 5, 
								5, 
								getRadians(0), getRadians(270), true);
		
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "left")
								if(arrowToArray[index][3] != "noneStartPoint") {
									drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
								}
								
							}
						}
					} else if (arrowToArray[index][1] == 'left') {
						ctx.moveTo(arrowItemCoords['x'] - 5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2)
						ctx.lineTo(arrowItemCoords['x'] - 5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
						
						if (arrowToArray[index][2] == 'right' && Math.floor(arrowItemCoords['y'] + arrowItemCoords['height'] / 2) == Math.floor(arrowToCoords['y'] + arrowToCoords['height'] / 2)) {
							ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
							drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "left")
							if(arrowToArray[index][3] == "doubleArrows") {
								drawArrowIcon(arrowItemCoords['x'] - 5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx, "right")
							} else {
								drawStartIcon(arrowItemCoords['x'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
							}
						} else if(arrowToArray[index][2] == 'right' && arrowItemCoords['x'] > arrowToCoords['x']) {
							let padding = arrowItem.classList.contains('_min-padding') && arrowToArray[index][3] != "noneMinPadding" ? 15 : 35;
							ctx.lineTo(arrowItemCoords['x'] - padding, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
							ctx.arc(
							arrowItemCoords['x'] - padding - 5, 
							arrowItemCoords['y'] + arrowItemCoords['height'] / 2 - 5, 
							5, 
							getRadians(90), getRadians(180), false);
							//ctx.lineTo(arrowItemCoords['x'] - padding - 10, arrowToCoords['y'] + arrowToCoords['height'] / 2) + 100;
							ctx.arc(
							arrowItemCoords['x'] - padding - 15, 
							arrowToCoords['y'] + arrowToCoords['height'] / 2 + 5, 
							5, 
							getRadians(0), getRadians(270), true);
							ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
							drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "left")
							if(arrowToArray[index][3] != "noneStartPoint") {
								drawStartIcon(arrowItemCoords['x'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
							}
						} else if(arrowToArray[index][2] == 'left') {
							
							if(arrowItemCoords['y'] < arrowToCoords['y']) {
								ctx.lineTo(arrowItemCoords['x'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] - 20, 
								arrowItemCoords['y'] + arrowItemCoords['height'] / 2 + 5, 
								5, 
								getRadians(270), getRadians(180), true);
		
								ctx.lineTo(arrowItemCoords['x'] - 20 - 5, arrowToCoords['y'] + arrowToCoords['height'] / 2 - 10);
		
								ctx.arc(
								arrowItemCoords['x'] - 20, 
								arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5, 
								5, 
								getRadians(180), getRadians(90), true);
		
								ctx.lineTo(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
								drawArrowIcon(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "right")

								if(arrowToArray[index][3] == "doubleArrows") {
									drawArrowIcon(arrowItemCoords['x'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx, "right")
								} else if(arrowToArray[index][3] != "noneStartPoint") {
									drawStartIcon(arrowItemCoords['x'] - 5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
								}
								
							} else if(arrowItemCoords['y'] > arrowToCoords['y']) {
								
								ctx.lineTo(arrowItemCoords['x'] - 20, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] - 20, 
								arrowItemCoords['y'] + arrowItemCoords['height'] / 2 - 5, 
								5, 
								getRadians(90), getRadians(180), false);
		
								ctx.lineTo(arrowItemCoords['x'] - 20 - 5, arrowToCoords['y'] + 10 + arrowToCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] - 20, 
								arrowToCoords['y'] + arrowToCoords['height'] / 2 + 5, 
								5, 
								getRadians(180), getRadians(270), false);
		
								ctx.lineTo(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
								drawArrowIcon(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "right")
								if(arrowToArray[index][2] != "noneStartPoint") {
									drawStartIcon(arrowItemCoords['x'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
								}
							}

						} else if(arrowToArray[index][2] == 'bottom') {

							ctx.arc(
							arrowToCoords['x'] + arrowToCoords['width'] / 2 + 5, 
							arrowItemCoords['y'] + arrowItemCoords['height'] / 2 - 5, 
							5, 
							getRadians(90), getRadians(180), false);
							ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowToCoords['y'] + arrowToCoords['height']);
							drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowToCoords['y'] + arrowToCoords['height'], ctx, "top")
							if(arrowToArray[index][3] != "noneStartPoint") {
								drawStartIcon(arrowItemCoords['x'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
							}
						}
					} else if (arrowToArray[index][1] == 'bottom') {
						ctx.moveTo(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'] + 5);
						ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'] + 5);

						if(arrowToArray[index][2] == 'top') {

							if(arrowItemCoords['x'] + arrowItemCoords['width']/2 == arrowToCoords['x'] + arrowToCoords['width']/2) {
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowToCoords['y']);
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowToCoords['y'], ctx, "bottom")
								if(arrowToArray[index][3] == "doubleArrows") {
									drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'] + 5, ctx, "top")
								} else {
									drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'], ctx)
								}
							} else if(arrowItemCoords['x'] + arrowItemCoords['width']/2 > arrowToCoords['x'] + arrowToCoords['width']/2) {
								let padding = arrowItem.classList.contains('_min-padding') ? 15 : 35;

								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowItemCoords['y'] + arrowItemCoords['height'] + padding);
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] / 2 - 5, 
								arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 5, 
								5, 
								getRadians(360), getRadians(90), false);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2 + 7.5, arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 10);
								ctx.arc(
								arrowToCoords['x'] + arrowToCoords['width'] / 2 + 7.5, 
								arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 15, 
								5, 
								getRadians(270), getRadians(180), true);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2 + 2.5, arrowToCoords['y']);
								
								drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'], ctx)
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2 + 2.5, arrowToCoords['y'], ctx, "bottom")

							} else if(arrowItemCoords['x'] + arrowItemCoords['width']/2 < arrowToCoords['x'] + arrowToCoords['width']/2) {
								let padding = arrowItem.classList.contains('_min-padding') ? 15 : 35;

								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowItemCoords['y'] + arrowItemCoords['height'] + padding);
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] / 2 + 5, 
								arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 5, 
								5, 
								getRadians(180), getRadians(90), true);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2 - 2.5, arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 10);
								ctx.arc(
								arrowToCoords['x'] + arrowToCoords['width'] / 2 - 2.5, 
								arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 15, 
								5, 
								getRadians(270), getRadians(0), false);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2 + 2.5, arrowToCoords['y']);
								drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'], ctx)
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2 + 2.5, arrowToCoords['y'], ctx, "bottom")
							}
							
						} else if(arrowToArray[index][2] == 'left') {

							let padding = arrowItem.classList.contains('_min-padding') ? 15 : 35;

							ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowItemCoords['y'] + arrowItemCoords['height'] + padding);
							ctx.arc(
							arrowItemCoords['x'] + arrowItemCoords['width'] / 2 - 5, 
							arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 5, 
							5, 
							getRadians(360), getRadians(90), false);
							ctx.lineTo(arrowToCoords['x'] - padding, arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 10);
							ctx.arc(
							arrowToCoords['x'] - padding, 
							arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 15, 
							5, 
							getRadians(270), getRadians(180), true);
							if(padding == 10) {
								ctx.lineTo(arrowToCoords['x'] - padding - padding, arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5);
							} else {
								ctx.lineTo(arrowToCoords['x'] - padding - 5, arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5);
							}
							
							ctx.arc(
							arrowToCoords['x'] - (padding), 
							arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5, 
							5, 
							getRadians(180), getRadians(90), true);
							ctx.lineTo(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
							drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'], ctx)
							drawArrowIcon(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "right")

						} else if(arrowToArray[index][2] == 'right') {

							let padding = arrowItem.classList.contains('_min-padding') ? 15 : 35;

							ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowItemCoords['y'] + arrowItemCoords['height'] + padding);
							ctx.arc(
							arrowItemCoords['x'] + arrowItemCoords['width'] / 2 + 5, 
							arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 5, 
							5, 
							getRadians(180), getRadians(90), true);
							ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] + padding - 2, arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 10);
							ctx.arc(
							arrowToCoords['x'] + arrowToCoords['width'] + padding - 2, 
							arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 15, 
							5, 
							getRadians(270), getRadians(0), false);
							ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] + padding + 3, arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5);
							ctx.arc(
							arrowToCoords['x'] + arrowToCoords['width'] + padding - 2, 
							arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5, 
							5, 
							getRadians(0), getRadians(-270), false);
							ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
							drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'], ctx)
							drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "left")
						}
					} else if(arrowToArray[index][1] == 'top') {
						ctx.moveTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowItemCoords['y'] - 5);
						if(arrowToArray[index][2] == 'bottom') {
							if(arrowItemCoords['x'] > arrowToCoords['x']) {
								let padding = arrowItem.classList.contains('_min-padding') ? 20 : 35;

								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowItemCoords['y'] - padding);
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] / 2 - 5, 
								arrowItemCoords['y'] - padding - 5, 
								5, 
								getRadians(0), getRadians(270), true);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2 + 5, arrowItemCoords['y'] - padding - 10);
								ctx.arc(
								arrowToCoords['x'] + arrowToCoords['width'] / 2 + 5, 
								arrowItemCoords['y'] - padding - 15, 
								5, 
								getRadians(90), getRadians(180), false);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowToCoords['y'] + arrowToCoords['height']);
								
								drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'], ctx)
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowToCoords['y'] + arrowToCoords['height'], ctx, "top")
							}
						}
					}
				}
				
			} else if(windowSize < 992 && arrowItem.dataset.mobArrowTo) {
				
				let arrowToArray = arrowItem.dataset.mobArrowTo.split('; ');

				for(let index = 0; index < arrowToArray.length; index++) {

					arrowToArray[index] = arrowToArray[index].substring(1);
					arrowToArray[index] = arrowToArray[index].slice(0,-1);
					arrowToArray[index] = arrowToArray[index].split(', ')					

					const arrowTo = document.querySelector(`[data-arrow-id="${arrowToArray[index][0]}"]`);
		
					const arrowToCoords = {
						x: arrowTo.offsetLeft,
						y: arrowTo.offsetTop,
						width: arrowTo.offsetWidth,
						height: arrowTo.offsetHeight,
					};
					
					if (arrowToArray[index][1] == 'bottom') {
						ctx.moveTo(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'] + 5);
						ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'] + 5);

						if(arrowToArray[index][2] == 'top') {
							if(Math.round(arrowItemCoords['x'] + arrowItemCoords['width']/2)-1 > Math.round(arrowToCoords['x'] + arrowToCoords['width']/2)) {
								let padding = 15;

								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowItemCoords['y'] + arrowItemCoords['height'] + padding);
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] / 2 - 5, 
								arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 5, 
								5, 
								getRadians(360), getRadians(90), false);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2 + 7.5, arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 10);
								ctx.arc(
								arrowToCoords['x'] + arrowToCoords['width'] / 2 + 7.5, 
								arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 15, 
								5, 
								getRadians(270), getRadians(180), true);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2 + 2.5, arrowToCoords['y']);
								
								drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'], ctx)
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2 + 2.5, arrowToCoords['y'], ctx, "bottom")

							} else if(Math.round(arrowItemCoords['x'] + arrowItemCoords['width']/2) < Math.round(arrowToCoords['x'] + arrowToCoords['width']/2)-1) {
								let padding = 15;

								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowItemCoords['y'] + arrowItemCoords['height'] + padding);
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] / 2 + 5, 
								arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 5, 
								5, 
								getRadians(180), getRadians(90), true);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2 - 2.5, arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 10);
								ctx.arc(
								arrowToCoords['x'] + arrowToCoords['width'] / 2 - 2.5, 
								arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 15, 
								5, 
								getRadians(270), getRadians(0), false);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2 + 2.5, arrowToCoords['y']);
								drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'], ctx)
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2 + 2.5, arrowToCoords['y'], ctx, "bottom")

							} else if(Math.abs(Math.floor(arrowItemCoords['x'] + arrowItemCoords['width']/2)) - Math.floor(arrowToCoords['x'] + arrowToCoords['width']/2) <= 10) {
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowToCoords['y']);
								drawArrowIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowToCoords['y'], ctx, "bottom")
								if(arrowToArray[index][3] == "doubleArrows") {
									drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'] + 5, ctx, "top")
								} else {
									drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'], ctx)
								}
							}


						} else if(arrowToArray[index][2] == 'bottom') {
							
							if(arrowItemCoords['x'] < arrowToCoords['x'] && Math.floor(arrowItemCoords['y']) == Math.floor(arrowItemCoords['y'])) {

								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowToCoords['y'] + 40);
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] / 2 + 5, 
								arrowItemCoords['y'] + 40 + 5, 
								5, 
								getRadians(180), getRadians(90), true);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width']/2 - 5, arrowToCoords['y'] + 40 + 10);
								ctx.arc(
								arrowToCoords['x'] + arrowToCoords['width'] / 2 - 5, 
								arrowItemCoords['y'] + 40 + 5, 
								5, 
								getRadians(90), getRadians(0), true);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width']/2, arrowToCoords['y'] + arrowToCoords['height'] + 5);
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowToCoords['y'] + arrowToCoords['height'] + 5, ctx, "top")

							} else if(arrowItemCoords['x'] > arrowToCoords['x'] && Math.floor(arrowItemCoords['y']) == Math.floor(arrowItemCoords['y'])) {
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowToCoords['y'] + 40);
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] / 2 - 5, 
								arrowItemCoords['y'] + 40 + 5, 
								5, 
								getRadians(360), getRadians(90), false);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width']/2 + 5, arrowToCoords['y'] + 40 + 10);
								ctx.arc(
								arrowToCoords['x'] + arrowToCoords['width'] / 2 + 5, 
								arrowItemCoords['y'] + 40 + 5, 
								5, 
								getRadians(90), getRadians(180), false);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width']/2, arrowToCoords['y'] + arrowToCoords['height'] + 5);
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowToCoords['y'] + arrowToCoords['height'] + 5, ctx, "top")
							}
						} else if(arrowToArray[index][2] == 'left') {

							let padding = 15;

							ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowItemCoords['y'] + arrowItemCoords['height'] + padding);
							ctx.arc(
							arrowItemCoords['x'] + arrowItemCoords['width'] / 2 - 5, 
							arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 5, 
							5, 
							getRadians(360), getRadians(90), false);
							ctx.lineTo(arrowToCoords['x'] - padding, arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 10);
							ctx.arc(
							arrowToCoords['x'] - padding, 
							arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 15, 
							5, 
							getRadians(270), getRadians(180), true);
							if(padding == 10) {
								ctx.lineTo(arrowToCoords['x'] - padding - padding, arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5);
							} else {
								ctx.lineTo(arrowToCoords['x'] - padding - 5, arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5);
							}
							
							ctx.arc(
							arrowToCoords['x'] - (padding), 
							arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5, 
							5, 
							getRadians(180), getRadians(90), true);
							ctx.lineTo(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
							drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'], ctx)
							drawArrowIcon(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "right")

						} else if(arrowToArray[index][2] == 'right') {

							let padding = 15;

							ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowItemCoords['y'] + arrowItemCoords['height'] + padding);
							ctx.arc(
							arrowItemCoords['x'] + arrowItemCoords['width'] / 2 + 5, 
							arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 5, 
							5, 
							getRadians(180), getRadians(90), true);
							ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] + padding - 2, arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 10);
							ctx.arc(
							arrowToCoords['x'] + arrowToCoords['width'] + padding - 2, 
							arrowItemCoords['y'] + arrowItemCoords['height'] + padding + 15, 
							5, 
							getRadians(270), getRadians(0), false);
							ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] + padding + 3, arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5);
							ctx.arc(
							arrowToCoords['x'] + arrowToCoords['width'] + padding - 2, 
							arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5, 
							5, 
							getRadians(0), getRadians(-270), false);
							ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
							drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] + arrowItemCoords['height'], ctx)
							drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "left")
						}

						/* if (arrowToArray[index][2] == 'left' && Math.floor(arrowItemCoords['y'] + arrowItemCoords['height'] / 2) == Math.floor(arrowToCoords['y'] + arrowToCoords['height'] / 2)) {
							ctx.lineTo(arrowToCoords['x'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
							drawArrowIcon(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "right")
							if(arrowToArray[index][3] == "doubleArrows") {
								drawArrowIcon(arrowItemCoords['x'] + arrowItemCoords['width'] + 5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx, "left")
							} else {
								drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
							}
						} else if(arrowToArray[index][2] == 'right') {
							if(arrowItemCoords['y'] < arrowToCoords['y']) {
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] + 20, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] + 20, 
								arrowItemCoords['y'] + arrowItemCoords['height'] / 2 + 5, 
								5, 
								getRadians(270), getRadians(360), false);
		
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] + 20 + 5, arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5);
		
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] + 20, 
								arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5, 
								5, 
								getRadians(360), getRadians(90), false);
		
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "left")
							} else if(arrowItemCoords['y'] > arrowToCoords['y']) {
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] + 20, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] + 20, 
								arrowItemCoords['y'] + arrowItemCoords['height'] / 2 - 5, 
								5, 
								getRadians(90), getRadians(360), true);
		
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] + 20 + 5, arrowToCoords['y'] + 10 + arrowToCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] + 20, 
								arrowToCoords['y'] + arrowToCoords['height'] / 2 + 5, 
								5, 
								getRadians(0), getRadians(270), true);
		
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "left")
							}
						} */
					} else if (arrowToArray[index][1] == 'left') {
						ctx.moveTo(arrowItemCoords['x'] - 5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2)
						ctx.lineTo(arrowItemCoords['x'] - 5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);

						if (arrowToArray[index][2] == 'right' && Math.floor(arrowItemCoords['y'] + arrowItemCoords['height'] / 2) == Math.floor(arrowToCoords['y'] + arrowToCoords['height'] / 2)) {
							ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
							drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "left")
							if(arrowToArray[index][3] == "doubleArrows") {
								drawArrowIcon(arrowItemCoords['x'] - 5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx, "right")
							} else {
								drawStartIcon(arrowItemCoords['x'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
							}
						} else if(arrowToArray[index][2] == 'left') {
							
							if(arrowItemCoords['y'] < arrowToCoords['y']) {
								ctx.lineTo(arrowItemCoords['x'] - 20, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] - 20, 
								arrowItemCoords['y'] + arrowItemCoords['height'] / 2 + 5, 
								5, 
								getRadians(270), getRadians(180), true);
		
								ctx.lineTo(arrowItemCoords['x'] - 20 - 5, arrowToCoords['y'] + arrowToCoords['height'] / 2 - 10);
		
								ctx.arc(
								arrowItemCoords['x'] - 20, 
								arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5, 
								5, 
								getRadians(180), getRadians(90), true);
		
								ctx.lineTo(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
								drawArrowIcon(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "right")
								
							} else if(arrowItemCoords['y'] > arrowToCoords['y']) {
								
								ctx.lineTo(arrowItemCoords['x'] - 10, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] - 15, 
								arrowItemCoords['y'] + arrowItemCoords['height'] / 2 - 5, 
								5, 
								getRadians(90), getRadians(180), false);
		
								ctx.lineTo(arrowItemCoords['x'] - 20, arrowToCoords['y'] + 10 + arrowToCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] - 15, 
								arrowToCoords['y'] + arrowToCoords['height'] / 2 + 5, 
								5, 
								getRadians(180), getRadians(270), false);
		
								ctx.lineTo(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
								drawArrowIcon(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "right")
								if(arrowToArray[index][3] != "noneStartPoint") {
									drawStartIcon(arrowItemCoords['x'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
								}
							}
						}
					} else if (arrowToArray[index][1] == 'top') {
						ctx.moveTo(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] - 5);
						ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] - 5);
						if(arrowToArray[index][2] == 'bottom') {
							if(arrowItemCoords['x'] > arrowToCoords['x']) {
								let padding = arrowItem.classList.contains('_min-padding') ? 20 : 35;

								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowItemCoords['y'] - padding);
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] / 2 - 5, 
								arrowItemCoords['y'] - padding - 5, 
								5, 
								getRadians(0), getRadians(270), true);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2 + 5, arrowItemCoords['y'] - padding - 10);
								ctx.arc(
								arrowToCoords['x'] + arrowToCoords['width'] / 2 + 5, 
								arrowItemCoords['y'] - padding - 15, 
								5, 
								getRadians(90), getRadians(180), false);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowToCoords['y'] + arrowToCoords['height']);
								
								drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'], ctx)
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowToCoords['y'] + arrowToCoords['height'], ctx, "top")
							} else {
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']/2, arrowToCoords['y'] + arrowToCoords['height']);
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowToCoords['y'] + arrowToCoords['height'], ctx, "top")
								if(arrowToArray[index][3] == "doubleArrows") {
									drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowItemCoords['y'] - 5, ctx, "bottom")
								} else {
									drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'], ctx)
								}
							}
							
						} else if(arrowToArray[index][2] == 'top') {
							
							if(arrowItemCoords['x'] < arrowToCoords['x'] && Math.floor(arrowItemCoords['y']) == Math.floor(arrowToCoords['y'])) {
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] - 30);
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] / 2 + 5, 
								arrowItemCoords['y'] - 30, 
								5, 
								getRadians(180), getRadians(270), false);
		
								ctx.lineTo(arrowToCoords['x'] - arrowToCoords['width'] / 2, arrowToCoords['y'] - 30 - 5);
								ctx.arc(
								arrowToCoords['x'] + arrowToCoords['width'] / 2 - 5, 
								arrowToCoords['y'] - 30, 
								5, 
								getRadians(270), getRadians(360), false);
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowToCoords['y'] - 5);
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'] / 2, arrowItemCoords['y'] - 5, ctx, "bottom")
							
								if(arrowToArray[index][3] == "doubleArrows") {
									drawArrowIcon(arrowItemCoords['x'] + arrowItemCoords['width'] / 2, arrowItemCoords['y'] - 5, ctx, "bottom")
								} else if(arrowToArray[index][3] != "noneStartPoint") {
									drawStartIcon(arrowItemCoords['x'] - 5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
								}
							}
						}
					} else if (arrowToArray[index][1] == 'right') {
						ctx.moveTo(arrowItemCoords['x'] + arrowItemCoords['width']+5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2)
						ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width']+5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
						if (arrowToArray[index][2] == 'left' && Math.floor(arrowItemCoords['y'] + arrowItemCoords['height'] / 2) == Math.floor(arrowToCoords['y'] + arrowToCoords['height'] / 2)) {
							ctx.lineTo(arrowToCoords['x'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
							drawArrowIcon(arrowToCoords['x'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "right")
							if(arrowToArray[index][3] == "doubleArrows") {
								drawArrowIcon(arrowItemCoords['x'] + arrowItemCoords['width'] + 5, arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx, "left")
							} else {
								drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
							}
						} else if(arrowToArray[index][2] == 'right') {
							if(arrowItemCoords['y'] < arrowToCoords['y']) {
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] + 15, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] + 15, 
								arrowItemCoords['y'] + arrowItemCoords['height'] / 2 + 5, 
								5, 
								getRadians(270), getRadians(360), false);
		
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] + 15 + 5, arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5);
		
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] + 15, 
								arrowToCoords['y'] + arrowToCoords['height'] / 2 - 5, 
								5, 
								getRadians(360), getRadians(90), false);
		
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "left")
								if(arrowToArray[index][3] != "noneStartPoint") {
									drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
								}

							} else if(arrowItemCoords['y'] > arrowToCoords['y']) {
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] + 20, arrowItemCoords['y'] + arrowItemCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] + 20, 
								arrowItemCoords['y'] + arrowItemCoords['height'] / 2 - 5, 
								5, 
								getRadians(90), getRadians(360), true);
		
								ctx.lineTo(arrowItemCoords['x'] + arrowItemCoords['width'] + 20 + 5, arrowToCoords['y'] + 10 + arrowToCoords['height'] / 2);
		
								ctx.arc(
								arrowItemCoords['x'] + arrowItemCoords['width'] + 20, 
								arrowToCoords['y'] + arrowToCoords['height'] / 2 + 5, 
								5, 
								getRadians(0), getRadians(270), true);
		
								ctx.lineTo(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2);
								drawArrowIcon(arrowToCoords['x'] + arrowToCoords['width'], arrowToCoords['y'] + arrowToCoords['height'] / 2, ctx, "left")
								if(arrowToArray[index][3] != "noneStartPoint") {
									drawStartIcon(arrowItemCoords['x'] + arrowItemCoords['width'], arrowItemCoords['y'] + arrowItemCoords['height'] / 2, ctx)
								}
								
							}
						}
					}
				}
			}

			ctx.stroke();
		})

		

		/* if(arg.reverse == true) {
			ctx.moveTo(outerCircleSize, outerCircleSize * 3);
			if(arg.disableAngle == true) {
				ctx.lineTo(outerCircleSize, height - (angleSize * 2) - lastLine);
				ctx.arc(angleSize + outerCircleSize, height - angleSize - outerCircleSize - (lineWidth/2), angleSize, getRadians(-180), Math.PI / 2, true);
				ctx.lineTo(width - outerCircleSize*3, height - (lineWidth/2) - outerCircleSize);
			} else {
				ctx.lineTo(outerCircleSize, height - (angleSize * 2) - lastLine);
				ctx.arc(angleSize + outerCircleSize, height - (angleSize * 2) - lastLine, angleSize, getRadians(-180), Math.PI / 2, true);
				ctx.lineTo(width - (angleSize * 2), height - angleSize - lastLine);
				ctx.arc(width - angleSize - lineWidth - (outerCircleSize), height - lastLine, angleSize, getRadians(-90), getRadians(0), false);
				ctx.lineTo(width - lineWidth - outerCircleSize, height - (outerCircleSize*2.5));
			}
		} *//*  else {

			ctx.moveTo(width - lineWidth - outerCircleSize, outerCircleSize * 3);
			if(arg.disableAngle == true) {
				ctx.lineTo(width - lineWidth - outerCircleSize, height - angleSize - outerCircleSize);
				ctx.arc(width - angleSize - outerCircleSize - lineWidth, height - angleSize - (lineWidth/2) - outerCircleSize, angleSize, getRadians(0), Math.PI / 2, false);
				ctx.lineTo((outerCircleSize*2.5) + lineWidth, height - (lineWidth/2) - outerCircleSize);
			} else {
				ctx.lineTo(width - lineWidth - outerCircleSize, height - (angleSize * 2) - lastLine);
				ctx.arc(width - angleSize - outerCircleSize - lineWidth, height - (angleSize * 2) - lastLine, angleSize, getRadians(0), Math.PI / 2, false);
				ctx.lineTo(angleSize * 2, height - angleSize - lastLine);
				ctx.arc(angleSize + outerCircleSize, height - lastLine, angleSize, getRadians(-90), getRadians(180), true);
				ctx.lineTo(outerCircleSize+lineWidth, height+lastLine);
			}
			
		} */

		

		/* ctx.beginPath();
		ctx.setLineDash([]);
		ctx.fillStyle = '#1E1E1E';
		ctx.lineWidth = 0;
		ctx.strokeStyle = "transparent";

		if(arg.reverse == true) {
			ctx.arc(outerCircleSize, outerCircleSize, outerCircleSize, 0, Math.PI * 2, true);
			ctx.arc(width - outerCircleSize*1.2, height - outerCircleSize-1, outerCircleSize, 0, Math.PI * 2, true);
			
		} else {
			ctx.arc(outerCircleSize, height - outerCircleSize-1, outerCircleSize, 0, Math.PI * 2, true);
			ctx.arc(width - outerCircleSize*1.2, outerCircleSize, outerCircleSize, 0, Math.PI * 2, true);
		}
		
		ctx.fill();
		ctx.stroke(); */
	}
}



window.addEventListener('load', function () {
	arrowCanvas.forEach(canvas => {
		const arrowItems = canvas.parentElement.querySelectorAll('.arrow-item');
	
		let width = 0, height = 0;
		function draw() {
			if (canvas.offsetWidth != width || canvas.offsetHeight != height) {
				width = canvas.offsetWidth;
				height = canvas.offsetHeight;
				drawArrow({
					canvas: canvas,
					arrowItems: arrowItems,
					/* reverse: true,
					lastLine: 20,
					angleSize: (window.innerWidth >= 768) ? 100 : 50,
					dashArray: [15,15],
					lineWidth: 2, */
					//disableAngle: true,
				});
			}
		}
	
		setInterval(draw, 100)
	})
})



function getRadians(degrees) {
	return (Math.PI / 180) * degrees;
}


// =-=-=-=-=-=-=-=-=-=-=-=- </arrows-draw> -=-=-=-=-=-=-=-=-=-=-=-=


const dateInputs = document.querySelectorAll('.date-input');
dateInputs.forEach(dateInput => {
	const datepicker = new Datepicker(dateInput, {
	// ...options
	}); 
})


const popupBlocks = document.querySelectorAll('.popup-block');
popupBlocks.forEach(popupBlock => {

	const forwardLink = popupBlock.querySelector('.forward-link');
	if(forwardLink) {
		forwardLink.addEventListener('click', function (event) {
			event.preventDefault();

			const prevElement = popupBlock.previousElementSibling;
			if(prevElement) {
				if(prevElement.classList.contains('popup-block')) {
					popupBlock.classList.add('fade-out');
					setTimeout(() => {
						popupBlock.classList.remove('_active');
						popupBlock.classList.remove('fade-out');
						prevElement.classList.add('_active');
						prevElement.classList.add('fade-in');
					},400)
				}
			}
			
		})
	}

	popupBlock.addEventListener('submit', function (event) {
		event.preventDefault();

		const nextElement = popupBlock.nextElementSibling;
		if(nextElement) {
			if(nextElement.classList.contains('popup-block') && !popupBlock.classList.contains('_disable-next-change')) {
				popupBlock.classList.add('fade-out');
				setTimeout(() => {

					popupBlock.classList.remove('_active');
					popupBlock.classList.remove('fade-out');
					nextElement.classList.add('_active');
					nextElement.classList.add('fade-in');

					if(nextElement.hasAttribute('data-remove-disable')) {
						setTimeout(() => {
							nextElement.classList.remove('_disable-next-change')
						},3000)
					}

				},400)
			}
		}

	})
})

const verificatePopupUploadInputs = document.querySelectorAll('.verificate-popup__upload--btn input[type="file"]');
verificatePopupUploadInputs.forEach(verificatePopupUploadInput => {
	verificatePopupUploadInput.addEventListener('change', function (event) {
		verificatePopupUploadInput.parentElement.querySelector('span').textContent = verificatePopupUploadInput.files[0].name
	})
})

/* 
// =-=-=-=-=-=-=-=-=-=-=-=- <animation> -=-=-=-=-=-=-=-=-=-=-=-=

AOS.init({
	disable: "mobile",
});

// =-=-=-=-=-=-=-=-=-=-=-=- </animation> -=-=-=-=-=-=-=-=-=-=-=-=

*/
