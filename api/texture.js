export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'No query' });

  const q = query.toLowerCase();
  
  // Determine category AND search keywords from query
  let category = 'WoodFloor';
  let searchKeyword = '';
  
  if (/marble|calacatta|travertine|stone|мрамор|камень/.test(q)) {
    category = 'Marble';
    if (/light|beige|white|warm|бежев|светл/.test(q)) searchKeyword = 'light';
    else if (/dark|black|grey|темн|черн/.test(q)) searchKeyword = 'dark';
    else searchKeyword = 'light'; // default marble to light
  } else if (/dark.wood|walnut|veneer|орех|темн.*дер/.test(q)) {
    category = 'WoodFloor';
    searchKeyword = 'dark';
  } else if (/light.*wood|oak|pale.*wood|светл.*дер|дуб/.test(q)) {
    category = 'WoodFloor';
    searchKeyword = 'light';
  } else if (/wood|шпон|мдф/.test(q)) {
    category = 'WoodFloor';
    searchKeyword = '';
  } else if (/brass|gold|bronze|латун|золот|бронз/.test(q)) {
    category = 'Metal';
    searchKeyword = 'gold';
  } else if (/black.*metal|steel|черн.*метал|сталь/.test(q)) {
    category = 'Metal';
    searchKeyword = 'dark';
  } else if (/metal|метал/.test(q)) {
    category = 'Metal';
    searchKeyword = '';
  } else if (/tile|ceramic|плитк|керамогран/.test(q)) {
    category = 'Tiles';
    if (/light|white|beige|светл|бел/.test(q)) searchKeyword = 'light';
    else if (/dark|black|темн/.test(q)) searchKeyword = 'dark';
  } else if (/concrete|cement|бетон/.test(q)) {
    category = 'Concrete';
    if (/light|grey|серый/.test(q)) searchKeyword = 'light';
  } else if (/fabric|velvet|ткань/.test(q)) {
    category = 'Fabric';
  } else if (/plaster|wall|штукатурк/.test(q)) {
    category = 'Plaster';
  }

  try {
    // Search with keyword filter if available
    let apiUrl = `https://ambientcg.com/api/v2/full_json?include=imageData&category=${category}&sort=Popular&limit=20`;
    if (searchKeyword) apiUrl += `&q=${searchKeyword}`;
    
    const r = await fetch(apiUrl);
    const d = await r.json();
    
    if (!d.foundAssets || d.foundAssets.length === 0) {
      // Fallback without keyword
      const r2 = await fetch(`https://ambientcg.com/api/v2/full_json?include=imageData&category=${category}&sort=Popular&limit=5`);
      const d2 = await r2.json();
      if (!d2.foundAssets || d2.foundAssets.length === 0) {
        return res.status(404).json({ error: 'Not found' });
      }
      const asset = d2.foundAssets[0];
      const id = asset.assetId;
      const flatUrl = `https://acg-media.struffelproductions.com/file/ambientCG-Web/media/surface-preview/${id}/${id}_SQ_Color.jpg`;
      return res.json({ url: flatUrl, name: asset.displayName });
    }
    
    // Filter by tag if searchKeyword set
    let filtered = d.foundAssets;
    if (searchKeyword) {
      filtered = d.foundAssets.filter(a => 
        a.tags && a.tags.some(t => t.includes(searchKeyword))
      );
      if (filtered.length === 0) filtered = d.foundAssets;
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
