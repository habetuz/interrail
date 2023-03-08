var request;

function home(context, next) {
    if (context.content == null) {
        next()
        return
    }
    console.info('Page manager event: home')
    $('main').html(context.content)
}

function shrinkBg(context, next) {
    console.info('Page manager event: shrinkBg')
    if ($('floating-header #wrapper')[0] == null) {
        next()
        return;
    }
    var wrapper = $('floating-header #wrapper')[0].getBoundingClientRect()
    var rightWrapper = $(window).width() - wrapper.left - wrapper.width
    var bottomWrapper = $(window).height() - wrapper.top - wrapper.height

    floatingHeader.expandedSilent = false

    anime({
        targets: 'floating-header #bg',
        bottom: bottomWrapper + 'px',
        right: rightWrapper + 'px',
        left: '15px',
        top: '15px',
        duration: 500,
        easing: 'easeInOutCubic',
        complete: () => {
            $('floating-header #bg')
                .css('left', '')
                .css('top', '')
        },
    })

    next()
}

function loadContent(context, next) {
    if (context.content == null) {
        next()
        return
    }
    console.info('Page manager event: loadContent')
    floatingHeader.expanded = true
    $('main').html(context.content)
    next()
}

function resolve(context, next) {
    console.info('Page manager event: resolve')
    request.then(
        response => {
            if (response.status == 200) {
                response.blob().then(blob => blob.text().then(result => {
                    context.content = result
                    next()
                }))
            }
            else if (response.status == 404) {
                floatingHeader.expanded = true
                $('main').append($('#not-found-error')[0].content.cloneNode(true))
                transitionIn()
            }
            else {
                floatingHeader.expanded = true
                $('main').append($('#unknown-error')[0].content.cloneNode(true))
                console.error(response)
                transitionIn()
            }
        },
        _ => {
            floatingHeader.expanded = true
            $('main')[0].appendChild($('#network-error')[0].content.cloneNode(true))
            transitionIn()
        }
    )

}

function transitionOut(context, next) {
    console.info('Page manager event: transitionOut')
    anime({
        targets: 'main>*',
        translateY: [0, 20],
        opacity: 0,
        duration: 500,
        easing: 'easeInOutCubic',
        complete: () => {
            next()
        },
    })
}

function transitionIn(context, next) {
    console.info('Page manager event: transitionIn')
    anime({
        targets: 'main>*',
        translateY: [20, 0],
        opacity: 1,
        duration: 500,
        easing: 'easeInOutCubic',
        complete: () => {
        },
    })
}

function clearContent(context, next) {
    console.info('Page manager event: clearContent')
    $('main').html('')
    next()
}

function requestContent(context, next) {
    console.info('Page manager event: requestContent')
    var path = context.pathname
    if (path[path.length - 1] != '/') {
        path += '/'
    }
    request = fetch(path + 'content.html')
    next()
}

function resetScroll(context, next) {
    console.info('Page manager event: resetScroll')
    window.scrollTo(0, 0)
    next()
}

function printInfo(context, next) {
    console.info('Page manager event: Moving to page "' + context.pathname + '"!')
    next()
}

page.redirect('/404.html', '/')
page('/', printInfo, shrinkBg, requestContent, transitionOut, clearContent, resetScroll, resolve, home)
page('*', printInfo, requestContent, transitionOut, clearContent, resetScroll, resolve, loadContent, transitionIn)
page()