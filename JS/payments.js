(function () {
  const API_BASE_URL = "http://localhost:4000";
  const serviceButtons = document.querySelectorAll(".pricing-service-item .pricing-service-btn");
  const serviceNameTarget = document.getElementById("selectedServiceName");
  const payWithPaypalBtn = document.getElementById("payWithPaypalBtn");
  const payWithMercadoPagoBtn = document.getElementById("payWithMercadoPagoBtn");
  const paymentModalElement = document.getElementById("paymentMethodModal");

  if (!paymentModalElement || !serviceButtons.length) {
    return;
  }

  const paymentModal = new bootstrap.Modal(paymentModalElement);
  const state = {
    selectedServiceId: null,
    selectedServiceName: null,
  };

  const showStatusAlert = (message, type) => {
    const listContainer = document.querySelector(".pricing-services-list");
    if (!listContainer) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "alert alert-" + type + " mb-4";
    wrapper.textContent = message;
    listContainer.parentElement.insertBefore(wrapper, listContainer);
  };

  const handleReturnFromCheckout = async () => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider");
    const paymentStatus = params.get("payment");

    if (!provider || !paymentStatus) {
      return;
    }

    if (provider === "paypal" && paymentStatus === "success") {
      const orderId = params.get("token");
      if (!orderId) {
        showStatusAlert("PayPal returned without an order token.", "warning");
        return;
      }

      const captureKey = "paypal-captured-" + orderId;
      if (sessionStorage.getItem(captureKey)) {
        showStatusAlert("PayPal payment already confirmed.", "success");
        return;
      }

      try {
        const response = await fetch(API_BASE_URL + "/api/payments/paypal/capture", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        if (!response.ok) {
          throw new Error("Capture failed");
        }

        showStatusAlert("PayPal payment confirmed successfully.", "success");
        sessionStorage.setItem(captureKey, "1");
      } catch (_error) {
        showStatusAlert("PayPal approval received, but capture failed. Please contact support.", "danger");
      }
      return;
    }

    if (paymentStatus === "success") {
      showStatusAlert("Payment approved successfully.", "success");
      return;
    }

    if (paymentStatus === "pending") {
      showStatusAlert("Your payment is pending confirmation.", "warning");
      return;
    }

    showStatusAlert("Payment was not completed.", "secondary");
  };

  const setLoadingState = (isLoading) => {
    payWithPaypalBtn.disabled = isLoading;
    payWithMercadoPagoBtn.disabled = isLoading;
    payWithPaypalBtn.textContent = isLoading ? "Redirecting..." : "Pay with PayPal";
    payWithMercadoPagoBtn.textContent = isLoading ? "Redirecting..." : "Pay with Mercado Pago";
  };

  const openServicePaymentModal = (serviceId, serviceName) => {
    state.selectedServiceId = serviceId;
    state.selectedServiceName = serviceName;
    serviceNameTarget.textContent = "Service: " + serviceName;
    paymentModal.show();
  };

  serviceButtons.forEach((button, index) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const serviceItem = button.closest(".pricing-service-item");
      const titleElement = serviceItem ? serviceItem.querySelector("h2") : null;
      const serviceName = titleElement ? titleElement.textContent.trim() : "Service " + (index + 1);
      const serviceId = "service-" + String(index + 1).padStart(2, "0");

      openServicePaymentModal(serviceId, serviceName);
    });
  });

  const createPaypalOrder = async () => {
    const response = await fetch(API_BASE_URL + "/api/payments/paypal/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serviceId: state.selectedServiceId }),
    });

    if (!response.ok) {
      throw new Error("Could not create PayPal order");
    }

    const payload = await response.json();
    if (!payload.approveUrl) {
      throw new Error("PayPal approve URL missing");
    }

    window.location.href = payload.approveUrl;
  };

  const createMercadoPagoPreference = async () => {
    const response = await fetch(API_BASE_URL + "/api/payments/mercadopago/preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serviceId: state.selectedServiceId }),
    });

    if (!response.ok) {
      throw new Error("Could not create Mercado Pago preference");
    }

    const payload = await response.json();
    const checkoutUrl = payload.checkoutUrl || payload.initPoint || payload.sandboxInitPoint;

    if (!checkoutUrl) {
      throw new Error("Mercado Pago checkout URL missing");
    }

    window.location.href = checkoutUrl;
  };

  payWithPaypalBtn.addEventListener("click", async () => {
    setLoadingState(true);
    try {
      await createPaypalOrder();
    } catch (error) {
      alert("Error starting PayPal checkout. Please try again.");
      setLoadingState(false);
    }
  });

  payWithMercadoPagoBtn.addEventListener("click", async () => {
    setLoadingState(true);
    try {
      await createMercadoPagoPreference();
    } catch (error) {
      alert("Error starting Mercado Pago checkout. Please try again.");
      setLoadingState(false);
    }
  });

  paymentModalElement.addEventListener("hidden.bs.modal", () => {
    setLoadingState(false);
  });

  handleReturnFromCheckout();
})();
