<!--
// 'use strict';
var sincloInfo;
(function(){
    sincloInfo = {
        dataset: {},
        site: {
          key: "65e00bd129158",
          socket: "https://ws.mediatalk.io",
          files: "https://ws.mediatalk.io"
        }
    };

    var b = document.getElementsByTagName('body')[0],
        l = [
            sincloInfo.site.files + '/websocket/sinclo-bundle.min.js?' + new Date().toISOString().slice(0, 10).replace(/-/g, '')
        ],
        i = 0,
        createElm = function (u){
            var s = document.createElement("script");
            s.type = 'text/javascript';
            s.src = u;
            s.charset="UTF-8";
            b.appendChild(s);
            i ++;
            s.onload = function(){
                if ( l[i] !== undefined ) createElm(l[i]);
            }
        };

    createElm(l[i]);

}());
//-->
