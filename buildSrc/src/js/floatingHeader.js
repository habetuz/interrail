class FloatingHeader extends HTMLElement {
    #translations;

    #lan = { inter: 'ZWISCHEN', rail: 'RAIL' };

    #inter;
    #rail;

    #expanded = false;

    #updateSize() {
        if (this.#expanded) {
            return;
        }

        var currRight = $('#background').css('right');

        var scrollProgress = clamp(document.documentElement.scrollTop / 300, 0, 1);
        var wrapper = $('floating-header #wrapper')[0].getBoundingClientRect();
        var rightWrapper = $(window).width() - wrapper.left - wrapper.width - 15;
        var bottomWrapper = $(window).height() - wrapper.top - wrapper.height - 15;
        var right = rightWrapper - (rightWrapper - 15) * scrollProgress;
        var bottom = bottomWrapper - (bottomWrapper - 15) * scrollProgress;

        if (right == null || right > rightWrapper) {
            right = rightWrapper;
        }
        if (bottom == null || bottom > bottomWrapper) {
            bottom = bottomWrapper;
        }

        $('#background')
            .css('right', right + 'px')
            .css('bottom', bottom + 'px');

        //anime({
        //    targets: '#background',
        //    bottom: bottom + 'px',
        //    right: right + 'px',
        //    duration: 200,
        //    easing: 'easeOutCubic'
        //})

        if (document.documentElement.scrollTop >= 300 && currRight != '15px') {
            transitionIn();
        }
        else if (document.documentElement.scrollTop < 300 && currRight == '15px') {
            transitionOut(null, () => { });
        }

    }

    constructor() {
        $.get('src/data/translations.json', (translations) => {
            this.#translations = translations;
        });

        super();
        window.floatingHeader = this;
    }

    onCreation

    connectedCallback() {
        fetch("/src/html/floatingHeader.html")
            .then(response => response.text())
            .then(html => {
                this.innerHTML = html;

                this.#lan = this.#translations[this.getAttribute('lan') ?? 'Deutschland'];
                $('floating-header #inter').text(this.#lan.inter);
                $('floating-header #rail').text(this.#lan.rail);
                this.#inter = new TextScramble($('floating-header #inter')[0]);
                this.#rail = new TextScramble($('floating-header #rail')[0]);

                this.expanded = this.getAttribute('expand') == 'true' ? true : false;
                this.#updateSize();
                new ResizeObserver(() => { this.#updateSize() }).observe($('floating-header #wrapper')[0]);

                window.addEventListener("scroll", () => {
                    this.#updateSize();
                });

                window.addEventListener("resize", () => {
                    this.#updateSize();
                });

                if (this.onCreation != null) {
                    this.onCreation();
                }
            });
    }

    attributeChangedCallback() {
        var lan = this.#translations && this.#translations[this.getAttribute('lan') ?? 'Deutschland'];
        var expand = this.getAttribute('expand') == 'true' ? true : false;

        if (expand != this.#expanded) {
            if (expand) {
                this.#expanded = expand;
                anime({
                    targets: '#background',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    easing: 'easeInOutCubic',
                    duration: 500,
                    complete: () => {
                        $('#map-container').css('visibility', 'hidden')
                    },
                });
            } else {
                $('#map-container').css('visibility', '');
                anime({
                    targets: '#background',
                    left: '15px',
                    right: '15px',
                    top: '15px',
                    bottom: '15px',
                    easing: 'easeInOutCubic',
                    duration: 500,
                    complete: () => {
                        $('#background')
                            .css('left', '')
                            .css('top', '')
                        this.#expanded = expand
                        this.#updateSize()
                    },
                });
            }
        }


        if (this.#inter != null && this.#rail != null && lan != this.#lan) {
            this.#lan = lan;
            this.#inter.setText(this.#lan.inter);
            this.#rail.setText(this.#lan.rail);
        }
    }

    get expanded() {
        return this.#expanded;
    }

    set expanded(expand) {
        this.setAttribute('expand', expand);
    }

    set expandedSilent(expand) {
        if (expand) {
            $('#map-container').css('visibility', 'hidden');
        } else {
            $('#map-container').css('visibility', '');
        }
        this.#expanded = expand;
        this.setAttribute('expand', expand);
    }

    set language(lan) {
        this.setAttribute('lan', lan);
    }

    static get observedAttributes() {
        return ['lan', 'expand'];
    }
}


// From https://codepen.io/soulwire/pen/mEMPrK
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

customElements.define('floating-header', FloatingHeader);
