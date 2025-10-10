# Chapter 4: Running a Bitcoin Node (Advanced)

**Progress: 25-33/100**

## Introduction

Running your own Bitcoin node is the ultimate expression of sovereignty. "Don't trust, verify" becomes reality when you validate every transaction and block yourself.

## 🖥️ What is a Bitcoin Node?

A Bitcoin node is software that:
- **Validates** all transactions and blocks
- **Stores** the entire blockchain history
- **Broadcasts** transactions to network
- **Enforces** consensus rules
- **Serves** data to other nodes and wallets

### Full Node vs Light Client

| Feature | Full Node | Light Client (SPV) |
|---------|-----------|-------------------|
| Blockchain | Full (~500GB) | Headers only (~50MB) |
| Validation | Every transaction | Trust others |
| Privacy | Maximum | Reveals addresses |
| Resources | High | Low |
| Security | Maximum | Good |

## 🎯 Why Run a Node?

### 1. Trustless Verification
- Verify YOUR transactions yourself
- Don't rely on third-party servers
- Ensure rules are being followed
- Detect any network attacks

### 2. Maximum Privacy
- Don't reveal which addresses are yours
- No external server sees your wallet
- Query your own node for balance/history
- Use Tor for IP privacy

### 3. Network Support
- Strengthen Bitcoin decentralization
- Help new nodes synchronize
- Validate and relay transactions
- Vote with your node on rule changes

### 4. Personal Infrastructure
- Connect your wallet to your node
- Run Lightning Network node on top
- Explore blockchain data yourself
- Learning and experimentation

## 🔧 Node Software Options

### Bitcoin Core (Reference Implementation)

**Best for:** Maximum compatibility, developers, researchers

**Features:**
- Official Bitcoin software
- Most battle-tested
- GUI and command-line options
- RPC interface for advanced use

**System Requirements:**
- 500GB+ storage (growing ~50GB/year)
- 2GB+ RAM
- Decent CPU (syncing is CPU-intensive)
- Unlimited internet (or high cap)

### BTCPay Server

**Best for:** Merchants accepting Bitcoin

**Features:**
- Payment processor
- Runs full node underneath
- Web interface
- Lightning support
- No third-party fees

### Umbrel

**Best for:** Beginners wanting all-in-one solution

**Features:**
- Beautiful web interface
- App store (Lightning, Ordinals, etc.)
- Automatic updates
- Runs on Raspberry Pi
- Pre-configured settings

### RaspiBlitz

**Best for:** DIY enthusiasts, Lightning focus

**Features:**
- Raspberry Pi optimized
- Lightning Network ready
- Terminal-based interface
- Comprehensive guides
- Active community

## 📦 Hardware Options

### Option 1: Raspberry Pi 4

**Cost: ~$200**
- Raspberry Pi 4 (8GB RAM) - $75
- 1TB SSD - $80
- Power supply - $15
- Case - $20
- MicroSD card - $10

**Pros:**
- Low power consumption
- Small form factor
- Silent operation
- Established ecosystem

**Cons:**
- Slower initial sync (1-2 weeks)
- Limited upgrade path
- ARM architecture (less software support)

### Option 2: Used/Old Laptop

**Cost: $0-300**
- Use laptop you already have
- Or buy used laptop
- Add external SSD if needed

**Pros:**
- Free if you have one
- Faster sync
- Built-in battery (UPS)
- Keyboard/screen included

**Cons:**
- Higher power consumption
- Larger footprint
- May need repairs

### Option 3: Mini PC / NUC

**Cost: $300-600**
- Intel NUC or similar
- 8GB+ RAM
- 1TB+ SSD

**Pros:**
- Fast sync (days not weeks)
- Compact
- Reliable
- Good upgrade path

**Cons:**
- Higher initial cost
- Still needs monitor for setup

### Option 4: Dedicated Node Hardware

**Cost: $400-1000**
- Start9 Embassy
- Nodl
- MyNode Premium

**Pros:**
- Plug-and-play
- Professional support
- Premium features
- Sleek design

**Cons:**
- Expensive
- Vendor lock-in
- Same hardware as DIY (but easier)

## 🚀 Setup Guide: Bitcoin Core on Ubuntu

### Step 1: Install Bitcoin Core

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Download Bitcoin Core
wget https://bitcoincore.org/bin/bitcoin-core-27.0/bitcoin-27.0-x86_64-linux-gnu.tar.gz

# Verify signatures (important!)
wget https://bitcoincore.org/bin/bitcoin-core-27.0/SHA256SUMS
wget https://bitcoincore.org/bin/bitcoin-core-27.0/SHA256SUMS.asc

# Import signing keys
gpg --keyserver hkps://keys.openpgp.org --recv-keys [key]

# Verify
gpg --verify SHA256SUMS.asc
sha256sum --ignore-missing --check SHA256SUMS

