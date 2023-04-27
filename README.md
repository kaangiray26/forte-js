# forte-js
Forte API client for JavaScript

## Features
* forte-js provides a simple interface for making API calls to Forte.
* forte-js supports only the browser environment.

## Including in your project
* [ft.js](https://kaangiray26.github.io/forte-js/ft.js)
* [ft.min.js](https://kaangiray26.github.io/forte-js/ft.min.js) (12.6 kB)

When run in a browser, forte.js will be assigned to the global variable and will be accessible via `window.ft`.

## Examples

```
// Login to a Forte server
await window.ft.login("http://localhost:3000", "forte", "alternative");

// Getting random tracks
let tracks = await ft.random_tracks();
console.log(tracks);
```

## Methods
### ft.login
-> Login using credentials and get session

Parameters
| name     | type     | data type | description          |
| -------- | -------- | --------- | -------------------- |
| server   | required | string    | Forte server address |
| username | required | string    | Forte username       |
| token    | required | string    | Forte user token     |

Responses
| type    | data type | response                         |
| ------- | --------- | -------------------------------- |
| success | boolean   | true                             |
| error   | error     | Failed to login via credentials. |