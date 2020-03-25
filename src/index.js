import invariant from 'invariant';
/*
This is pretty simplistic at the moment, since it doesn't handle references. More work is needed to actually
*/

/*
Versions based on discussion info: http://sketchplugins.com/d/316-sketch-version
*/
// Internal Sketch Version (ex: 95 => v47 and below)
const SKETCH_HIGHEST_COMPATIBLE_VERSION = '95';
// External Sketch Version
const SKETCH_LOWEST_COMPATIBLE_APP_VERSION = '43';

let envOK =
   (typeof MSJSONDataArchiver !== 'undefined')
&& (typeof MSJSONDictionaryUnarchiver !== 'undefined')

function appVersion() {
  if (typeof NSBundle !== 'undefined') {
    return NSBundle.mainBundle().infoDictionary().CFBundleShortVersionString;
  } else {
    return undefined;
  }
}

const _checkEnv = () =>
  invariant(envOK, `sketchapp-json-plugin needs to run within Sketch v${SKETCH_LOWEST_COMPATIBLE_APP_VERSION}+. You are running ${appVersion()}`);

export function appVersionSupported() {
  return envOK;
}

// Converts an object, eg from context.selection into its JSON string representation
export function toSJSON(sketchObject) {
  _checkEnv();
  if (!sketchObject) {
    return null;
  }
  const imm = sketchObject.immutableModelObject();
  return MSJSONDataArchiver.archiveStringWithRootObject_error_(imm, null);
}

export function fromSJSON(json) {
  _checkEnv();
  const dict = JSON.parse(json);
  if (!dict) return null;
  if (dict._class.length <= 0) {
    return null;
  }
  return fromSJSONDictionary(dict);
}

// Takes a Sketch JSON tree and turns it into a native object. May throw on invalid data
export function fromSJSONDictionary(jsonTree) {
  _checkEnv();
  const uace = MSJSONDictionaryUnarchiver.unarchivedObjectFromDictionary_asVersion_corruptionDetected_error || MSJSONDictionaryUnarchiver.unarchiveObjectFromDictionary_asVersion_corruptionDetected_error;
  const decoded = uace(jsonTree, SKETCH_HIGHEST_COMPATIBLE_VERSION, null, null);
  const mutableClass = decoded.class().mutableClass();
  return mutableClass.alloc().initWithImmutableModelObject(decoded);
}
