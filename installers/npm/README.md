# UNOFFICIAL ELM PACKAGE

**This is not the official `elm` npm package!**

_You probably don’t need this package anymore:_

- Since version 0.19.2-0 of the official `elm` npm package, all the improvements from `@lydell/elm` have been incorporated. Both the npm package meta improvements, and Linux ARM support. (But not Raspberry PI, but that’s pretty niche.)
- `@lydell/elm` _only_ supports Elm 0.19.1 – not 0.19.2 and later.

This is a fork of the Elm _npm package._ It contains the _same 0.19.1 binaries_ as the official package installs – plus a couple of new ones. That’s the only point of this package.

- Elm 0.19.1 for Linux ARM 64-bit (useful for example in Docker on macOS ARM), [compiled by Mario Rogic](https://github.com/supermario/elm-tooling-compiler/commit/3af7f31a0ad5c4c7fe6df51220b3ec3e1d62a643).
- Elm 0.19.1 for Raspberry PI Linux ARM 32-bit, [compiled by dmy](https://github.com/dmy/elm-raspberry-pi).

```
npm install @lydell/elm
```

> **History:** This package was originally used for testing a better way to package Elm, which was then merged into the official `elm` package and released as version 0.19.1-6 – except the Linux ARM 64-bit (which was added in version 0.19.2-0) and Raspberry PI binaries. The `@lydell/elm` package is still around in case you need those.

👉 [Official elm package](https://www.npmjs.com/package/elm)
