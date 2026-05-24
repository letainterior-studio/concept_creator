export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'No query' });

  const q = query.toLowerCase();

  // Map material to Poly Haven categories/tags
  let category = 'wood';
  if (/marble|calacatta|travertine/.test(q)) {
    category = /dark|black/.test(q) ? 'marble' : 'marble';
  } else if (/wood|walnut|oak|veneer|floor/.test(q)) {
    category = 'wood';
  } else if (/brass|gold|bronze|copper|metal/.test(q)) {
    category = 'metal';
  } else if (/tile|ceramic/.test(q)) {
    category = 'tile';
  } else if (/concrete|cement/.test(q)) {
    category = 'concrete';
  } else if (/fabric|velvet|textile/.test(q)) {
    category = 'fabric';
  } else if (/plaster|wall|stucco/.test(q)) {
    category = 'plaster';
  } else if (/stone/.test(q)) {
    category = 'stone';
  }

  try {
    // Get list of textures in category
    const listUrl = `https://api.polyhaven.com/assets?type=textures&categories=${category}`;
    const r = await fetch(listUrl, {
      headers: { 'User-Agent': 'LetaConceptCreator/1.0' }
    });
    const data = await r.json();
    
    const keys = Object.keys(data);
    if (!keys.length) return res.status(404).json({ error: 'Not found' });

    // Pick random one from first 10
    const idx = Math.floor(Math.random() * Math.min(10, keys.length));
    const assetId = keys[idx];

    // Get the render preview image (flat texture view)
    const previewUrl = `https://cdn.polyhaven.com/asset_img/thumbs/${assetId}.png?width=512`;

    res.json({ url: previewUrl, name: assetId });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
