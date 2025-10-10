# Chapter 6: Understanding Inscriptions

**Progress: 42-50/100**

## Introduction

Now that you understand ordinal theory, let's dive deep into inscriptions - how to create them, view them, transfer them, and manage a collection.

## 🖼️ What is an Inscription?

An **inscription** is data attached to a specific satoshi, creating a digital artifact that:
- Lives forever on the Bitcoin blockchain
- Cannot be changed or deleted
- Transfers with the sat it's inscribed on
- Requires no external storage or servers

**Think of it like:**
- Carving into a gold coin (permanent)
- NOT sticking a label on it (removable)

## 🛠️ Creating Inscriptions

### Tools for Inscribing

#### 1. Ord Wallet (Command Line)

**Best for:** Technical users, developers
**Cost:** Transaction fees only

```bash
# Install ord
cargo install ord

# Create wallet
ord wallet create

# Inscribe a file
ord wallet inscribe --fee-rate 10 image.png
```

#### 2. OrdinalsBot (Web Service)

**Best for:** Beginners, batch inscriptions
**Cost:** Service fee + transaction fees

- Visit ordinalsbot.com
- Upload file
- Pay with Bitcoin or credit card
- Receive inscription to your address

#### 3. Gamma.io (Marketplace)

**Best for:** Artists, collectors
**Cost:** Platform fee + transaction fees

- Create account
- Upload artwork
- Set parameters
- Mint to marketplace

#### 4. Xverse Wallet (Built-in)

**Best for:** Xverse users, convenience
**Cost:** Transaction fees + small service fee

- Open Xverse
- Go to "Inscribe" tab
- Select file
- Confirm and broadcast

### Inscription Process Step-by-Step

**Using Ord Wallet:**

**Step 1: Prepare Content**
```bash
# Check file size (smaller = cheaper)
ls -lh my-inscription.png

# Optimal: under 50KB for reasonable fees
# Maximum practical: ~400KB
```

**Step 2: Estimate Fees**
```bash
# Check mempool for fee rates
curl https://mempool.space/api/v1/fees/recommended

# Example response:
{
  "fastestFee": 20,
  "halfHourFee": 15,
  "hourFee": 10
}
```

**Step 3: Create Inscription**
```bash
# Inscribe with specific fee rate
ord wallet inscribe \
  --fee-rate 15 \
  --file my-inscription.png \
  --destination bc1p... (your taproot address)

# Returns:
{
  "commit": "abc123...",
  "reveal": "def456...",
  "inscription": "789xyz...",
  "fees": 0.00050000
}
```

**Step 4: Broadcast**
```bash
# Broadcast commit transaction
bitcoin-cli sendrawtransaction <commit_tx>

# Wait for confirmation (≈10 min)

# Broadcast reveal transaction
bitcoin-cli sendrawtransaction <reveal_tx>

# Inscription is now live!
```

## 📊 Inscription Anatomy

### Transaction Structure

**Commit Transaction:**
```
Input: Your funds (e.g., 0.001 BTC)
Output 1: Taproot output with inscription script
Output 2: Change back to you
Fee: Variable (market rate)
```

**Reveal Transaction:**
```
Input: Commit output (contains inscription)
Output: Your address (inscription now on this sat)
Fee: Variable (usually higher, more data)
```

### Inscription Data Format

```json
{
  "content_type": "image/png",
  "content": "<binary data>",
  "inscription_id": "abc123...i0",
  "inscription_number": 50000000,
  "sat": 1234567890123456,
  "address": "bc1p...",
  "output_value": 546,
  "timestamp": 1234567890
}
```

## 🎨 Content Types & Best Practices

### Supported Formats

| Type | MIME Type | Max Size | Use Case |
|------|-----------|----------|----------|
| PNG | image/png | ~400KB | Art, pfps |
| JPEG | image/jpeg | ~400KB | Photos |
| SVG | image/svg+xml | ~100KB | Vector art |
| GIF | image/gif | ~400KB | Animations |
| WebP | image/webp | ~400KB | Efficient |
| HTML | text/html | ~100KB | Interactive |
| Text | text/plain | ~100KB | Documents |
| JSON | application/json | ~100KB | Metadata |

### Optimization Tips

**Images:**
```bash
# Compress PNG
pngquant --quality 80-90 image.png

# Optimize JPEG
jpegoptim --max=90 image.jpg

# Convert to WebP (better compression)
cwebp -q 90 image.png -o image.webp
```

**Size Considerations:**
- 10KB file @ 20 sat/vB ≈ 0.0002 BTC ($8-10)
- 100KB file @ 20 sat/vB ≈ 0.002 BTC ($80-100)
- 400KB file @ 20 sat/vB ≈ 0.008 BTC ($320-400)

**Fee Saving Strategies:**
1. Inscribe during low-fee periods (weekends, nights)
2. Optimize file sizes aggressively
3. Use CPFP if stuck (child pays for parent)
4. Batch inscriptions when possible

## 🔍 Viewing Inscriptions

### Explorers

**1. Ordinals.com**
- Primary explorer
- Clean interface
- Search by inscription ID, sat number, address

**2. Ord.io**
- Beautiful gallery view
- Collection browsing
- Trending inscriptions

**3. OrdinalHub**
- Advanced search
- Collection tracking
- Rarity tools

**4. Magic Eden (Ordinals)**
- Marketplace view
- Price data
- Trading volume

### Viewing Your Inscriptions

**In Xverse:**
1. Open Xverse wallet
2. Go to "Collectibles" tab
3. See all inscriptions at your address

