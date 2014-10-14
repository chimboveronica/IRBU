/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mapGoogle;
var rendererOptions = {
    draggable: true
};
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var listMarker = [];
var listInfoWindows = [];



var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var image;
var mapOptions;

Ext.onReady(function() {
    // Constructor Base
    mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(-3.9912, -79.20733),
        mapTypeId: google.maps.MapTypeId.ROADMAP, //ROADMAP :: SATELLITE :: TERRAIN
        minZoom: 2
    };
    directionsDisplay = new google.maps.DirectionsRenderer();
    mapGoogle = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(mapGoogle);
    directionsDisplay.setPanel(document.getElementById('directionsPanel'));

    google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
        computeTotalDistance(directionsDisplay.getDirections());
    });



//    paradas();
//    calcRoute();


});

function paradas() {
    var markers = Array();
    var infowindowActivo = false;
    image = {
        url: 'img/map.png',
        size: new google.maps.Size(32, 51),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
    };

    for (var i = 0; i < storeParadas.data.length; i++) {

        var myLatLng = new google.maps.LatLng(storeParadas.getAt(i).data.lat, storeParadas.getAt(i).data.lon);

        markers[i] = new google.maps.Marker({
            position: myLatLng,
            map: mapGoogle,
            icon: image

        });
        markers[i].infoWindow = new google.maps.InfoWindow({
            content: ' <center><img src="' + storeParadas.getAt(i).data.dir_img + '" width="180" height="90"></center><br>\n\
                    <b>Dirección: </b>' + storeParadas.getAt(i).data.direccion + '<br>\n\ '
        });


        google.maps.event.addListener(markers[i], 'click', function() {
            if (infowindowActivo)
                infowindowActivo.close();
            infowindowActivo = this.infoWindow;
            infowindowActivo.open(mapGoogle, this);
        });

    }
}


function calcRoute(storeLatLong) {
    var request;
    var infowindowActivo = false;
    var beachMarker;
    var beachMarker1;



    var start = new google.maps.LatLng(storeLatLong[0].lat, storeLatLong[0].lon);
    var end = new google.maps.LatLng(storeLatLong[storeLatLong.length - 1].lat, storeLatLong[storeLatLong.length - 1].lon);

    var data = [];

    for (var i = 0; i < storeLatLong.length; i++) {

        data[i] = new google.maps.LatLng(storeLatLong[i].lat, storeLatLong[i].lon)

    }
    //console.log(data[0].location);

//    var request = {
//        origin: start,
//        destination: end,
//        waypoints: data.location,
//        travelMode: google.maps.TravelMode.DRIVING
//    };




    var ruta = new google.maps.Polyline({
        path: data,
        map: mapGoogle,
        strokeColor: '#222000',
        strokeWeight: 4,
        strokeOpacity: 0.6,
        clickable: false});

//    directionsService.route(request, function(response, status) {
//        if (status == google.maps.DirectionsStatus.OK) {
//            directionsDisplay.setDirections(response);
//        }
//    });


    var image = 'img/inicio.png';
    beachMarker = new google.maps.Marker({
        position: start,
        map: mapGoogle,
        icon: image
    });

    beachMarker.infoWindow = new google.maps.InfoWindow({
        content: 'Inicio'
    });


    google.maps.event.addListener(beachMarker, 'click', function() {
        if (infowindowActivo)
            infowindowActivo.close();
        infowindowActivo = this.infoWindow;
        infowindowActivo.open(mapGoogle, this);
    });

    var image = 'img/fin.png';
    beachMarker1 = new google.maps.Marker({
        position: end,
        map: mapGoogle,
        icon: image
    });

    beachMarker1.infoWindow = new google.maps.InfoWindow({
        content: 'Fin'
    });


    google.maps.event.addListener(beachMarker1, 'click', function() {
        if (infowindowActivo)
            infowindowActivo.close();
        infowindowActivo = this.infoWindow;
        infowindowActivo.open(mapGoogle, this);
    });

}

function limpiarMapa() {
    mapGoogle.removeAll();

}

function paradasRutas(storeParadasRutas) {
    var markers = Array();
    var infowindowActivo = false;
    image = {
        url: 'img/map.png',
        size: new google.maps.Size(32, 51),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
    };

    for (var i = 0; i < storeParadasRutas.length; i++) {

        var myLatLng = new google.maps.LatLng(storeParadasRutas[i].lat, storeParadasRutas[i].lon);

        markers[i] = new google.maps.Marker({
            position: myLatLng,
            map: mapGoogle,
            icon: image

        });
        markers[i].infoWindow = new google.maps.InfoWindow({
            content: ' <center><img src="' + storeParadasRutas[i].dir_img + '" width="180" height="90"></center><br>\n\
                    <b>Dirección: </b>' + storeParadasRutas[i].direccion + '<br>\n\
                    <b>Información de horarios</b><a href="' + +'" target="_blank"><img src="img/Safari.png" width="30" height="30"></a>'

        });


        google.maps.event.addListener(markers[i], 'click', function() {
            if (infowindowActivo)
                infowindowActivo.close();
            infowindowActivo = this.infoWindow;
            infowindowActivo.open(mapGoogle, this);
        });

    }
}

function computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    total = total / 1000.0;

    console.log(total + ' km');
}


function obtenerLongLat() {
    google.maps.event.addListener(mapGoogle, 'click', function(event) {
        Ext.getCmp('latitud').setValue(event.latLng.k);
        Ext.getCmp('longitud').setValue(event.latLng.B);
        winParadas.show();
    });
}


function dibujarRuta() {

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
//                google.maps.drawing.OverlayType.MARKER,
//                google.maps.drawing.OverlayType.CIRCLE,
//                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.POLYLINE,
//                google.maps.drawing.OverlayType.RECTANGLE
            ]
        },
    });
    var puntos = [];
    google.maps.event.addListener(drawingManager, 'polylinecomplete', function(line) {

        for (var i = 0; i < line.getPath().length; i++) {
            puntos.push({
                latitud: line.getPath().j[0].K,
                longitud: line.getPath().j[0].B,
            });
        }
        Ext.getCmp('selector').setValue(line.getPath().length);
        winAdminRoute.show();

    });
    drawingManager.setMap(mapGoogle);

}


function dibujarParadasMasCercanas() {

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.POLYLINE,
                google.maps.drawing.OverlayType.RECTANGLE
            ]
        },
    });
    var puntos = [];
    google.maps.event.addListener(drawingManager, 'polylinecomplete', function(line) {
        for (var j = 0; j < storeParadasTotales.length; j++) {
            console.log(storeParadas.getAt(j).data.lon);
            console.log("Longitud" + line.getPath().j[i].B);

            for (var i = 0; i < line.getPath().length; i++) {
                if (storeParadas.getAt(j).data.lon <= line.getPath().j[i].B)
                    console.log("Latitud" + line.getPath().j[i].K + "Longitud" + line.getPath().j[i].B);
            }
        }


    });
    drawingManager.setMap(mapGoogle);

}