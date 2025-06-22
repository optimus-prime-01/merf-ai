const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { SEMRESATTRS_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [SEMRESATTRS_SERVICE_NAME]: 'alert-receiver-service',
  }),
  traceExporter: new JaegerExporter({
    endpoint: 'http://localhost:14268/api/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

// Simple initialization without promises
try {
  sdk.start();
  console.log('✅ OpenTelemetry initialized');
} catch (err) {
  console.error('❌ OpenTelemetry init error', err);
}

process.on('SIGTERM', () => {
  try {
    sdk.shutdown();
    console.log('Tracing shut down');
  } catch (err) {
    console.error('Tracing shutdown error', err);
  }
  process.exit(0);
});