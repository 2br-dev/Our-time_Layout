let map;
let sideNav;
let akf;
let scrollSpy;

(() => {
	$('.lazy').lazy();

	if($('#map').length){
		loadScript("https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.js", () => {
			initMap();
		})
	}

    $('body').on('click', '.scroll-nav', scrollNav);
    $('body').on('mousemove', '.speaker', addHover);
    $('body').on('mouseleave', '.speaker', removeHover);
    $('body').on('click', '.close-speaker', removeHover1);
    
    sideNav = M.Sidenav.init(document.querySelector('.sidenav'));

    render();
})();

function addHover(e){
    e.preventDefault();
    $(this).addClass('hover');
}

function removeHover(e){
    e.preventDefault();
    $(this).removeClass('hover');
}

function removeHover1(e){
    e.preventDefault();
    $(this).parents('.speaker').removeClass('hover');
    let el = $(this).parents('.speaker')[0];
}

var coords = [40.2952563, 43.6727759]; 
var zoom = 15;

function scrollNav(e){

    e.preventDefault();

    let anchor = $(this).attr('href');
    let anchorST = anchor != "#" ? parseInt($(anchor).offset().top) : 0;
    sideNav.close()
    
    $('html, body').animate({
        scrollTop: anchorST
    });

}

function render(){

    // Отображение идикатора в программе
    let offset = parseInt(window.getComputedStyle(document.querySelector('section#program'), null).getPropertyValue('padding-top'));
    let min = $('.program-wrapper').offset().top;
    let max = min + $('.program-wrapper').outerHeight();
    let current = $('html, body').scrollTop() + window.innerHeight / 2;
    let percent = ( (current - min) / (max - min) ) * 100;

    let height = 0;

    $('.program-indicator').css({
        height: (percent) +'%'
    });

    $('.program-entry').each((index, pe) => {

        height += pe.clientHeight;

        if($('.program-indicator').outerHeight() > height - pe.clientHeight / 2){
            $(pe).addClass('highlight');
        }else{
            $(pe).removeClass('highlight');
        }
    });

    $('.last').removeClass('last');
    let length = $('.highlight').length;
    $( $('.highlight')[length - 1] ) .addClass('last');

    $('.line-wrapper .line').each((index, line) => {

        let speed = $(line).data('speed');
        let delta = ($('.line-wrapper').offset().top - $('html, body').scrollTop()) * speed;

        $(line).css({
            transform: `skew(-35deg) translateY(${delta}px)`
        });
    })

    // Установка видимости героя для футера
    if ( $('html, body').scrollTop() > window.innerHeight * 1.5 ){
        $('#hero').css({
            opacity: 0
        })
    }else{
        $('#hero').css({
            opacity: 1
        });
    }

    akf = requestAnimationFrame(render);
}



//= Асинхронная загрузка скриптов =========================================
function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";
    
    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

//= Инициализация карты ===================================================
function initMap(){

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VuZXN5cyIsImEiOiJja2xyejVqbTAwN3c2MnBwdjZvdHVhOHpiIn0.IrmmbUMTtmXBxZjv8mcH8Q';

    const geoJson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "point",
                    "coordinates": coords
                },
                "properties": {
                    "title": "Наше время",
                    "coordinates": coords
                }
            }
        ]
    }

    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/genesys/ckls2dt0l12fj17qxtbz91bqg',
        center: coords,
        zoom: zoom,
        pitch: 60,
        bearing: -20
    });

    map.scrollZoom.disable();

    for (const feature of geoJson.features){
        const el = $('<div class="marker"><div class="marker-element"></div></div>')[0];
        el.className = "marker";

        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({offset: 25})
                    .setHTML(
                        `<div class="popup-header">${feature.properties.title}</div><div class="popup-description"><p>г. Сочи, с. Сто-Садок, набережная «Панорама», 4</p><a target="_blank" href="https://yandex.ru/maps/-/CCUJVDxp8A">Подробнее</a></div>`
                    )
            )
            .addTo(map);
    }
}