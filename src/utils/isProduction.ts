export default function isProduction() {
  return process.env["AWS_LAMBDA_FUNCTION_NAME"]?.includes("production");
}
