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
        // document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        document.addEventListener('deviceready', function () {
            // Enable to debug issues.
            // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

            var notificationOpenedCallback = function (jsonData) {
                console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            };

            window.plugins.OneSignal
                .startInit("50258523-927f-4c3e-864d-61d67b123a4d")
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

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

    },


    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

};

function showDeviceInfo() {
    alert("Plataforma: " + device.platform +
        "Versão:" + device.version +
        "Modelo:" + device.model +
        "Versão do Cordova:" + device.cordova);
}

function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function onSuccess(position) {
    var longitude = position.coords.longitude;
    var latitude = position.coords.latitude;
    var timestamp = position.timestamp;

    alert("Longitude: " + longitude +
        "Latitude:" + latitude +
        "Timestamp:" + timestamp);

}

function abrirGourmex() {
    window.open("http://www.gourmex.com/?isApp=true", "_self");
}

function onError(error) {

    alert("code: " + error.code +
        "message:" + error.message);

}

app.initialize();