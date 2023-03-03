class FloatingHeader extends HTMLElement {
    #translations = {
        de: { inter: 'ZWISCHEN', rail: 'SCHIENE' },
        en: { inter: 'INTER', rail: 'RAIL' },
    }

    #lan = this.#translations.de

    #inter = null
    #rail = null

    #updateSize() {
        var wrapper = $('floating-header #wrapper')[0].getBoundingClientRect()
        var bg = $('floating-header #bg')
        bg.css('width', wrapper.width + 'px')
        bg.css('height', wrapper.height + 'px')
    }

    constructor() {
        super()
        window.floatingHeader = this;
    }

    connectedCallback() {
        fetch("/floatingHeader.html")
            .then(response => response.text())
            .then(html => {
                this.innerHTML = html

                this.#lan = this.#translations[this.getAttribute('lan') ?? 'de']
                $('floating-header #inter').text(this.#lan.inter)
                $('floating-header #rail').text(this.#lan.rail)
                this.#inter = new TextScramble($('floating-header #inter')[0])
                this.#rail = new TextScramble($('floating-header #rail')[0])

                this.#updateSize()
                new ResizeObserver(this.#updateSize).observe($('floating-header #wrapper')[0])
            })
    }

    attributeChangedCallback() {
        var lan = this.#translations[this.getAttribute('lan') ?? 'de']
        if (this.#inter == null || this.#rail == null || lan == this.#lan) {
            return
        }

        this.#lan = lan
        this.#inter.setText(this.#lan.inter)
        this.#rail.setText(this.#lan.rail)

    }

    changeLanguage(lan) {
        this.setAttribute('lan', lan)
    }

    static get observedAttributes() {
        return ['lan']
    }
}


// From https://codepen.io/soulwire/pen/mEMPrK
class TextScramble {
    constructor(el) {
        this.el = el
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        this.update = this.update.bind(this)
    }
    setText(newText) {
        const oldText = this.el.innerText
        const length = Math.max(oldText.length, newText.length)
        const promise = new Promise((resolve) => this.resolve = resolve)
        this.queue = []
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || ''
            const to = newText[i] || ''
            const start = Math.floor(Math.random() * 40)
            const end = start + Math.floor(Math.random() * 40)
            this.queue.push({ from, to, start, end })
        }
        cancelAnimationFrame(this.frameRequest)
        this.frame = 0
        this.update()
        return promise
    }
    update() {
        let output = ''
        let complete = 0
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i]
            if (this.frame >= end) {
                complete++
                output += to
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar()
                    this.queue[i].char = char
                }
                output += `<span class="dud">${char}</span>`
            } else {
                output += from
            }
        }
        this.el.innerHTML = output
        if (complete === this.queue.length) {
            this.resolve()
        } else {
            this.frameRequest = requestAnimationFrame(this.update)
            this.frame++
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)]
    }
}

customElements.define('floating-header', FloatingHeader)
