var map = new BMap.Map("container");
map.setMapStyle({
    styleJson: [
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "poilabel",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "town",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "manmade",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "building",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
                "color": "#021019"
            }
        },
        {
            "featureType": "green",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "districtlabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#d5628eff"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "geometry",
            "stylers": {
                "color": "#021019ff"
            }
        },
        {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": "#0b314aff"
            }
        },
        {
            "featureType": "districtlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "district",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }
    ]
});
map.centerAndZoom(new BMap.Point(118.454, 32.955), 4);
map.enableScrollWheelZoom();

let locations = dev_data.data;
let destination = new BMap.Point(118.645084, 28.766059);
let curves = [];

for (let country of locations) {
    for (let city of country.city) {
        let cityPoint = new BMap.Point(city.lon, city.lat);
        let color = city.num > 1000 ? 'red' : 'yellow';
        let starIcon = new BMap.Marker(cityPoint, {
            icon: new BMap.Symbol(BMap_Symbol_SHAPE_STAR, {
                scale: Math.max(Math.log(Math.log(city.num)) / 2, 0.3),
                fillColor: color,
                fillOpacity: 0.7,
                strokeWeight: 0,
                strokeColor: color,
                strokeOpacity: 0.7,
            })
        });
        map.addOverlay(starIcon);

        if (city.lon > -170 && city.lon < -60) {
            continue;
        }
        if (city.num < 5)
            continue;
        let curve = new BMapLib.CurveLine([destination, cityPoint], {
            strokeColor: "#EAC219",
            strokeWeight: 1,
            strokeOpacity: 1,
        }); //创建弧线对象
        map.addOverlay(curve); //添加到地图中
        curves.push(curve);
    }
}

document.body.addEventListener('keydown', function (event) {
    let k = event.keyCode;
    if (k === 48) {
        for (curve of curves)
            curve.hide();
    } else if (k === 49) {
        for (curve of curves)
            curve.show();
    }
});