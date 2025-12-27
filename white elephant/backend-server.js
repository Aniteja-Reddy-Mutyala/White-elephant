import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database file path
const DB_PATH = path.join(__dirname, 'white-elephant-db.json');

// Helper function to get initial database state
function getInitialDatabase() {
  return {
    "teams": [
      {
        "id": 1,
        "name": "Bunny",
        "score": 600
      },
      {
        "id": 2,
        "name": "Bun Tea",
        "score": 400
      },
      {
        "id": 3,
        "name": "Dilkush",
        "score": 150
      },
      {
        "id": 4,
        "name": "Dil Pasand",
        "score": 150
      },
      {
        "id": 5,
        "name": "Irani Chai",
        "score": 150
      },
      {
        "id": 6,
        "name": "Coffee",
        "score": 300
      }
    ],
    "goodies": [
      {
        "id": 1,
        "name": "Wireless Headphones",
        "image": "🎧",
        "imageUrl": "",
        "productUrl": "",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 2,
        "name": "Gourmet Coffee Set",
        "image": "☕",
        "imageUrl": "",
        "productUrl": "",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 3,
        "name": "Gaming Mouse",
        "image": "🖱️",
        "imageUrl": "",
        "productUrl": "",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 4,
        "name": "Smart Watch",
        "image": "⌚",
        "imageUrl": "",
        "productUrl": "",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 5,
        "name": "Bluetooth Speaker",
        "image": "🔊",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 6,
        "name": "Instant Camera",
        "image": "📷",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 7,
        "name": "Plant Terrarium",
        "image": "🌿",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 8,
        "name": "Book Collection",
        "image": "📚",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 9,
        "name": "Yoga Mat Set",
        "image": "🧘",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 10,
        "name": "BBQ Tool Kit",
        "image": "🍖",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 11,
        "name": "Art Supplies",
        "image": "🎨",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 12,
        "name": "Tea Sampler",
        "image": "🍵",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 13,
        "name": "Portable Charger",
        "image": "🔋",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 14,
        "name": "Cozy Blanket",
        "image": "🛋️",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 15,
        "name": "Recipe Book",
        "image": "📖",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 16,
        "name": "Desk Organizer",
        "image": "📌",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 17,
        "name": "Essential Oils Set",
        "image": "🧴",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 18,
        "name": "Travel Mug",
        "image": "🥤",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 19,
        "name": "Puzzle Game",
        "image": "🧩",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 20,
        "name": "Scented Candles",
        "image": "🕯️",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 21,
        "name": "Kitchen Gadget Set",
        "image": "🍴",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 22,
        "name": "Phone Stand",
        "image": "📱",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 23,
        "name": "Notebook Set",
        "image": "📝",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      },
      {
        "id": 24,
        "name": "Water Bottle",
        "image": "💧",
        "imageUrl": "",
        "productUrl": "",
        "value": 50,
        "revealed": false,
        "winner": null
      }
    ],
    "bids": [],
    "gameState": {
      "currentTurn": null,
      "gameStatus": "in_progress",
      "revealedItems": [],
      "lastUpdated": new Date().toISOString()
    },
    "settings": {
      "minBidAmount": 1,
      "maxBidAmount": 1000,
      "allowNegativeScores": false,
      "autoDeductPoints": true
    }
  };
}

// Helper function to read database
async function readDatabase() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    throw error;
  }
}

// Helper function to write database
async function writeDatabase(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw error;
  }
}

// ========== ROUTES ==========

// Get entire database
app.get('/api/database', async (req, res) => {
  try {
    const db = await readDatabase();
    res.json(db);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load database' });
  }
});

