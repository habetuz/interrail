var content;

function notFound(context, next) {
    if (window.location.pathname == context.pathname) {
        next()
        return
    }
    next()
}

function home(context, next) {
    content.then(content => {
        console.log('home')
        $('main').css('height', '200vh')
        $('main').html(content)
        next()
    })
}

function test(context, next) {
    content.then(content => {
        console.log('test')
        $('main').html(content)
        next()
    })
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
    fetch(path + 'content.html')
        .then(data => { content = data.text() })
}

page('/', transitionOut, home, transitionIn)
page('/test', transitionOut, test, transitionIn)
page()