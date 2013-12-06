/*jslint browser:true */
function compassTest(e) {
    'use strict';
    var heading = e.webkitCompassHeading,
        res = document.getElementById("res"),
        comp = document.getElementById("compass");
    if (heading < 0) {
        heading += 360;
    }
    heading += window.orientation;
    res.innerHTML = '方位 : ' + heading + '<br />精度 : ' + e.webkitCompassAccuracy;
    comp.style.webkitTransform = 'rotate(+' + heading + 'deg)';
}
window.addEventListener('load', function () {
    'use strict';
    window.addEventListener('deviceorientation', compassTest, false);
}, false);
