const MIN_DISPLAY_MS = 350;
const ASSET_WAIT_MS = 5000;
const FONT_WAIT_MS = 3000;

function waitForImage(img) {
  if (img.complete) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => resolve();
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    }),
  ]);
}

export async function waitForPageReady(rootEl) {
  const startedAt = Date.now();

  await withTimeout(
    document.fonts?.ready ?? Promise.resolve(),
    FONT_WAIT_MS
  );

  if (rootEl) {
    const images = rootEl.querySelectorAll("img");
    await withTimeout(
      Promise.all(Array.from(images).map(waitForImage)),
      ASSET_WAIT_MS
    );
  }

  await new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });

  const elapsed = Date.now() - startedAt;
  if (elapsed < MIN_DISPLAY_MS) {
    await new Promise((resolve) => {
      window.setTimeout(resolve, MIN_DISPLAY_MS - elapsed);
    });
  }
}
