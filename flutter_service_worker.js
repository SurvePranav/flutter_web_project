'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "6a23fde21c81a258386e2e144f814a99",
"assets/assets/background/background.png": "6dec81575c622b115a96607f22b6c457",
"assets/assets/background/background_mobile.png": "68db67217867c849bf269373dab1b71e",
"assets/assets/background/menu_background.png": "ce6933849f2a33ae5feffd0dbdc59b57",
"assets/assets/icons/computer_1.png": "efb79bba6aa03f9696036bbc7a2ff198",
"assets/assets/icons/features_icon.png": "e2ec8b54263f4e598fe42704985bba48",
"assets/assets/icons/home_1.png": "5a9fb7b2ee0d564919844e518bd1924c",
"assets/assets/icons/icon_1.png": "301943c86957fa8090b55a44c035ce28",
"assets/assets/icons/icon_2.png": "f3822273668fc6d5964a69ba79597286",
"assets/assets/icons/icon_3.png": "38d3320616974d8c6671469c311cdce3",
"assets/assets/icons/icon_4.png": "a64197b0849f9b589a0cc14ba775ea66",
"assets/assets/icons/icon_5.png": "0a210bcc73cd5dac5fa28eee0c240355",
"assets/assets/icons/icon_6.png": "3248624ea058415f39c9e2a5a86238c8",
"assets/assets/icons/menu_1_1.png": "af674345896d87817488eee4f0fa90d6",
"assets/assets/icons/testimonals_icon.png": "e8445dac599f67ca633e845184c483c2",
"assets/assets/logo/logo.png": "1654990a5ba61c06ca1fbdadc92792a8",
"assets/assets/logo/logo_small.png": "2292dd149fe74b9a75ca87e7ba4b7bf8",
"assets/assets/mobile_screens/mobile_top.png": "adec5bed74169fd735e889f0d3e9ec33",
"assets/assets/mobile_screens/mobile_top_small.png": "54c578a8659dd246c3d2473190535d74",
"assets/assets/mobile_screens/screen_1.png": "cafe8237f3148bd02b872b8504010180",
"assets/assets/mobile_screens/screen_2.png": "09315dab3fc5ecffec4df0da6f479d18",
"assets/assets/mobile_screens/screen_3.png": "cd739d9a20512830174ccf1f373c1654",
"assets/assets/mobile_screens/screen_4.png": "2cf0c506ec08d5b5bbf8500c2d6dc699",
"assets/assets/mobile_screens/screen_5.png": "55b5980ba4407f557578ede81816b60f",
"assets/assets/mobile_screens/screen_6.png": "d65ce276759f2ef9f8a39d55ae79636a",
"assets/assets/persons/person1.png": "e50dd6171b27b41b7a49f87b1257f3a0",
"assets/assets/persons/person2.png": "544b5c2e74799eb20fa9ecff51b856a7",
"assets/assets/persons/person3.png": "d7b88fb739f5f7b9e688e47fd6e8be33",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "00510717171032343ddf174017a2bea0",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "a85fcf6324d3c4d3ae3be1ae4931e9c5",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "43493b07058b225adc362ba86fcd9b4d",
"/": "43493b07058b225adc362ba86fcd9b4d",
"main.dart.js": "be010fc2af2a70cb6cbb12d2cc42cbfe",
"manifest.json": "5b57c09b7c85239eb47059bed1989620",
"version.json": "106aa206fa6c380204a2f07e90e79867"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
