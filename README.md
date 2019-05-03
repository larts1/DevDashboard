# serviceworkerapi

## Description

https://serviceworker-api.firebaseapp.com/ is service worker periodic sync powered dashboard. Dashboard dosen't only stores chart positions and visualizations in cloud, all data is handled locally and therefore offline usage in closed system is possible.

Can be used to create fast and flexible dashboard, that contains any information that can be reached through clients browser. However project had major set back due https://developer.mozilla.org/en-US/docs/Web/API/SyncManager being set off the standardisation track, and not being supported by any major browser.

So at the moment data can only be collected while web page is actually open and active.

Demo scene available at `https://serviceworker-api.firebaseapp.com/` -> menu -> load demoscene. This demonstrates all premade data entry fetchers. How ever chart position and location can be a bit off due screen size differences.
## Features

Currently there is 4 different data collection methods:
   * Static json
   * Response time of an API
   * Size of an API body payload
   * Status code of API

To API ones you provide URL where browser sends the request. **NOTICE** That as all browser requests this can be stopped if request is blocked by your browsers CORS-check. To prevent this use service like `https://cors-anywhere.herokuapp.com/` (so instead of `www.google.fi`, use `https://cors-anywhere.herokuapp.com/google.fi` ). This however dosen't work in closed systems and in those you have to provide CORS-header or CORS-proxy your self.

### Future features

Plan is that user can provide own javascript file through UI which can perform more complicated requests. Currently this is only possible by addin fetcher to `src/Fetchers` and hosting this service yourself.

Also planned to replace firestore by saving to local filesystem. This makes a lot more sense considering the intended offline use.

## Project setup
```
npm install

```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
