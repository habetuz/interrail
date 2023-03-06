var request;

function home(context, next) {
    if (context.content == null) {
        next()
        return
    }
    console.log('home')
    $('main').html(context.content)
}

function shrinkBg(context, next) {
    console.log('shrinkBg')
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
        duration: 1000,
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
    floatingHeader.expanded = true
    console.log('test')
    $('main').html(context.content)
    next()
}

function notFound(context, next) {
    if (window.location.pathname == context.pathname) {
        next()
        return
    }
    next()
}

function resolve(context, next) {
    request.then(
        success => success.text(),
        () => "network error",
    ).then(result => {
        if (result == "network error") {
            floatingHeader.expanded = true
            $('main').append($('#network-error')[0].content)
        }
        else {
            context.content = result
        }
        next()
    })
}

function transitionOut(context, next) {
    console.log('out')
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
    console.log('in')
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
    $('main').html('')
    next()
}

function requestContent(context, next) {
    var path = context.pathname
    if (path[path.length - 1] != '/') {
        path += '/'
    }
    request = fetch(path + 'content.html')
    next()
}

function resetScroll(context, next) {
    window.scrollTo(0, 0)
    next()
}

function checkHandled(context, next) {
    console.log(context)
    if (context.handled) {
        return
    }

    next()
}

page.redirect('/404.html', '/')
page('/', shrinkBg, requestContent, transitionOut, resetScroll, resolve, home)
page('*', requestContent, transitionOut, resetScroll, resolve, loadContent, transitionIn)
page()