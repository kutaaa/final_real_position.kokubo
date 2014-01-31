/*global google, jQuery */
/*jslint browser:true, devel:true */

$.ajax({
  //url: 'http://powerful-island-3353.herokuapp.com/shelters.json',
  url: 'http://localhost:3000/shelters.json',
  dataType: 'jsonp',
    success: function (data) {
        //console.log(data[0].lat);
        //var Lat = data[0].lat;
        //var Lng = data[0].lng;
        var Jname = new Array();
        var Jlat = new Array();
        var Jlng = new Array();
        var Jtel = new Array();
        var Jcapacity = new Array();
        var JdataLength = data.length;
        for (i = 0; i < data.length; i += 1) {
            Jname[i] = data[i].name;
            Jlat[i] = data[i].lat;
            Jlng[i] = data[i].lng;
            Jtel = data[i].tel;
            Jcapacity = data[i].capacity;
        }
        allPrograms(Jname, Jlat, Jlng, Jtel, Jcapacity, JdataLength);
    },
    error: function () {
        console.log("通信エラー");
  }
});

function allPrograms(Jname, Jlat, Jlng){
    var markersArray = [];
    var latlng = new google.maps.LatLng(35.66, 139.69);
    //現在地の緯度経度を入れておく
    var Glatlng = null;
    //目的地の緯度経度を入れておく
    var Elatlng = null;
    var infoWindows = [];
    var currentInfoWindow = null;
    var currentMarker = null;
    var directionsDisplay;
    var i;
    var markers = new Array();//マーカーをそれぞれのポイントとして格納しておく

    var options = {
        zoom: 15,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map'), options);
    /*
    //情報ウィンドー
    var infoWindow = new google.maps.InfoWindow({
        content: '<div>青森大学避難所<br><input type="button" id="directions" value="ナビ開始"></div>'
    });

    //避難場所表示マーカー

    var myMarker = new google.maps.Marker({
        // マーカーを置く緯度経度
        position: new google.maps.LatLng(40.782841, 140.782183),
        map: map
    });

    google.maps.event.addListener(myMarker, 'click', function () {
        'use strict';
        infoWindow.open(map, myMarker);
        Elatlng = new google.maps.LatLng(40.782841, 140.782183);
    });
    */

    //情報ウィンドー
    var addInfoWindow = function (index,myMarker) {
        var infoWindow = new google.maps.InfoWindow({
            content: '<div>' + Jname[index] + '<br>' + Jtel[index] + '<br>' + Jcapacity[index] + '<br><input type="button" id="directions" value="ナビ開始" style="WIDTH: 100px; HEIGHT: 100px"></div>'
        });
        infoWindow.open(map, myMarker);
        currentInfoWindow = infoWindow;//currentInfoWindowの中にinfoWindowの中にある情報を入れておく
    }
    var addMarker = function (address,index) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(Jlat[index], Jlng[index]),
            map: map
        });
        google.maps.event.addListener(marker, 'click', function () {
            //currentInfoWindowの中にある情報のinfoWindowは消す
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
            //console.log(index);//indexはマーカーの番号
            addInfoWindow(index, markers[index]);
            //currentInfoWindow = InfoWindow;
            console.log(Address[index].lat);
            console.log(markers[index]);
            Elatlng = new google.maps.LatLng(Jlat[index], Jlng[index]);
        });
        markers.push(marker);
    }
    /*中に直書きではなく、関数を作ってからじゃなきゃダメ！
    理由は直書きだと実引数のiをもらってしまうため、どこのマーカーをクリックしても最後のiの数字をもらってしまう（今回は４）
    今回はクリックしたマーカーはどれであったか確認したいため関数をいったん作って仮引数のiをとることにした。*/
    for (i = 0; i < 3; i += 1) {
        var address = Address[i];
        addMarker(address, i);
    }

    // HTML5 - Google Chrome
    // iPhone, Android


    //マーカーを消す
    function clearOverlays() {
        'use strict';
        var i;
        for (i = 0; i < markersArray.length; i = i + 1) {
            markersArray[i].setMap(null);
        }
    }

    // サーバーを用意する
    setInterval(geoLocationOn(),5000);
    function geoLocationOn() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function (position) {
                'use strict';
                clearOverlays();
                //現在地をGlatlngに入れた
                Glatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                map.setCenter(Glatlng);

                var marker = new google.maps.Marker({
                    position: map.getCenter(),
                    icon: new google.maps.MarkerImage('red.png'),
                    map: map
                });
                //マーカーを配列に入れる
                markersArray.push(marker);
            }, function () {
                'use strict';
                alert('現在地を取得できません！');
            });
        } else {
            alert('対応していません！');
        }
    }
    /*
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
            'use strict';
            clearOverlays();
            //現在地をGlatlngに入れた
            Glatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            map.setCenter(Glatlng);

            var marker = new google.maps.Marker({
                position: map.getCenter(),
                icon: new google.maps.MarkerImage('red.png'),
                map: map
            });
            //マーカーを配列に入れる
            markersArray.push(marker);
        }, function () {
            'use strict';
            alert('現在地を取得できません！');
        });
    } else {
        alert('対応していません！');
    }
*/
    function removeInfoWindow() {
        'use strict';
        console.log(currentInfoWindow);
        if (currentInfoWindow) {
            currentInfoWindow.close();
        }
        if (currentMarker) {
            currentMarker.setMap();
        }
    }
