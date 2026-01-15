export default async function handler(req, res) {
  // 1. Tangkap ID dari parameter m (hasil dari vercel.json rewrite)
  const { m } = req.query;
  const apiKey = '0ac7d6475232e17859d8e46b5dc9a435';
  
  // Link tujuan akhir di GitHub
  const githubUrl = `https://mediaxlus.github.io/Idmovie/mvp.html`;

  // Jika tidak ada ID, kembalikan ke beranda GitHub
  if (!m) {
    return res.redirect('https://mediaxlus.github.io/Idmovie/');
  }

  try {
    // 2. Ambil data dari TMDB untuk Metadata (Thumbnail/Preview)
    const response = await fetch(`https://api.themoviedb.org/3/movie/${m}?api_key=${apiKey}&language=id-ID`);
    const data = await response.json();

    const title = data.title ? data.title.toUpperCase() : "NONTON FILM GRATIS";
    const description = data.overview 
      ? data.overview.substring(0, 160) + "..." 
      : "Streaming film kualitas HD subtitle Indonesia gratis tanpa pendaftaran.";
    
    // Gambar Backdrop (w780 supaya ringan buat WhatsApp)
    const image = data.backdrop_path 
      ? `https://image.tmdb.org/t/p/w780${data.backdrop_path}` 
      : `https://mediaxlus.github.io/Idmovie/poster.jpg`;

    // 3. Kirim HTML berisi Meta Tag (Agar WA muncul gambar) dan Script Redirect
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>${title} - ID MOVIE</title>
        
        <meta property="og:type" content="video.movie">
        <meta property="og:title" content="▶️ NONTON: ${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${image}">
        <meta property="og:url" content="${githubUrl}?id=${m}">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image" content="${image}">

        <meta http-equiv="refresh" content="0;url=${githubUrl}?id=${m}">
        
        <style>
          body { background: #0a0a0a; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: sans-serif; }
          .loader { border: 3px solid #f3f3f3; border-top: 3px solid #e50914; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin-bottom: 15px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .container { text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="loader"></div>
          <p>Menghubungkan ke Server...</p>
        </div>

        <script>
          setTimeout(() => {
            window.location.href = "${githubUrl}?id=${m}";
          }, 200);
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    // Jika API Error, tetap arahkan ke GitHub
    res.redirect(`${githubUrl}?id=${m}`);
  }
}
