# Mastering Bitcoin - Book Club Trivia

**Book:** Mastering Bitcoin (2nd Edition)
**Author:** Andreas M. Antonopoulos
**Total Questions:** 7

---

## Question 1: Bitcoin's True Nature

**Question:** What insight transformed Antonopoulos from dismissing Bitcoin as "Pfft! Nerd money!" to becoming obsessed with it?

**A)** Bitcoin's price potential for wealth creation
**B)** Bitcoin is "a decentralized trust network," not just money
**C)** Bitcoin's energy consumption proves its value
**D)** Bitcoin eliminates the need for banks and governments

**Correct Answer:** B

**Explanation:** Antonopoulos describes his revelation: "this isn't money, it's a decentralized trust network." This reframing is crucial—Bitcoin isn't just digital cash competing with dollars. It's a breakthrough in distributed computing that solves the Byzantine Generals' Problem, enabling strangers to transact without trusted intermediaries. Understanding Bitcoin as a trust network rather than merely currency unlocks comprehension of its revolutionary nature.

**Source:** Workbook only (not in slides)

---

## Question 2: Private Key Security

**Question:** What does Antonopoulos reveal about the nature of Bitcoin ownership that challenges common misconceptions?

**A)** Bitcoin is stored in your wallet like cash in a physical wallet
**B)** Exchanges provide the safest storage because they have professional security
**C)** The private key must be kept secret because revealing it is equivalent to giving control over your bitcoin
**D)** Lost private keys can be recovered through Bitcoin's customer service

**Correct Answer:** C

**Explanation:** The book states: "The private key must be kept secret at all times, because revealing it to third parties is equivalent to giving them control over the bitcoin secured by that key. The private key must also be backed up and protected from accidental loss, because if it's lost it cannot be recovered and the funds secured by it are forever lost, too." This establishes the harsh reality: Bitcoin is a bearer asset with no recourse. "Not your keys, not your coins" isn't a slogan—it's fundamental protocol design.

**Source:** Workbook only (not in slides)

---

## Question 3: No Coins, No Accounts

**Question:** What counterintuitive truth does Antonopoulos reveal about Bitcoin's structure?

**A)** Bitcoin uses a traditional account-based system like banks
**B)** In bitcoin, there are no coins, no senders, no recipients, no balances, no accounts, and no addresses—these are higher-level constructs
**C)** Bitcoin mining creates new coins that are distributed to miners
**D)** Bitcoin addresses function like bank account numbers

**Correct Answer:** B

**Explanation:** The book explains: "In bitcoin, there are no coins, no senders, no recipients, no balances, no accounts, and no addresses. All those things are constructed at a higher level for the benefit of the user, to make things easier to understand." Bitcoin's reality is UTXOs (Unspent Transaction Outputs) and scripts. What we call "balance" is actually sum of UTXOs. What we call "sending" is consuming inputs and creating outputs. This understanding is essential for grasping how Bitcoin actually works beneath the user interface.

**Source:** Workbook only (not in slides)

---

## Question 4: Proof-of-Work Purpose

**Question:** According to the book, what is proof-of-work's primary purpose in Bitcoin?

**A)** To create new bitcoins and reward miners for their work
**B)** To make attacking the network economically infeasible by requiring massive energy expenditure
**C)** To slow down transaction processing for security
**D)** To distribute bitcoin fairly among participants

**Correct Answer:** B

**Explanation:** While proof-of-work does reward miners with new bitcoin, its essential purpose is security. The book explains that proof-of-work makes rewriting history exponentially expensive—each block requires massive computational work, but verification is instant. After 6 confirmations, reversing a transaction would require outspending the entire honest network for ~1 hour. Energy expenditure isn't wasteful; it's the mechanism that makes Bitcoin's immutable ledger possible without trusted authorities.

**Source:** Workbook only (not in slides)

---

## Question 5: Script Design Philosophy

**Question:** Why is Bitcoin's Script language intentionally NOT Turing-complete?

**A)** Turing-complete languages are too complex for most developers
**B)** Non-Turing-complete ensures limited complexity and predictable execution times, preventing infinite loops
**C)** Turing-completeness would make Bitcoin incompatible with existing systems
**D)** Satoshi didn't know how to implement Turing-complete languages

**Correct Answer:** B

**Explanation:** Antonopoulos explains: "Script is not Turing Complete, meaning that scripts have limited complexity and predictable execution times. This ensures that the language cannot be used to create an infinite loop or other form of 'logic bomb' that could be embedded in a transaction in a way that causes a denial-of-service attack." This deliberate limitation is a security feature, not a deficiency. Bitcoin prioritizes predictability and security over computational flexibility.

**Source:** Workbook only (not in slides)

---

## Question 6: Full Nodes vs SPV

**Question:** What critical capability distinguishes full nodes from SPV (Simplified Payment Verification) nodes?

**A)** Full nodes mine blocks while SPV nodes only validate transactions
**B)** Full nodes can autonomously verify any transaction without external reference; SPV nodes must trust others
**C)** Full nodes earn transaction fees while SPV nodes pay fees
**D)** Full nodes require more bandwidth but both verify equally

**Correct Answer:** B

**Explanation:** The book states: "Full nodes can autonomously and authoritatively verify any transaction without external reference." SPV nodes download only block headers and rely on Merkle proofs, trusting that miners and other full nodes follow consensus rules. They cannot detect invalid blocks or rule violations. Running a full node is the only way to truly "don't trust, verify"—you independently enforce Bitcoin's consensus rules regardless of what miners, developers, or businesses claim.

**Source:** Workbook and slides

---

## Question 7: Consensus and Governance

**Question:** What does running your own full node give you in terms of Bitcoin governance?

**A)** Voting rights on protocol changes proportional to your holdings
**B)** The ability to veto protocol changes by enforcing the consensus rules you believe in
**C)** Extra mining rewards for supporting network decentralization
**D)** Priority access to new features and upgrades

**Correct Answer:** B

**Explanation:** Antonopoulos emphasizes that "consensus rules enforced by every full node independently." Soft forks add restrictions old nodes see as valid; hard forks require all nodes to upgrade or create chain splits. Running your own node means YOU enforce the consensus rules you believe in—nobody can force you to follow new rules. This gives users ultimate veto power over protocol changes, which is why the Blocksize Wars resolution favored small blockers running full nodes.

**Source:** Workbook and slides

---

## Answer Key
1. B - Decentralized trust network, not just money
2. C - Private key secret = control; lost = gone forever
3. B - No coins, accounts, balances—all higher-level constructs
4. B - Makes attacks economically infeasible through energy cost
5. B - Ensures limited complexity and predictable execution
6. B - Full nodes verify autonomously; SPV trusts others
7. B - Veto power through enforcing your consensus rules

---

**Note:** Questions 1-5 focus on technical architecture and design philosophy from the workbook that challenges common assumptions. Questions 6-7 cover the sovereignty implications of running a full node present in both workbook and slides.
