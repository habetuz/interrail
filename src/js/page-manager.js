function home(context, next) {
    document.addEventListener('scroll', aboutUpdateScroll)
}

function shrinkBg(context, next) {
    console.info('Page manager event: shrinkBg')
    if ($('floating-header #wrapper')[0] == null) {
        next()
        return;
    }
    var wrapper = $('floating-header #wrapper')[0].getBoundingClientRect()
    var rightWrapper = $(window).width() - wrapper.left - wrapper.width - 15
    var bottomWrapper = $(window).height() - wrapper.top - wrapper.height - 15

    floatingHeader.expandedSilent = false

    anime({
        targets: '#background',
        bottom: bottomWrapper + 'px',
        right: rightWrapper + 'px',
        left: '15px',
        top: '15px',
        duration: 500,
        easing: 'easeInOutCubic',
        complete: () => {
            $('#background')
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
    console.log(context)
    $('main').html(context.wrapper.html())
    $('#about-description, #content').html(context.content)
    next()
}

function resolve(context, next) {
    console.info('Page manager event: resolve')
    context.request.then(
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
            $('main').css('visibility', 'hidden')
            next()
        },
    })
}

function transitionIn(context, next) {
    console.info('Page manager event: transitionIn')
    $('main').css('visibility', '')
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
    document.removeEventListener('scroll', aboutUpdateScroll)
    next()
}

function requestAbout(context, next) {
    console.info('Page manager event: requestAbout')

    context.request = fetch('about.html')
    context.wrapper = $('#about-wrapper').clone()
    next()
}

function requestArticle(context, next) {
    console.info('Page manager event: requestArticle')

    var path = context.pathname
    context.request = fetch('articles/' + path.replace('/', '') + '.html')
    context.wrapper = $('#article-wrapper').clone()
    next()
}

function resetScroll(context, next) {
    console.info('Page manager event: resetScroll')
    window.scrollTo(0, 0)
    next()
}

function expandBG(context, next) {
    console.info('Page manager event: expandBG')
    floatingHeader.expanded = true;
    next()
}

function printInfo(context, next) {
    console.info('Page manager event: Moving to page "' + context.pathname + '"!')
    next()
}

page.redirect('/404.html', '/')
page('/', printInfo, shrinkBg, requestAbout, transitionOut, clearContent, resetScroll, resolve, loadContent, home)
page('*', printInfo, requestArticle, transitionOut, expandBG, clearContent, resolve, loadContent, resetScroll, transitionIn)
page()