# Chapter 12: Fungibility vs Non-Fungibility on Bitcoin

**Progress: 83-90/100**

## Introduction

Bitcoin now supports both fungible tokens (Runes) and non-fungible digital artifacts (Ordinals inscriptions). Understanding the difference, use cases, and interplay between these is crucial for navigating the Bitcoin token ecosystem.

## 🔄 Fungibility Explained

### What is Fungibility?

**Fungible** means each unit is interchangeable:

**Examples:**
- ✅ Money (one dollar = another dollar)
- ✅ Gold bars (1oz = 1oz, quality equal)
- ✅ Bitcoin (1 BTC = 1 BTC)
- ✅ Runes tokens (1 DOG = 1 DOG)

**Non-Fungible** means unique, not interchangeable:

**Examples:**
- ✅ Art pieces (Mona Lisa ≠ Starry Night)
- ✅ Real estate (House A ≠ House B)
- ✅ Ordinal inscriptions (each unique)
- ✅ Baseball cards (Rookie Babe Ruth ≠ common card)

### Technical Fungibility

**Bitcoin's Base Layer:**
- All satoshis technically unique (ordinal numbers)
- But treated as fungible (1 sat = 1 sat)
- UTXO model supports both paradigms

**Ordinals:**
- Makes sat uniqueness meaningful
- Inscriptions create non-fungibility
- Each inscribed sat is distinct

**Runes:**
- Built on UTXOs but fungible within token type
- 1 DOG token = any other DOG token
- Balances can be split/merged

## 🎨 Ordinals (Non-Fungible)

### Characteristics

**Unique Properties:**
- Each inscription is one-of-a-kind
- Specific sat number
- Specific content
- Specific history
- Cannot be subdivided

**Use Cases:**
- Digital art (PFPs, generative art)
- Collectibles (trading cards, memorabilia)
- Identity (badges, certificates)
- Music/video (albums, clips)
- Documents (proof of existence)

### Value Drivers

**Why are Ordinals valuable?**

1. **Scarcity**
   - Only one exists
   - Cannot be duplicated
   - Provable rarity

2. **Cultural Significance**
   - First of its kind
   - Historical moment
   - Community meaning

3. **Artistic Merit**
   - Visual appeal
   - Creative execution
   - Technical innovation

4. **Provenance**
   - Who created it
   - Who owned it
   - When it was made

### Market Dynamics

**Pricing:**
- Based on subjective value
- Auction/offers common
- Wide price ranges
- Illiquidity normal

**Trading:**
- One-on-one transactions
- Negotiated prices
- Marketplaces facilitate
- PSBT-based swaps

## 🪙 Runes (Fungible)

### Characteristics

**Interchangeable Properties:**
- Each token unit identical
- Can be split infinitely (within divisibility)
- Can be merged
- Balances across UTXOs

**Use Cases:**
- Currencies (DOG, memecoins)
- Reward points (loyalty programs)
- Gaming currency (in-game money)
- Governance tokens (voting weight)
- Utility tokens (access rights)

### Value Drivers

**Why are Runes valuable?**

1. **Network Effects**
   - More users = more value
   - Liquidity attracts liquidity
   - Community growth

2. **Utility**
   - What can you do with it?
   - Exchange for goods/services
   - Access to platforms

3. **Speculation**
   - Price appreciation expectation
   - Trading opportunities
   - Meme value

4. **Supply/Demand**
   - Token economics
   - Scarcity (total supply)
   - Distribution fairness

### Market Dynamics

**Pricing:**
- Market determines single price
- Orderbook trading
- Clear bid/ask spreads
- Higher liquidity

**Trading:**
- Exchange-based
- Automated market makers
- Price discovery efficient
- Lower friction

## 🔀 Comparison Table

| Aspect | Ordinals (NFT) | Runes (FT) |
|--------|----------------|------------|
| **Fungibility** | Non-fungible | Fungible |
| **Use Case** | Art, collectibles, identity | Currency, points, utility |
| **Pricing** | Subjective, varies widely | Market-determined, single price |
| **Liquidity** | Lower, one-by-one sales | Higher, pooled liquidity |
| **Storage** | Single UTXO per inscription | Balances across UTXOs |
| **Trading** | PSBTs, marketplaces | Exchanges, AMMs |
| **Value** | Uniqueness, rarity | Network effects, utility |
| **Divisibility** | Indivisible | Divisible (up to 18 decimals) |
| **Discovery** | Galleries, explorers | Price charts, exchanges |

## 🌉 Interplay Between Types

### Hybrid Approaches

**1. Inscriptions with Tokens**
- Inscription grants token allocation
- NFT proof of token ownership
- Collections with utility tokens

**Example: Runestones**
- Ordinal inscription (non-fungible art)
- Contained Rune allocation (fungible tokens)
- Dual value proposition

**2. Token-Gated Content**
- Hold Rune to access inscription
- Fungible token = membership
- Inscription = exclusive content

**3. Fractional NFTs**
- Inscription represents whole
- Rune tokens = fractional shares
- Bridges fungible/non-fungible

### Use Case Matrix

