// Create this file to debug what's available
console.log('=== Checking @opentelemetry/resources ===');
try {
  const resources = require('@opentelemetry/resources');
  console.log('Available exports:', Object.keys(resources));
  console.log('Resource type:', typeof resources.Resource);
} catch (err) {
  console.error('Error loading @opentelemetry/resources:', err.message);
}

console.log('\n=== Checking @opentelemetry/semantic-conventions ===');
try {
  const semconv = require('@opentelemetry/semantic-conventions');
  console.log('Available exports:', Object.keys(semconv));
} catch (err) {
  console.error('Error loading @opentelemetry/semantic-conventions:', err.message);
}

console.log('\n=== Package versions ===');
try {
  const pkg = require('./package.json');
  console.log('Dependencies:', pkg.dependencies);
  console.log('DevDependencies:', pkg.devDependencies);
} catch (err) {
  console.log('No package.json found');
}