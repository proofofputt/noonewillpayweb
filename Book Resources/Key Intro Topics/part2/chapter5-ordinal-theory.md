# Chapter 5: Ordinal Theory Handbook Read-Along

**Progress: 33-42/100**

## Introduction

Ordinal Theory, created by Casey Rodarmor in 2022, revolutionized Bitcoin by enabling digital artifacts to be inscribed directly on satoshis. This chapter walks through the Ordinal Theory Handbook with explanations for each concept.

## 🎯 What are Ordinals?

**Ordinals** are a numbering scheme for satoshis that:
- Track individual sats across transactions
- Enable NFT-like digital artifacts on Bitcoin
- Use Bitcoin's existing infrastructure
- Require no protocol changes
- Are stored on-chain forever

## 📖 The Ordinal Theory Handbook

### Core Concepts

#### 1. Ordinal Numbers

Every satoshi gets a unique number based on mining order:

```
Satoshi #0: First sat in genesis block
Satoshi #1: Second sat in genesis block
...
Satoshi #5,000,000,000: First sat in block 1
...
Satoshi #[current]: Latest mined sat
```

**Properties:**
- Sequential from 0 to ~1.9 quadrillion (when all mined)
- Immutable (can't be changed)
- Transferable (follow Bitcoin transactions)
- Provable (on-chain verification)

#### 2. Ordinal Notation

Multiple ways to reference ordinals:

**Integer:**
```
2099994106992659
```

**Decimal (block.offset):**
```
3891094.16797
```

**Degree (cycle°epoch′period″block‴offset):**
```
3°11094′214″0‴16797
```

**Name (base-26):**
```
satoshi
```

#### 3. Rarity Levels

Ordinals have different rarity tiers:

| Rarity | Supply | When Created | Example |
|--------|--------|--------------|---------|
| **Common** | ~21T | Any sat | 99.99% of all sats |
| **Uncommon** | ~6.93M | First sat of block | Every 10 min |
| **Rare** | ~3437 | First sat of difficulty adj | Every 2 weeks |
| **Epic** | ~32 | First sat of halving | Every 4 years |
| **Legendary** | 5 | First sat of cycle | Every 24 years |
| **Mythic** | 1 | First sat ever (genesis) | Only 1 exists |

**The Hierarchy:**
```
Mythic:      Sat #0 (Genesis)
Legendary:   First sat of each cycle (5 total when complete)
Epic:        First sat after each halving (32 total)
Rare:        First sat after difficulty adjustment (~3437)
Uncommon:    First sat of each block (~6.93M)
Common:      All other sats
```

### 4. Inscription Protocol

Inscriptions are digital artifacts stored on sats:

**Process:**
1. Select a satoshi (any ordinal)
2. Create inscription content (image, text, etc.)
3. Encode in Bitcoin script (witness data)
4. Broadcast transaction
5. Content permanently on-chain

**Inscription Transaction:**
```
Commit Transaction:
- Creates inscription in taproot script
- Prepared but not revealed

Reveal Transaction:
- Spends commit output
- Reveals inscription data
- Assigns to specific sat
```

### 5. Transfer Mechanics

Ordinals transfer with first-in-first-out (FIFO):

**Example:**
```
UTXO Input:  Sats #100-200 (100 sats)
UTXO Output: Sats #100-149 (50 sats to recipient)
             Sats #150-200 (50 sats change)
```

Inscriptions stay with their ordinal sat:
- Sat #150 inscribed → tracks through transfers
- Cannot split inscription from sat
- Follows wherever sat goes

## 🖼️ Inscription Types

### 1. Images (most common)
- PNG, JPEG, SVG, GIF, WebP
- Stored as raw bytes
- Max practical size: ~400KB

### 2. Text
- Plain text
- HTML
- Markdown
- JSON

### 3. Video/Audio
- Small clips
- MIDI files
- Compressed formats

### 4. Recursive Inscriptions
- Reference other inscriptions
- Build on existing content
- Enable complex projects

### 5. Collections
- Series of related inscriptions
- Metadata linking
- Provenance tracking

## 🔧 Technical Deep Dive

### Taproot Envelopes

Inscriptions use taproot script:

```
OP_FALSE
OP_IF
  OP_PUSH "ord"
  OP_PUSH 1
  OP_PUSH "image/png"
  OP_PUSH 0
  OP_PUSH <png bytes>
OP_ENDIF
```

**Why taproot?**
- Larger script capacity
- Lower fees than other methods
- Better privacy (looks like normal tx)
- SegWit discount (75% on witness data)

### Satoshi Tracking

How wallets track ordinals:

1. **Full Indexing:**
   - Track every sat in every transaction
   - Build ordinal-to-UTXO mapping
   - Heavy computation (requires full node)

2. **Light Tracking:**
   - Track only inscribed sats
   - Query indexer services
   - Faster but less trustless

3. **Heuristics:**
   - Assume FIFO transfer
   - Identify inscription outputs
   - Good enough for most use cases

### Cursed Inscriptions

Early protocol quirks created "cursed" inscriptions:

**Types of curses:**
- Negative inscription numbers
- Non-standard formats
- Multiple inscriptions in one tx

**Status:** Most curses have been lifted in updated versions

## 🌟 Notable Inscription Projects

### 1. Bitcoin Punks

First major collection:
- 100 punk images
- Inscribed Feb 2023
- Homage to CryptoPunks

### 2. Ordinal Maxi Biz (OMB)

Large collection:
- 10,000 pieces
- Business-themed
- Community-driven

### 3. Taproot Wizards

Pushed boundaries:
- Large inscriptions (4MB block)
- Wizard artwork
- Technical experiments

### 4. Bitcoin Frogs

Popular collection:
- 10,000 frogs
- Active community
- Regular events

## 🔗 Via Negativa Perspective

What Ordinals are **NOT**:

- ❌ NOT on a sidechain (native Bitcoin L1)
- ❌ NOT using tokens (just sats)
- ❌ NOT changeable (immutable forever)
- ❌ NOT requiring consensus changes (uses existing features)
- ❌ NOT external storage (all on-chain)
- ❌ NOT permissioned (anyone can inscribe)

## 🎯 Practical Understanding

### Why Ordinals Matter

**1. Digital Artifacts on Bitcoin**
- True ownership (on most secure chain)
- Permanent storage
- No 3rd party dependencies

**2. Cultural Significance**
- Bitcoin as culture layer
- Art on Bitcoin
- Memes and history preserved

**3. Technical Innovation**
- New use for taproot
- Satoshi-level precision
- Foundation for Runes

**4. Economic Activity**
- Fee revenue for miners
- New Bitcoin use case
- Ecosystem growth

### Controversy & Debate

**Critics say:**
- "Bloats the blockchain"
- "Not Bitcoin's purpose"
- "Wastes block space"

**Supporters say:**
- "Pays miners fees"
- "Uses Bitcoin as designed"
- "Expands Bitcoin utility"
- "Culture strengthens money"

**Neutral truth:**
- Anyone can use Bitcoin for any data
- Fees determine block space allocation
- Market decides value
- No one can censor valid transactions

## 📚 Further Reading

- [Ordinal Theory Handbook](https://docs.ordinals.com/)
- [Casey Rodarmor's Blog](https://rodarmor.com/blog/)
- [Ordinals.com Explorer](https://ordinals.com/)
- [Ord Software Documentation](https://github.com/ordinals/ord)

## ✅ Chapter Quiz

1. What is an ordinal number?
2. How many mythic satoshis exist?
3. What transaction type do inscriptions use?
4. What does FIFO mean in ordinal transfers?
5. Are inscriptions stored on-chain or off-chain?

## Next Chapter

Continue to [Chapter 6: Understanding Inscriptions](chapter6-inscriptions.md) to learn how to create and manage your own inscriptions.

---

**Progress: 42/100 Complete** ✅
