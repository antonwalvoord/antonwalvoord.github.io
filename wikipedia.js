async function loadPOTD() {
    const d = new Date(); // Wikipedia's Main Page rolls over at 00:00 UTC
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const templateTitle = `Template:POTD_protected/${dateStr}`;

    const base = 'https://en.wikipedia.org/w/api.php';

    // Step 1: get the image filename embedded in today's POTD template
    const step1 = await fetch(`${base}?action=query&prop=images&titles=${encodeURIComponent(templateTitle)}&format=json&origin=*`);
    const step1Data = await step1.json();
    const pages = step1Data.query.pages;
    const page = Object.values(pages)[0];
    const filename = page.images[0].title; // e.g. "File:Something.jpg"

    // Step 2: get a scaled-down thumbnail URL + caption
    const step2 = await fetch(
        `${base}?action=query&prop=imageinfo&titles=${encodeURIComponent(filename)}` +
        `&iiprop=url|extmetadata&iiurlwidth=400&format=json&origin=*`
    );
    const step2Data = await step2.json();
    const imgPage = Object.values(step2Data.query.pages)[0];
    const info = imgPage.imageinfo[0];
    const caption = info.extmetadata?.ImageDescription?.value || '';

    document.getElementById('potd').innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
        <img class="potd-image" src="${info.thumburl}" width="${info.thumbwidth}" height="${info.thumbheight}" alt="${filename}">
        <blockquote>"${caption}"</blockquote>
    </div>
    <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(filename)}" target="_blank">View on Wikipedia</a>
    `;
}
loadPOTD();
