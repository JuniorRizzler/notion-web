import { readFileSync } from "node:fs";
import path from "node:path";

const BODY_OPEN = /<body[^>]*>/i;
const HTML_OPEN = /<html[^>]*>/i;
const CAPTURED_TITLE = /<title\b[^>]*>[\s\S]*?<\/title>/gi;
const CAPTURED_ICON = /<link\b(?=[^>]*\brel=(?:"icon"|'icon'|icon))[^>]*>/gi;
const CAPTURED_STYLE = /<style\b[^>]*>[\s\S]*?<\/style>/gi;
const CAPTURED_WIDGET_MARKERS = [
  '<span id=PING_CONTENT_DLS_POPUP',
  '<span id="PING_CONTENT_DLS_POPUP"',
  '<div id=transcend-consent-manager',
  '<div id="transcend-consent-manager"'
];
const NAV_LOGO = /<a\s+class=globalNavigation_logo__i44_w\b[^>]*>[\s\S]*?<\/a>/i;
const FOOTER_LOGO = /<a\s+class=footer_logo__ssDpx\b[^>]*>[\s\S]*?<\/a>/i;

const animatedLogo = `
  <img class="studyconcept-brand-image" src="/brand/studyconcept-logo-animated.svg?v=original-flame-1" alt="" width="36" height="36" aria-hidden="true">
`;

function replaceLegacyLogos(markup: string) {
  return markup
    .replace(
      NAV_LOGO,
      `<a class="globalNavigation_logo__i44_w studyconcept-nav-brand" aria-label="StudyConcept – Home" href="/">${animatedLogo}</a>`
    )
    .replace(
      FOOTER_LOGO,
      `<a class="footer_logo__ssDpx studyconcept-footer-brand" aria-label="StudyConcept – Home" href="/">
        ${animatedLogo}
        <span class="studyconcept-wordmark">StudyConcept</span>
      </a>`
    );
}

function removeCapturedBrowserWidgets(markup: string) {
  const widgetStart = CAPTURED_WIDGET_MARKERS.reduce((earliest, marker) => {
    const index = markup.indexOf(marker);

    if (index === -1) return earliest;
    return earliest === -1 ? index : Math.min(earliest, index);
  }, -1);

  return widgetStart === -1 ? markup : markup.slice(0, widgetStart);
}

function removeCapturedExtensionStyles(markup: string) {
  return markup.replace(CAPTURED_STYLE, (style) =>
    style.includes("MCAFEE RESTRICTED CONFIDENTIAL") ? "" : style
  );
}

export function loadReferenceMarkup() {
  const source = readFileSync(path.join(process.cwd(), "public", "reference.html"), "utf8");
  const htmlMatch = HTML_OPEN.exec(source);
  const bodyMatch = BODY_OPEN.exec(source);

  if (!htmlMatch || htmlMatch.index === undefined || !bodyMatch || bodyMatch.index === undefined) {
    throw new Error("The source-backed reference document is missing its html or body element.");
  }

  const capturedHead = source.slice(htmlMatch.index + htmlMatch[0].length, bodyMatch.index);
  const capturedBody = source.slice(bodyMatch.index + bodyMatch[0].length);

  return {
    head: removeCapturedExtensionStyles(
      capturedHead.replace(CAPTURED_TITLE, "").replace(CAPTURED_ICON, "")
    ),
    body: replaceLegacyLogos(removeCapturedBrowserWidgets(capturedBody))
  };
}
