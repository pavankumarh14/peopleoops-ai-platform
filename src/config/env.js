function requireEnv(name, fallbackValue = null) {
  const value = process.env[name] ?? fallbackValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function loadEnv() {
  const elasticServerlessEndpoint =
    process.env.ELASTIC_SERVERLESS_ENDPOINT || process.env.ELASTIC_URL || null;

  return {
    elasticServerlessEndpoint: requireEnv(
      "ELASTIC_SERVERLESS_ENDPOINT",
      elasticServerlessEndpoint
    ),
    elasticApiKey: requireEnv("ELASTIC_API_KEY"),
    elasticInferenceId:
      process.env.ELASTIC_INFERENCE_ID ||
      ".openai-gpt-4.1-mini-completion"
  };
}

module.exports = { loadEnv };
