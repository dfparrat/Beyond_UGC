(function () {
  const links = {
    stanStore: {
      general: "https://stan.store/BEYONDUGC",
    },
    beacons: {
      profile: "https://beacons.ai/beyondugc",
    },
    social: {
      tiktok: "https://www.tiktok.com/@dianapardougc",
      instagram: "https://www.instagram.com/dianapardougc",
    },
    contact: {
      whatsapp: "https://wa.me/+13073339811?text=Hi,%20I%20want%20to%20learn%20more%20about%20Beyond%20UGC",
    },
  };

  window.BUGC_LINKS = links;

  const normalizeText = (value) => (value || "").replace(/\s+/g, " ").trim().toLowerCase();
  const hasAny = (text, terms) => terms.some((term) => text.includes(term));

  const setHref = (anchor, href) => {
    if (anchor && href) {
      anchor.setAttribute("href", href);
    }
  };

  const applySocialLink = (anchor) => {
    const icon = anchor.querySelector("i");
    if (icon && icon.classList.contains("fa-tiktok")) {
      setHref(anchor, links.social.tiktok);
      return true;
    }

    if (icon && icon.classList.contains("fa-instagram")) {
      setHref(anchor, links.social.instagram);
      return true;
    }

    return false;
  };

  const applyContextualLinks = () => {
    const anchors = Array.from(document.querySelectorAll("a"));

    anchors.forEach((anchor) => {
      const text = normalizeText(anchor.textContent);
      const href = anchor.getAttribute("href") || "";
      const isInHeader = Boolean(anchor.closest("header"));
      const isInFooter = Boolean(anchor.closest("footer"));
      const isInHero = Boolean(anchor.closest(".hero"));
      const isInServiceArea = Boolean(anchor.closest("#hire") || anchor.closest(".pricing-services-list") || anchor.closest(".service-card"));

      if (anchor.classList.contains("social-icon") && applySocialLink(anchor)) {
        return;
      }

      if (href.startsWith("https://wa.me/")) {
        setHref(anchor, links.contact.whatsapp);
        return;
      }

      if (
        anchor.classList.contains("pricing-service-btn") ||
        (isInServiceArea && hasAny(text, ["get yours", "more information"])) ||
        (isInHero && hasAny(text, ["see portfolio services", "explore resources", "see coaching offers", "shop products", "explore services"])) ||
        (isInFooter && hasAny(text, ["shop products"])) ||
        (hasAny(text, ["pricing", "products", "resource", "offer", "portfolio services", "coaching offers", "explore services"]) && anchor.classList.contains("btn"))
      ) {
        setHref(anchor, links.stanStore.general);
        return;
      }

      if (
        (anchor.classList.contains("hire-now-btn") && (isInHeader || isInFooter)) ||
        anchor.classList.contains("btn-get-hired") ||
        anchor.classList.contains("cta-button") ||
        hasAny(text, ["book now", "schedule with us", "schedule a meeting", "book a call", "get guidance", "schedule a consultation", "book a strategy call", "contact us", "ask about coaching", "join today", "apply to join"])
      ) {
        setHref(anchor, links.beacons.profile);
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyContextualLinks);
  } else {
    applyContextualLinks();
  }
})();
