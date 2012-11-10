define(function(require) {
    var $ = require('zepto');

    var mediadb;
    if (!mediadb) init();


    function init() {
        var openRequest = window.indexedDB.open('podcasts', 1); // db version == 1

        openRequest.onsuccess = function(e) {
            mediadb = e.target.result;
            mediadb.onerror = function (event) {
                console.error("Error creating/accessing IndexedDB database");
            };
        }
        openRequest.onupgradeneeded = function(e) {
            var db = e.target.result;
            db.createObjectStore('podcasts');
            db.createObjectStore('streams');
        }
    }

    /** Cache a podcast URL to indexeddb. */
    function cache(item) {
        console.log('Caching: ' + item.get('url'));
        var req = new XMLHttpRequest();
        req.open('GET', item.get('url'), true);
        req.responseType = 'blob';
        req.onload = function() {
            console.log('All buffered, now storing.');
            var ta = mediadb.transaction('streams', 'readwrite');
            var store = ta.objectStore('streams');
            var req = store.put(req.response, item.get('url'));
            console.log(req.response);
        };
        req.onerror = function(error) {
            console.error(error);
        }
        req.send(null);
    }

    return {
        cache: cache
    }
});
