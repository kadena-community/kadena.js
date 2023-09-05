# Troubleshooting

## Missing `canvas` on macOS

This issue might occur in a Silicon M1/M2 chip:

```text
Cannot find module '../build/Release/canvas.node'
```

Solution:

```sh
brew install pkg-config cairo pango libpng jpeg giflib librsvg
pnpm install --force
```
