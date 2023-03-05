// Setup map
var svgRoot
var svgMap
var svgViewport

fetch('/src/map.svg')
    .then((response) => response.text())
    .then((svg) => {
        svgRoot = SVG().addTo('#map_container').size('1920px', '1080px').svg(svg)
        svgMap = svgRoot.findOne('#Map')
        svgViewport = svgRoot.findOne('#Viewport').clone()
        resizeMap();
    })

addEventListener("resize", resizeMap);
function resizeMap() {
    svgMap.move(
        -svgViewport.x() + (window.innerWidth - svgViewport.width()) / 2,
        -svgViewport.y() + (window.innerHeight - svgViewport.height()) / 2)

    var xScale = window.innerWidth / svgViewport.width()
    var yScale = window.innerHeight / svgViewport.height()

    if (xScale < 1 || yScale < 1) {
        $('#map_container').css('transform', 'scale(1)')
    } else if (xScale < yScale) {
        $('#map_container').css('transform', 'scale(' + xScale + ')')
    } else {
        $('#map_container').css('transform', 'scale(' + yScale + ')')
    }
}

setTimeout(() => { floatingHeader.language = 'de' }, 3000)

floatingHeader.onCreation = () => {
    $('floating-header #bg').click(() => {
        page('/test/')
    })
}