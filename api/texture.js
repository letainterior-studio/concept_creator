export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'No query' });

  const q = query.toLowerCase();
  
  let category = 'WoodFloor';
  let searchKeyword = '';
  
  if (/marble|calacatta|travertine|stone/.test(q)) {
    category = 'Marble';
    searchKeyword = /dark|black|grey/.test(q) ? 'dark' : 'light';
  } else if (/dark.*wood|walnut|veneer/.test(q)) {
    category = 'WoodFloor';
    searchKeyword = 'dark';
  } else if (/light.*wood|oak|pale/.test(q)) {
    category = 'WoodFloor';
    searchKeyword = 'light';
  } else if (/wood|floor/.test(q)) {
    category = 'WoodFloor';
  } else if (/brass|gold|bronze/.test(q)) {
    category = 'Metal';
    searchKeyword = 'gold';
  } else if (/black.*metal|steel/.test(q)) {
    category = 'Metal';
    searchKeyword = 'dark';
  } else if (/metal/.test(q)) {
    category = 'Metal';
  } else if (/tile|ceramic/.test(q)) {
    category = 'Tiles';
    searchKeyword = /dark|black/.test(q) ? 'dark' : 'light';
  } else if (/concrete|cement/.test(q)) {
    category = 'Concrete';
  } else if (/fabric|velvet/.test(q)) {
    category = 'Fabric';
  } else if (/plaster|wall/.test(q)) {
    category = 'Plaster';
  }

  try {
    let apiUrl = `https://ambientcg.com/api/v2/full_json?include=imageData&category=${category}&sort=Popular&limit=20`;
    if (searchKeyword) apiUrl += `&q=${searchKeyword}`;
    
    const r = await fetch(apiUrl);
    const d = await r.json();
    
    if (!d.foundAssets || d.foundAssets.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    let filtered = d.foundAssets;
    if (searchKeyword) {
      const f = d.foundAssets.filter(a => a.tags && a.tags.some(t => t.includes(searchKeyword)));
      if (f.length > 0) filtered = f;
    }
    
    const idx = Math.floor(Math.random() * Math.min(3, filtered.length));
    const asset = filtered[idx];
    const id = asset.assetId;
    const flatUrl = `https://acg-media.struffelproductions.com/file/ambientCG-Web/media/surface-preview/${id}/${id}_SQ_Color.jpg`;
    
    res.json({ url: flatUrl, name: asset.displayName });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
