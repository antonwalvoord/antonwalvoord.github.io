
// Files to render
const md_files = [
    "100-hardware-firmware.md",
    "101-maze-robot.md",
    "102-sar-adc.md",
    "103-pdm.md",
    "200-software.md",
    "201-arm-game.md",
    "202-blockchain.md",
]

const VIDEO_EXTENSIONS = /\.(mp4|webm)(\?.*)?$/i;

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/\//g, '-')   // "/" -> dashes
        .replace(/[^\w\s-]/g, '')   // strip punctuation
        .replace(/\s+/g, '-');     // spaces -> dashes
}

function renderVideo(href, title, text) {
    // title field doubles as an options string, e.g. "autoplay,loop,muted"
    const opts = (title || '').split(',').map(s => s.trim());
    const autoplay = opts.includes('autoplay') ? 'autoplay' : '';
    const loop = opts.includes('loop') ? 'loop' : '';
    const muted = opts.includes('muted') || opts.includes('autoplay') ? 'muted' : ''; // autoplay requires muted in most browsers
    const controls = opts.includes('nocontrols') ? '' : 'controls';
    const playsinline = 'playsinline'; // needed for autoplay on iOS

    return `
        <video class="project-video" ${controls} ${autoplay} ${loop} ${muted} ${playsinline} preload="metadata">
            <source src="${href}" type="video/${href.split('.').pop().split('?')[0]}">
            Your browser doesn't support embedded video. <a href="${href}">Download it instead</a>.
        </video>
    `;
}

function render() {
    const renderer = new marked.Renderer();
    renderer.heading = function (text, level) {
        const id = slugify(text);
        return `<h${level} id="${id}">${text}</h${level}>\n`;
    };

    renderer.link = function (href, title, text) {
        return `<a href="${href}" target="_blank" rel="noopener noreferrer"${title ? ` title="${title}"` : ''}>${text}</a>`;
    };

    renderer.image = (href, title, text) => {
        if (VIDEO_EXTENSIONS.test(href)) {
            return renderVideo(href, title, text);
        }
        return `<img src="${href}" alt="${text}" class="project-img" loading="lazy">`;
    };

    renderer.codespan = (code) => {
        return `<code class="inline-code">${code}</code>`;
    };

    Promise.all(
        md_files.map(file => fetch("content/"+file)
            .then(res => res.text()))
    ).then(md_contents => {
    md_contents.forEach((md, i) => {
        const section = document.createElement('div');
        section.className = 'md-section';
        section.dataset.source = "content/"+md_files[i];
        section.innerHTML = marked.parse(md, { renderer });
        document.getElementById('content').appendChild(section);
        });
    });
}
render();