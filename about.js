function updateScroll() {
    var scrollPos = document.documentElement.scrollTop - 300;
    $('#about-scroll-wrapper').css('top', -scrollPos)
}