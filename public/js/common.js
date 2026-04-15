async function api(url, options = {}) {
  const opts = {
    headers: { "Content-Type": "application/json" },
    ...options
  };
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data && data.error ? data.error : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

function qs(sel) {
  return document.querySelector(sel);
}

function setStatus(message, type = "ok") {
  const el = qs("#status");
  if (!el) return;
  el.className = `status ${type === "err" ? "err" : "ok"}`;
  el.textContent = message;
}

function clearStatus() {
  const el = qs("#status");
  if (!el) return;
  el.className = "status";
  el.textContent = "";
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resetForm(form) {
  form.reset();
  const hidden = form.querySelector('input[name="_mode"]');
  if (hidden) hidden.value = "create";
}

