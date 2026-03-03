# Deployment Runbook

## Topology

- `angularcleanup.shop`: shop SSR + static assets.
- `demo.angularcleanup.shop`: storefront static SPA.
- Shared API for both domains on `/api/*`.
- Public ingress through Nginx.
- Node runtimes managed by PM2:
  - `angular-cleanup-api` on port `3333`
  - `angular-cleanup-shop-ssr` on port `4000`

## Paths

- App deploy root on server: `${HETZNER_DEPLOY_PATH}` (GitHub Actions secret)
  - `${HETZNER_DEPLOY_PATH}/api`
  - `${HETZNER_DEPLOY_PATH}/shop`
  - `${HETZNER_DEPLOY_PATH}/storefront`
- Optional storefront nginx static root: `${HETZNER_STOREFRONT_STATIC_PATH}`
  - if set, workflow syncs `dist/apps/storefront/browser` here.

## Nginx

Template config:

- `deploy/nginx/angularcleanup.conf`

Recommended install path:

- `/etc/nginx/sites-available/angularcleanup.conf`
- symlink to `/etc/nginx/sites-enabled/angularcleanup.conf`
- Keep the `/.well-known/acme-challenge/` block enabled on port `80` for both domains.
- Ensure challenge root exists:

```bash
sudo mkdir -p /var/www/_letsencrypt
```

After changes:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## PM2

Template ecosystem:

- `deploy/pm2/ecosystem.config.cjs`

Bootstrap (once):

```bash
export CLEANUP_DEPLOY_ROOT=/var/www/angular-cleanup-shop
pm2 start deploy/pm2/ecosystem.config.cjs
pm2 save
```

Current CI deploy behavior:

- Restarts `angular-cleanup-api` only when API is affected.
- Restarts `angular-cleanup-shop-ssr` only when shop is affected.
- No PM2 restart for storefront-only changes.

Migration note:

- Legacy single-process app name `angular-cleanup-shop` is superseded by:
  - `angular-cleanup-api`
  - `angular-cleanup-shop-ssr`

## TLS / Certificates

Issue certs for both domains:

```bash
sudo certbot --nginx -d angularcleanup.shop -d demo.angularcleanup.shop
```

Renewal check:

```bash
sudo certbot renew --dry-run
```

## Validation

```bash
curl -I https://angularcleanup.shop/
curl -I https://demo.angularcleanup.shop/
curl https://angularcleanup.shop/api
curl https://demo.angularcleanup.shop/api
pm2 status
sudo nginx -t
```

Expected:

- Shop domain serves SSR/static.
- Demo domain serves storefront SPA (`try_files ... /index.html`).
- Both `/api` endpoints reach same API service.

## Rollback

1. Repoint `angularcleanup.shop` nginx routing back to previous frontend target.
2. Disable `demo.angularcleanup.shop` server block if needed.
3. Restart PM2 to prior process map:

```bash
pm2 restart angular-cleanup-api
pm2 restart angular-cleanup-shop-ssr
pm2 save
```

4. Revert latest deployment artifact directories under deploy root if required.
