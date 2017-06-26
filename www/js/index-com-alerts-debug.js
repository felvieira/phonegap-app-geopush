/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('deviceready', function () {
            // Enable to debug issues.
            // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

            var notificationOpenedCallback = function (jsonData) {
                console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            };

            window.plugins.OneSignal
                // .startInit("50258523-927f-4c3e-864d-61d67b123a4d")
                .startInit("d2e1ce8a-39e6-44da-9d8b-cc22e4fc65f2")
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

            window.plugins.OneSignal.getIds(function (ids) {
                console.log('getIds: ' + JSON.stringify(ids));
                alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);

                document.getElementById("OneSignalUserID").innerHTML = ids.userId;
                document.getElementById("OneSignalPushToken").innerHTML = ids.pushToken;

            });

            // Call syncHashedEmail anywhere in your app if you have the user's email.
            // This improves the effectiveness of OneSignal's "best-time" notification scheduling feature.
            // window.plugins.OneSignal.syncHashedEmail(userEmail);
        }, false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        // window.open("http://www.gourmex.com/?isApp=true","_self");

        // document.getElementById("showDeviceInfo")
        //     .addEventListener("click", showDeviceInfo, false);

        document.getElementById("abrirGeo")
            .addEventListener("click", GeoRedirect, false);

        document.getElementById("abrirGourmexNormal")
            .addEventListener("click", abrirGourmexNormal, false);

        // document.getElementById("location")
        //     .addEventListener("click", onSuccess, false);

    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

};

function GeoRedirect() {
    document.getElementById("loader-pre-container").classList.remove("hide-loader");
    getCurrentLocation();
    setTimeout(function () {
        onSuccess();
    }, 3000);
}

function showDeviceInfo() {
    alert("Plataforma: " + device.platform +
        "Versão:" + device.version +
        "Modelo:" + device.model +
        "Versão do Cordova:" + device.cordova);
}

function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function getAjax(url, success) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status == 200) success(xhr.responseText);
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
    return xhr;
}

function postAjax(url, success) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('POST', url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status == 200) success(xhr.responseText);
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
    return xhr;
}


function onSuccess(position) {

    nomeLoja = "Gourmex";
    siteLoja = "gourmex.com";
    
    document.getElementById("nome-loja").innerHTML = nomeLoja;
    document.getElementById("dominio").innerHTML = siteLoja;

    longitude = position.coords.longitude;
    latitude = position.coords.latitude;
    timestamp = position.timestamp;

    if (Boolean(longitude && latitude)) {

        console.log("Longitude: " + longitude + "Latitude:" + latitude + "Timestamp:" + timestamp);

        try {

            getAjax("https://nominatim.openstreetmap.org/reverse?lat=" + latitude + "&lon=" + longitude + "&format=json", function (data) {
                var json = JSON.parse(data);

                var postCode = json.address.postcode;
                var road = json.address.road;
                var suburb = json.address.suburb;
                var city = json.address.city;
                var country = json.address.country;
                var enderecoCompleto = json.display_name;
                var lat = json.lat;
                var lon = json.lon;

                if (Boolean(postCode)) {
                    console.log("A tag CEP é" + postCode);
                    document.getElementById("cep").innerHTML = "Seu CEP é :" + postCode;
                }

                if (Boolean(lat)) {
                    console.log("A tag LATITUDE é" + lat);
                    document.getElementById("lat").innerHTML = "Latitude é :" + lat;
                }

                if (Boolean(lon)) {
                    console.log("A tag LONGITUDE é" + lon);
                    document.getElementById("lon").innerHTML = "Longitude é :" + lon;
                }

                if (Boolean(enderecoCompleto)) {
                    console.log("A tag ENDEREÇO COMPLETO é" + enderecoCompleto);
                    document.getElementById("endereco").innerHTML = "Seu endereço é :" + enderecoCompleto;
                }

                if (Boolean(road)) {
                    console.log("A tag RUA é" + road);
                    document.getElementById("rua").innerHTML = "Sua Rua é :" + road;
                }

                if (Boolean(suburb)) {
                    console.log("A tag BAIRRO é" + suburb);
                    document.getElementById("bairro").innerHTML = "Seu bairro é :" + suburb;
                }

                if (Boolean(city)) {
                    console.log("A tag CIDADE é" + city);
                    document.getElementById("cidade").innerHTML = "Seu cidade é :" + city;
                }

                if (Boolean(country)) {
                    console.log("A tag PAÍS é" + country);
                    document.getElementById("pais").innerHTML = "Seu país é :" + country;
                }


                document.getElementById("loader-pre-container").classList.add("hide-loader");

                alert("Seu Cep: " + postCode + "Endereço:" + enderecoCompleto);

                var pushID = document.getElementById("OneSignalUserID").textContent;
                var pushToken = document.getElementById("OneSignalPushToken").textContent;

                var urlRedirect = 'http://www.gourmex.com/?isApp=true';
                var urlRedirectFinal = urlRedirect + "&endereco.cep=" + encodeURI(postCode) + "&rua=" + encodeURI(road) + "&bairro=" + encodeURI(suburb) + "&cidade=" + encodeURI(city) + "&endereco.longitude=" + encodeURI(lon) + "&endereco.latitude=" + encodeURI(lat) + "&appUserId=" + pushID + "&appPushToken=" + pushToken;
                console.log(urlRedirectFinal);

                alert("Sua URL: " + urlRedirectFinal);

                // window.open = urlRedirectFinal;

                window.open(urlRedirectFinal, "_self");

                //    console.log(json); 
            });

        } catch (ex) {
            alert('error:' + ex);
        }

    }
}

// www.gourmex.com/?isApp=true
// &endereco.cep=undefined
// &rua=Avenida%20Mari%C3%A2ngela%20Pucci%20Ananias
// &bairro=undefined
// &cidade=Araraquara
// &pushID=f958f61f-0d91-46f8-97f1-4b5e3dbcf778
// &pushToken=APA91bHKcDYvDRQVW_dED9Yitd0YJt2Mr7-Kw685msm-iKCV0Me_qVYrhDRS_3Tv-pkxITOlg8Kvk_kkR59EwmPL8bUf-TP2uFYWeg1nr1TEd2C0xwBFZ2VItVFnRlWT4G2crNizTfXP

function onError(error) {

    alert("code: " + error.code +
        "message:" + error.message);

}


function abrirGourmexNormal() {
    window.open("http://www.gourmex.com/?isApp=true", "_self");
}


app.initialize();