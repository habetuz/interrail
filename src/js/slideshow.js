class SlideShow extends HTMLElement{connectedCallback(){var t=this.getAttribute("src"),n=$('<swiper-container loop="true" mousewheel="true" autoplay="true" grab-cursor="true" space-between="50"><\/swiper-container>');$.get("src/img/"+t+"/index.json",t=>{t.forEach(t=>{n.append($(`<swiper-slide><img src='${t}'></img></swiper-slide>`))})});this.appendChild(n[0])}}customElements.define("slide-show",SlideShow)