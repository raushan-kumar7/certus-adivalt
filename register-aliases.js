const moduleAlias = require('module-alias');
const path = require('path');

// Register aliases for dist folder
moduleAlias.addAliases({
  '@/types': path.join(__dirname, 'dist', 'types'),
  '@/constants': path.join(__dirname, 'dist', 'constants'), 
  '@/certus': path.join(__dirname, 'dist', 'certus'),
  '@/responses': path.join(__dirname, 'dist', 'responses'),
  '@/valt': path.join(__dirname, 'dist', 'valt'),
  '@/adi': path.join(__dirname, 'dist', 'adi')
});

console.log('✅ Path aliases registered for dist folder');