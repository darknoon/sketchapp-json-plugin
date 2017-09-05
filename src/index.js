import invariant from 'invariant';
/*
This is pretty simplistic at the moment, since it doesn't handle references. More work is needed to actually
*/

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
  invariant(envOK, `sketchapp-json-plugin needs to run within the correct version of Sketch. You are running ${appVersion()}`);

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
  const decoded = MSJSONDictionaryUnarchiver.unarchiveObjectFromDictionary_asVersion_corruptionDetected_error(jsonTree,999,nil,nil);
  const mutableClass = decoded.class().mutableClass();
  return mutableClass.alloc().initWithImmutableModelObject(decoded);
}
