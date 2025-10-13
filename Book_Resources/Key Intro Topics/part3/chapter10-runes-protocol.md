# Chapter 10: Runes Protocol Deep Dive

**Progress: 66-75/100**

## Introduction

Runes is a fungible token protocol for Bitcoin, designed by Casey Rodarmor (creator of Ordinals). Launched at the Bitcoin halving (block 840,000) on April 20, 2024, Runes enables simple, efficient fungible tokens natively on Bitcoin.

## 🪙 What are Runes?

**Runes** are:
- Fungible tokens on Bitcoin
- Using UTXO model (not account-based)
- Encoded in OP_RETURN
- No native tokens or new consensus rules
- Designed for simplicity and efficiency

**Key Characteristics:**
- Token name (spacers allowed: DOG•GO•TO•THE•MOON)
- Total supply (fixed or variable)
- Divisibility (up to 18 decimals)
- Symbol (optional, 1 character)

## 🎯 Why Runes?

### Problems with Previous Standards

**BRC-20 (Ordinals-based tokens):**
- ❌ Creates massive UTXO bloat
- ❌ Requires complex indexing
- ❌ Off-chain balance tracking
- ❌ Not UTXO-native

**Counterparty, Omni Layer:**
- ❌ Legacy tech
- ❌ Small communities
- ❌ Complex protocols

**RGB, Taproot Assets:**
- ❌ Very complex
- ❌ Require specialized wallets
- ❌ Limited adoption

### Runes Solution

**✅ Advantages:**
- UTXO-based (fits Bitcoin naturally)
- Minimal blockchain footprint
- Simple to implement
- Efficient indexing
- Better UX than alternatives

## 🔧 Technical Architecture

### OP_RETURN Data Structure

Runes use OP_RETURN for token operations:

```
OP_RETURN
  0x52 (R)
  0x55 (U)
  0x4E (N)
  0x45 (E)
  <varint: protocol message>
```

**Protocol Messages:**
1. **ETCH** - Create new Rune
2. **MINT** - Mint tokens (if mintable)
3. **TRANSFER** - Move tokens between UTXOs

### Runestone Structure

A **Runestone** is the OP_RETURN data:

```
Runestone {
  edicts: Vec<Edict>,
  etching: Option<Etching>,
  mint: Option<RuneId>,
  pointer: Option<u32>,
}

Edict {
  id: RuneId,
  amount: u128,
  output: u32,
}

Etching {
  divisibility: u8,
  premine: u128,
  rune: Rune,
  spacers: u32,
  symbol: char,
  terms: Option<Terms>,
}
```

### Example Transaction

**Etching a New Rune:**
```
Transaction:
  Inputs:
    - 0.001 BTC from creator

  Outputs:
    - OP_RETURN (Runestone):
        ETCH
        Name: UNCOMMON•GOODS
        Supply: 21,000,000
        Divisibility: 2
        Symbol: ⧉
    - Back to creator (holds all tokens)

  Fee: 0.0001 BTC
```

**Transferring Runes:**
```
Transaction:
  Inputs:
    - UTXO containing 1000 DOG

  Outputs:
    - OP_RETURN (Runestone):
        TRANSFER
        500 DOG → Output 1
        500 DOG → Output 2
    - Output 1: Recipient address (gets 500 DOG)
    - Output 2: Change address (gets 500 DOG)

  Fee: based on size
```

## 📝 Creating a Rune

### Etching Process

**Step 1: Choose Parameters**
```
Name: EXAMPLE•RUNE
Symbol: ⟠
Divisibility: 8 (like Bitcoin)
Premine: 1,000,000 (creator receives)
Terms:
  - Amount per mint: 1000
  - Cap: 21,000 mints
  - Start height: 840,000
  - End height: 1,000,000
```

**Step 2: Build Etching Transaction**
```bash
# Using ord wallet
ord wallet etch \
  --rune EXAMPLE•RUNE \
  --divisibility 8 \
  --symbol ⟠ \
  --supply 21000000 \
  --premine 1000000 \
  --fee-rate 50
```

**Step 3: Broadcast**
```bash
# Transaction broadcasts
# Runestone in OP_RETURN
# Creator receives premined tokens
# Rune is now live
```

### Naming Rules

**Valid Names:**
- ✅ ALPHA•NUMERIC•ONLY
- ✅ Minimum 13 characters initially
- ✅ Gets shorter over time
- ✅ Spacers (•) allowed, not counted

**Name Length Schedule:**
| Block Height | Min Length |
|--------------|-----------|
| 840,000-1,050,000 | 13 chars |
| 1,050,000-1,150,000 | 12 chars |
| 1,150,000-1,250,000 | 11 chars |
| ... | ... |
| 1,750,000+ | 1 char |

**Examples:**
- UNCOMMON•GOODS ✅ (13 chars without spacers)
- BITCOIN ❌ (too short for early blocks)
- DOG•GO•TO•THE•MOON ✅
- RUNESTONE ✅

## 🔄 Rune Operations

### 1. Etching (Creating)

**Full Parameters:**
```rust
Etching {
    divisibility: 8,      // Decimals (0-18)
    premine: 1000000,     // Creator allocation
    rune: "EXAMPLE•RUNE",
    spacers: 0x0000,      // Position of •
    symbol: '⟠',          // Display symbol
    terms: Some(Terms {
        amount: 1000,     // Per mint
        cap: 21000,       // Max mints
        height: (         // Block range
            Some(840000), // Start
            Some(1000000) // End
        ),
        offset: (None, None)
    }),
    turbo: false          // Speed vs. size tradeoff
}
```

