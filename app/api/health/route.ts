import { NextResponse } from 'next/server'
import db from '@/lib/db'

/**
 * Health check endpoint for monitoring
 * Returns 200 if all systems operational, 503 if degraded
 */
export async function GET() {
  const startTime = Date.now()
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {} as Record<string, { status: string; latency?: number; error?: string }>,
  }

  try {
    // Check database connection
    const dbStart = Date.now()
    try {
      await db.execute('SELECT 1')
      health.checks.database = {
        status: 'healthy',
        latency: Date.now() - dbStart,
      }
    } catch (error) {
      health.checks.database = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
      health.status = 'degraded'
    }

    // Check environment variables
    health.checks.environment = {
      status: process.env.DATABASE_URL && process.env.JWT_SECRET ? 'healthy' : 'unhealthy',
    }

    if (health.checks.environment.status === 'unhealthy') {
      health.status = 'degraded'
    }

    // Overall response time
    const responseTime = Date.now() - startTime

    return NextResponse.json({
      ...health,
      responseTime,
      uptime: process.uptime(),
    }, {
      status: health.status === 'healthy' ? 200 : 503,
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, {
      status: 503,
    })
  }
}
