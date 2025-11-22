const fs = require('fs');
const path = require('path');

function mergeCSS(inputFile, outputFile) {
  const cssDir = path.dirname(inputFile);
  let content = fs.readFileSync(inputFile, 'utf8');
  
  // 解析所有 @import 语句
  const importRegex = /@import\s+['"]([^'"]+)['"];?/g;
  let match;
  let mergedContent = '';
  
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    const fullPath = path.join(cssDir, importPath);
    
    if (fs.existsSync(fullPath)) {
      const importedContent = fs.readFileSync(fullPath, 'utf8');
      mergedContent += `/* ${importPath} */\n${importedContent}\n\n`;
    } else {
      console.warn(`Warning: CSS file not found: ${fullPath}`);
    }
  }
  
  // 写入合并后的文件
  fs.writeFileSync(outputFile, mergedContent, 'utf8');
  console.log(`Merged CSS written to: ${outputFile}`);
}

// 处理主CSS文件
const mainCSS = path.join(__dirname, '../assets/css/main.css');
const outputCSS = path.join(__dirname, '../assets/css/main-merged.css');

if (fs.existsSync(mainCSS)) {
  mergeCSS(mainCSS, outputCSS);
} else {
  console.error(`Error: Main CSS file not found: ${mainCSS}`);
  process.exit(1);
}

