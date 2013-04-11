
require('./libmpg123.js');
var assert = require('assert');

// libmpg123 constants
var MPG123_DONE = -12;
var MPG123_NEW_FORMAT = -11;
var MPG123_NEED_MORE = -10;
var MPG123_ERR = -1;
var MPG123_OK = 0;

// libc
var malloc = Module.cwrap('malloc', 'number', ['number']);
var free = Module.cwrap('free', 'void', ['number']);

// create proxy functions that we can call from JavaScript
var mpg123_init = Module.cwrap('mpg123_init', 'number', []);
var mpg123_exit = Module.cwrap('mpg123_exit', 'void', []);
var mpg123_new = Module.cwrap('mpg123_new', 'number', ['string', 'number']);
var mpg123_delete = Module.cwrap('mpg123_delete', 'void', ['number']);

var mpg123_supported_decoders = Module.cwrap('mpg123_supported_decoders', 'number', []);

var mpg123_open_feed = Module.cwrap('mpg123_open_feed', 'number', ['number']);
var mpg123_read = Module.cwrap('mpg123_read', 'number', ['number', 'number', 'number', 'number']);
var mpg123_feed = Module.cwrap('mpg123_feed', 'number', ['number', 'number', 'number']);

var mpg123_getformat = Module.cwrap('mpg123_getformat', 'number', ['number', 'number', 'number']);



// XXX: better way to get these sizes?
var sizeof = {
  'int': 4,
  'pointer': 4
};



// return value
var r;

// init
r = mpg123_init();
assert.equal(0, r, 'mpg123_init() failed: ' + r);


// get an array of the "supported decoders"
var decodersPtr = mpg123_supported_decoders();
var decoders = [];
while (true) {
  var decoder = Module.getValue(decodersPtr, 'i32');
  if (0 === decoder) {
    // got NULL pointer
    break;
  }
  decodersPtr += 4;
  decoders.push(Module.Pointer_stringify(decoder));
}
console.error(decoders);


// create an mpg123 decoder handle
var errorPtr = malloc(sizeof.int);
var mh = mpg123_new(0, errorPtr);
var error = Module.getValue(errorPtr, 'i32');
assert.equal(0, error, 'mpg123_new() failed: ' + error);

// open the "feed" - tell mpg123 that we're going to feed to buffers manually
r = mpg123_open_feed(mh);
assert.equal(0, r, 'mpg123_open_feed() failed: ' + r);

// upon `stdin` "data" events, invoke `mpg123_feed()` and `mpg123_read()`
process.stdin.on('data', function (buf) {
  console.error('process.stdin "data" event (%d bytes)', buf.length);

  var bufPtr = malloc(buf.length);
  Module.writeArrayToMemory(buf, bufPtr);

  // feed
  r = mpg123_feed(mh, bufPtr, buf.length);
  assert.equal(0, r, 'mpg123_feed() failed: ' + r);
  free(bufPtr);

  var donePtr = malloc(8 /* sizeof size_t */);
  var done;

  var outLen = 8124;
  var outPtr = malloc(outLen);

  while (true) {
    // read

    r = mpg123_read(mh, outPtr, outLen, donePtr);

    if (MPG123_DONE == r) {
      // mp3 is done
      break;
    } else if (MPG123_NEED_MORE == r) {
      // need more data!
      break;
    } else if (MPG123_NEW_FORMAT === r) {
      // got a new format!
      var ratePtr = malloc(8 /* sizeof long? */);
      var channelsPtr = malloc(8 /* sizeof int */);
      var encodingPtr = malloc(8 /* sizeof int */);

      r = mpg123_getformat(mh, ratePtr, channelsPtr, encodingPtr);
      assert.equal(0, r, 'mpg123_getformat() failed: ' + r);

      var rate = Module.getValue(ratePtr, 'i32');
      var channels = Module.getValue(channelsPtr, 'i32');
      var encoding = Module.getValue(encodingPtr, 'i32');
      console.error('new format:', {
        rate: rate,
        channels: channels,
        encoding: encoding
      });

      continue;
    } else if (MPG123_OK == r) {
      // ok
      done = Module.getValue(donePtr, 'i32');
      console.error('decoded %s bytes!', done);

      var out = Module.HEAPU8.subarray(outPtr, outPtr + done);
      var b = new Buffer(out);
      //console.error(b);
      process.stdout.write(b);
      //ws.write(b);

    } else {
      // fail
      assert(0, 'mpg123_read() failed: ' + r);
    }
  }

  free(donePtr);
  free(outPtr);
});

process.stdin.on('end', function(){
  console.error('process.stdin "end" event');
});

process.on('end', close);

function close () {
  ws.end();

  // free the "handle" resources
  mpg123_delete(mh);
  free(mh);

  // exit
  mpg123_exit();
}
