class SlideShow extends HTMLElement{connectedCallback(){var t=this.getAttribute("src"),n=$('<swiper-container mousewheel="true" autoplay-delay="2000" space-between="50" pagination-clickable="true" pagination-dynamic-bullets="true"><\/swiper-container>');n[0].shadowEl.prepend($(`
        <style>
            .swiper-pagination-bullet {
                background-color: var(--main-dark-color) !important;
                border: 2px solid var(--main-color) !important;
            }
        </style>
        `)[0]);$.get("src/img/"+t+"/index.json",t=>{t.forEach(t=>{n.append($(`<swiper-slide><img src='${t}'></img></swiper-slide>`))}),this.appendChild(n[0])})}}customElements.define("slide-show",SlideShow)