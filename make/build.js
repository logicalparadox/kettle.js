require('smoosh').config({
  "JAVASCRIPT": {
    "DIST_DIR": "./",
    "kettle": [
      "./src/copyright.js",
      "./src/kettle.js"
    ]
  },
  "JSHINT_OPTS": {
    "boss": true,
    "forin": false,
    "curly": true,
    "debug": false,
    "devel": false,
    "evil": false,
    "regexp": false,
    "undef": false,
    "sub": true,
    "white": true,
    "indent": 2,
    "whitespace": true,
    "asi": false
  }
}).run().build().analyze();