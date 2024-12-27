export function isExpired(timestamp: string) {
  // Convert the timestamp to milliseconds
  const timestampInMilliseconds = new Date(timestamp).getTime();
  // Get the current timestamp in milliseconds
  const currentTimestamp = new Date().getTime();
  // Calculate the difference in milliseconds
  const timeDifference = currentTimestamp - timestampInMilliseconds;
  // Check if the time difference is greater than or equal to 10 minutes (600,000 milliseconds)
  return timeDifference >= 300000;
}
