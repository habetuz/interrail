function home(){document.addEventListener("scroll",aboutUpdateScroll)}function shrinkBg(n,t){if(console.info("Page manager event: shrinkBg"),$("floating-header #wrapper")[0]==null){t();return}var i=$("floating-header #wrapper")[0].getBoundingClientRect(),r=$(window).width()-i.left-i.width-15,u=$(window).height()-i.top-i.height-15;floatingHeader.expandedSilent=!1;anime({targets:"#background",bottom:u+"px",right:r+"px",left:"15px",top:"15px",duration:500,easing:"easeInOutCubic",complete:()=>{$("#background").css("left","").css("top","")}});t()}function loadContent(n,t){if(n.content==null){t();return}if(console.info("Page manager event: loadContent"),$("main").html(n.wrapper.html()),$("#about-description, #content").html(n.content),n.pathname!="/"){var i=stops[n.pathname.replace("/","").toLowerCase()];$("#content").prepend(`<h1 country='${i.country}'>${i.name}</h1>`);floatingHeader.language=i.country}t()}function resolve(n,t){console.info("Page manager event: resolve");n.request.then(i=>{i.status==200?i.blob().then(i=>i.text().then(i=>{n.content=i,t()})):i.status==404?(floatingHeader.expanded=!0,$("main").append($("#not-found-error")[0].content.cloneNode(!0)),transitionIn()):(floatingHeader.expanded=!0,$("main").append($("#unknown-error")[0].content.cloneNode(!0)),console.error(i),transitionIn())},()=>{floatingHeader.expanded=!0,$("main")[0].appendChild($("#network-error")[0].content.cloneNode(!0)),transitionIn()})}function transitionOut(n,t){console.info("Page manager event: transitionOut");anime({targets:"main>*",translateY:[0,20],opacity:0,duration:500,easing:"easeInOutCubic",complete:()=>{$("main").css("visibility","hidden"),t()}})}function transitionIn(){console.info("Page manager event: transitionIn");$("main").css("visibility","");anime({targets:"main>*",translateY:[20,0],opacity:1,duration:500,easing:"easeInOutCubic",complete:()=>{}})}function clearContent(n,t){console.info("Page manager event: clearContent");$("main").html("");document.removeEventListener("scroll",aboutUpdateScroll);t()}function requestAbout(n,t){console.info("Page manager event: requestAbout");n.request=fetch("about.html");n.wrapper=$("#about-wrapper-template").clone();t()}function requestArticle(n,t){console.info("Page manager event: requestArticle");var i=n.pathname;n.request=fetch("articles/"+i.replace("/","")+".html");n.wrapper=$("#article-wrapper-template").clone();t()}function resetScroll(n,t){console.info("Page manager event: resetScroll");window.scrollTo(0,0);t()}function expandBG(n,t){console.info("Page manager event: expandBG");floatingHeader.expanded=!0;t()}function printInfo(n,t){console.info('Page manager event: Moving to page "'+n.pathname+'"!');t()}page.redirect("/404.html","/");page("/",printInfo,shrinkBg,requestAbout,transitionOut,clearContent,resetScroll,resolve,loadContent,home);page("*",printInfo,requestArticle,transitionOut,expandBG,clearContent,resolve,loadContent,resetScroll,transitionIn);page()