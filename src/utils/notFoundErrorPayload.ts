export default function notFoundErrorPayload(
  endpoint: string,
  errorMessage: string
) {
  console.error(`[${endpoint}] - [404]: ${errorMessage}`);

  return {
    statusCode: 404,
    body: JSON.stringify({
      error: errorMessage,
    }),
  };
}