**Using Ord:**
```bash
# List all inscriptions in wallet
ord wallet inscriptions

# View specific inscription
ord wallet inscription <inscription_id>
```

**On Web:**
- Visit ordinals.com/inscription/<id>
- Or ord.io/<id>
- Bookmark your collection

## 🔄 Transferring Inscriptions

### Important Rules

**⚠️ Critical:**
- Inscription is on a SPECIFIC sat in a SPECIFIC UTXO
- Sending that UTXO sends the inscription
- Accidentally spending = lost inscription
- Always use inscription-aware wallet

### Safe Transfer Methods

**Method 1: Xverse Wallet**
```
1. Go to Collectibles
2. Select inscription
3. Click "Send"
4. Enter recipient address (must be taproot bc1p...)
5. Confirm transaction
```

**Method 2: Ord Wallet**
```bash
# Send inscription to address
ord wallet send \
  --fee-rate 10 \
  <inscription_id> \
  bc1p... (recipient taproot address)
```

**Method 3: Marketplace**
```
1. List on Magic Eden / Gamma
2. Buyer purchases
3. Platform handles transfer
4. Both parties protected
```

### Common Mistakes to Avoid

**❌ Don't:**
- Use non-inscription wallet for inscribed UTXOs
- Combine inscribed UTXO with regular funds
- Send to non-taproot address
- Forget to select "cardinal" vs "ordinal" outputs

**✅ Do:**
- Use Xverse or Ord wallet
- Keep inscriptions in separate UTXOs
- Verify recipient address type
- Check transaction before broadcasting

## 🏪 Marketplaces

### Major Platforms

**1. Magic Eden (Ordinals)**
- Largest volume
- Best liquidity
- 0-2% fees
- Offers and auctions

**2. Gamma.io**
- Creator-friendly
- Clean UI
- Advanced features
- Collection launches

**3. OKX Marketplace**
- Exchange integration
- High volume
- Wide selection

**4. Ordinals Wallet**
- Built-in marketplace
- Direct wallet integration
- Simple interface

### Buying Inscriptions

**Step-by-Step:**
```
1. Browse marketplace
2. Connect Xverse wallet
3. Find inscription you want
4. Click "Buy Now" or "Make Offer"
5. Confirm transaction
6. Wait for confirmation
7. Inscription appears in your wallet
```

**Due Diligence:**
- Verify collection authenticity
- Check floor price on multiple platforms
- Review inscription content (on-chain)
- Understand rarity/traits
- Research creator/project

### Selling Inscriptions

**Listing Process:**
```
1. Connect wallet to marketplace
2. Select inscription from your wallet
3. Set price in BTC or sats
4. Choose listing type (fixed/auction)
5. Sign listing transaction (no fee yet)
6. Listing goes live
7. Fee paid when sold
```

**Pricing Strategy:**
- Check floor price
- Consider rarity
- Factor in traits/desirability
- Review recent sales
- Set competitive price

## 🧩 Collections & Metadata

### Collection Structure

**Parent-Child Inscriptions:**
```
Parent Inscription:
- Collection metadata
- Name, description
- Royalty info
- Provenance

Child Inscriptions:
- Individual NFTs
- Reference parent
- Inherit metadata
- Provably part of collection
```

### Metadata Standards

**JSON Metadata Example:**
```json
{
  "p": "ordinals",
  "op": "mint",
  "tick": "EXAMPLE",
  "id": "abc123",
  "meta": {
    "name": "Example #1",
    "description": "First in series",
    "attributes": [
      {"trait_type": "Background", "value": "Blue"},
      {"trait_type": "Eyes", "value": "Laser"}
    ]
  }
}
```

### Recursive Inscriptions

**Building on Existing:**
```html
<!-- Inscription references another -->
<img src="/content/abc123i0">
<script src="/content/def456i0"></script>
```

**Benefits:**
- Reuse code libraries
- Smaller file sizes
- Composable art
- Shared resources

## 🔗 Via Negativa Perspective

What inscriptions are **NOT**:

- ❌ NOT hosted on IPFS (fully on-chain)
- ❌ NOT on a sidechain (Bitcoin mainnet)
- ❌ NOT using ERC-721 (native Bitcoin)
- ❌ NOT changeable metadata (immutable)
- ❌ NOT dependent on servers (self-contained)
- ❌ NOT cheap to create (Bitcoin fees apply)

## 🎯 Practical Exercise

**Beginner:**
1. Create account on Gamma.io
2. Browse inscriptions under $10
3. Buy your first inscription
4. View in Xverse wallet
5. List for sale (practice)

**Intermediate:**
1. Install ord wallet
2. Prepare small image file (<10KB)
3. Estimate inscription cost
4. Create inscription (testnet first)
5. Verify on explorer

**Advanced:**
1. Create recursive inscription
2. Build parent-child collection
3. Inscribe to specific rare sat
4. Set up automated inscribing

## 📚 Resources

- [Ord Documentation](https://docs.ordinals.com/)
- [Inscription Best Practices](https://ordinals.com/guides)
- [Fee Estimation Calculator](https://ordinalswallet.com/inscribe)

## ✅ Chapter Quiz

1. What are the two transactions required for inscribing?
2. What address type should receive inscriptions?
3. What happens if you send an inscribed UTXO with a regular wallet?
4. What's the practical maximum inscription size?
5. What is a recursive inscription?

## Next Chapter

Continue to [Chapter 7: The Runestone Protocol](chapter7-runestone.md) to learn about the first major fungible token standard on Bitcoin Ordinals.

---

**Progress: 50/100 Complete** ✅
**Halfway there!** 🎉