### 2. Minting

**Open Mint:**
```bash
# Anyone can mint (if terms allow)
ord wallet mint \
  --rune EXAMPLE•RUNE \
  --fee-rate 20

# Receives: 1000 tokens (per terms)
```

**Closed Mint:**
- No minting allowed
- Fixed supply at etching
- All premined to creator

### 3. Transferring

**Simple Transfer:**
```bash
# Send 500 tokens to address
ord wallet send \
  --rune EXAMPLE•RUNE \
  --amount 500 \
  --address bc1p... \
  --fee-rate 15
```

**Split Transfer:**
```
Input: 1000 EXAMPLE•RUNE

Edicts in OP_RETURN:
  - 300 → Output 0 (recipient A)
  - 400 → Output 1 (recipient B)
  - 300 → Output 2 (change)
```

## 💼 UTXO Model for Tokens

### How Runes Use UTXOs

Unlike Ethereum (account model), Runes use UTXOs:

**Ethereum:**
```
Account 0x123: 1000 tokens
(tracked in state)
```

**Runes:**
```
UTXO #1: 300 tokens
UTXO #2: 500 tokens
UTXO #3: 200 tokens
Total: 1000 tokens
(across multiple UTXOs)
```

### Benefits

**✅ Advantages:**
- Better privacy (UTXOs unlinkable)
- Parallel processing
- Fits Bitcoin model
- UTXO consolidation strategies
- Compatible with Lightning

**⚠️ Considerations:**
- Must manage UTXO set
- Can have many small UTXOs
- Requires UTXO-aware wallets
- Consolidation may be needed

## 📊 Economics & Tokenomics

### Supply Models

**1. Fixed Supply (Bitcoin-like)**
```
Total: 21,000,000
Premine: 1,000,000 (4.76%)
Mintable: 20,000,000 (95.24%)
Mints: 20,000 × 1,000 each
```

**2. Fair Launch (No Premine)**
```
Total: 1,000,000
Premine: 0
Mintable: 1,000,000 (100%)
Open mint until cap reached
```

**3. Time-Limited Mint**
```
Total: Variable
Terms: Mint 100/block
Duration: Blocks 840,000 - 850,000
Max: 1,000,000 (if all minted)
```

**4. Creator-Only (NFT-like)**
```
Total: 1
Premine: 1
Terms: None (no minting)
Use: Unique certificates, proof
```

### Fee Market

**Etching Costs:**
- Transaction bytes × fee rate
- Typically 300-1000 sats
- Higher during congestion

**Minting Costs:**
- Smaller tx than etching
- 200-500 sats typically
- Batch minting possible

**Transferring Costs:**
- Similar to Bitcoin tx
- ~150-300 sats
- Multiple recipients efficient

## 🛠️ Tooling & Infrastructure

### Wallets

**Rune-Enabled:**
- Xverse (mobile/extension)
- Unisat Wallet
- Leather Wallet (formerly Hiro)
- Sparrow Wallet (desktop)

**Coming Soon:**
- More hardware wallet support
- Lightning integration
- DEX interfaces

### Indexers

**1. Ord (Reference)**
```bash
ord wallet balance

# Shows:
Bitcoin: 0.05 BTC
Runes:
  DOG•GO•TO•THE•MOON: 1,000,000
  UNCOMMON•GOODS: 500
  EXAMPLE•RUNE: 2,000
```

**2. Third-Party APIs**
- RunesAPI
- Magic Eden Runes API
- OKX Runes Indexer

### Explorers

- ordinals.com/runes
- runescan.io
- magiceden.io/runes
- unisat.io/runes

## 🔗 Via Negativa Perspective

What Runes are **NOT**:

- ❌ NOT using account model (UTXO-based)
- ❌ NOT requiring sidechains (Bitcoin L1)
- ❌ NOT smart contracts (simple token logic)
- ❌ NOT off-chain balances (on-chain UTXOs)
- ❌ NOT complex to implement (simpler than RGB)
- ❌ NOT bloating UTXO set badly (OP_RETURN prunable)

## 🎯 Use Cases

### 1. Memecoins
- Community tokens
- Cultural artifacts
- Social experiments
- DOG•GO•TO•THE•MOON example

### 2. Project Tokens
- Fundraising
- Community rewards
- Governance (off-chain)
- Ecosystem incentives

### 3. Stablecoins (Future)
- Potential for fiat-backed
- Algorithmic stables
- Bitcoin-backed synthetics

### 4. Gaming Assets
- In-game currencies
- Tradeable items
- Achievement tokens

### 5. Reward Points
- Loyalty programs
- Proof of participation
- Engagement tracking

## 📚 Further Reading

- [Runes Documentation](https://docs.ordinals.com/runes.html)
- [Casey's Runes Blog Post](https://rodarmor.com/blog/runes/)
- [Runes Specification](https://github.com/ordinals/ord/blob/master/docs/src/runes.md)

## ✅ Chapter Quiz

1. What Bitcoin feature do Runes use for data?
2. What block height did Runes activate?
3. What are the three main Rune operations?
4. How are Rune balances tracked?
5. What's the minimum name length at launch?

## Next Chapter

Continue to [Chapter 11: Dog Go To The Moon Analysis](chapter11-dog-go-moon.md) to study the most successful Rune launch.

---

**Progress: 75/100 Complete** ✅
