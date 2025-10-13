# Chapter 3: Advanced Self-Custody & Cold Storage

**Progress: 18-26/100**

**Note:** This chapter covers advanced wallet security. If you've already completed Chapter 1 (Xverse setup), you can skip this or return to it later when you're ready to secure larger amounts.

## Introduction

"Not your keys, not your coins" is the most important principle in Bitcoin. In this chapter, you'll learn to set up a self-custody wallet using Xverse, generate a taproot address, and secure your Bitcoin properly.

## 🔐 What is Self-Custody?

Self-custody means you alone control the private keys to your Bitcoin. No exchange, no bank, no third party can:
- Freeze your funds
- Confiscate your Bitcoin
- Go bankrupt and lose your money
- Require permission for transactions

### The Three Levels of Bitcoin Custody

1. **Exchange Custody** ❌
   - Exchange holds your keys
   - You trust them to give your Bitcoin back
   - Risk: Mt. Gox, FTX, Celsius, etc.

2. **Custodial Wallet** ⚠️
   - Third party holds keys
   - Easier to use but requires trust
   - Examples: Cash App, Strike, Wallet of Satoshi

3. **Self-Custody** ✅
   - You hold your own keys
   - Full sovereignty
   - Full responsibility
   - Examples: Xverse, Sparrow, Coldcard

## 📱 Why Xverse?

Xverse is perfect for beginners because it:
- Supports **Taproot addresses** (latest Bitcoin technology)
- Enables **Ordinals and Runes** (digital artifacts on Bitcoin)
- Provides simple **seed phrase backup**
- Works on **mobile and browser**
- Has a clean, **user-friendly interface**

## 🚀 Step-by-Step Setup Guide

### Step 1: Download Xverse

**Mobile:**
- iOS: [App Store link]
- Android: [Google Play link]

**Browser Extension:**
- Chrome: [Chrome Web Store link]
- Firefox: [Firefox Add-ons link]

### Step 2: Create New Wallet

1. Open Xverse app/extension
2. Click "Create New Wallet"
3. Set a strong password
   - At least 12 characters
   - Mix of letters, numbers, symbols
   - Use a password manager

### Step 3: Backup Your Seed Phrase

**THIS IS THE MOST IMPORTANT STEP**

You'll be shown 12 words (your seed phrase). This is your Bitcoin.

**Critical Rules:**
- ✅ Write it down on paper (never digital)
- ✅ Store in multiple secure locations
- ✅ Never take a photo
- ✅ Never store in cloud/email/notes
- ✅ Never share with anyone
- ✅ Triple-check spelling and order

**Seed Phrase Example (DO NOT USE THIS):**
```
witch collapse practice feed shame open despair
creek road again ice least
```

Your actual seed phrase will be different and must be kept secret.

### Step 4: Verify Your Seed Phrase

Xverse will ask you to confirm your seed phrase:
1. Select words in correct order
2. Confirm all 12 words match
3. Only proceed when 100% certain

### Step 5: Generate Taproot Address

1. Navigate to "Receive" in Xverse
2. Select **"Bitcoin (Taproot)"** address type
3. Copy your first Bitcoin address

**Address Types Explained:**

| Type | Starts With | Use Case |
|------|-------------|----------|
| Legacy | 1... | Old standard, avoid |
| SegWit | 3... | Wrapped SegWit |
| Native SegWit | bc1q... | Current standard |
| **Taproot** | bc1p... | **Latest tech, lowest fees, Ordinals support** |

**Your Taproot Address:**
```
bc1p... [62 characters]
```

This is your "account number" for receiving Bitcoin.

## 🛡️ Security Best Practices

### Seed Phrase Storage

**Good Options:**
- Metal seed phrase backup (fireproof/waterproof)
- Safety deposit box
- Hidden in home safe
- Split between multiple secure locations

**Bad Options:**
- ❌ Phone notes/photos
- ❌ Cloud storage (Google Drive, iCloud)
- ❌ Email to yourself
- ❌ Password manager (use for password only)
- ❌ Anywhere digital

### Operational Security

1. **Never share your seed phrase** - not even with "support"
2. **Verify all addresses** - Bitcoin transactions are irreversible
3. **Start with small amounts** - practice before storing large sums
4. **Use strong password** - protects app access
5. **Enable biometrics** - convenient secondary protection

## 🧪 Testing Your Wallet

### Receive Test

1. Get free testnet Bitcoin from a faucet
2. Or buy $10 worth from an exchange
3. Send to your Taproot address
4. Wait for confirmation (≈10 minutes)
5. Verify receipt in Xverse

### Send Test

1. Send small amount to another address
2. Verify transaction on blockchain explorer
3. Confirm it leaves your wallet
4. Check the recipient receives it

**Block Explorers:**
- [Mempool.space](https://mempool.space)
- [Blockstream.info](https://blockstream.info)

## 📊 Understanding Your Wallet

### Public vs Private Keys

**Public Key (Address):**
- Like your email address
- Share freely
- Receives Bitcoin
- Visible on blockchain

**Private Key (Seed Phrase):**
- Like your email password
- NEVER share
- Controls your Bitcoin
- Must be kept secret

### UTXO Model

Bitcoin uses Unspent Transaction Outputs (UTXOs):
- Each transaction creates new outputs
- Outputs are "unspent" until you send them
- Your balance = sum of all your UTXOs

Think of UTXOs like physical bills:
- Can't split a $20 bill
- Need to use whole bill and get change
- Each bill is independent

## 🔗 Via Negativa: What Self-Custody is NOT

- ❌ NOT convenient like a bank app
- ❌ NOT reversible if you lose seed phrase
- ❌ NOT protected by customer support
- ❌ NOT insured by FDIC
- ❌ NOT recoverable with "forgot password"

**But it IS:**
- ✅ Fully sovereign
- ✅ Censorship resistant
- ✅ Globally accessible 24/7
- ✅ Inheritance-friendly (with proper planning)

## 🎯 Practical Exercise

1. Download and install Xverse
2. Create new wallet
3. Backup seed phrase on paper
4. Verify seed phrase backup
5. Generate Taproot address
6. Save address for next chapter
7. (Optional) Send test transaction

## ⚠️ Common Mistakes to Avoid

1. **Storing seed phrase digitally**
   - Photos, screenshots, cloud = hacked

2. **Not verifying addresses**
   - Always double-check before sending

3. **Sending to wrong address type**
   - Use Taproot (bc1p...) for Ordinals/Runes

4. **Panic selling seed phrase holder**
   - Test your backup before storing large amounts

5. **Sharing with "support" scammers**
   - No legitimate support will ever ask for seed phrase

## 📚 Additional Resources

- [Xverse Official Documentation](https://xverse.app)
- [Bitcoin Address Types Explained](https://bitcoin.org/en/glossary)
- [Seed Phrase Security Guide](https://bitcoin.org/en/secure-your-wallet)

## ✅ Chapter Quiz

1. What does "not your keys, not your coins" mean?
2. How many words are in a standard Bitcoin seed phrase?
3. What do Taproot addresses start with?
4. Should you ever take a photo of your seed phrase?
5. What is a UTXO?

## Next Chapter

Continue to [Chapter 4: Bitcoin Basics](chapter4-bitcoin-basics.md) to learn about UTXOs, transaction structure, and how Bitcoin actually works.

---

**Progress: 26/100 Complete** ✅
