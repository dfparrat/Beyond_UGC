# Beyond UGC Payments Backend

Express API to process payments per service using PayPal and Mercado Pago.

## 1) Install dependencies

```bash
cd backend
npm install
```

## 2) Configure environment variables

1. Copy `.env.example` to `.env`
2. Set your credentials:
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `MP_ACCESS_TOKEN`

## 3) Run API

```bash
npm run dev
```

Server starts on `http://localhost:4000`.

## Endpoints

- `GET /api/health`
- `GET /api/services`
- `POST /api/payments/paypal/order`
- `POST /api/payments/paypal/capture`
- `POST /api/payments/mercadopago/preference`
- `POST /api/webhooks/paypal`
- `POST /api/webhooks/mercadopago`

## Body examples

### Create PayPal order

```json
{
  "serviceId": "service-01"
}
```

### Capture PayPal order

```json
{
  "orderId": "5O190127TN364715T"
}
```

### Create Mercado Pago preference

```json
{
  "serviceId": "service-01"
}
```

## Frontend integration

`pricing.html` loads `JS/payments.js`. Each service button maps to a service ID (`service-01` to `service-18`) and opens a modal to choose the gateway.
