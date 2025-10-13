# Chapter 3: Bitcoin Basics - UTXO, Keys, and Addresses

**Progress: 16-25/100**

## Introduction

Now that you have a wallet, let's dive deep into how Bitcoin actually works. Understanding UTXOs, keys, and addresses is crucial for mastering Bitcoin.

## 🔑 Cryptographic Keys

### The Key Hierarchy

```
Seed Phrase (12-24 words)
    ↓
Master Private Key
    ↓
Derived Private Keys (HD Wallet)
    ↓
Public Keys
    ↓
Bitcoin Addresses
```

### Private Keys

A private key is a 256-bit number:
```
5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ
```

**Properties:**
- 2^256 possible combinations (more than atoms in universe)
- Impossible to guess or brute force
- Controls Bitcoin at derived addresses
- Must be kept absolutely secret

### Public Keys

Generated from private key using elliptic curve cryptography:
```
04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f
```

**Properties:**
- One-way function: private → public ✅, public → private ❌
- Safe to share publicly
- Used to verify signatures
- Hashed to create addresses

### Addresses

Final step: hash public key to create address:

**Taproot Address:**
```
bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr
```

**Properties:**
- Shorter and more user-friendly
- Encodes network (bc = Bitcoin mainnet)
- Includes checksum (catches typos)
- Derived from public key hash

## 💰 The UTXO Model

### What is a UTXO?

**UTXO = Unspent Transaction Output**

Bitcoin doesn't have "account balances" like a bank. Instead:
- Every transaction creates outputs
- Outputs are either spent or unspent
- Your balance = sum of all your unspent outputs

### Physical Cash Analogy

Think of UTXOs like physical bills:

**Example:**
- You have three bills: $20, $10, $5
- Total balance: $35
- To buy $12 item:
  - Give $20 bill
  - Receive $8 change
  - Now have: $10, $5, $8

**Bitcoin works the same:**
- You have UTXOs: 0.5 BTC, 0.3 BTC, 0.1 BTC
- Total: 0.9 BTC
- To send 0.6 BTC:
  - Use 0.5 BTC + 0.3 BTC inputs
  - Create 0.6 BTC output (recipient)
  - Create 0.19 BTC output (your change)
  - 0.01 BTC goes to miner as fee

### UTXO Lifecycle

```
1. CREATED: Transaction output is created
2. UNSPENT: Sits in blockchain, owned by you
3. SPENT: Used as input in new transaction
4. DEAD: Cannot be spent again (immutable)
```

### Transaction Anatomy

```
INPUTS (what you're spending):
- UTXO #1: 0.5 BTC
- UTXO #2: 0.3 BTC
Total Input: 0.8 BTC

OUTPUTS (where it's going):
- Output #1: 0.6 BTC (recipient address)
- Output #2: 0.19 BTC (your change address)
Total Output: 0.79 BTC

Fee: 0.01 BTC (Input - Output)
```

## 🔐 Digital Signatures

### How Signatures Work

1. **Create transaction** specifying inputs/outputs
2. **Hash the transaction** to get message digest
3. **Sign with private key** to prove ownership
4. **Broadcast to network** with signature attached
5. **Network verifies** using your public key

### Signature Verification

Anyone can verify your signature:
- Use your public key (not secret)
- Use the transaction data
- Use the signature
- Math proves you signed it
- Cannot forge without private key

**Magic of cryptography:**
- Private key creates signature ✅
- Public key verifies signature ✅
- Public key cannot create signature ❌
- Signature cannot reveal private key ❌

## 🧮 Bitcoin Script

Bitcoin uses a scripting language for transactions:

### Pay-to-Taproot (P2TR)

Modern Taproot transactions:
```
OP_1 <32-byte-taproot-output>
```

**What it means:**
- Checks signature against public key
- Enables complex conditions (via Merkle tree)
- Looks like single key (privacy)
- Supports Ordinals inscriptions

### Script Types Evolution

