# Mishti Farmer

Ionic Angular PWA and Capacitor demo app for a dairy product storefront.

## Demo Accounts

- User: `user@mishti.in` / `user123`
- Admin: `admin@mishti.in` / `admin123`

## Tech Stack

- Angular `21.2.x` with classic NgModule setup, not standalone components
- Ionic Angular `8.8.x` with Ionic CLI project structure
- Capacitor `8.3.x` with Android and iOS projects
- Angular service worker PWA
- Dummy local storage services for auth, catalog, cart, orders, inventory, and support queries

## Run Locally

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

## Ionic Commands

```bash
npm run ionic -- --help
npm run serve
npm run build
```

GitHub Pages build:

```bash
npm run build:github
```

## Capacitor

```bash
npm run cap:sync
npm run android
npm run ios
```

Android requires Android Studio. iOS builds require macOS with Xcode.

## Pages Included

- Login, register, forgot password
- User-only home, products, cart, payment, orders, order detail chat, account, help, query detail chat
- Admin-only dashboard, orders, order detail with status and tracking, inventory/product add, support queries, query status/chat, future control center

## GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`. After code is pushed to `main`, GitHub Pages builds `www` using `npm run build:github`.