//道の途中にある目印の建物のinfowindowを表示させるところ
    function attachInfoWindow(marker, json) {
        'use strict';
        var infoWindow = new google.maps.InfoWindow({
            content: '<h3>' + json.name + '</h3>'
                + '<p>' + json.vicinity + '</p>'
        });
        infoWindow.id = json.id;

        infoWindows.push(infoWindow);
        google.maps.event.addListener(marker, 'click', function () {
            removeInfoWindow();
            infoWindow.open(marker.getMap(), marker);
            currentInfoWindow = infoWindow;
        });
        return infoWindow;
    }



    function setMarker(lat, lng) {
        'use strict';
        console.log('setMarker' + lat + ':' + lng);
        jQuery.each(markersArray, function () {
            this.setMap(null);
        });
        jQuery.ajax({
            url: './get_GooglePlacesJSON.php',
            dataType: 'jsonp',
            type: 'GET',
            data: {
                location: lat + ',' + lng,
                //半径何M
                radius: 100,
                types: 'convenience_store',
                language: 'ja',
                sensor: 'false',
                key: 'AIzaSyD_g-Zq1yElImO3nsgkvEX4XxB604c1HDU'
            },
            jsonp : 'callback',
            //もし目印となる建物があったら
            // on success
            success: function (json, textStatus, jqXHR) {
                var i, marker, infoWindow;
                console.log('textStatus=' + textStatus);
                console.log('jqXHR=' + jqXHR);

                //console.log(json);

                for (i in json.results) {
                    console.log('lat=' + json.results[i].geometry.location.lat);
                    console.log('lng=' + json.results[i].geometry.location.lng);
                    marker = new google.maps.Marker({
                        map: map,
                        position: new google.maps.LatLng(json.results[i].geometry.location.lat, json.results[i].geometry.location.lng)
                    });
                    markersArray.push(marker);

                    //吹き出し
                    infoWindow = attachInfoWindow(marker,json.results[i]);
                }

            },
            // on failure
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('jqXHR=' + jqXHR);
                console.log('textStatus=' + textStatus);
                console.log('errorThrown=' + errorThrown);
            }
        });
    }

    function resizeMapCanvas() {
        'use strict';
        jQuery('#map-canvas').height(jQuery(document).height());
    }

    //3:StaticMapsAPIに変換する
    function staticRoute(response) {
        'use strict';
        console.log('staticRoute: ' + response);

        var path, slat, slng, marker, base, box, length, i, lat, lng, html, emarker;
        //StaticMapsAPIの基本URL部分
        base = "http://maps.googleapis.com/maps/api/staticmap?size=220x220&sensor=false&";
        slat = (response.routes[0].legs[0].start_location.lat()).toFixed(6);
        slng = (response.routes[0].legs[0].start_location.lng()).toFixed(6);

        //StaticMapsAPIのマーカー作成部分
        marker = "markers=color:blue|label:S|" + slat + "," + slng + "&";
        marker += "markers=color:green|label:E|" + response.routes[0].legs[0].end_location.lat() + "," + response.routes[0].legs[0].end_location.lng() + "&";
        path = "path=color:0x0000ff|weight:5|" + slat + "," + slng;

        html = response.routes[0].legs[0].distance.text + "(";
        html += response.routes[0].legs[0].duration.text + ")<br>";

        length = response.routes[0].legs[0].steps.length;

        //StaticMapsAPIのpath(ルート表示）作成部分
    //羅列している
        for (i = 0; i < length; i = i + 1) {
            lat = response.routes[0].legs[0].steps[i].end_location.lat();//到着地点の緯度
            lng = response.routes[0].legs[0].steps[i].end_location.lng();//到着地点の経度

    //      html += "<li>"+response.routes[0].legs[0].steps[1].instructions;
    //右側文字表示部分
            //html += "<li>"+response.routes[0].legs[0].steps[i].instructions;
    //      console.log(response.routes[0].legs[0].steps[i]);
            box = response.routes[0].legs[0].steps[i].instructions;
            if (box.match(/右折/) || box.match(/左折/)) {
                setMarker(lat, lng);
                resizeMapCanvas();
                //console.log(lat, lng);
            }

            lat = lat.toFixed(6);//小数点６
            lng = lng.toFixed(6);


    //ルートが検索できなかった場合
            if (lat !== undefined) {
                path += "|" + lat + "," + lng;
                emarker = "";
            }

        }

        //img = base + marker + path;
    //右に距離・時間を表示させていたところ
        //document.getElementById("result").innerHTML = "<ol>"+html+"</ol>";//ルートの文字を表示しているところ

    //あやしい
    //  document.getElementById("static").innerHTML = "<img src="+img+">";//ルートの小さい地図を表示しているところ

    }


    //2:ルート検索を行う
    function execDirect() {
        'use strict';
        var Genzai = Glatlng,
            EndPosition = Elatlng,
            mode = google.maps.DirectionsTravelMode.WALKING,
            directionsService = new google.maps.DirectionsService();
        //2回目のルート検索をする場合に必要
        //もしルート表示（directionsDisplay）されていたら（undefinedではない）マップに表示されてあるルートは消してください
        if (typeof directionsDisplay !== "undefined") {
            directionsDisplay.setMap(null);
        }
        directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});

        console.log('Elatlng:' + Elatlng);
        console.log('Glatlng:' + Glatlng);
    /*
    //もしドライブモードで行くなら
        if (document.getElementById("mode").selectedIndex === 1) {
            mode = google.maps.DirectionsTravelMode.DRIVING;
        }
        */
    //怪しい

        google.maps.event.addListener(directionsDisplay, "directions_changed", function () {
            staticRoute(directionsDisplay.directions);
        });

    //怪しい
        directionsDisplay.setMap(map);
        directionsService.route(
            {
                origin : Genzai,
                destination: EndPosition,
                travelMode: mode
            },
            function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    staticRoute(response);
                } else {
                    alert("ルート検索に失敗しました");
            //          console.log(status);
            //          console.log(response);
                }
            }
        );
    /*
        document.getElementById("cls").addEventListener("click", function () {
            directionsDisplay.setMap(null);
        }, true);
    */
    }

    /*

    */
    /*
    //ナビ部分
    document.getElementById("control").innerHTML = '<select id=mode><option value="WALKING">WALKING</option><option value="DRIVING">DRIVING</option></select>';
    */
    //document.getElementById("control").innerHTML += '<input type="button" id="directions" value="Go">';
    //document.getElementById("control").innerHTML += '<input type="button" id="cls" value="cls">';
    //document.getElementById("directions").addEventListener("click", execDirect, true);

    jQuery(document).on('click', '#directions', function () {
        'use strict';
        execDirect();
    });

    //つけたし
    jQuery(window).resize(function () {
        'use strict';
        resizeMapCanvas();
    });
    //sourceTreeのtest
}