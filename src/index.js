-
 /*
 This is pretty simplistic at the moment, since it doesn't handle references. More work is needed to actually
 */

-let envOK = (
-   MSJSONDataArchiver !== undefined
-&& MSJSONDictionaryUnarchiver !== undefined
-);
+const envOK = () =>
+  (typeof MSJSONDataArchiver !== 'undefined') &&
+    (typeof MSJSONDictionaryUnarchiver !== 'undefined');

 function appVersion() {
   if (NSBundle !== undefined) {
@@ -17,13 +15,13 @@ function appVersion() {
 }

 const _checkEnv = () => {
-  if (!envOK) {
+  if (!envOK()) {
     throw new Error("sketchapp-json-plugin needs to run within the correct version of Sketch. You are running " + appVersion());
   }
 }

 export function appVersionSupported() {
-  return envOK;
+  return envOK();
 }

 // Converts an object, eg from context.selection into its JSON string representation
