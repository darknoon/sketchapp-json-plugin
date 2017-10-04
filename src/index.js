// @flow
/*
  This is pretty simplistic at the moment, since it doesn't handle references.
  More work is needed
*/
import invariant from 'invariant';

// Global types
declare var MSJSONDataArchiver: Object;
declare var MSJSONDictionaryUnarchiver: Object;
declare var NSBundle: Object;
type SketchObject = any;

/*
Versions based on discussion info: http://sketchplugins.com/d/316-sketch-version
*/
// Internal Sketch Version
// Using a high number to basically allow all versions
const SKETCH_HIGHEST_COMPATIBLE_VERSION = '999';
// External Sketch Version
const SKETCH_LOWEST_COMPATIBLE_APP_VERSION = '43';

const envOK =
  typeof MSJSONDataArchiver !== 'undefined' &&
  typeof MSJSONDictionaryUnarchiver !== 'undefined';

function appVersion(): string {
  if (typeof NSBundle !== 'undefined') {
    return NSBundle.mainBundle().infoDictionary().CFBundleShortVersionString;
  }
  return 'Unknown';
}

const checkEnv = () =>
  invariant(
    envOK,
    `sketchapp-json-plugin needs to run within Sketch v${SKETCH_LOWEST_COMPATIBLE_APP_VERSION}+. You are running version: ${appVersion()}`
  );

export function appVersionSupported(): boolean {
  return envOK;
}

// Converts an object, eg from context.selection into its JSON string representation
export function toSJSON(sketchObject: SketchObject): ?string {
  checkEnv();
  if (!sketchObject) {
    return null;
  }
  const imm = sketchObject.immutableModelObject();
  // eslint-disable-next-line no-underscore-dangle
  return MSJSONDataArchiver.archiveStringWithRootObject_error_(imm, null);
}

// Takes a Sketch JS object tree and turns it into a native object. May throw on invalid data
export function fromSJSONDictionary(
  jsTree: {
    [string]: any
  },
  version: ?string = SKETCH_HIGHEST_COMPATIBLE_VERSION
): ?SketchObject {
  checkEnv();
  const decoded = MSJSONDictionaryUnarchiver.unarchiveObjectFromDictionary_asVersion_corruptionDetected_error(
    jsTree,
    version,
    null,
    null
  );
  const mutableClass = decoded.class().mutableClass();
  return mutableClass.alloc().initWithImmutableModelObject(decoded);
}

// Takes a Sketch JSON tree and turns it into a native object.
export function fromSJSON(json: string, version: ?string): ?SketchObject {
  checkEnv();
  const dict = JSON.parse(json);
  if (!dict) return null;

  // eslint-disable-next-line no-underscore-dangle
  if (dict._class.length <= 0) {
    return null;
  }
  return fromSJSONDictionary(dict, version);
}
