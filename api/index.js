export default async function handler(req, res) {
  // 1. Ambil ID Film dari URL (misal: /api?m=1367947)
  const { m } = req.query;
  const apiKey = '0ac7d6475232e17859d8e46b5dc9a435';

  if (!m) {
    return res.redirect('https://mediaxlus.github.io/Idmovie/');
  }

  try {
    // 2. Ambil data dari TMDB
    const response = await fetch(`https://api.themoviedb.org/3/movie/${m}?api_key=${apiKey}&language=id-ID`);
    const data = await response.json();

    const title = data.title || "Nonton Film Gratis";
    const description = data.overview || "Streaming gratis sepuasnya tanpa batas.";
    const image = data.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
      : `https://mediaxlus.github.io/Idmovie/poster.jpg`; // Gambar cadangan

    // 3. Kirim HTML khusus untuk Bot WhatsApp/FB agar muncul thumbnail
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta property="og:title" content="NONTON : ${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${image}">
        <meta property="og:type" content="video.movie">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image" content="${image}">
        <meta http-equiv="refresh" content="0;url=https://mediaxlus.github.io/Idmovie/?m=${m}">
      </head>
      <body>
        <p>Sedang mengalihkan ke pemutar film...</p>
        <script>window.location.href = "https://mediaxlus.github.io/Idmovie/?m=${m}";</script>
      </body>
      </html>
    `);
  } catch (error) {
    res.redirect(`https://mediaxlus.github.io/Idmovie/?m=${m}`);
  }
}
