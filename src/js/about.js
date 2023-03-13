function aboutUpdateScroll() {
    var scrollPos = document.documentElement.scrollTop - 300;
    $('#about-scroll-wrapper').css('top', -scrollPos)
}

class AboutTimeline extends HTMLElement {
    connectedCallback() {
        Promise.all([
            fetch('/src/html/aboutTimeline.html'),
            fetch('src/data/route.json'),
        ]).then(([html, route]) => {
            Promise.all([
                html.text(),
                route.json(),
            ]).then(([html, route]) => {
                this.innerHTML = html
                for (var i = 0; i < route.length; i++) {
                    var stop = route[i]
                    $('about-timeline #timeline-content').append(
                        `<div class="${stop.type}">${stop.name}</div>`
                    )
                }
            })
        })

    }
}

customElements.define('about-timeline', AboutTimeline)
