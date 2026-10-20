/**
 * "/" → language redirect.
 * Hosting redirects (vercel.json / public/_redirects) normally handle this before the page loads;
 * this page is the fallback: Amharic browsers go to /am/, everyone else to /en/.
 */
const script = `(function(){var l=(navigator.languages||[navigator.language||'']).join(',').toLowerCase();location.replace(/(^|,)am/.test(l)?'/am/':'/en/');})();`;

export default function RootPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/en/" />
      </noscript>
      <p style={{ padding: "2rem" }}>
        <a href="/en/" style={{ color: "inherit" }}>English</a> · <a href="/am/" style={{ color: "inherit" }}>አማርኛ</a>
      </p>
    </>
  );
}
