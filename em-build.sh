#!/bin/sh

EXPORTED_FUNCTIONS="["
EXPORTED_FUNCTIONS+="'_mpg123_init',"
EXPORTED_FUNCTIONS+="'_mpg123_exit',"
EXPORTED_FUNCTIONS+="'_mpg123_new',"
EXPORTED_FUNCTIONS+="'_mpg123_delete',"

EXPORTED_FUNCTIONS+="'_mpg123_param',"
EXPORTED_FUNCTIONS+="'_mpg123_getparam',"

EXPORTED_FUNCTIONS+="'_mpg123_feature',"

EXPORTED_FUNCTIONS+="'_mpg123_plain_strerror',"
EXPORTED_FUNCTIONS+="'_mpg123_strerror',"
EXPORTED_FUNCTIONS+="'_mpg123_errcode',"

EXPORTED_FUNCTIONS+="'_mpg123_decoders',"
EXPORTED_FUNCTIONS+="'_mpg123_supported_decoders',"
EXPORTED_FUNCTIONS+="'_mpg123_decoder',"
EXPORTED_FUNCTIONS+="'_mpg123_current_decoder',"

EXPORTED_FUNCTIONS+="'_mpg123_rates',"
EXPORTED_FUNCTIONS+="'_mpg123_encodings',"
EXPORTED_FUNCTIONS+="'_mpg123_encsize',"
EXPORTED_FUNCTIONS+="'_mpg123_format_none',"
EXPORTED_FUNCTIONS+="'_mpg123_format_all',"
EXPORTED_FUNCTIONS+="'_mpg123_format',"
EXPORTED_FUNCTIONS+="'_mpg123_format_support',"
EXPORTED_FUNCTIONS+="'_mpg123_getformat',"

EXPORTED_FUNCTIONS+="'_mpg123_open_feed',"
EXPORTED_FUNCTIONS+="'_mpg123_close',"

EXPORTED_FUNCTIONS+="'_mpg123_read',"
EXPORTED_FUNCTIONS+="'_mpg123_feed',"

EXPORTED_FUNCTIONS+="'_mpg123_framepos',"

EXPORTED_FUNCTIONS+="'_mpg123_info',"
EXPORTED_FUNCTIONS+="'_mpg123_safe_buffer',"
EXPORTED_FUNCTIONS+="'_mpg123_safe_buffer',"

EXPORTED_FUNCTIONS+="'_mpg123_getstate',"

EXPORTED_FUNCTIONS+="'_mpg123_meta_check',"
EXPORTED_FUNCTIONS+="'_mpg123_meta_free',"
EXPORTED_FUNCTIONS+="'_mpg123_id3',"

EXPORTED_FUNCTIONS+="]"

EMCC_DEBUG=1 emcc -g -o libmpg123.js out/Release/libmpg123.dylib -s EXPORTED_FUNCTIONS=$EXPORTED_FUNCTIONS
