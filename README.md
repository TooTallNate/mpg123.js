mpg123.js
=========


This module is [`libmpg123`][libmpg123] compiled to JavaScript using [emscripten][].


Compile Instructions
--------------------

This module comes with a known working compiled `libmpg123.js` file included.

In order to (re)generate this file, you need to build the "gyp-ified" version of
[`libmpg123`][libmpg123] using [emscripten][], and then run the
[`em-build.sh`](em-build.sh) file which specifies the C functions (symbols) to
export and outputs to the `libmpg123.js` file.


[libmpg123]: http://www.mpg123.de/api/
[emscripten]: https://github.com/kripken/emscripten
