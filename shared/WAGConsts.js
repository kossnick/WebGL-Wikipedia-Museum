/**
 * Wikipedia Art Gallery constants
 * Shared between client and server
 */

var WAGConsts = {
  UNKNOWN_METHOD: -1,
  SUCCESS       :  0,
  UNKNOWN       :  1,
  EMPTY_CATEGORY:  2,
  INVALID_ACTION:  3,
  NORTH         :  'N',
  SOUTH         :  'S',
  WEST          :  'W',
  EAST          :  'E'
};

if (typeof exports != "undefined") {
  for (var i in WAGConsts) {
    exports[i] = WAGConsts[i];
  }
}