# Extract
tar xzf bitcoin-27.0-x86_64-linux-gnu.tar.gz
sudo install -m 0755 -o root -g root -t /usr/local/bin bitcoin-27.0/bin/*
```

### Step 2: Configure bitcoin.conf

```bash
mkdir -p ~/.bitcoin
nano ~/.bitcoin/bitcoin.conf
```

**Basic Configuration:**
```ini
# Network
server=1
txindex=1

# RPC (for wallet/queries)
rpcuser=yourusername
rpcpassword=yourpassword
rpcallowip=127.0.0.1

# Performance
dbcache=2048
maxconnections=40

# Privacy (optional)
proxy=127.0.0.1:9050  # Tor
listen=1
bind=127.0.0.1
```

### Step 3: Start Initial Block Download (IBD)

```bash
# Start Bitcoin Core
bitcoind -daemon

# Check sync status
bitcoin-cli getblockchaininfo

# View sync progress
tail -f ~/.bitcoin/debug.log
```

**IBD Timeline:**
- Fast hardware (NVMe, modern CPU): 24-48 hours
- Medium hardware (SATA SSD): 3-5 days
- Slow hardware (Raspberry Pi): 1-2 weeks

### Step 4: Verify Sync Completion

```bash
bitcoin-cli getblockcount
# Should match current block height at mempool.space

bitcoin-cli getblockchaininfo | grep verification
# verificationprogress should be 0.999999+
```

## 🔐 Securing Your Node

### 1. Firewall Configuration

```bash
# Allow SSH (if remote)
sudo ufw allow 22

# Allow Bitcoin P2P
sudo ufw allow 8333

# Enable firewall
sudo ufw enable
```

### 2. Tor Integration (Privacy)

```bash
# Install Tor
sudo apt install tor

# Configure Tor
sudo nano /etc/tor/torrc
```

Add:
```
ControlPort 9051
CookieAuthentication 1
```

Restart:
```bash
sudo systemctl restart tor
```

### 3. Automatic Updates

```bash
# Create update script
nano ~/update-bitcoin.sh
```

```bash
#!/bin/bash
bitcoin-cli stop
wget [latest version URL]
# ... verify and install ...
bitcoind -daemon
```

### 4. Monitoring

```bash
# System resources
htop

# Bitcoin status
watch -n 1 bitcoin-cli getnetworkinfo

# Connection count
bitcoin-cli getconnectioncount
```

## ⚡ Connecting Your Wallet

### Electrum (Desktop)

1. Install Electrum Personal Server
2. Configure with your xpub
3. Connect to your node's Electrum interface
4. Verify you're using your node (no external queries)

### Sparrow (Desktop)

1. Settings → Server
2. Select "Bitcoin Core"
3. Enter: localhost:8332
4. Input RPC credentials
5. Test connection

### Blue Wallet (Mobile)

1. Settings → Network
2. Select "Electrum Server"
3. Enter your node's onion address (if Tor)
4. Or use Tailscale/VPN for clearnet

## 🔍 Advanced: Exploring the Blockchain

### Querying Your Node

```bash
# Get specific block
bitcoin-cli getblock [blockhash]

# Get transaction
bitcoin-cli getrawtransaction [txid] true

# Get UTXO set info
bitcoin-cli gettxoutsetinfo

# Get mempool info
bitcoin-cli getmempoolinfo

# List wallet UTXOs
bitcoin-cli listunspent
```

### Running Your Own Block Explorer

Install BTC RPC Explorer:
```bash
git clone https://github.com/janoside/btc-rpc-explorer
cd btc-rpc-explorer
npm install
npm start
```

Access at `http://localhost:3002`

## 📊 Node Maintenance

### Regular Tasks

**Daily:**
- Check sync status
- Monitor disk space
- Review logs for errors

**Weekly:**
- Update software (if new version)
- Check peer connections
- Verify backups

**Monthly:**
- Review configuration
- Test wallet connections
- Check for hardware issues

### Common Issues

**1. Slow Sync**
- Increase dbcache
- Use faster storage
- Check internet speed

**2. Disk Full**
- Prune old blocks (if not archival)
- Add more storage
- Clean debug logs

**3. Connection Issues**
- Check firewall
- Verify port forwarding
- Try different peers

**4. Crashes**
- Check logs
- Verify RAM sufficient
- Update to latest version

## 🔗 Via Negativa: What Nodes Are NOT

- ❌ NOT required to use Bitcoin (but recommended)
- ❌ NOT mining (nodes validate, miners create blocks)
- ❌ NOT earning you money (unless running Lightning)
- ❌ NOT making you a "master node" (no such thing in Bitcoin)
- ❌ NOT demanding constant attention (set and forget)

## 🎯 Practical Exercise

**Beginner Path:**
1. Install Bitcoin Core on old computer
2. Start IBD
3. Wait for full sync
4. Connect Sparrow wallet
5. Verify using your own node

**Advanced Path:**
1. Set up Raspberry Pi with Umbrel
2. Configure Tor for privacy
3. Install BTC RPC Explorer
4. Run Lightning node on top
5. Accept payments via BTCPay

## 📚 Resources

- [Bitcoin Core Documentation](https://bitcoin.org/en/full-node)
- [Running a Full Node (Bitcoin.org)](https://bitcoin.org/en/full-node)
- [Raspibolt Guide](https://raspibolt.org/)
- [Ministry of Nodes Tutorials](https://www.ministryofnodes.com.au/)

## ✅ Chapter Quiz

1. What's the difference between a full node and SPV client?
2. How much disk space does a full node require?
3. What does IBD stand for?
4. Can you earn Bitcoin by running a node?
5. What does txindex=1 enable?

## Next Section

Continue to **Part 2: Ordinals & Digital Artifacts** → [Chapter 5: Ordinal Theory Handbook Read-Along](../part2/chapter5-ordinal-theory.md)

---

**Progress: 33/100 Complete** ✅
**Part 1 Complete!** 🎉
