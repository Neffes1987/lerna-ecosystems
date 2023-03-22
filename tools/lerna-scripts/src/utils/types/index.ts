import fs from 'fs';

export { PackageJson } from './package.json.typings';
export type CallBackError = Error | undefined | null;
export type Callback<T = unknown> = (err: CallBackError, result: T) => void;
export type CallbackResult<T extends Callback> = T extends (
  err: CallBackError,
) => void
  ? Promise<void>
  : T extends Callback<infer TResult>
  ? Promise<TResult>
  : never;

declare module 'webpack' {
  interface InputFileSystem {
    stat(path: string, callback: Callback<fs.Stats>): void;
    readdir(path: string, callback: Callback<string[]>): void;
  }
}
