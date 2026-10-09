const fs = require('fs');
const path = 'd:/project/hotel/frontend/src/app/resident/page.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/opacity-0 animate-in [a-zA-Z0-ms-]{1,100}/g, 'transition-all animate-bounce-in');
content = content.replace(/opacity-0 animate-in slide-in-[^"']+/g, 'transition-all duration-300');
content = content.replace(/animate-in fade-in slide-in-[^"']+/g, 'transition-all duration-300');
fs.writeFileSync(path, content);
console.log('Fixed opacity classes.');
