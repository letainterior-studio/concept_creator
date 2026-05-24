// Vercel serverless function — ищет текстуру через Unsplash
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'No query' });

  const UNSPLASH_KEY = process.env.UNSPLASH_KEY;
  
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' texture material close-up')}&per_page=1&orientation=squarish&client_id=${UNSPLASH_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    const photo = data.results[0];
    res.json({ url: photo.urls.small, thumb: photo.urls.thumb });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
