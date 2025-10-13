# Chapter 9: Open Ordinal Infrastructure

**Progress: 63-66/100**

## Introduction

Open Ordinal (openordex.org) and the surrounding infrastructure represent the open-source foundation that powers the Ordinals ecosystem. This chapter explores the tools, indexers, and platforms that make Ordinals accessible.

## 🛠️ The Ordinals Stack

### Layer 1: Bitcoin

```
┌─────────────────────────────┐
│      Bitcoin Blockchain      │
│   (Immutable Data Layer)     │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│     Ordinals Protocol        │
│   (Numbering & Tracking)     │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│    Inscription Protocol      │
│  (Data Embedding via Taproot)│
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│      Indexers & APIs         │
│   (Query & Discovery)        │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│   Wallets & Applications     │
│      (User Interface)        │
└─────────────────────────────┘
```

## 🔍 Indexing Infrastructure

### What is an Indexer?

An **indexer** is software that:
- Scans every Bitcoin block
- Identifies ordinal inscriptions
- Tracks sat movements (FIFO)
- Builds searchable database
- Provides API access

**Why Needed:**
- Bitcoin doesn't natively track ordinals
- FIFO calculations are complex
- Users need fast queries
- Developers need APIs

### Major Indexers

#### 1. Ord (Reference Implementation)

**Repository:** github.com/ordinals/ord

**Features:**
- Official Casey Rodarmor indexer
- Command-line interface
- Local database (rekor)
- Full control & privacy

**Setup:**
```bash
# Install ord
cargo install ord

# Start indexing (requires Bitcoin Core)
ord --index index update

# Run server
ord server
```

**Pros:**
- ✅ Self-hosted (trustless)
- ✅ Complete control
- ✅ Privacy preserved
- ✅ Open source

**Cons:**
- ❌ Requires full node
- ❌ Days to sync
- ❌ Technical setup

#### 2. Hiro Ordinals API

**URL:** api.hiro.so/ordinals

**Features:**
- Hosted indexer
- REST API
- WebSocket support
- Free tier available

**Example Query:**
```bash
curl https://api.hiro.so/ordinals/v1/inscriptions/abc123

# Response:
{
  "id": "abc123...i0",
  "number": 50000000,
  "address": "bc1p...",
  "content_type": "image/png",
  "sat": 1234567890,
  "timestamp": 1234567890
}
```

**Pros:**
- ✅ No setup required
- ✅ Fast queries
- ✅ Well-documented
- ✅ WebSocket updates

**Cons:**
- ❌ Trust required
- ❌ API limits
- ❌ Privacy concerns

#### 3. Ordinals.com Indexer

**URL:** ordinals.com

**Features:**
- Web interface
- Public API
- Inscription hosting
- Collection tracking

**Use Cases:**
- Browsing inscriptions
- Verifying ownership
- Collection research
- Quick lookups

#### 4. OrdAPI

**URL:** ordapi.xyz

**Features:**
- Developer-focused
- Multiple endpoints
- Batch queries
- Webhook support

**Pricing:**
- Free: 1,000 req/day
- Pro: 100,000 req/day
- Enterprise: Unlimited

## 📡 Open Ordinal (OpenOrdex)

### What is OpenOrdex?

**OpenOrdex** is:
- Open-source ordinals marketplace
- Peer-to-peer trading protocol
- No intermediary required
- PSBT-based swaps

**URL:** openordex.org

### How It Works

**Traditional Marketplace:**
```
1. Seller lists on platform
2. Platform holds custody
3. Buyer purchases
4. Platform executes trade
5. Platform takes fee
```

**OpenOrdex (P2P):**
```
1. Seller creates PSBT (Partially Signed Bitcoin Transaction)
2. PSBT specifies: give inscription, receive X BTC
3. Broadcast PSBT to network
4. Buyer completes PSBT
5. Both sign, transaction settles
6. No platform custody or fees
```

### Technical Deep Dive

**PSBT Structure:**
```
┌─────────────────────────────┐
│         INPUTS              │
├─────────────────────────────┤
│ Seller: Inscription UTXO    │
│ Buyer: Payment UTXO         │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│        OUTPUTS              │
├─────────────────────────────┤
│ Buyer: Receives inscription │
│ Seller: Receives payment    │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│       SIGNATURES            │
├─────────────────────────────┤
│ Seller: Signs input         │
│ Buyer: Signs input          │
│ → Transaction valid         │
└─────────────────────────────┘
```

**Example PSBT:**
```
cHNidP8BAHECAAAAAb3...
(base64 encoded transaction)
```

### Using OpenOrdex

**As a Seller:**
```bash
# Create listing PSBT
ord wallet inscriptions
ord wallet create-listing \
  --inscription-id abc123 \
  --price 0.05 \
  --output psbt.txt

# Share PSBT
cat psbt.txt
# Post to OpenOrdex, Twitter, etc.
```

**As a Buyer:**
```bash
# Receive PSBT from seller
# Verify contents
ord wallet decode-psbt psbt.txt

# Complete purchase
ord wallet sign-psbt \
  --psbt psbt.txt \
  --output signed.txt

# Broadcast
bitcoin-cli sendrawtransaction $(cat signed.txt)
```

### Advantages

**✅ Benefits:**
- No custody risk
- No platform fees
- Fully permissionless
- Censorship resistant
- Open source

**⚠️ Considerations:**
- More technical
- Need to verify PSBTs
- Manual process
- Less discovery

