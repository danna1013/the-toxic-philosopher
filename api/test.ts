/**
 * Simple test endpoint for Vercel
 */

export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    env: {
      hasKV: !!process.env.KV_REST_API_URL,
      hasAdminPassword: !!process.env.ADMIN_PASSWORD,
      isVercel: process.env.VERCEL === '1'
    }
  });
}
