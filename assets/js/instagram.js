const IG_ACCESS_TOKEN = 'YOUR_INSTAGRAM_ACCESS_TOKEN'; // Store securely
const IG_FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
const IG_LIMIT = 6;

async function loadInstagramFeed() {
  const grid = document.getElementById('ig-feed-grid');
  if (!grid) return;
  
  try {
    // Attempting to fetch if token is valid. Usually handled server-side.
    if(IG_ACCESS_TOKEN === 'YOUR_INSTAGRAM_ACCESS_TOKEN') throw new Error('Token not set');
    
    const url = `https://graph.instagram.com/me/media?fields=${IG_FIELDS}&limit=${IG_LIMIT}&access_token=${IG_ACCESS_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (!data.data) throw new Error('No data');
    
    grid.innerHTML = data.data.map(post => {
      const imgSrc = post.media_type === 'VIDEO' 
        ? post.thumbnail_url 
        : post.media_url;
      const caption = post.caption 
        ? post.caption.substring(0, 80) + (post.caption.length > 80 ? '…' : '')
        : '';
      
      return `
        <a href="${post.permalink}" target="_blank" rel="noopener" 
           class="ig-post" title="${caption}">
          <img src="${imgSrc}" alt="Instagram post" loading="lazy"/>
          <div class="ig-post__overlay">
            <p class="ig-post__caption jost">${caption}</p>
          </div>
          ${post.media_type === 'VIDEO' ? '<span class="ig-post__type cinzel" style="position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.5); padding:2px 5px; font-size:10px;">VIDEO</span>' : ''}
        </a>
      `;
    }).join('');
    
  } catch (err) {
    console.warn('Instagram feed failed, showing fallback:', err);
    // Show static link to profile instead
    grid.innerHTML = `
      <div class="ig-fallback" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p class="jost">Visit <a href="https://www.instagram.com/the.soft.command/" 
           target="_blank" rel="noopener" class="gold-gradient-text">@the.soft.command</a> on Instagram</p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', loadInstagramFeed);
