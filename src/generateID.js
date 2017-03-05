/* @flow */

declare class MSModelObjectCommon {
  generateObjectID():string;
}

export const generateID = (): string => "" + MSModelObjectCommon.generateObjectID();
