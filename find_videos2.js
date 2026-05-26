import yts from 'yt-search';

const queries = [
  "Nguyễn Bảo Bằng tay",
  "Nguyễn Bảo Bằng bụng",
  "Nguyễn Bảo Bằng cardio"
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
