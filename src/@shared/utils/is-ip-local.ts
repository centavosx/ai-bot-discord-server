export const isIpLocal = (ip: string) =>
  !ip ||
  ip === '127.0.0.1' ||
  ip === '::1' ||
  ip === 'localhost' ||
  ip.startsWith('::ffff:') ||
  ip.startsWith('192.168.') || // optional: local network
  ip.startsWith('10.'); // optional: local network
