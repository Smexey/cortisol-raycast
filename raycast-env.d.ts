/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `increase-cortisol` command */
  export type IncreaseCortisol = ExtensionPreferences & {}
  /** Preferences accessible in the `lower-cortisol` command */
  export type LowerCortisol = ExtensionPreferences & {}
  /** Preferences accessible in the `cortisol-menu-bar` command */
  export type CortisolMenuBar = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `increase-cortisol` command */
  export type IncreaseCortisol = {}
  /** Arguments passed to the `lower-cortisol` command */
  export type LowerCortisol = {}
  /** Arguments passed to the `cortisol-menu-bar` command */
  export type CortisolMenuBar = {}
}

