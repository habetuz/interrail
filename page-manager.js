var request;

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

function home(context, next) {
    if (context.content == null) {
        return
    }
    console.log('home')
    $('main').css('height', '200vh')
    $('main').html(context.content)
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

function transitionOut(context, next) {
    console.log('out')
    if (context.pathname == '/') {
        floatingHeader.expanded = false
    }
    else {
        floatingHeader.expanded = true
    }
    requestContent(context.pathname)
    anime({
        targets: 'main>*',
        translateY: [0, 20],
        opacity: 0,
        duration: 500,
        easing: 'easeInOutCubic',
        complete: () => {
            $('main')
                .html('')
                .css('height', '')

            window.scrollTo(0, 0)
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
            window.scrollTo(0, 0)
            next()
        },
    })
}

function requestContent(path) {
    if (path[path.length - 1] != '/') {
        path += '/'
    }
    request = fetch(path + 'content.html')
}

page('/', transitionOut, resolve, home, transitionIn)
page('/test', transitionOut, resolve, test, transitionIn)
page()