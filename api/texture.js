export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'No query' });

  // Map query to ambientCG category and search keywords
  const q = query.toLowerCase();
  
  let category = 'Wood';
  let keywords = '';
  
  if (/marble|stone|calacatta|travertine/.test(q)) {
    category = 'Marble'; keywords = q;
  } else if (/dark.wood|walnut|oak|veneer/.test(q)) {
    category = 'WoodFloor'; keywords = 'dark';
  } else if (/wood|floor/.test(q)) {
    category = 'WoodFloor'; keywords = q;
  } else if (/brass|gold|metal|steel/.test(q)) {
    category = 'Metal'; keywords = q;
  } else if (/tile|ceramic/.test(q)) {
    category = 'Tiles'; keywords = q;
  } else if (/concrete|cement/.test(q)) {
    category = 'Concrete'; keywords = q;
  } else if (/fabric|velvet/.test(q)) {
    category = 'Fabric'; keywords = q;
  } else if (/plaster|wall/.test(q)) {
    category = 'Plaster'; keywords = q;
  }

  try {
    const url = `https://ambientcg.com/api/v2/full_json?include=imageData&category=${category}&sort=Popular&limit=5`;
    const r = await fetch(url);
    const d = await r.json();
    
    if (!d.foundAssets || d.foundAssets.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    // Pick a random one from top 5 for variety
    const idx = Math.floor(Math.random() * Math.min(5, d.foundAssets.length));
    const asset = d.foundAssets[idx];
    
    // Get 512px thumbnail
    const imageUrl = asset.previewImage?.['512-JPG-242424'] || 
                     asset.previewImage?.['512-PNG'] ||
                     asset.previewImage?.['256-JPG-242424'];
    
    if (!imageUrl) return res.status(404).json({ error: 'No image' });
    
    res.json({ url: imageUrl, name: asset.displayName });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
