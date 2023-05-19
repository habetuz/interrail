function resizeMap(){var i=-svgViewport.x()+(window.innerWidth-svgViewport.width())/2,r=-svgViewport.y()+(window.innerHeight-svgViewport.height())/2,n,t;svgMap.attr("transform",`translate(${i} ${r})`);n=window.innerWidth/svgViewport.width();t=window.innerHeight/svgViewport.height();n<1||t<1?$("#map-container").css("transform","scale(1)"):n<t?$("#map-container").css("transform","scale("+n+")"):$("#map-container").css("transform","scale("+t+")")}function linkMap(){$("#links>*").each((n,t)=>{var i=t.parentNode;i.appendChild($(`<a href='${$(t).attr("id")}' onclick="mapLinkClickCallback('${$(t).attr("id")}')"></a>`)[0].appendChild(t).parentNode)});$("#map-container")[0].innerHTML+=""}function mapLinkClickCallback(n){return page(n),event.preventDefault(),!1}const clamp=(n,t,i)=>Math.min(Math.max(n,t),i);var svgRoot,svgMap,svgViewport;$.get("/src/img/map.svg",n=>{$("#map-container").append(n);linkMap();var t=$("#map-container > *");t.attr("width","1920px");t.attr("height","1080px");svgRoot=SVG(t[0]);svgMap=svgRoot.findOne("#Map");svgViewport=svgRoot.findOne("#Viewport").clone();resizeMap()},"text");$.get("src/data/stops.json",n=>{this.stops=n});$.get("src/data/route.json",n=>{this.route=n});addEventListener("resize",resizeMap)