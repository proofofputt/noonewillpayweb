# Chapter 14: Nostr & Decentralized Social Networks

**Progress: 95-100/100**

## Introduction

Nostr (Notes and Other Stuff Transmitted by Relays) is a simple, open protocol for censorship-resistant social networking. Built by Bitcoin developers and embraced by the Bitcoin community, Nostr represents the social layer of the decentralized internet.

## 🌐 What is Nostr?

**Nostr** is:
- A protocol (not a platform)
- Decentralized (no company owns it)
- Censorship-resistant (can't be shut down)
- Portable (own your identity and data)
- Bitcoin-native (Lightning integration)

**Key Insight:**
Nostr isn't Twitter. It's a protocol that enables many Twitter-like (and other) applications to be built on top of it.

## 🔑 Core Concepts

### Public/Private Keys

**Your Identity:**
- **Private Key (nsec):** Your password, never share
- **Public Key (npub):** Your username, share freely

```
Private Key (nsec): nsec1abc123... (keep secret!)
Public Key (npub): npub1xyz789... (your identity)
```

**This Means:**
- You own your identity (not a company)
- Can't be banned (no central authority)
- One identity across all Nostr apps
- Portable data (take it anywhere)

### Relays

**What are relays?**
- Servers that store and transmit notes
- Anyone can run one
- Clients connect to multiple relays
- No single point of failure

**How it works:**
```
1. You write a note
2. Sign with your private key
3. Send to connected relays
4. Relays broadcast to subscribers
5. Your followers receive from their relays
```

**Relay Examples:**
- relay.damus.io (popular)
- nostr.mom (community relay)
- relay.nostr.band (aggregator)
- Your own relay (self-hosted)

### Events (Notes)

**Everything is an event:**
- Kind 0: Metadata (profile info)
- Kind 1: Short text note (like tweet)
- Kind 3: Contact list (follows)
- Kind 4: Encrypted DMs
- Kind 7: Reactions (likes)
- Kind 40-42: Chat rooms
- And many more...

**Event Structure:**
```json
{
  "id": "abc123...",
  "pubkey": "npub1xyz...",
  "created_at": 1234567890,
  "kind": 1,
  "tags": [],
  "content": "Hello Nostr!",
  "sig": "signature..."
}
```

## 📱 Getting Started with Nostr

### Step 1: Generate Keys

**Option A: Client generates for you**
- Download Damus (iOS) or Amethyst (Android)
- App creates keys automatically
- BACKUP YOUR PRIVATE KEY!

**Option B: Use key generator**
- Visit nostr.how
- Generate keys
- Store securely (password manager)

**Option C: Use Bitcoin wallet**
- Some wallets support Nostr keys
- Alby extension
- Unified experience

### Step 2: Choose a Client

**Mobile Apps:**

**Damus (iOS):**
- Beautiful design
- Easy to use
- Great for beginners
- Free, open source

**Amethyst (Android):**
- Feature-rich
- Customizable
- Active development
- Free, open source

**Web Clients:**

**Snort.social:**
- Twitter-like interface
- No installation needed
- Good for quick access

**Iris.to:**
- Clean design
- Web of trust features
- Beginner-friendly

**Coracle.social:**
- Advanced features
- Relay management
- Power user tool

**Desktop:**

**Nostrudel:**
- Full-featured
- Multi-account
- Advanced filters

### Step 3: Set Up Profile

**Basic Info:**
- Display name
- About/bio
- Profile picture (URL)
- Banner image (URL)

**Advanced:**
- Lightning address (for zaps)
- Website
- NIP-05 verification

### Step 4: Find People

**Discovery Methods:**
1. **Follow suggestions** (in-app)
2. **Search by npub** (if you know someone)
3. **Browse hashtags** (#bitcoin, #nostr)
4. **Join communities** (topic-based)

**Recommended Follows:**
- @jack (Twitter founder, Nostr supporter)
- @fiatjaf (Nostr creator)
- @NVK (Bitcoin dev, Nostr advocate)
- @hodlbod (Nostr developer)

## ⚡ Lightning Integration (Zaps)

### What are Zaps?

**Zaps** are Lightning payments on Nostr:
- Instant Bitcoin tips
- Attached to notes
- Show appreciation
- Support creators

**How it Works:**
```
1. You like someone's note
2. Click "⚡ Zap"
3. Choose amount (e.g., 100 sats)
4. Lightning invoice generated
5. Your wallet pays
6. Zap shows publicly on note
```

### Setting Up Zaps

**Requirements:**
- Lightning wallet (Wallet of Satoshi, Alby, Strike)
- Lightning address (you@yourdomain.com or lnurl)
- Add to Nostr profile

**Configure:**
1. Get Lightning address from wallet
2. Add to Nostr profile metadata
3. Verify it's working (zap yourself)
4. Start zapping others!

**Popular Amounts:**
- 21 sats (Bitcoin number)
- 100 sats (casual tip)
- 1,000 sats (quality content)
- 10,000+ sats (exceptional)

## 🛠️ Advanced Features

### Encrypted DMs

**Private Messaging:**
- End-to-end encrypted
- Only you and recipient can read
- Uses Nostr keys for encryption

**Limitations:**
- Metadata visible (who, when)
- Improving protocols (NIP-04, NIP-17)
- Not as secure as Signal (yet)

### Communities & Channels

**Like subreddits:**
- Topic-based discussion
- Public or private
- Moderation possible
- Multiple relay support

**Examples:**
- #bitcoin (price talk, news)
- #nostr (protocol discussion)
- #memes (fun content)
- #dmv (local community)

### Web of Trust

**Reputation System:**
- Follow people you trust
- See their follows
- Filter spam/bots
- Build trust network

**How to Use:**
1. Follow trusted people
2. Review their follows
3. Set trust levels
4. Filter unknown accounts

### Badges & Verification

**NIP-05 Verification:**
- Links npub to domain
- Shows you control domain
- Adds credibility

**Setup:**
```
1. Add JSON file to your domain:
   yourdomain.com/.well-known/nostr.json

2. File contents:
   {
     "names": {
       "yourname": "your_npub_hex"
     }
   }

3. Add to Nostr profile:
   yourname@yourdomain.com

4. Verified checkmark appears
```

## 🌟 Use Cases Beyond Social

### 1. Long-Form Content

**Blogging on Nostr:**
- Markdown support
- Permanent posts
- Monetize with zaps
- Censorship-resistant

**Clients:**
- Habla.news
- Yakihonne
- Blogstack

### 2. Marketplaces

**Buy/Sell on Nostr:**
- P2P commerce
- Escrow services
- Lightning payments
- Global reach

**Platforms:**
- Plebeian Market
- Shopstr
- Diagon Alley

### 3. Media Sharing

**Photos, Videos, Audio:**
- Upload to specialized relays
- Permanent storage (paid relays)
- Monetize with zaps

**Apps:**
- Nostr.build (image hosting)
- Fountain (podcasts)
- Wavlake (music)

### 4. Live Streaming

**Stream on Nostr:**
- Zaps during stream
- Chat integration
- Portable audience

**Platforms:**
- Zap.stream
- Nostrnests (audio spaces)

## 🔒 Privacy & Security

### Best Practices

**Key Management:**
- ✅ Backup private key offline
- ✅ Use hardware key storage (future)
- ✅ Consider multiple identities
- ✅ Never share nsec publicly

**Relay Selection:**
- ✅ Use multiple relays
- ✅ Include paid relays (less spam)
- ✅ Run your own relay
- ✅ Review relay policies

**Content:**
- ✅ Assume all notes public
- ✅ Don't doxx yourself
- ✅ Use pseudonyms if needed
- ✅ Think before posting

### Threat Models

**What Nostr Protects Against:**
- ✅ Platform censorship
- ✅ Account deletion
- ✅ Data lock-in
- ✅ Central authority control

**What Nostr Doesn't Fully Solve:**
- ⚠️ Metadata privacy (IPs, timing)
- ⚠️ Content deletion (relays can remove)
- ⚠️ Identity management (key loss = identity loss)
- ⚠️ Spam (improving with filters)

## 🔧 Running Your Own Relay

### Why Run a Relay?

**Benefits:**
- Full control of your data
- Support the network
- Custom policies
- Community relay for group

### How to Run

**Option 1: nostr-rs-relay (Rust)**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Clone repo
git clone https://github.com/scsibug/nostr-rs-relay

# Build and run
cd nostr-rs-relay
cargo build --release
./target/release/nostr-rs-relay
```

**Option 2: strfry (C++)**
- High performance
- Low resource usage
- Production-ready

**Option 3: Hosted Solutions**
- nostream.your-domain.com
- Relay-as-a-service
- Managed infrastructure

### Relay Policies

**Configure:**
- Who can write (public, paid, whitelist)
- Content filtering
- Rate limits
- Storage limits

**Monetization:**
- Paid relays (sats/month)
- Pay-per-post
- Zap splits
- Donations

## 🌍 Nostr & Bitcoin Culture

### Shared Values

**Nostr is Bitcoin-native because:**
- Decentralization
- Self-sovereignty
- Censorship resistance
- Freedom of speech
- Individual empowerment
- Open source
- Permissionless

### Cultural Overlap

**The Venn Diagram:**
- Bitcoiners → Early Nostr adopters
- Nostr devs → Often Bitcoin devs
- Lightning → Enables Nostr monetization
- Memes → Flow freely on both

### Building the Citadel

**Vision:**
- Bitcoin: Financial layer
- Lightning: Payment layer
- Nostr: Social/communication layer
- Combined: Parallel digital society

## 🔗 Via Negativa: What Nostr is NOT

- ❌ NOT a company (open protocol)
- ❌ NOT owned by anyone (public good)
- ❌ NOT just for Bitcoin (universal)
- ❌ NOT anonymous by default (pseudonymous)
- ❌ NOT perfect (evolving)
- ❌ NOT replacing all social media (yet!)

## 🎯 Practical Guide

### First Week on Nostr

**Day 1:**
- Create account
- Set up profile
- Follow 10 people

**Day 2:**
- Post your first note
- Reply to someone
- Use a hashtag

**Day 3:**
- Set up Lightning address
- Receive your first zap
- Zap someone else

**Day 4:**
- Join a community
- Find DMV locals
- Introduce yourself

**Day 5:**
- Explore different clients
- Find your favorite
- Customize experience

**Day 6:**
- Create longer content
- Share knowledge
- Engage with replies

**Day 7:**
- Reflect on experience
- Compare to Twitter
- Decide on commitment

### DMV Nostr Community

**Find Local Nostr Users:**
- Search #dmv hashtag
- #nostrdc
- #bitcoindc
- Ask at Bitcoin meetups

**Local Initiatives:**
- DMV Nostr meetup (organizing)
- Zap-based local economy
- P2P marketplace
- Community relay (planned)

## 📚 Resources

- [Nostr.how](https://nostr.how) - Beginner guide
- [Nostr.com](https://nostr.com) - Official docs
- [NIPs](https://github.com/nostr-protocol/nips) - Protocol specs
- [Awesome Nostr](https://github.com/aljazceru/awesome-nostr) - Curated list

## ✅ Final Chapter Quiz

1. What does Nostr stand for?
2. What's the difference between npub and nsec?
3. What is a relay?
4. What are zaps?
5. Why is Nostr aligned with Bitcoin values?

## 🎉 Congratulations!

You've completed the **No One Will Pay - Bitcoin Education GitBook**!

**You've learned:**
- ✅ Bitcoin fundamentals & whitepaper
- ✅ Self-custody & wallet security
- ✅ Ordinals & digital artifacts
- ✅ Runes & fungible tokens
- ✅ DMV community & resources
- ✅ Nostr & decentralized social

**Next Steps:**
1. Practice what you learned
2. Join the DMV community
3. Build something
4. Help others learn
5. Stay humble, stack sats

**Remember:**
- Not your keys, not your coins
- Verify, don't trust
- Stay curious
- Keep learning
- Have fun

---

**Progress: 100/100 Complete** ✅
**🎓 Course Complete!** 🎊

**Join the community:**
- DMV Bitcoin Telegram
- Nostr: npub1dmvbitcoin...
- Next meetup: First Thursday

**Keep building!** 🧡⚡🚀
