/**
 * JSON Schema for node/npm package.json
 */
export type PackageJson = Structure & {
  scripts: {
    test?: string;
    [k: string]: unknown;
  };
  author: PersonObject;
  contributors?: PersonObject[];
  maintainers?: PersonObject[];
  /**
   * @description кастомное свойство для копирования ассетов, который не могут быть нормально импортированы
   */
  assets?: { [index: string]: string };
  [k: string]: unknown;
};
export type Name = string;
export type Semver = string;
export type Person = string | PersonObject;
export type Email = string;
export type UriHttp = string;
export type Path = string;
export type Licence = string | LicenceObject;
export type Identifier = string;

export interface Structure {
  name?: Name;
  version?: Semver;
  description?: string;
  keywords?: Name[];
  author?: Person;
  contributors?: Person[];
  maintainers?: Person[];
  homepage?: UriHttp;
  repository?: TypeUrl;
  man?: Path | Path[];
  bugs?:
    | UriHttp
    | {
        url: UriHttp;
        email?: Email;
        [k: string]: unknown;
      };
  license?: Licence;
  licenses?: Licence[];
  private?: boolean;
  preferGlobal?: boolean;
  engines?: StringMap;
  engineStrict?: boolean;
  main?: Path;
  bin?: Path | PathMap;
  files?: Path[];
  os?: Identifier[];
  cpu?: Identifier[];
  config?: {
    [k: string]: unknown;
  };
  publishConfig?: {
    [k: string]: unknown;
  };
  directories?: {
    lib?: Path;
    bin?: Path;
    man?: Path;
    doc?: Path;
    example?: Path;
    [k: string]: unknown;
  };
  scripts?: StringMap;
  dependencies?: StringMap;
  devDependencies?: StringMap;
  bundledDependencies?: StringMap;
  bundleDependencies?: StringMap;
  optionalDependencies?: StringMap;
  peerDependencies?: StringMap;
  [k: string]: unknown;
}
export interface PersonObject {
  name: string;
  email?: Email;
  url?: UriHttp;
  [k: string]: unknown;
}
export interface TypeUrl {
  type: string;
  url: UriHttp;
}
export interface LicenceObject {
  type?: string;
  url?: UriHttp;
}
export interface StringMap {
  /**
   * This interface was referenced by `StringMap`'s JSON-Schema definition
   * via the `patternProperty` ".+".
   */
  [k: string]: string;
}
export interface PathMap {
  /**
   * This interface was referenced by `PathMap`'s JSON-Schema definition
   * via the `patternProperty` ".+".
   */
  [k: string]: string;
}
