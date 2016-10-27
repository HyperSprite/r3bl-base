// https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/32dbb649dbbbfc96f4b0274aec5740cb51d8e688/redux-devtools/redux-devtools.d.ts
// Type definitions for redux-devtools 3.0.0
// Project: https://github.com/gaearon/redux-devtools
// Definitions by: Petryshyn Sergii <https://github.com/mc-petry>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference path="../react/index.d.ts" />

declare module "redux-devtools" {
  import * as React from 'react'

  export interface IDevTools {
    new (): JSX.ElementClass
    instrument(): (opts: any) => any;
  }

  export function createDevTools(el: React.ReactElement<any>): IDevTools
  export function persistState(debugSessionKey: string): Function

  var factory: { instrument(): (opts: any) => any }

  export default factory;
}