| Type | Script | Era |
|------|--------|-----|
| P2PK | Pay to Public Key | 2009-2010 |
| P2PKH | Pay to Public Key Hash | 2010-2017 |
| P2SH | Pay to Script Hash | 2012-2017 |
| P2WPKH | Pay to Witness PKH (SegWit) | 2017-2021 |
| **P2TR** | **Pay to Taproot** | **2021-present** |

## 📡 How Transactions Flow

### Step-by-Step Process

**1. Create Transaction**
```javascript
{
  inputs: [utxo1, utxo2],
  outputs: [
    {address: recipient, amount: 0.6},
    {address: change, amount: 0.39}
  ],
  fee: 0.01
}
```

**2. Sign Transaction**
- Hash transaction data
- Sign hash with private key
- Attach signature + public key

**3. Broadcast to Mempool**
- Send to Bitcoin nodes
- Nodes validate signature
- Transaction enters mempool (waiting area)

**4. Mining**
- Miners select transactions (highest fee first)
- Include in block candidate
- Solve proof-of-work puzzle
- Broadcast block to network

**5. Confirmation**
- Block added to blockchain
- Your transaction gets 1 confirmation
- Every new block adds confirmation
- 6+ confirmations = settled

## 🔍 Reading the Blockchain

### Using Block Explorers

Visit [mempool.space](https://mempool.space) and look up a transaction:

**Transaction Components:**
- **TxID**: Unique transaction identifier (hash)
- **Inputs**: Which UTXOs are being spent
- **Outputs**: New UTXOs being created
- **Fee**: Sats/vB (satoshis per virtual byte)
- **Size**: Bytes of transaction data
- **Confirmations**: How many blocks deep

### Example Transaction Breakdown

```
Transaction: 3a4b...9f2c

INPUTS:
bc1q... 0.05000000 BTC

OUTPUTS:
bc1p... 0.04500000 BTC (recipient)
bc1q... 0.00490000 BTC (change)

Fee: 0.00010000 BTC (10,000 sats)
Fee Rate: 15 sat/vB
Size: 154 vB
Confirmations: 6
Status: CONFIRMED ✅
```

## 💡 Key Concepts Summary

### UTXOs
- Bitcoin's "bills and coins" model
- Each output can only be spent once
- Change addresses are normal
- Fee = inputs - outputs

### Keys
- Private key = ownership proof
- Public key = verification tool
- Address = destination identifier
- Never reveal private key

### Transactions
- Input: what you spend
- Output: where it goes
- Script: spending conditions
- Signature: proof of authorization

## 🔗 Via Negativa Perspective

What Bitcoin transactions are **NOT**:

- ❌ NOT like bank account debits (it's UTXO-based)
- ❌ NOT reversible (immutable once confirmed)
- ❌ NOT instant (requires mining/confirmation)
- ❌ NOT private by default (pseudonymous)
- ❌ NOT free (requires transaction fees)
- ❌ NOT dependent on identity (just keys)

## 🎯 Practical Exercise

1. **Find a transaction** on mempool.space
2. **Identify inputs and outputs**
3. **Calculate the fee** (inputs - outputs)
4. **Check confirmations** (how deep in blockchain)
5. **Examine addresses** (what type are they?)

**Recommended transaction to study:**
The Bitcoin Pizza transaction: `a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d`

## 📚 Further Reading

- [Mastering Bitcoin - Chapter 6: Transactions](https://github.com/bitcoinbook/bitcoinbook)
- [Learn Me a Bitcoin: UTXOs](https://learnmeabitcoin.com/technical/utxo)
- [Bitcoin Optech: Taproot](https://bitcoinops.org/en/topics/taproot/)

## ✅ Chapter Quiz

1. What does UTXO stand for?
2. Can you derive a private key from a public key?
3. What happens to the difference between inputs and outputs?
4. How many confirmations is considered "final"?
5. What do Taproot addresses start with?

## Next Chapter

Continue to [Chapter 4: Running a Bitcoin Node](chapter4-bitcoin-node.md) to learn about running your own infrastructure (advanced).

---

**Progress: 25/100 Complete** ✅
