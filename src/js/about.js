function aboutUpdateScroll() {
    var scrollPos = document.documentElement.scrollTop - 300;
    $('#about-scroll-wrapper').css('top', -scrollPos)
}

class AboutTimeline extends HTMLElement {
    connectedCallback() {
        fetch('src/data/route.json').then(route => route.json()).then(route => {
            for (var i = 0; i < route.length; i++) {
                var stop = route[i]
                if (stop.type == 'city') {
                    $('about-timeline').append(
                        `<a class="city animated-hover" href="${stop.link}">${stop.name}</a>`
                    )
                }
                else {
                    $('about-timeline').append(
                        `<div class="${stop.type}">${stop.name}</div>`
                    )
                }
            }
            $('#about-spacer').css('height', 'calc(' + (300 + $('#about-scroll-wrapper')[0].getBoundingClientRect().height) + "px + 100vh)")
        })
    }
}

customElements.define('about-timeline', AboutTimeline)
