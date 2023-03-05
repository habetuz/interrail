var request;

function home(context, next) {
    console.log('home')
    $('main').css('height', 'calc(100vh + 300px)')
    next()
}

function about(context, next) {
    console.log('about')
    window.scrollTo(0, 300)
    if (context.content == null) {
        return
    }
    $('main')
        .html(context.content)
        .css('height', '')
    next()
}

function test(context, next) {
    if (context.content == null) {
        return
    }
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
        fail => "network error",
    ).then(result => {
        if (result == "network error") {
            // Handle network error
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
            $('main').html('')
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

page('/', transitionOut, home, transitionIn)
page('/about/', requestContent, transitionOut, resolve, about, transitionIn)
page('/test/', requestContent, transitionOut, resetScroll, resolve, test, transitionIn)
page()