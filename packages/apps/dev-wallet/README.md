# Dev Wallet

Kadena Dev Wallet

#### Development

run the app in dev mode on port 1420

```bash
pnpm run dev
```

#### production

build the app in production mode; this will create dist folder with production
build optimization

```bash
pnpm run build
```

### Dev Wallet extension

this application can be run as an chrome extension the configuration is in the
`manifest.json`.

run `pnpm run build-dev` to create the files in the watch mode then load the
`dist` as an unpacked extension in [chrome extension](chrome://extensions/) (you
need to enable _developer mode_ and select _load unpacked_)

### Dev Wallet Desktop

The app is packages as a Tauri app; check
[dev-wallet-desktop](../dev-wallet-desktop/).

### Contributing

[Contributing](CONTRIBUTING.md)
[- Architecture](CONTRIBUTING.md#architecture)
[- ERD](CONTRIBUTING.md#erd)
```
