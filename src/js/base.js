const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

// Setup map
var svgRoot
var svgMap
var svgViewport

fetch('/src/img/map.svg')
    .then((response) => response.text())
    .then((svg) => {
        svgRoot = SVG().addTo('#map-container').size('1920px', '1080px').svg(svg)
        svgMap = svgRoot.findOne('#Map')
        svgViewport = svgRoot.findOne('#Viewport').clone()
        resizeMap();
    })

addEventListener("resize", resizeMap);
function resizeMap() {
    var xTranslate = -svgViewport.x() + (window.innerWidth - svgViewport.width()) / 2
    var yTranslate = -svgViewport.y() + (window.innerHeight - svgViewport.height()) / 2
    svgMap.attr('transform', `translate(${xTranslate} ${yTranslate})`)

    var xScale = window.innerWidth / svgViewport.width()
    var yScale = window.innerHeight / svgViewport.height()

    if (xScale < 1 || yScale < 1) {
        $('#map-container').css('transform', 'scale(1)')
    } else if (xScale < yScale) {
        $('#map-container').css('transform', 'scale(' + xScale + ')')
    } else {
        $('#map-container').css('transform', 'scale(' + yScale + ')')
    }
}

setTimeout(() => { floatingHeader.language = 'de' }, 3000)