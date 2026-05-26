import yts from 'yt-search';

const queries = [
  "Nguyễn Bảo Bằng Bench Press",
  "Nguyễn Bảo Bằng Squat",
  "Nguyễn Bảo Bằng Kéo Xô",
  "Nguyễn Bảo Bằng vai",
  "Nguyễn Bảo Bằng hít đất"
];

async function run() {
  for (const q of queries) {
    const r = await yts(q);
    const vids = r.videos.slice(0, 2);
    console.log(`QUERY: ${q}`);
    vids.forEach(v => {
      console.log(`- ${v.title} (${v.videoId})`);
    });
    console.log('');
  }
}

run();
