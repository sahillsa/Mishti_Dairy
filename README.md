# Mishti Farmer

Ionic Angular PWA and Capacitor demo app for a dairy product storefront.

## Demo Accounts

- User: `user@mishti.in` / `user123`
- Admin: `admin@mishti.in` / `admin123`

## Tech Stack

- Angular `21.2.x` with classic NgModule setup, not standalone components
- Ionic Angular `8.8.x`
- Capacitor `8.3.x`
- Angular service worker PWA
- Dummy local storage services for auth, cart, orders, and support queries

## Run Locally

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

## Build

```bash
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
- Home, products, cart, payment, orders, account
- Help & contact
- Protected admin dashboard, admin orders, admin queries
