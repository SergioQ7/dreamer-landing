const fs = require('fs');

const files = [
  'client/src/pages/Home.tsx',
  'client/src/pages/LoginPage.tsx',
  'client/src/pages/AdminPage.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace inline fontWeight: 700 after Anton
    content = content.replace(/(fontFamily:\s*["']'Anton', sans-serif["'][^>]*?)fontWeight:\s*700/gs, '$1fontWeight: 400');
    // Replace inline fontWeight: 700 inline objects
    content = content.replace(/fontFamily:\s*["']'Anton', sans-serif["'],\s*fontSize:\s*\d+,\s*fontWeight:\s*700/g, match => match.replace('700', '400'));
    // Remove italic from Anton
    content = content.replace(/(fontFamily:\s*["']'Anton', sans-serif["'][^>]*?)fontStyle:\s*["']italic["']/gs, '$1textTransform: "uppercase"');
    
    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log("Done");