| Goal | Use Ordinals | Use Runes |
|------|--------------|-----------|
| Unique art | ✅ | ❌ |
| Mass distribution | ❌ | ✅ |
| Individual identity | ✅ | ❌ |
| Currency/payment | ❌ | ✅ |
| Rare collectibles | ✅ | ❌ |
| Loyalty points | ❌ | ✅ |
| Proof of ownership | ✅ | ❌ |
| Speculative trading | Both | ✅ (easier) |
| Gaming items | ✅ (unique) | ✅ (currency) |
| Social tokens | ❌ | ✅ |

## 💡 Economic Principles

### Fungibility & Money

**Why is fungibility important for money?**

1. **Divisibility**
   - Can make change
   - Precision in transactions
   - Flexible payments

2. **Interchangeability**
   - Don't need specific units
   - Simplifies accounting
   - Enables markets

3. **Liquidity**
   - Easy to trade
   - Price discovery
   - Market depth

**Why Bitcoin is fungible:**
- 1 BTC = 1 BTC (in practice)
- Satoshi-level divisibility
- Widely accepted as equivalent

**Ordinals challenge:**
- Some sats more "valuable" than others
- Inscription adds uniqueness
- Debates on Bitcoin fungibility

### Non-Fungibility & Value

**Why is uniqueness important?**

1. **Scarcity**
   - Limited supply of specific item
   - Not replicable
   - Provable rarity

2. **Identity**
   - Expresses individuality
   - Social signaling
   - Membership proof

3. **Collection**
   - Set completion drives value
   - Trait rarity
   - Historical significance

## 🔬 Technical Deep Dive

### UTXO Model for Both

**Ordinals:**
```
UTXO:
  Satoshi: #1234567890
  Inscription: Image XYZ
  Value: 546 sats (dust limit)
  Owner: bc1p...

Properties:
  - Indivisible
  - Unique sat number
  - Specific inscription
  - Single UTXO holds it
```

**Runes:**
```
UTXO Set:
  UTXO 1: 1000 DOG tokens
  UTXO 2: 5000 DOG tokens
  UTXO 3: 500 DOG tokens
  Total: 6500 DOG

Properties:
  - Divisible
  - Fungible within token
  - Spread across UTXOs
  - Can merge/split
```

### Transfer Mechanics

**Ordinals Transfer:**
```
Input: Inscribed UTXO (1 specific sat)
Output: Same sat to new address
Result: Inscription moves atomically
```

**Runes Transfer:**
```
Input: UTXOs totaling 1000 DOG
Edicts (in OP_RETURN):
  - 600 DOG → Recipient
  - 400 DOG → Change
Result: Tokens split per edicts
```

## 🎯 Choosing the Right Type

### Decision Framework

**Choose Ordinals if:**
- ✅ Creating unique art/collectibles
- ✅ Need individual identity per item
- ✅ Value is in uniqueness
- ✅ Limited edition (small quantity)
- ✅ Cultural/historical significance

**Choose Runes if:**
- ✅ Need divisibility
- ✅ Mass distribution (thousands+)
- ✅ Creating currency/points system
- ✅ Need liquidity/trading
- ✅ Utility-focused

**Use Both if:**
- ✅ NFT membership + utility token
- ✅ Art collection + community currency
- ✅ Fractionalized ownership
- ✅ Multi-tier system

## 🔗 Via Negativa Perspective

**What fungibility is NOT:**
- ❌ NOT about physical form (digital vs physical)
- ❌ NOT about value (both can be valuable)
- ❌ NOT about blockchain (both on Bitcoin)
- ❌ NOT about ownership (both have owners)

**What determines type:**
- ✅ Interchangeability
- ✅ Divisibility
- ✅ Uniqueness
- ✅ Use case intent

## 🎯 Practical Examples

### Example 1: Art Project

**Problem:** Launch digital art collection

**Solution:**
- **Ordinals:** Each artwork as inscription
- **Runes:** Companion token for holders
- **Benefit:** Art (NFT) + community (FT)

### Example 2: Gaming Ecosystem

**Problem:** In-game economy

**Solution:**
- **Ordinals:** Unique items (weapons, skins)
- **Runes:** Currency (gold, gems)
- **Benefit:** Collectibles + tradeable currency

### Example 3: Social Platform

**Problem:** Engagement rewards

**Solution:**
- **Ordinals:** Badges, achievements
- **Runes:** Points, tipping currency
- **Benefit:** Status (NFT) + utility (FT)

## 📚 Further Reading

- [Fungibility in Economics](https://en.wikipedia.org/wiki/Fungibility)
- [Ordinals vs Runes Debate](https://bitcoinmagazine.com/ordinals-runes)
- [UTXO Model Explained](https://learnmeabitcoin.com/technical/utxo)

## ✅ Chapter Quiz

1. What makes something fungible?
2. Can you split an Ordinal inscription?
3. Can you split a Runes token?
4. What's an example of hybrid use?
5. When would you choose Runes over Ordinals?

## Next Chapter

Continue to [Chapter 13: DMV Bitcoin Community](chapter13-dmv-community.md) to learn about local resources and meetups.

---

**Progress: 90/100 Complete** ✅