// Get all teams
app.get('/api/teams', async (req, res) => {
  try {
    const db = await readDatabase();
    res.json(db.teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load teams' });
  }
});

// Add a new team
app.post('/api/teams', async (req, res) => {
  try {
    const { name, score = 0 } = req.body;
    const db = await readDatabase();
    
    const newTeam = {
      id: db.teams.length > 0 ? Math.max(...db.teams.map(t => t.id)) + 1 : 1,
      name,
      score
    };
    
    db.teams.push(newTeam);
    await writeDatabase(db);
    
    res.json(newTeam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add team' });
  }
});

// Delete a team
app.delete('/api/teams/:id', async (req, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const db = await readDatabase();
    
    // Remove team
    db.teams = db.teams.filter(t => t.id !== teamId);
    
    // Remove their bids
    db.bids = db.bids.filter(b => b.teamId !== teamId);
    
    // Clear turn if it's their turn
    const deletedTeam = db.teams.find(t => t.id === teamId);
    if (deletedTeam && db.gameState.currentTurn === deletedTeam.name) {
      db.gameState.currentTurn = null;
    }
    
    await writeDatabase(db);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

// Update team score
app.put('/api/teams/:id', async (req, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const { score } = req.body;
    const db = await readDatabase();
    
    const team = db.teams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    team.score = score;
    await writeDatabase(db);
    
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// Adjust team score (add or subtract)
app.post('/api/teams/:id/adjust', async (req, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const { adjustment } = req.body; // Can be positive or negative
    const db = await readDatabase();
    
    const team = db.teams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    team.score += adjustment;
    await writeDatabase(db);
    
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to adjust team score' });
  }
});

// Get all goodies
app.get('/api/goodies', async (req, res) => {
  try {
    const db = await readDatabase();
    res.json(db.goodies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load goodies' });
  }
});

// Reveal a goodie
app.put('/api/goodies/:id/reveal', async (req, res) => {
  try {
    const goodieId = parseInt(req.params.id);
    const db = await readDatabase();
    
    const goodie = db.goodies.find(g => g.id === goodieId);
    if (!goodie) {
      return res.status(404).json({ error: 'Goodie not found' });
    }
    
    goodie.revealed = true;
    if (!db.gameState.revealedItems.includes(goodieId)) {
      db.gameState.revealedItems.push(goodieId);
    }
    
    db.gameState.lastUpdated = new Date().toISOString();
    await writeDatabase(db);
    
    res.json(goodie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reveal goodie' });
  }
});

// Get all bids
app.get('/api/bids', async (req, res) => {
  try {
    const db = await readDatabase();
    res.json(db.bids);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load bids' });
  }
});

// Get bids for a specific item
app.get('/api/bids/item/:itemId', async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const db = await readDatabase();
    
    const itemBids = db.bids
      .filter(b => b.itemId === itemId)
      .sort((a, b) => b.bidAmount - a.bidAmount); // Highest first
    
    res.json(itemBids);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load item bids' });
  }
});

// Place a bid (with all validation rules)
app.post('/api/bids', async (req, res) => {
  try {
    const { teamId, teamName, itemId, itemNumber, bidAmount } = req.body;
    const db = await readDatabase();
    
    // Find team
    const team = db.teams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    // Find goodie
    const goodie = db.goodies.find(g => g.id === itemId);
    if (!goodie) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // UNIVERSAL MINIMUM BID FOR UNREVEALED ITEMS
    const UNREVEALED_MIN_BID = 50; // Set universal minimum for unrevealed items
    
    // VALIDATION: Original winner cannot re-bid their own item unless someone else re-bid
    if (goodie.winner && goodie.winner.teamId === teamId) {
      // Check if there are any re-bids from other teams
      const otherTeamRebids = db.bids.filter(
        b => b.itemId === itemId && 
        b.isRebid && 
        b.teamId !== teamId && 
        (b.status === 'active' || b.status === 'outbid')
      );
      
      if (otherTeamRebids.length === 0) {
        const itemName = goodie.revealed ? goodie.name : `Item #${goodie.id}`;
        return res.status(400).json({ 
          error: `${team.name}: You already won ${itemName}. You cannot re-bid on your own item unless another team re-bids first.` 
        });
      }
    }
    
    // Get current highest bid for this item
    const existingBids = db.bids.filter(b => b.itemId === itemId && b.status === 'active');
    const highestBid = existingBids.length > 0 
      ? Math.max(...existingBids.map(b => b.bidAmount))
      : 0;
    
    // Determine minimum bid and handle re-bidding on won items
    let minimumBid;
    let previousWinner = null;
    
    if (goodie.winner) {
      // RULE: If item has a winner, new bid must be at least 2x the winning amount
      minimumBid = goodie.winner.bidAmount * 2;
      
      if (bidAmount < minimumBid) {
        const itemName = goodie.revealed ? goodie.name : `Item #${goodie.id}`;
        return res.status(400).json({ 
          error: `${team.name}: ${itemName} was won by ${goodie.winner.teamName} at $${goodie.winner.bidAmount}. To re-bid, you must bid at least $${minimumBid} (2x the winning amount)` 
        });
      }
      
      // Store previous winner info for point transfer
      previousWinner = {
        teamId: goodie.winner.teamId,
        teamName: goodie.winner.teamName,
        bidAmount: goodie.winner.bidAmount
      };
      
    } else if (highestBid > 0) {
      // If there's a current bid, must be higher
      if (bidAmount <= highestBid) {
        // Find the team with current highest bid
        const highestBidder = existingBids.find(b => b.bidAmount === highestBid);
        return res.status(400).json({ 
          error: `${team.name}: Your bid must be higher than ${highestBidder.teamName}'s current bid of $${highestBid}` 
        });
      }
    } else {
      // No bids yet - check if revealed or unrevealed
      if (!goodie.revealed) {
        // UNREVEALED: Use universal minimum bid
        if (bidAmount < UNREVEALED_MIN_BID) {
          return res.status(400).json({ 
            error: `${team.name}: Minimum bid for unrevealed items is $${UNREVEALED_MIN_BID}` 
          });
        }
      } else {
        // REVEALED: Use item value as minimum
        if (bidAmount < goodie.value) {
          return res.status(400).json({ 
            error: `${team.name}: Minimum bid for ${goodie.name} must be at least $${goodie.value}` 
          });
        }
      }
    }
    
    // VALIDATION RULE: Team cannot bid more than their current score
    if (bidAmount > team.score) {
      return res.status(400).json({ 
        error: `${team.name}: You cannot bid $${bidAmount} as you only have $${team.score} points available` 
      });
    }
    
    // Store original winner info - need to track through multiple re-bids
    let originalWinnerId = null;
    let originalWinnerName = null;
    
    // Check if this is a re-bid scenario
    if (goodie.winner && previousWinner) {
      // This is the first re-bid - store the original winner
      originalWinnerId = previousWinner.teamId;
      originalWinnerName = db.teams.find(t => t.id === previousWinner.teamId)?.name;
      
      // Clear the winner (bidding reopened)
      goodie.winner = null;
    } else if (!goodie.winner) {
      // Check if there are already re-bids for this item
      // We need to carry forward the original winner from previous re-bids
      const existingRebids = db.bids.filter(b => b.itemId === itemId && b.originalWinnerId);
      if (existingRebids.length > 0) {
        // Use the original winner from any previous re-bid
        const previousRebid = existingRebids[0];
        originalWinnerId = previousRebid.originalWinnerId;
        originalWinnerName = previousRebid.originalWinnerName;
      }
    }
    
    // Create new bid
    const newBid = {
      id: db.bids.length > 0 ? Math.max(...db.bids.map(b => b.id)) + 1 : 1,
      teamId,
      teamName,
      itemId,
      itemNumber,
      bidAmount: parseFloat(bidAmount),
      timestamp: new Date().toISOString(),
      status: 'active',
      isRebid: originalWinnerId !== null, // Mark if this is part of a re-bid chain
      originalWinnerId: originalWinnerId, // Store original winner for later transfer
      originalWinnerName: originalWinnerName
    };
    
    // Mark all previous bids on this item as outbid
    db.bids.forEach(bid => {
      if (bid.itemId === itemId && bid.status === 'active') {
        bid.status = 'outbid';
        
        // REFUND points to outbid team
        const outbidTeam = db.teams.find(t => t.id === bid.teamId);
        if (outbidTeam) {
          outbidTeam.score += bid.bidAmount;
        }
      }
    });
    
    // Deduct points from bidding team
    team.score -= bidAmount;
    
    // Add new bid
    db.bids.push(newBid);
    
    db.gameState.lastUpdated = new Date().toISOString();
    await writeDatabase(db);
    
    const itemName = goodie.revealed ? goodie.name : `Item #${goodie.id}`;
    
    res.json({ 
      success: true, 
      bid: newBid,
      newScore: team.score,
      wasRebid: originalWinnerId !== null,
      teamName: team.name,
      itemName: itemName,
      bidAmount: bidAmount
    });
  } catch (error) {
    console.error('Bid error:', error);
    res.status(500).json({ error: 'Failed to place bid' });
  }
});

// Close bidding on an item and declare winner
app.post('/api/bids/close/:itemId', async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const db = await readDatabase();
    
    const goodie = db.goodies.find(g => g.id === itemId);
    if (!goodie) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Find highest active bid
    const activeBids = db.bids.filter(b => b.itemId === itemId && b.status === 'active');
    
    if (activeBids.length === 0) {
      return res.status(400).json({ error: 'No active bids for this item' });
    }
    
    const winningBid = activeBids.reduce((highest, current) => 
      current.bidAmount > highest.bidAmount ? current : highest
    );
    
    // Mark winning bid as won
    const bid = db.bids.find(b => b.id === winningBid.id);
    bid.status = 'won';
    
    // Check if there were any re-bids (bids with originalWinnerId)
    const rebids = activeBids.filter(b => b.isRebid && b.originalWinnerId);
    
    let transferInfo = null;
    
    if (rebids.length > 0) {
      // Find the highest re-bid
      const highestRebid = rebids.reduce((highest, current) => 
        current.bidAmount > highest.bidAmount ? current : highest
      );
      
      // Transfer the highest re-bid amount to the original winner
      const originalWinnerTeam = db.teams.find(t => t.id === highestRebid.originalWinnerId);
      if (originalWinnerTeam) {
        originalWinnerTeam.score += highestRebid.bidAmount;
        
        transferInfo = {
          originalWinner: highestRebid.originalWinnerName,
          transferredAmount: highestRebid.bidAmount,
          fromBidder: highestRebid.teamName
        };
        
        console.log(`💰 Closing bid transfer: $${highestRebid.bidAmount} transferred to ${originalWinnerTeam.name} (original winner) from ${highestRebid.teamName}'s re-bid`);
      }
    }
    
    // Set winner on goodie
    goodie.winner = {
      teamId: winningBid.teamId,
      teamName: winningBid.teamName,
      bidAmount: winningBid.bidAmount
    };
    
    // Mark all other bids as lost
    db.bids.forEach(b => {
      if (b.itemId === itemId && b.id !== winningBid.id && b.status === 'active') {
        b.status = 'lost';
      }
    });
    
    db.gameState.lastUpdated = new Date().toISOString();
    await writeDatabase(db);
    
    res.json({ 
      success: true, 
      winner: goodie.winner,
      goodie,
      transferInfo // Include transfer information if it happened
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to close bidding' });
  }
});

// Set winner directly on an item (for manual "Mark as Sold")
app.put('/api/goodies/:id/winner', async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const { teamId, bidAmount } = req.body;
    const db = await readDatabase();
    
    const goodie = db.goodies.find(g => g.id === itemId);
    if (!goodie) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const team = db.teams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    // Validate bid amount
    const amount = parseInt(bidAmount);
    if (isNaN(amount) || amount < goodie.value) {
      return res.status(400).json({ 
        error: `Bid amount must be at least $${goodie.value}` 
      });
    }
    
    // Check if team has enough points
    if (team.score < amount) {
      return res.status(400).json({ 
        error: `${team.name} doesn't have enough points. Has $${team.score}, needs $${amount}` 
      });
    }
    
    // Handle re-auction payment flow
    let paymentInfo = null;
    
    if (goodie.reauctionRequestingTeam && goodie.originalOwnerForReauction) {
      // This is a re-auctioned item
      const originalOwner = db.teams.find(t => t.id === goodie.originalOwnerForReauction.teamId);
      
      if (originalOwner) {
        // Single payment: Winner pays bid amount to original owner
        team.score -= amount;
        originalOwner.score += amount;
        
        console.log(`💰 Re-auction sale: $${amount} from ${team.name} → ${originalOwner.name} (original owner)`);
        
        paymentInfo = {
          bidAmount: amount,
          paidByWinner: team.name,
          receivedBy: originalOwner.name,
          wasReauction: true
        };
      }
      
      // Clear re-auction markers
      delete goodie.reauctionRequestingTeam;
      delete goodie.originalOwnerForReauction;
      
    } else if (goodie.originalOwnerForReauction) {
      // Legacy re-auction (old flow) - pay original owner
      const originalOwner = db.teams.find(t => t.id === goodie.originalOwnerForReauction.teamId);
      if (originalOwner) {
        team.score -= amount;
        originalOwner.score += amount;
        console.log(`💰 Re-auction payment: $${amount} from ${team.name} → ${originalOwner.name}`);
      }
      delete goodie.originalOwnerForReauction;
      
    } else {
      // Normal sale - just deduct from winner
      team.score -= amount;
    }
    
    // Set new winner
    goodie.winner = {
      teamId: team.id,
      teamName: team.name,
      bidAmount: amount
    };
    
    // Mark as revealed if not already
    if (!goodie.revealed) {
      goodie.revealed = true;
    }
    
    await writeDatabase(db);
    
    res.json({ 
      success: true,
      goodie,
      team,
      paymentInfo
    });
  } catch (error) {
    console.error('Error setting winner:', error);
    res.status(500).json({ error: 'Failed to set winner' });
  }
});

// Re-auction an item (bring back to auction)
app.post('/api/goodies/:id/reauction', async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const { requestingTeamId } = req.body;
    const db = await readDatabase();
    
    const goodie = db.goodies.find(g => g.id === itemId);
    if (!goodie) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (!goodie.winner) {
      return res.status(400).json({ error: 'Item is not currently owned' });
    }
    
    // Initialize re-auction count if not exists
    if (!goodie.reauctionCount) {
      goodie.reauctionCount = 0;
    }
    
    // Check max re-auctions
    if (goodie.reauctionCount >= 3) {
      return res.status(400).json({ error: 'Maximum re-auctions (3) reached for this item' });
    }
    
    const requestingTeam = db.teams.find(t => t.id === requestingTeamId);
    const currentOwner = db.teams.find(t => t.id === goodie.winner.teamId);
    
    if (!requestingTeam) {
      return res.status(404).json({ error: 'Requesting team not found' });
    }
    
    if (!currentOwner) {
      return res.status(404).json({ error: 'Current owner not found' });
    }
    
    // Can't re-auction your own item
    if (requestingTeamId === goodie.winner.teamId) {
      return res.status(400).json({ error: 'Cannot re-auction your own item' });
    }
    
    const doublePrice = goodie.winner.bidAmount * 2;
    
    // Check if requesting team has enough points
    if (requestingTeam.score < doublePrice) {
      return res.status(400).json({ 
        error: `${requestingTeam.name} doesn't have enough points. Has $${requestingTeam.score}, needs $${doublePrice}` 
      });
    }
    
    // Store current owner info - they will get paid when item sells
    const currentOwnerId = goodie.winner.teamId;
    const currentOwnerName = goodie.winner.teamName;
    const currentPrice = goodie.winner.bidAmount;
    
    // Increment re-auction count
    goodie.reauctionCount += 1;
    
    // Store original owner who will receive final payment
    goodie.originalOwnerForReauction = {
      teamId: currentOwnerId,
      teamName: currentOwnerName
    };
    
    // Store requesting team info for initial bid
    goodie.reauctionRequestingTeam = {
      teamId: requestingTeamId,
      teamName: requestingTeam.name,
      reauctionCost: doublePrice
    };
    
    // Clear winner to reopen bidding
    goodie.winner = null;
    
    // Mark as revealed if not already
    if (!goodie.revealed) {
      goodie.revealed = true;
    }
    
    await writeDatabase(db);
    
    res.json({ 
      success: true,
      goodie,
      requestingTeam,
      currentOwner,
      reauctionCost: doublePrice,
      remainingReauctions: 3 - goodie.reauctionCount
    });
  } catch (error) {
    console.error('Error re-auctioning item:', error);
    res.status(500).json({ error: 'Failed to re-auction item' });
  }
});

// Update game state
app.put('/api/gamestate', async (req, res) => {
  try {
    const { currentTurn, gameStatus } = req.body;
    const db = await readDatabase();
    
    if (currentTurn !== undefined) {
      db.gameState.currentTurn = currentTurn;
    }
    if (gameStatus !== undefined) {
      db.gameState.gameStatus = gameStatus;
    }
    
    db.gameState.lastUpdated = new Date().toISOString();
    await writeDatabase(db);
    
    res.json(db.gameState);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update game state' });
  }
});

// Reset entire game
app.post('/api/reset', async (req, res) => {
  try {
    const db = await readDatabase();
    
    // Reset all teams scores to 0
    db.teams.forEach(team => team.score = 0);
    
    // Reset all goodies
    db.goodies.forEach(goodie => {
      goodie.revealed = false;
      goodie.winner = null;
    });
    
    // Clear all bids
    db.bids = [];
    
    // Reset game state
    db.gameState = {
      currentTurn: null,
      gameStatus: 'in_progress',
      revealedItems: [],
      lastUpdated: new Date().toISOString()
    };
    
    await writeDatabase(db);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset game' });
  }
});

// Start server
// Reset database to initial state
app.post('/api/database/reset', async (req, res) => {
  try {
    const initialDb = getInitialDatabase();
    await writeDatabase(initialDb);
    res.json({ 
      success: true,
      message: 'Database reset to initial state',
      database: initialDb
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Using database at: ${DB_PATH}`);
  console.log(`🎮 White Elephant Game API running on http://localhost:${PORT}`);
});