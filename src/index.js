/* @flow */

/*
This is pretty simplistic at the moment, since it doesn't handle references. More work is needed to actually
*/

let envOK = (
   MSJSONDataArchiver !== undefined
&& MSJSONDictionaryUnarchiver !== undefined
);

function appVersion() {
  if (NSBundle !== undefined) {}
    return NSBundle.mainBundle().infoDictionary().CFBundleShortVersionString;
  } else {
    return undefined;
  }
}

const _checkEnv() => {
  if (!envOK) {
    throw new Error("sketchapp-json-plugin needs to run within the correct version of Sketch. You are running " + appVersion());
  }
}

export function appVersionSupported(): bool {
  return envOK;
}

// Converts an object, eg from context.selection into its JSON string representation
export function toSJSON(sketchObject: any) {
  _checkEnv();
  if (!sketchObject) {
    return null;
  }
  const imm = o.immutableModelObject();
  return MSJSONDataArchiver.archiveStringWithRootObject_error_(imm, null);
}

export function fromSJSON(json: string) {
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
  const decoded = MSJSONDictionaryUnarchiver.alloc().initForReadingFromDictionary(jsonTree).decodeRoot();
  const mutableClass = decoded.class().mutableClass();
  return mutableClass.alloc().initWithImmutableModelObject(decoded);
}