# Sketch.app JSON Plugin library

Provides utilities for basing your plugins on the JSON format instead of learning all of the sketch private API objects.

This is indended to be used within the Sketch plugin environment; to generate sketch files entirely in node.js, you need a different library.

There are 2 main APIs:

    // Converts an object, eg from context.selection into a JSON string representation
    toSJSON(sketchObject);

    // Takes a Sketch JSON tree and turns it into a native object. May throw on invalid data
    fromSJSON(json);


Additionally, if you would like to create layers from a dictionary, you want this:

    // Pass in a javascript object literal
    const obj: SJTextLayer = {
    "_class": "text",
    "do_objectID": generateID(),
    "frame": {
      "_class": "rect",
      "constrainProportions": false,
      "height": 17,
      "width": 117,
      "x": 146,
      "y": 253
    },
    "isVisible": true,
    "name": "My hot hot ABCD",
    ...

    };
    fromSJSONObject(obj);

If you want to verify your version of Sketch is compatible (v43+):

    import JSONPlugin from 'sketchapp-json-plugin';
    if (JSONPlugin.appVersionSupported()) {
      const layer = SJSON.fromSJSON(myJSON);
      ...
      document.pages[0].addLayers([layer]);
    } else {
      // Use old code path
    }
