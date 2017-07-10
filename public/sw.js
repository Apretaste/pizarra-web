'use strict';
importScripts('sw-toolbox.js');
toolbox.precache(["feed","chats","chats/with","profile","profile/of","res/css/pizarra.css"]);
toolbox.router.get('/res/images/*', toolbox.cacheFirst);
toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5});
