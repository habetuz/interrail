
function notFound(context, next) {
    if (window.location.pathname == context.pathname) {
        next()
        return
    }
    next()
}

function home(context, next) {
    getContent(context.pathname, (content) => {
        console.log(content)
        $('main').css('height', '200vh')
        $('main').html(content)
        floatingHeader.expanded = false
        window.scrollTo(0, 0)
        next()
    })
}

function homeExit(context, next) {
    floatingHeader.expanded = true
    $('main').css('height', '')
    next()
}

function test(context, next) {
    getContent(context.pathname, (content) => {
        $('main').html(content)
        next()
    })
}

function transitionOut(context, next) {
    window.scrollTo(0, 0)
    $('main').html('')

    next()
}

function transitionIn(context, next) {
    next()
}

function getContent(path, callback) {
    fetch(path + 'content.html')
        .then(data => { return data.text() })
        .then(html => callback(html))
}

page('/', transitionOut, home, transitionIn)
page('/test', transitionOut, test, transitionIn)
page.exit('/', homeExit)
page()