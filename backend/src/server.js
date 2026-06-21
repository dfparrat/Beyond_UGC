require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { serviceCatalog } = require("./serviceCatalog");

const app = express();
const PORT = Number(process.env.PORT || 4000);
const PAYPAL_BASE_URL = process.env.PAYPAL_MODE === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === "null") {
      return callback(null, true);
    }
    return callback(null, true);
  },
}));

const toMoney = (value) => Number(value).toFixed(2);

const getServiceOrThrow = (serviceId) => {
  const service = serviceCatalog[serviceId];
  if (!service) {
    const error = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }
  return service;
};

const getPaypalAccessToken = async () => {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials are missing");
  }

  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");

  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return response.data.access_token;
};

const getBaseSiteUrl = () => process.env.PUBLIC_SITE_URL || "http://127.0.0.1:5500";

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/services", (_req, res) => {
  const services = Object.entries(serviceCatalog).map(([id, value]) => ({ id, ...value }));
  res.json({ services });
});

app.post("/api/payments/paypal/order", async (req, res, next) => {
  try {
    const { serviceId } = req.body;
    const service = getServiceOrThrow(serviceId);
    const accessToken = await getPaypalAccessToken();

    const returnUrl = process.env.PAYPAL_RETURN_URL || `${getBaseSiteUrl()}/pricing.html?payment=success&provider=paypal`;
    const cancelUrl = process.env.PAYPAL_CANCEL_URL || `${getBaseSiteUrl()}/pricing.html?payment=cancelled&provider=paypal`;

    const orderResponse = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: serviceId,
            custom_id: serviceId,
            description: service.name,
            amount: {
              currency_code: service.currency,
              value: toMoney(service.amount),
            },
          },
        ],
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
          user_action: "PAY_NOW",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const approveLink = (orderResponse.data.links || []).find((link) => link.rel === "approve");

    res.json({
      provider: "paypal",
      serviceId,
      orderId: orderResponse.data.id,
      approveUrl: approveLink ? approveLink.href : null,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/payments/paypal/capture", async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }

    const accessToken = await getPaypalAccessToken();
    const captureResponse = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json({
      provider: "paypal",
      orderId,
      status: captureResponse.data.status,
      details: captureResponse.data,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/payments/mercadopago/preference", async (req, res, next) => {
  try {
    const { serviceId } = req.body;
    const service = getServiceOrThrow(serviceId);

    if (!process.env.MP_ACCESS_TOKEN) {
      throw new Error("Mercado Pago access token is missing");
    }

    const successUrl = process.env.MP_SUCCESS_URL || `${getBaseSiteUrl()}/pricing.html?payment=success&provider=mercadopago`;
    const pendingUrl = process.env.MP_PENDING_URL || `${getBaseSiteUrl()}/pricing.html?payment=pending&provider=mercadopago`;
    const failureUrl = process.env.MP_FAILURE_URL || `${getBaseSiteUrl()}/pricing.html?payment=failed&provider=mercadopago`;

    const preferencePayload = {
      items: [
        {
          id: serviceId,
          title: service.name,
          quantity: 1,
          currency_id: service.currency,
          unit_price: Number(service.amount),
        },
      ],
      metadata: {
        serviceId,
      },
      back_urls: {
        success: successUrl,
        pending: pendingUrl,
        failure: failureUrl,
      },
      auto_return: "approved",
    };

    if (process.env.MP_NOTIFICATION_URL) {
      preferencePayload.notification_url = process.env.MP_NOTIFICATION_URL;
    }

    const preferenceResponse = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      preferencePayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      provider: "mercadopago",
      serviceId,
      preferenceId: preferenceResponse.data.id,
      initPoint: preferenceResponse.data.init_point,
      sandboxInitPoint: preferenceResponse.data.sandbox_init_point,
      checkoutUrl: preferenceResponse.data.init_point,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/webhooks/paypal", (req, res) => {
  console.log("PayPal webhook:", req.body);
  res.status(200).send("ok");
});

app.post("/api/webhooks/mercadopago", (req, res) => {
  console.log("Mercado Pago webhook:", req.body);
  res.status(200).send("ok");
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || error.response?.status || 500;
  const details = error.response?.data || null;

  console.error("Payment API error:", {
    message: error.message,
    statusCode,
    details,
  });

  res.status(statusCode).json({
    error: error.message || "Unexpected error",
    details,
  });
});

app.listen(PORT, () => {
  console.log(`Payments API running at http://localhost:${PORT}`);
});
