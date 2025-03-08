export function googleTagBodyContent(tagId: string) {
    const tagNoScript = `
<noscript>
    <iframe
        title="google-tag"
        src="https://www.googletagmanager.com/ns.html?id=${tagId}"
        height="0"
        width="0"
        style="display:none;visibility:hidden">
    </iframe>
</noscript>`;

    return tagNoScript;

}

export function sendGoogleEvent(name: string, data: any) {
    //@ts-ignore
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('event', name, data);
}

export function googleAnalitycsHeadContent(id: string) {
    return `
        <script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${id}', { debug_mode: true });
</script>
        `
}

export function googleTagHeadContent(tagId: string) {
    return `
        <script>
            (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start':
                        new Date().getTime(), event: 'gtm.js'
                });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', '${tagId}');
        </script>
        `
}