## 🧰 Developer Tools

### 1. Ordinals API Libraries

**JavaScript/TypeScript:**
```javascript
import { Ordinals } from '@sadoprotocol/ordinals'

const ordinals = new Ordinals()
await ordinals.getInscription('abc123...i0')
```

**Python:**
```python
from ordinals import OrdinalsAPI

api = OrdinalsAPI()
inscription = api.get_inscription('abc123')
```

**Rust:**
```rust
use ord::api::Ordinals;

let ordinals = Ordinals::new();
let inscription = ordinals.get("abc123");
```

### 2. Inscription Creation Libraries

**ord-inscribe (Node.js):**
```javascript
const { inscribe } = require('ord-inscribe')

await inscribe({
  file: './image.png',
  feeRate: 15,
  network: 'mainnet'
})
```

**Ordinals SDK (Python):**
```python
from ordinals_sdk import Inscriber

inscriber = Inscriber(network='mainnet')
inscriber.inscribe_file(
    'image.png',
    fee_rate=15
)
```

### 3. PSBT Helpers

**bitcoin-js-lib:**
```javascript
import * as bitcoin from 'bitcoinjs-lib'

const psbt = new bitcoin.Psbt({ network })
psbt.addInput({ ... })
psbt.addOutput({ ... })
psbt.signInput(0, keyPair)
```

## 🌐 Infrastructure Services

### Full Node Providers

**1. Self-Hosted:**
- Bitcoin Core + Ord
- Complete control
- Maximum privacy

**2. Hosted Nodes:**
- Voltage.cloud
- QuickNode
- Blockstream.info

**3. Umbrel/RaspiBlitz:**
- All-in-one packages
- Pre-configured
- Community support

### Ordinals-Specific Infrastructure

**1. Inscription Hosting:**
- ordinals.com (free)
- ord.io (free)
- On-chain (always accessible)

**2. Collection Metadata:**
- Ordinals Collections Standard
- On-chain via parent inscriptions
- IPFS backup (controversial)

**3. Marketplace Infrastructure:**
- OpenOrdex (P2P)
- Magic Eden API
- Gamma.io SDK

## 🔐 Security Considerations

### Indexer Trust

**Risks:**
- Indexer shows wrong owner
- Missing inscriptions
- Incorrect sat tracking
- API manipulation

**Mitigation:**
- Run own indexer
- Cross-reference multiple sources
- Verify on-chain yourself
- Use open-source tools

### PSBT Safety

**Always Verify:**
```bash
# Decode PSBT before signing
bitcoin-cli decodepsbt <psbt>

# Check:
# ✓ Inputs (what you're giving)
# ✓ Outputs (what you're getting)
# ✓ Fees (reasonable?)
# ✓ Addresses (correct recipient?)
```

**Red Flags:**
- 🚩 Unexpectedly high fees
- 🚩 Unknown output addresses
- 🚩 Multiple transactions
- 🚩 Strange scripts

### API Key Management

**Best Practices:**
```javascript
// ❌ Bad
const API_KEY = 'pk_live_abc123...'

// ✅ Good
const API_KEY = process.env.ORDINALS_API_KEY

// ✅ Better
import { SecretsManager } from 'aws-sdk'
const secret = await getSecret('ordinals-api-key')
```

## 🔗 Via Negativa Perspective

What Open Infrastructure is **NOT**:

- ❌ NOT centralized (distributed by design)
- ❌ NOT proprietary (open source)
- ❌ NOT custodial (self-sovereign)
- ❌ NOT permissioned (anyone can use)
- ❌ NOT opaque (fully transparent)
- ❌ NOT unchangeable (community-driven development)

## 🎯 Practical Projects

### Beginner: Query Inscriptions

```javascript
// Fetch inscription data
const response = await fetch(
  'https://api.hiro.so/ordinals/v1/inscriptions/abc123'
)
const data = await response.json()
console.log(data)
```

### Intermediate: Build Explorer

```javascript
// Simple inscription explorer
async function getInscriptions(address) {
  const response = await fetch(
    `https://api.hiro.so/ordinals/v1/inscriptions?address=${address}`
  )
  return await response.json()
}
```

### Advanced: Create Marketplace

```javascript
// P2P marketplace with PSBTs
class OrdinalsMarketplace {
  async createListing(inscription, price) {
    const psbt = await this.buildPSBT(inscription, price)
    return psbt.toBase64()
  }

  async completePurchase(psbt, buyerWallet) {
    psbt.signInput(1, buyerWallet)
    return psbt.finalizeAllInputs()
  }
}
```

## 📚 Resources

- [Ord GitHub](https://github.com/ordinals/ord)
- [OpenOrdex](https://openordex.org)
- [Hiro Ordinals API Docs](https://docs.hiro.so/ordinals)
- [Ordinals Collections Standard](https://github.com/ordinals/ord/blob/master/docs/src/collections.md)

## ✅ Chapter Quiz

1. What does an indexer do?
2. What is a PSBT?
3. What's the main advantage of OpenOrdex?
4. Why might you run your own ord indexer?
5. What should you always verify before signing a PSBT?

## Next Section

Continue to **Part 3: Runes & Community** → [Chapter 10: Runes Protocol Deep Dive](../part3/chapter10-runes-protocol.md)

---

**Progress: 66/100 Complete** ✅
**Part 2 Complete!** 🎉
