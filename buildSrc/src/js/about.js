function aboutUpdateScroll() {
    var scrollPos = document.documentElement.scrollTop - 300;
    $('#about-scroll-wrapper').css('top', -scrollPos)
}

var media = window.matchMedia("(max-width: 600px)")
function aboutResize() {
    if (media.matches) {
        $('#about-scroll-wrapper').css({ left: '0', 'padding-right': '30px' })
            .prepend($('#about-description'))
        $('#about-description').css({ position: 'relative', padding: '0', width: '100%' })
        $('about-timeline').css({ 'margin-top': '100px', left: '30px' })
    }
    else {
        $('#about-wrapper').prepend($('#about-description'))
        $('#about-scroll-wrapper').css({ left: '', 'padding-right': '' })
        $('#about-description').css({ position: '', padding: '', width: '' })
        $('about-timeline').css({ 'margin-top': '', left: '' })
    }

    $('#about-spacer').css('height', 'calc(' + (300 + Math.max(0, $('#about-scroll-wrapper')[0].getBoundingClientRect().height - $('#about-wrapper').height())) + "px + 100vh)")
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

            aboutResize(media)
            window.addEventListener('resize', aboutResize)
        })
    }

    disconnectedCallback() {
        window.removeEventListener('resize', aboutResize)
    }
}

customElements.define('about-timeline', AboutTimeline)