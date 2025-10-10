# Glossary

## Bitcoin Terms

**Bitcoin (BTC)** - A decentralized digital currency and payment system. Also refers to the protocol and network.

**Satoshi (sat)** - The smallest unit of Bitcoin. 1 BTC = 100,000,000 satoshis.

**UTXO** - Unspent Transaction Output. Bitcoin's model for tracking balances.

**Private Key** - Secret number that controls Bitcoin. Never share this.

**Public Key** - Derived from private key. Used to create addresses.

**Seed Phrase** - 12 or 24 words that backup your wallet. Equivalent to private key.

**Taproot** - Bitcoin upgrade enabling more efficient and private transactions. Required for Ordinals.

**Lightning Network** - Layer 2 payment network for instant, cheap Bitcoin transactions.

**Mempool** - Waiting area for unconfirmed transactions before mining.

**Mining** - Process of creating new blocks and securing the network.

**Halving** - Event every 4 years when block reward is cut in half.

**Self-Custody** - Holding your own keys, not trusting third parties.

## Ordinals Terms

**Ordinals** - A numbering scheme for individual satoshis enabling NFTs on Bitcoin.

**Inscription** - Data (image, text, etc.) attached to a specific satoshi.

**Ordinal Number** - The unique number assigned to each satoshi based on mining order.

**Sat Rarity** - Categories of satoshi rarity (common, uncommon, rare, epic, legendary, mythic).

**Recursive Inscription** - Inscription that references other inscriptions.

**Parent-Child Inscriptions** - Collection structure where parent defines metadata for child NFTs.

**Cursed Inscription** - Early inscription with non-standard format, now mostly resolved.

**Sat Tracking** - Following individual satoshis through transactions (FIFO method).

## Runes Terms

**Runes** - Fungible token protocol for Bitcoin using OP_RETURN.

**Etching** - Creating a new Rune token.

**Runestone** - The OP_RETURN data containing Rune operations.

**Edict** - Instruction within a Runestone for transferring tokens.

**Divisibility** - Number of decimal places a Rune supports (0-18).

**Premine** - Tokens minted to creator at launch.

**Mint Terms** - Rules for how a Rune can be minted (amount, cap, timing).

**Symbol** - Optional single character representing the Rune (e.g., 🐕 for DOG).

**Spacers** - Dots (•) in Rune names for readability.

## Technical Terms

**OP_RETURN** - Bitcoin script opcode for storing arbitrary data.

**Taproot Script** - Script type used for Ordinals inscriptions.

**Witness Data** - Part of transaction where inscription data is stored.

**PSBT** - Partially Signed Bitcoin Transaction. Used for complex/multi-party txs.

**Indexer** - Software that scans blockchain and builds searchable database.

**Block Explorer** - Website for viewing blockchain data.

**Fee Rate** - Cost per byte of transaction data (sat/vB).

**vByte** - Virtual byte. Unit for measuring transaction size.

**Dust Limit** - Minimum output value (546 sats) to prevent spam.

**RBF** - Replace-By-Fee. Ability to increase fee of unconfirmed transaction.

## Wallet Terms

**Hot Wallet** - Wallet connected to internet (convenient but less secure).

**Cold Wallet** - Wallet offline (more secure but less convenient).

**Hardware Wallet** - Physical device for storing keys securely.

**Watch-Only Wallet** - Can view balance but not spend (no private keys).

**Multi-Sig** - Wallet requiring multiple signatures to spend.

**Xverse** - Popular wallet for Bitcoin, Ordinals, and Runes.

**Taproot Address** - Address starting with bc1p... for Taproot transactions.

## DMV Terms

**DMV** - District of Columbia, Maryland, Virginia metro area.

**Via Negativa** - Defining something by what it is NOT.

**No One Will Pay** - This educational initiative emphasizing Bitcoin principles.

**Circular Economy** - Economic system where Bitcoin circulates within community.

## Nostr Terms

**Nostr** - Notes and Other Stuff Transmitted by Relays. Decentralized social protocol.

**npub** - Nostr public key (your username/identity).

**nsec** - Nostr private key (your password, keep secret!).

**Relay** - Server that stores and transmits Nostr messages.

**Zap** - Lightning payment on Nostr as tip/appreciation.

**NIP** - Nostr Implementation Possibility. Protocol specifications.

**Event** - Generic term for any Nostr message (note, DM, reaction, etc.).

**Web of Trust** - Reputation system based on who you follow and trust.
