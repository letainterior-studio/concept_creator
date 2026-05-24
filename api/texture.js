export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'No query' });

  const UNSPLASH_KEY = process.env.UNSPLASH_KEY;

  // Build atmospheric search query
  const q = query + ' texture interior material close-up luxury';

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&orientation=squarish&client_id=${UNSPLASH_KEY}`;
    const r = await fetch(url);
    const d = await r.json();
    if (!d.results || d.results.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ url: d.results[0].urls.small });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
