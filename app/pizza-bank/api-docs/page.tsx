'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function APIDocsPage() {
  const [copied, setCopied] = useState('')

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pizza-bank"
            className="text-orange hover:text-orange-light transition-colors mb-4 inline-block"
          >
            ← Back to Pizza Bank
          </Link>

          <h1 className="text-5xl font-bold text-bitcoin mb-4">
            🔧 API Documentation
          </h1>
          <p className="text-xl text-gray-400">
            Integrate Pizza Bank with your POS system for automated order fulfillment
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Contents</h2>
          <nav className="space-y-2">
            <a href="#authentication" className="block text-orange hover:underline">1. Authentication</a>
            <a href="#webhooks" className="block text-orange hover:underline">2. Webhook Setup</a>
            <a href="#order-structure" className="block text-orange hover:underline">3. Order Payload Structure</a>
            <a href="#status-updates" className="block text-orange hover:underline">4. Status Update Callbacks</a>
            <a href="#pos-integrations" className="block text-orange hover:underline">5. POS System Integrations</a>
            <a href="#testing" className="block text-orange hover:underline">6. Testing Environment</a>
          </nav>
        </div>

        {/* Authentication */}
        <section id="authentication" className="mb-12">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
            <h2 className="text-3xl font-bold mb-4 text-bitcoin">1. Authentication</h2>
            <p className="text-gray-300 mb-6">
              All API requests must include your API key in the Authorization header.
            </p>

            <div className="bg-black rounded-lg p-4 mb-4 relative">
              <pre className="text-sm text-green-400 overflow-x-auto">
{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}
              </pre>
              <button
                onClick={() => copyCode('Authorization: Bearer YOUR_API_KEY\nContent-Type: application/json', 'auth')}
                className="absolute top-2 right-2 px-3 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              >
                {copied === 'auth' ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                <span className="font-bold">💡 Getting your API key:</span> After your pizzeria is verified, you'll receive an email with your unique API key.
                You can also find it in your pizzeria dashboard under Settings → API Integration.
              </p>
            </div>
          </div>
        </section>

        {/* Webhooks */}
        <section id="webhooks" className="mb-12">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
            <h2 className="text-3xl font-bold mb-4 text-bitcoin">2. Webhook Setup</h2>
            <p className="text-gray-300 mb-6">
              Configure your webhook URL to receive real-time order notifications.
            </p>

            <h3 className="text-xl font-bold mb-3 text-white">Webhook Events</h3>
            <div className="space-y-3 mb-6">
              <div className="bg-black/40 rounded-lg p-4">
                <div className="text-orange font-bold mb-1">order.created</div>
                <div className="text-sm text-gray-400">Fired when a new order is placed</div>
              </div>
              <div className="bg-black/40 rounded-lg p-4">
                <div className="text-orange font-bold mb-1">order.payment_confirmed</div>
                <div className="text-sm text-gray-400">Fired when payment is verified (Bitcoin/Lightning)</div>
              </div>
              <div className="bg-black/40 rounded-lg p-4">
                <div className="text-orange font-bold mb-1">order.cancelled</div>
                <div className="text-sm text-gray-400">Fired when customer cancels the order</div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-white">Example Webhook Payload</h3>
            <div className="bg-black rounded-lg p-4 mb-4 relative">
              <pre className="text-sm text-green-400 overflow-x-auto">
{`POST https://your-pos-system.com/webhook
{
  "event": "order.created",
  "timestamp": "2025-10-12T16:30:00Z",
  "order": {
    "id": "ord_abc123",
    "pizzeria_id": "piz_xyz789",
    "customer": {
      "name": "John Doe",
      "phone": "+1234567890"
    },
    "items": [
      {
        "name": "Pepperoni Pizza",
        "size": "Large",
        "quantity": 2,
        "price": 18.99
      }
    ],
    "total_amount": 37.98,
    "payment_method": "lightning",
    "fulfillment_code": "ABC123",
    "pickup_time": "2025-10-12T17:30:00Z",
    "notes": "Extra cheese please"
  }
}`}
              </pre>
              <button
                onClick={() => copyCode(`POST https://your-pos-system.com/webhook\n{\n  "event": "order.created",\n  ...`, 'webhook')}
                className="absolute top-2 right-2 px-3 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              >
                {copied === 'webhook' ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-sm text-yellow-300">
                <span className="font-bold">⚠️ Security:</span> Always verify the webhook signature to ensure requests are from Pizza Bank.
                Check the <code className="bg-black px-2 py-1 rounded">X-PizzaBank-Signature</code> header.
              </p>
            </div>
          </div>
        </section>

        {/* Order Structure */}
        <section id="order-structure" className="mb-12">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
            <h2 className="text-3xl font-bold mb-4 text-bitcoin">3. Order Payload Structure</h2>

            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-orange">Field</th>
                  <th className="text-left py-3 px-4 text-orange">Type</th>
                  <th className="text-left py-3 px-4 text-orange">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 font-mono">id</td>
                  <td className="py-3 px-4">string</td>
                  <td className="py-3 px-4">Unique order identifier</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 font-mono">pizzeria_id</td>
                  <td className="py-3 px-4">string</td>
                  <td className="py-3 px-4">Your pizzeria ID</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 font-mono">items</td>
                  <td className="py-3 px-4">array</td>
                  <td className="py-3 px-4">Array of ordered items</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 font-mono">total_amount</td>
                  <td className="py-3 px-4">number</td>
                  <td className="py-3 px-4">Total price in USD</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 font-mono">payment_method</td>
                  <td className="py-3 px-4">enum</td>
                  <td className="py-3 px-4">'bitcoin' | 'lightning' | 'fiat'</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 font-mono">payment_status</td>
                  <td className="py-3 px-4">enum</td>
                  <td className="py-3 px-4">'pending' | 'confirmed' | 'failed'</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 font-mono">fulfillment_code</td>
                  <td className="py-3 px-4">string</td>
                  <td className="py-3 px-4">6-digit code customer uses to claim order</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 font-mono">pickup_time</td>
                  <td className="py-3 px-4">timestamp</td>
                  <td className="py-3 px-4">Estimated pickup time (ISO 8601)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono">notes</td>
                  <td className="py-3 px-4">string</td>
                  <td className="py-3 px-4">Special instructions from customer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Status Updates */}
        <section id="status-updates" className="mb-12">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
            <h2 className="text-3xl font-bold mb-4 text-bitcoin">4. Status Update Callbacks</h2>
            <p className="text-gray-300 mb-6">
              Update order status as you fulfill them. POST to our API endpoint:
            </p>

            <div className="bg-black rounded-lg p-4 mb-4 relative">
              <pre className="text-sm text-green-400 overflow-x-auto">
{`POST https://api.noonewillpay.com/pizza-bank/orders/:orderId/status
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "status": "preparing",
  "estimated_completion": "2025-10-12T17:45:00Z"
}`}
              </pre>
              <button
                onClick={() => copyCode(`POST https://api.noonewillpay.com/pizza-bank/orders/:orderId/status`, 'status')}
                className="absolute top-2 right-2 px-3 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              >
                {copied === 'status' ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <h3 className="text-xl font-bold mb-3 text-white">Order Status Flow</h3>
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-4">
              <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg px-4 py-2 text-yellow-300 font-bold whitespace-nowrap">
                pending
              </div>
              <div className="text-gray-500">→</div>
              <div className="bg-blue-900/20 border border-blue-600 rounded-lg px-4 py-2 text-blue-300 font-bold whitespace-nowrap">
                preparing
              </div>
              <div className="text-gray-500">→</div>
              <div className="bg-orange/20 border border-orange rounded-lg px-4 py-2 text-orange font-bold whitespace-nowrap">
                ready
              </div>
              <div className="text-gray-500">→</div>
              <div className="bg-green-900/20 border border-green-600 rounded-lg px-4 py-2 text-green-300 font-bold whitespace-nowrap">
                completed
              </div>
            </div>
          </div>
        </section>

        {/* POS Integrations */}
        <section id="pos-integrations" className="mb-12">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
            <h2 className="text-3xl font-bold mb-4 text-bitcoin">5. POS System Integrations</h2>
            <p className="text-gray-300 mb-6">
              Pre-built integrations for popular POS systems:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/40 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-2">Toast POS</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Direct integration with Toast API. Automatically sync menu, inventory, and order status.
                </p>
                <a href="#" className="text-orange hover:underline text-sm">
                  View Toast Integration Guide →
                </a>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-2">Square</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Connect via Square webhooks. Real-time order creation and payment processing.
                </p>
                <a href="#" className="text-orange hover:underline text-sm">
                  View Square Integration Guide →
                </a>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-2">Clover</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Clover App Market integration. Install Pizza Bank app directly on your Clover device.
                </p>
                <a href="#" className="text-orange hover:underline text-sm">
                  View Clover Integration Guide →
                </a>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-2">Custom / Other</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Use our REST API to build your own integration. Full documentation and support provided.
                </p>
                <a href="#" className="text-orange hover:underline text-sm">
                  View REST API Docs →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testing */}
        <section id="testing" className="mb-12">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
            <h2 className="text-3xl font-bold mb-4 text-bitcoin">6. Testing Environment</h2>
            <p className="text-gray-300 mb-6">
              Test your integration in our sandbox environment before going live.
            </p>

            <div className="bg-black rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-300 space-y-2">
                <div><span className="text-orange font-bold">Sandbox API URL:</span> https://sandbox-api.noonewillpay.com</div>
                <div><span className="text-orange font-bold">Test API Key:</span> test_sk_abc123xyz789</div>
                <div><span className="text-orange font-bold">Test Webhook URL:</span> https://webhook.site (for testing)</div>
              </div>
            </div>

            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <h4 className="text-green-300 font-bold mb-2">Test Cards & Wallets</h4>
              <ul className="text-sm text-green-300 space-y-1">
                <li>• Bitcoin testnet: Use any testnet Bitcoin address</li>
                <li>• Lightning testnet: Use testnet Lightning invoices</li>
                <li>• Fiat test cards: 4242 4242 4242 4242 (any future expiry, any CVC)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Support */}
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg border-2 border-purple-600 p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Need Help?</h2>
          <p className="text-gray-300 mb-6">
            Our integration team is here to help you get set up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@noonewillpay.com"
              className="px-8 py-4 bg-orange text-black font-bold rounded-lg hover:bg-orange-dark transition-colors"
            >
              📧 Email Support
            </a>
            <Link
              href="/pizza-bank"
              className="px-8 py-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Pizza Bank
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
