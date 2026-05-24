export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'No query' });

  const q = query.toLowerCase();
  
  let category = 'WoodFloor';
  
  if (/marble|stone|calacatta|travertine/.test(q)) category = 'Marble';
  else if (/wood|walnut|oak|veneer|floor/.test(q)) category = 'WoodFloor';
  else if (/brass|gold|metal|steel/.test(q)) category = 'Metal';
  else if (/tile|ceramic/.test(q)) category = 'Tiles';
  else if (/concrete|cement/.test(q)) category = 'Concrete';
  else if (/fabric|velvet/.test(q)) category = 'Fabric';
  else if (/plaster|wall/.test(q)) category = 'Plaster';

  try {
    const url = `https://ambientcg.com/api/v2/full_json?include=imageData&category=${category}&sort=Popular&limit=5`;
    const r = await fetch(url);
    const d = await r.json();
    
    if (!d.foundAssets || d.foundAssets.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    const idx = Math.floor(Math.random() * Math.min(5, d.foundAssets.length));
    const asset = d.foundAssets[idx];
    const id = asset.assetId;
    
    // Use the flat color texture from CDN directly
    const flatUrl = `https://acg-media.struffelproductions.com/file/ambientCG-Web/media/surface-preview/${id}/${id}_SQ_Color.jpg`;
    
    res.json({ url: flatUrl, name: asset.displayName });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
