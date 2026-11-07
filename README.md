 <p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-light.png">
    <img alt="smarker" src="assets/logo-dark.png" width="420">
  </picture>
</p>

<p align="center">A markdown editor with no fuzz.</p>

Write in plain text blocks, see them rendered as markdown. That's it.

## What's a smark?

A **smark** is one block in smarker: a textbox with markdown parsing. Hit `+` to add one, `x` to delete one.

## Features

- Add and delete smarks
- Markdown rendering for every smark ([react-markdown](https://github.com/remarkjs/react-markdown))
- Desktop app via Tauri

## Planned

- Save to disk
- Edit/preview toggle inside each smark

## Stack

- [Tauri](https://tauri.app)
- React
- Vite

## Getting started

You'll need Node.js, Rust, and the [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your OS.

```zsh
git clone https://github.com/hamzadotjs/smarker.git
cd smarker
npm install
npm run tauri dev
```

To run just the frontend in the browser:

```zsh
npm run dev
```

## Build

```zsh
npm run tauri build
```

## Icons

Generate all the app icons from a single 1024x1024 PNG:

```zsh
npm run tauri icon ./app-icon.png
```
