import React, { useState, useEffect } from "react";
import { Gift, Users, Trophy, DollarSign, Sparkles, Star, TrendingUp, Award, Edit, X, CheckCircle, AlertCircle } from "lucide-react";
import "./WhiteElephantGame.css";

// API base URL - your backend server
const API_URL = "http://localhost:3001/api";

const WhiteElephantGameComplete = () => {
  const [currentPage, setCurrentPage] = useState("registration");
  const [db, setDB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState("");
  const [flippedCards, setFlippedCards] = useState({});
  const [bidForm, setBidForm] = useState({
    teamName: "",
    itemNumber: "",
    bidAmount: "",
  });
  const [selectedItemForBids, setSelectedItemForBids] = useState(null);
  const [itemBids, setItemBids] = useState([]);
  const [activeBiddingItem, setActiveBiddingItem] = useState(null);
  
  // Score editing state (NEW)
  const [editingScore, setEditingScore] = useState(null); // teamId being edited
  const [editScoreValue, setEditScoreValue] = useState("");
  
  // Notification system (NEW)
  const [notification, setNotification] = useState(null);
  
  // Scroll position preservation (NEW)
  const [preserveScroll, setPreserveScroll] = useState(false);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  
  // Hover state for team winnings (NEW)
  const [hoveredTeam, setHoveredTeam] = useState(null);
  
  // Card modal state (NEW)
  const [selectedCard, setSelectedCard] = useState(null);
  const [soldToTeam, setSoldToTeam] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);
  
  // Celebration popup state (NEW)
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState(null);
  
  // Re-auction state (NEW)
  const [showReauctionPrompt, setShowReauctionPrompt] = useState(false);
  const [reauctionItem, setReauctionItem] = useState(null);

  // Show notification (NEW)
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Load database from API
  const loadDatabase = async () => {
    // Save scroll position before loading
    const currentScroll = window.scrollY || window.pageYOffset;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/database`);
      const data = await response.json();
      setDB(data);
      console.log("✅ Database loaded:", data);
      
      // Restore scroll position after state update
      requestAnimationFrame(() => {
        window.scrollTo(0, currentScroll);
      });
    } catch (error) {
      console.error("❌ Error loading database:", error);
      showNotification("Failed to connect to backend. Make sure server is running on port 3001", 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load bids for a specific item
  const loadItemBids = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/bids/item/${itemId}`);
      const bids = await response.json();
      setItemBids(bids);
      setSelectedItemForBids(itemId);
    } catch (error) {
      console.error("Error loading item bids:", error);
    }
  };

  // Initial load
  useEffect(() => {
    loadDatabase();
  }, []);
  
  // Restore scroll position when needed (NEW)
  useEffect(() => {
    if (preserveScroll && savedScrollPosition !== null) {
      window.scrollTo(0, savedScrollPosition);
      setPreserveScroll(false);
    }
  }, [db, preserveScroll, savedScrollPosition]);

  // ========== TEAM OPERATIONS ==========

  // Add a new team via API
  const handleRegisterTeam = async (e) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      try {
        const response = await fetch(`${API_URL}/teams`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTeamName, score: 0 }),
        });

        if (!response.ok) throw new Error("Failed to add team");

        await loadDatabase();
        setNewTeamName("");
        showNotification(`Team "${newTeamName}" has been registered successfully!`, 'success');
      } catch (error) {
        console.error("Error adding team:", error);
        showNotification("Failed to add team", 'error');
      }
    }
  };

  // Delete a team via API
  const handleDeleteTeam = async (team) => {
    try {
      const response = await fetch(`${API_URL}/teams/${team.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete team");

      await loadDatabase();
      showNotification(`Team "${team.name}" has been deleted`, 'success');
    } catch (error) {
      console.error("Error deleting team:", error);
      showNotification("Failed to delete team", 'error');
    }
  };

  // Adjust team score by amount (NEW)
  const adjustTeamScore = async (teamId, adjustment) => {
    try {
      const response = await fetch(`${API_URL}/teams/${teamId}/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adjustment }),
      });

      if (!response.ok) throw new Error("Failed to adjust score");
      
      // Update database without page refresh
      const updatedDb = await fetch(`${API_URL}/database`).then(res => res.json());
      setDB(updatedDb);
      
      const team = updatedDb.teams.find(t => t.id === teamId);
      showNotification(
        `${team?.name}: Score adjusted by ${adjustment > 0 ? '+' : ''}${adjustment} points`,
        'success'
      );
    } catch (error) {
      console.error("Error adjusting score:", error);
      showNotification("Failed to adjust score", 'error');
    }
  };

  // Set team score to exact value (NEW)
  const setTeamScore = async (teamId, newScore) => {
    if (isNaN(newScore)) {
      showNotification("Please enter a valid number", 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/teams/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: newScore }),
      });

      if (!response.ok) throw new Error("Failed to set score");
      
      // Update database without page refresh
      const updatedDb = await fetch(`${API_URL}/database`).then(res => res.json());
      setDB(updatedDb);
      
      const team = updatedDb.teams.find(t => t.id === teamId);
      showNotification(`${team?.name}: Score set to ${newScore} points`, 'success');
      
      // Clear editing state
      setEditingScore(null);
      setEditScoreValue("");
    } catch (error) {
      console.error("Error setting score:", error);
      showNotification("Failed to set score", 'error');
    }
  };

  // Handle score click to edit (NEW)
  const handleScoreClick = (teamId, currentScore) => {
    setEditingScore(teamId);
    setEditScoreValue(currentScore.toString());
  };

  // Handle score input change (NEW)
  const handleScoreChange = (e) => {
    setEditScoreValue(e.target.value);
  };

  // Handle score input submit (NEW)
  const handleScoreSubmit = (teamId) => {
    const newScore = parseInt(editScoreValue);
    if (!isNaN(newScore)) {
      setTeamScore(teamId, newScore);
    }
  };

  // Handle score input blur (NEW)
  const handleScoreBlur = () => {
    setEditingScore(null);
    setEditScoreValue("");
  };
  
  // Handle card click to open modal (NEW)
  const handleCardClick = (goodie) => {
    setSelectedCard(goodie);
    
    // Get current highest bid for this item
    const currentBid = getCurrentBid(goodie.id);
    
    if (currentBid) {
      // If there's a current bid, set it
      setSoldToTeam(currentBid.teamId);
      setBidAmount(currentBid.bidAmount);
    } else if (goodie.winner) {
      // If item is already won, show winner
      setSoldToTeam(goodie.winner.teamId);
      setBidAmount(goodie.winner.bidAmount);
    } else {
      // No bids yet, use item value as starting amount
      setSoldToTeam(null);
      setBidAmount(goodie.value);
    }
  };
  
  // Handle re-auction counter click
  const handleReauctionClick = (e, goodie) => {
    e.stopPropagation(); // Prevent card click
    setReauctionItem(goodie);
    setShowReauctionPrompt(true);
  };
  
  // Close re-auction prompt
  const closeReauctionPrompt = () => {
    setShowReauctionPrompt(false);
    setReauctionItem(null);
  };
  
  // Handle team selection for re-auction
  const handleReauctionRequest = async (teamId) => {
    if (!reauctionItem || !teamId) return;
    
    try {
      const response = await fetch(`${API_URL}/goodies/${reauctionItem.id}/reauction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestingTeamId: teamId })
      });
      
      if (!response.ok) {
        const error = await response.json();
        showNotification(error.error || 'Failed to re-auction item', 'error');
        return;
      }
      
      const result = await response.json();
      
      // Reload database
      const updatedDb = await fetch(`${API_URL}/database`).then(res => res.json());
      setDB(updatedDb);
      
      // Close re-auction prompt
      closeReauctionPrompt();
      
      // Open bidding modal with requesting team and double price
      const updatedItem = updatedDb.goodies.find(g => g.id === reauctionItem.id);
      setSelectedCard(updatedItem);
      setSoldToTeam(teamId);
      setBidAmount(result.reauctionCost);
      
      showNotification(
        `${result.requestingTeam.name} brought ${updatedItem.name} back to auction for $${result.reauctionCost}!`,
        'success'
      );
    } catch (error) {
      console.error('Error requesting re-auction:', error);
      showNotification('Failed to request re-auction', 'error');
    }
  };
  
  // Close modal
  const closeModal = () => {
    setSelectedCard(null);
    setSoldToTeam(null);
    setBidAmount(0);
  };
  
  // Handle sold action - updates winner in database
  const handleSoldToTeam = async () => {
    if (!soldToTeam || !selectedCard || !bidAmount) return;
    
    try {
      // Set the team as winner with the bid amount
      const response = await fetch(`${API_URL}/goodies/${selectedCard.id}/winner`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          teamId: soldToTeam,
          bidAmount: parseInt(bidAmount)
        }),
      });
      
      if (!response.ok) throw new Error("Failed to mark as sold");
      
      const updatedDb = await fetch(`${API_URL}/database`).then(res => res.json());
      setDB(updatedDb);
      
      const team = updatedDb.teams.find(t => t.id === soldToTeam);
      
      // Close the bidding modal first
      closeModal();
      
      // Show celebration popup
      setCelebrationData({
        teamName: team?.name,
        itemName: selectedCard.name,
        itemEmoji: selectedCard.image,
        amount: bidAmount
      });
      setShowCelebration(true);
      
      // Auto-hide celebration after 5 seconds
      setTimeout(() => {
        setShowCelebration(false);
        setCelebrationData(null);
      }, 5000);
      
      showNotification(
        `${selectedCard.name} sold to ${team?.name} for $${bidAmount}!`,
        'success'
      );
    } catch (error) {
      console.error("Error marking as sold:", error);
      showNotification("Failed to mark item as sold", 'error');
    }
  };

  // ========== GAME OPERATIONS ==========

  // Reveal a card via API
  const handleRevealCard = async (id) => {
    // Save current scroll position IMMEDIATELY
    const scrollPosition = window.scrollY || window.pageYOffset;
    
    // Create a scroll lock function
    const lockScroll = (e) => {
      window.scrollTo(0, scrollPosition);
    };
    
    // Add scroll lock listener
    window.addEventListener('scroll', lockScroll, { passive: false });
    
    // Store in state for useEffect
    setSavedScrollPosition(scrollPosition);
    setPreserveScroll(true);
    
    try {
      await fetch(`${API_URL}/goodies/${id}/reveal`, { method: "PUT" });
      await fetch(`${API_URL}/gamestate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentTurn: null }),
      });

      await loadDatabase();
      setFlippedCards({ ...flippedCards, [id]: true });
      
      // Multiple restore attempts
      window.scrollTo(0, scrollPosition);
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosition);
      });
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 10);
      
      const revealedGoodie = db.goodies.find(g => g.id === id);
      showNotification(
        `Revealed ${revealedGoodie?.name || `Item #${id}`}!`,
        'success'
      );
    } catch (error) {
      console.error("Error revealing card:", error);
      showNotification("Failed to reveal card", 'error');
      setPreserveScroll(false);
    } finally {
      // Remove scroll lock after a delay
      setTimeout(() => {
        window.removeEventListener('scroll', lockScroll);
      }, 100);
    }
  };

  const handleFlipCard = (id) => {
    const goodie = db.goodies.find((g) => g.id === id);
    if (goodie && goodie.revealed) {
      setFlippedCards({ ...flippedCards, [id]: !flippedCards[id] });
    }
  };

  // Start top scorer's turn via API
  // Get current highest bid for an item
  const getCurrentBid = (itemId) => {
    const activeBids = db.bids.filter(
      (b) => b.itemId === itemId && b.status === "active"
    );
    if (activeBids.length === 0) return null;
    return activeBids.reduce((highest, current) =>
      current.bidAmount > highest.bidAmount ? current : highest
    );
  };

  // Get minimum bid for an item (UPDATED)
  const getMinimumBid = (itemId) => {
    const goodie = db.goodies.find((g) => g.id === itemId);
    if (!goodie) return 0;

    // Universal minimum for unrevealed items
    const UNREVEALED_MIN_BID = 50;

    // If item has a winner, next bid must be 2x the winning amount
    if (goodie.winner) {
      return goodie.winner.bidAmount * 2;
    }

    const currentBid = getCurrentBid(itemId);
    if (currentBid) {
      return currentBid.bidAmount + 1; // Must be higher than current bid
    }

    // If unrevealed, use universal minimum
    if (!goodie.revealed) {
      return UNREVEALED_MIN_BID;
    }

    // If revealed, use item value
    return goodie.value;
  };

  // Submit bid via API
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const itemId = parseInt(bidForm.itemNumber);
    const bidAmount = parseFloat(bidForm.bidAmount);

    if (bidForm.teamName && bidForm.itemNumber && bidForm.bidAmount) {
      const team = db.teams.find((t) => t.name === bidForm.teamName);

      if (!team) {
        showNotification("Team not found!", 'error');
        return;
      }

      // Check if item exists
      const goodie = db.goodies.find((g) => g.id === itemId);
      if (!goodie) {
        showNotification("Item not found!", 'error');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/bids`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamId: team.id,
            teamName: bidForm.teamName,
            itemId: itemId,
            itemNumber: itemId,
            bidAmount: bidAmount,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          showNotification(data.error, 'error');
          return;
        }

        await loadDatabase();
        
        // Keep the item as active bidding item
        setActiveBiddingItem(itemId);
        
        // Auto-flip the card to show the back (NEW)
        setFlippedCards({ ...flippedCards, [itemId]: true });
        
        // Don't reset the form, just update bid amount to new minimum
        const newMinBid = getMinimumBid(itemId);
        setBidForm({
          ...bidForm,
          bidAmount: newMinBid.toString(),
        });

        // Show detailed success notification
        showNotification(
          `${data.teamName} successfully bid $${data.bidAmount} on ${data.itemName}. New score: ${data.newScore}`,
          'success'
        );

        // Reload bids if viewing this item
        if (selectedItemForBids === itemId) {
          loadItemBids(itemId);
        }
      } catch (error) {
        console.error("Error placing bid:", error);
        showNotification("Failed to place bid", 'error');
      }
    }
  };

  // Close bidding on an item
  const closeBidding = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/bids/close/${itemId}`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        showNotification(data.error, 'error');
        return;
      }

      // Build notification message
      let message = `🏆 Winner: ${data.winner.teamName} with a bid of $${data.winner.bidAmount}!`;
      
      // Add transfer info if there was a re-bid
      if (data.transferInfo) {
        message += ` | 💰 $${data.transferInfo.transferredAmount} transferred to ${data.transferInfo.originalWinner} (original winner)`;
      }

      showNotification(message, 'success');
      await loadDatabase();

      // Clear active bidding item
      setActiveBiddingItem(null);

      // Reload bids if viewing this item
      if (selectedItemForBids === itemId) {
        loadItemBids(itemId);
      }
    } catch (error) {
      console.error("Error closing bidding:", error);
      showNotification("Failed to close bidding", 'error');
    }
  };

  // Reset game via API
  const resetGame = async () => {
    try {
      const response = await fetch(`${API_URL}/database/reset`, { method: "POST" });
      if (!response.ok) throw new Error('Reset failed');
      
      await loadDatabase();
      setFlippedCards({});
      setCurrentPage("registration");
      setSelectedItemForBids(null);
      setItemBids([]);
      setActiveBiddingItem(null);
      showNotification("Game reset successfully! 24 items at $50 each", 'success');
    } catch (error) {
      console.error("Error resetting game:", error);
      showNotification("Failed to reset game", 'error');
    }
  };

  // ========== RENDERING ==========

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-icon">⏳</div>
          <div className="loading-text">Loading game data from server...</div>
        </div>
      </div>
    );
  }

  if (!db) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-icon">❌</p>
          <p className="error-title">Failed to connect to server</p>
          <p className="error-subtitle">
            Make sure the backend is running: node backend-server-enhanced.js
          </p>
          <button onClick={loadDatabase} className="retry-button button-hover">
            🔄 Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* Notification Toast (NEW) */}
      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          <div className="notification-content">
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{notification.message}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="notification-close"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Background stars */}
      <div className="background-stars">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${
                2 + Math.random() * 3
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="content-wrapper">
        {/* Header */}
        <div className="header-container">
          <div className="header-title-row">
            <Gift size={48} color="#fff" className="header-icon-bounce" />
            <h1 className="header-title">White Elephant Game</h1>
            <Sparkles
              size={48}
              color="#fff"
              className="header-icon-bounce-delayed"
            />
          </div>
          <p className="header-subtitle">
            🌐 Connected to Backend - Live Database Updates
          </p>
        </div>

        {/* Navigation */}
        <div className="navigation-container">
          {["registration", "game"].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`nav-button button-hover ${
                currentPage === page
                  ? "nav-button-active"
                  : "nav-button-inactive"
              }`}
            >
              {page === "registration" ? "Teams" : page}
            </button>
          ))}
          <button onClick={resetGame} className="reset-button button-hover">
            🔄 Reset Game
          </button>
        </div>

        {/* Registration Page */}
        {currentPage === "registration" && (
          <div className="section-container">
            <div className="section-card">
              <h2 className="section-header">
                <Users size={32} />
                Team Registration
              </h2>

              <form
                onSubmit={handleRegisterTeam}
                style={{ marginBottom: "30px" }}
              >
                <div className="form-row">
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter team name..."
                    className="form-input"
                  />
                  <button type="submit" className="form-button button-hover">
                    Add Team
                  </button>
                </div>
              </form>

              <div className="team-list">
                {db.teams.map((team, index) => (
                  <div
                    key={team.id}
                    className="team-card"
                    style={{
                      animation: `slideIn 0.5s ease-out ${
                        index * 0.1
                      }s backwards`,
                    }}
                  >
                    <div className="team-info">
                      <Star size={24} color="#FFD700" fill="#FFD700" />
                      <span className="team-name">{team.name}</span>
                    </div>
                    <div className="team-actions">
                      <div className="team-score">Score: {team.score}</div>
                      <button
                        onClick={() => handleDeleteTeam(team)}
                        className="delete-button button-hover"
                        title="Delete team"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
                {db.teams.length === 0 && (
                  <p className="empty-state">
                    No teams registered yet. Add your first team!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Game Page */}
        {currentPage === "game" && (
          <div className="game-container-max-width">
            {/* Teams Leaderboard Section */}
            <div className="leaderboard-container">
              <div className="leaderboard-header">
                <h2 className="leaderboard-title">
                  <Trophy size={32} />
                  Leaderboard
                </h2>
              </div>
              <div className="leaderboard-grid">
                {db.teams.map((team, index) => {
                  const isEditing = editingScore === team.id;
                  
                  // Get winnings for this team
                  const wonItems = db.goodies.filter(
                    g => g.winner && g.winner.teamId === team.id
                  );
                  const leadingItems = db.goodies.filter(g => {
                    if (g.winner) return false;
                    const currentBid = getCurrentBid(g.id);
                    return currentBid && currentBid.teamId === team.id;
                  });
                  
                  return (
                    <div
                      key={team.id}
                      className="scorer-card scorer-card-regular"
                      style={{
                        animation: `fadeIn 0.6s ease-out ${
                          index * 0.1
                        }s backwards`,
                      }}
                      onMouseEnter={() => setHoveredTeam(team.id)}
                      onMouseLeave={() => setHoveredTeam(null)}
                    >
                      <div className="scorer-name">{team.name}</div>
                      
                      {/* Hover Card for Winnings */}
                      {hoveredTeam === team.id && (
                        <div className="team-hover-card">
                          <div className="hover-card-header">
                            <Star size={16} color="#FFD700" fill="#FFD700" />
                            {team.name}'s Items
                          </div>
                          
                          {/* Won Items */}
                          {wonItems.length > 0 ? (
                            <div className="hover-section">
                              <div className="hover-section-title">🏆 Won ({wonItems.length})</div>
                              {wonItems.map(item => (
                                <div key={item.id} className="hover-item won-item">
                                  <span className="hover-item-emoji">{item.image}</span>
                                  <span className="hover-item-name">{item.name}</span>
                                  <span className="hover-item-amount">${item.winner.bidAmount}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="hover-section">
                              <div className="hover-section-title">🏆 Won Items</div>
                              <div className="hover-empty-state">No items won yet</div>
                            </div>
                          )}
                          
                          {/* Leading Items */}
                          {leadingItems.length > 0 ? (
                            <div className="hover-section">
                              <div className="hover-section-title">📈 Leading ({leadingItems.length})</div>
                              {leadingItems.map(item => {
                                const currentBid = getCurrentBid(item.id);
                                return (
                                  <div key={item.id} className="hover-item leading-item">
                                    <span className="hover-item-emoji">{item.revealed ? item.image : '🎁'}</span>
                                    <span className="hover-item-name">
                                      {item.revealed ? item.name : `Item #${item.id}`}
                                    </span>
                                    <span className="hover-item-amount">${currentBid.bidAmount}</span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="hover-section">
                              <div className="hover-section-title">📈 Currently Leading</div>
                              <div className="hover-empty-state">Not leading on any items</div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Editable Score */}
                      <div className="scorer-points-container">
                        {isEditing ? (
                          <div className="score-edit-wrapper">
                            <span className="score-label">Score:</span>
                            <input
                              type="number"
                              value={editScoreValue}
                              onChange={handleScoreChange}
                              onBlur={handleScoreBlur}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleScoreSubmit(team.id);
                                } else if (e.key === 'Escape') {
                                  handleScoreBlur();
                                }
                              }}
                              className="score-edit-input"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div
                            className="scorer-points scorer-points-editable scorer-points-regular"
                            onClick={() => handleScoreClick(team.id, team.score)}
                            title="Click to edit score"
                          >
                            <span className="score-label-static">Score:</span>
                            {team.score}
                            <Edit size={16} className="edit-icon" />
                          </div>
                        )}
                      </div>
                      
                      {/* Score Adjustment Buttons */}
                      <div className="score-adjustment-buttons">
                        <div className="score-btn-column score-btn-positive-col">
                          <button 
                            onClick={() => adjustTeamScore(team.id, 50)} 
                            className="score-adjust-btn score-adjust-positive"
                            title="Add 50 points"
                          >
                            +50
                          </button>
                          <button 
                            onClick={() => adjustTeamScore(team.id, 100)} 
                            className="score-adjust-btn score-adjust-positive"
                            title="Add 100 points"
                          >
                            +100
                          </button>
                          <button 
                            onClick={() => adjustTeamScore(team.id, 200)} 
                            className="score-adjust-btn score-adjust-positive"
                            title="Add 200 points"
                          >
                            +200
                          </button>
                        </div>
                        <div className="score-btn-column score-btn-negative-col">
                          <button 
                            onClick={() => adjustTeamScore(team.id, -50)} 
                            className="score-adjust-btn score-adjust-negative"
                            title="Subtract 50 points"
                          >
                            -50
                          </button>
                          <button 
                            onClick={() => adjustTeamScore(team.id, -100)} 
                            className="score-adjust-btn score-adjust-negative"
                            title="Subtract 100 points"
                          >
                            -100
                          </button>
                          <button 
                            onClick={() => adjustTeamScore(team.id, -200)} 
                            className="score-adjust-btn score-adjust-negative"
                            title="Subtract 200 points"
                          >
                            -200
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


            {/* Mystery Goodies Section */}
            <div className="goodies-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="section-header" style={{ marginBottom: 0 }}>
                  <Gift size={32} />
                  Mystery Goodies
                </h2>
                
                {/* Show All Items button (NEW) */}
                {activeBiddingItem && (
                  <button
                    onClick={() => {
                      setActiveBiddingItem(null);
                      setBidForm({ teamName: "", itemNumber: "", bidAmount: "" });
                    }}
                    className="button-hover"
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontFamily: 'Fredoka',
                      fontSize: '1rem',
                    }}
                  >
                    ← Show All Items
                  </button>
                )}
              </div>
              
              <div className="goodies-grid">
                {db.goodies
                  .filter(goodie => {
                    // If there's active bidding, only show that item (NEW)
                    if (activeBiddingItem) {
                      return goodie.id === activeBiddingItem;
                    }
                    return true; // Show all items when no active bidding
                  })
                  .map((goodie, index) => {
                    const isRevealed = goodie.revealed;
                    const canReveal = db.gameState.currentTurn && !isRevealed;
                    const currentBid = getCurrentBid(goodie.id);
                    const hasWinner = goodie.winner !== null;

                    return (
                      <div
                        key={goodie.id}
                        onClick={(e) => {
                          e.preventDefault();
                          // Only open modal if item is NOT sold
                          if (!hasWinner) {
                            handleCardClick(goodie);
                          }
                        }}
                        className={`goodie-card ${hasWinner ? '' : 'goodie-card-pointer'}`}
                        style={{
                          animation: flippedCards[goodie.id]
                            ? `flipFade 0.6s ease-in-out, fadeIn 0.8s ease-out ${
                                index * 0.05
                              }s backwards`
                            : `fadeIn 0.8s ease-out ${
                                index * 0.05
                              }s backwards`,
                          opacity: !isRevealed && !canReveal ? 0.6 : 1,
                          cursor: hasWinner ? 'default' : 'pointer',
                          filter: canReveal
                            ? "brightness(1.2) drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))"
                            : "none",
                          background: !flippedCards[goodie.id]
                            ? isRevealed
                              ? hasWinner
                                ? "linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)"
                                : "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                              : canReveal
                              ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
                              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        }}
                      >
                        {!flippedCards[goodie.id] ? (
                          // Front of card
                          <>
                            {/* SOLD ITEMS - Simple: Image, Name, Owner, Price */}
                            {hasWinner ? (
                              <>
                                {/* Re-auction counter badge */}
                                {(goodie.reauctionCount || 0) < 3 && (
                                  <div 
                                    className="reauction-counter"
                                    onClick={(e) => handleReauctionClick(e, goodie)}
                                    title="Click to bring back to auction"
                                  >
                                    {3 - (goodie.reauctionCount || 0)}
                                  </div>
                                )}
                                {(goodie.reauctionCount || 0) >= 3 && (
                                  <div className="reauction-locked" title="Max re-auctions reached">
                                    🔒
                                  </div>
                                )}
                                
                                {/* Product Image/Emoji - clickable if productUrl exists */}
                                {goodie.productUrl ? (
                                  <a 
                                    href={goodie.productUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="goodie-product-link"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {goodie.imageUrl ? (
                                      <img 
                                        src={goodie.imageUrl} 
                                        alt={goodie.name}
                                        className="goodie-image-sold"
                                      />
                                    ) : (
                                      <div className="goodie-emoji-sold">{goodie.image}</div>
                                    )}
                                  </a>
                                ) : (
                                  goodie.imageUrl ? (
                                    <img 
                                      src={goodie.imageUrl} 
                                      alt={goodie.name}
                                      className="goodie-image-sold"
                                    />
                                  ) : (
                                    <div className="goodie-emoji-sold">{goodie.image}</div>
                                  )
                                )}
                                
                                <div className="goodie-name-sold">{goodie.name}</div>
                                <div className="goodie-owner-sold">{goodie.winner.teamName}</div>
                                <div className="goodie-price-sold-badge">
                                  ${goodie.winner.bidAmount}
                                </div>
                              </>
                            ) : (
                              // UNSOLD ITEMS - Show mystery card
                              <>
                                {isRevealed && !hasWinner && (
                                  <div className="goodie-badge-revealed">✅</div>
                                )}
                                {canReveal && (
                                  <div className="goodie-badge-can-reveal">👆</div>
                                )}
                                <Gift
                                  size={64}
                                  color="#fff"
                                  style={{ marginBottom: "15px" }}
                                />
                                <div className="goodie-number">#{goodie.id}</div>

                                {/* Show current bid or minimum */}
                                {currentBid ? (
                                  <div className="goodie-status-text">
                                    <div
                                      style={{
                                        fontWeight: "700",
                                        fontSize: "0.95rem",
                                        marginTop: "10px",
                                      }}
                                    >
                                      Current: ${currentBid.bidAmount}
                                    </div>
                                    <div style={{ fontSize: "0.85rem" }}>
                                      by {currentBid.teamName}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="goodie-status-text">
                                    {isRevealed
                                      ? `Min bid: $${goodie.value}`
                                      : canReveal
                                      ? "Click to reveal!"
                                      : `Min bid: $50`}
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          // Back of card - UPDATED
                          <>
                            {/* Product Image/Emoji - clickable if productUrl exists */}
                            {goodie.productUrl ? (
                              <a 
                                href={goodie.productUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="goodie-product-link"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {goodie.imageUrl ? (
                                  <img 
                                    src={goodie.imageUrl} 
                                    alt={goodie.name}
                                    className="goodie-image"
                                  />
                                ) : (
                                  <div className="goodie-emoji">{goodie.image}</div>
                                )}
                              </a>
                            ) : (
                              goodie.imageUrl ? (
                                <img 
                                  src={goodie.imageUrl} 
                                  alt={goodie.name}
                                  className="goodie-image"
                                />
                              ) : (
                                <div className="goodie-emoji">{goodie.image}</div>
                              )
                            )}
                            
                            <div className="goodie-name">{goodie.name}</div>
                            
                            {/* Show re-bid amount if won, otherwise original value */}
                            <div className="goodie-price">
                              {hasWinner 
                                ? `$${goodie.winner.bidAmount * 2} (Re-bid)` 
                                : `$${goodie.value}`
                              }
                            </div>
                            
                            {/* Winner info on back (NEW) */}
                            {hasWinner && (
                              <div style={{ 
                                marginTop: '15px', 
                                padding: '10px', 
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '12px',
                                width: '100%'
                              }}>
                                <div style={{ 
                                  fontSize: '0.9rem', 
                                  fontWeight: '700', 
                                  color: '#fff',
                                  marginBottom: '5px'
                                }}>
                                  🏆 Winner: {goodie.winner.teamName}
                                </div>
                                <div style={{ 
                                  fontSize: '0.85rem', 
                                  color: 'rgba(255,255,255,0.9)'
                                }}>
                                  Won at: ${goodie.winner.bidAmount}
                                </div>
                                <div style={{ 
                                  fontSize: '0.85rem', 
                                  color: 'rgba(255,255,255,0.7)',
                                  marginTop: '5px',
                                  fontStyle: 'italic'
                                }}>
                                  Original value: ${goodie.value}
                                </div>
                              </div>
                            )}
                            
                            {/* View Bids button on back - ALWAYS SHOW if revealed (FIXED) */}
                            {isRevealed && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  loadItemBids(goodie.id);
                                }}
                                className="view-all-bids-button"
                              >
                                <TrendingUp size={16} /> View All Bids
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Bidding History Modal */}
            {selectedItemForBids && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
                onClick={() => setSelectedItemForBids(null)}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    padding: "30px",
                    maxWidth: "600px",
                    width: "90%",
                    maxHeight: "80vh",
                    overflow: "auto",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <h3 style={{ color: "#667eea", margin: 0 }}>
                      Bidding History - Item #
                      {selectedItemForBids}
                    </h3>
                    <button
                      onClick={() => setSelectedItemForBids(null)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                      }}
                    >
                      ✖️
                    </button>
                  </div>

                  {itemBids.length > 0 ? (
                    <>
                      <div style={{ marginBottom: "20px" }}>
                        {itemBids.map((bid, idx) => (
                          <div
                            key={bid.id}
                            style={{
                              padding: "15px",
                              marginBottom: "10px",
                              borderRadius: "12px",
                              background:
                                bid.status === "active"
                                  ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                                  : bid.status === "won"
                                  ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
                                  : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                              color: "#fff",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <div
                                style={{ fontWeight: "700", fontSize: "1.1rem" }}
                              >
                                {bid.teamName}
                              </div>
                              <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                                {new Date(bid.timestamp).toLocaleString()}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div
                                style={{ fontWeight: "700", fontSize: "1.2rem" }}
                              >
                                ${bid.bidAmount}
                              </div>
                              <div style={{ fontSize: "0.85rem" }}>
                                {bid.status === "active" && "🏆 Leading"}
                                {bid.status === "won" && "👑 Winner"}
                                {bid.status === "outbid" && "Outbid"}
                                {bid.status === "lost" && "Lost"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Close Bidding Button */}
                      {itemBids.some((b) => b.status === "active") && (
                        <button
                          onClick={() => closeBidding(selectedItemForBids)}
                          className="button-hover"
                          style={{
                            width: "100%",
                            padding: "15px",
                            background:
                              "linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50px",
                            fontSize: "1.1rem",
                            fontWeight: "700",
                            cursor: "pointer",
                            fontFamily: "Fredoka",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                          }}
                        >
                          <Award size={20} /> Close Bidding & Declare Winner
                        </button>
                      )}
                    </>
                  ) : (
                    <p style={{ textAlign: "center", color: "#999" }}>
                      No bids yet for this item.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Card Zoom Modal (NEW) */}
        {selectedCard && (
          <div className="card-modal-overlay" onClick={closeModal}>
            <div className="card-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={closeModal}>✕</button>
              
              <div className="modal-card-display">
                {/* Product Image/Emoji - clickable if productUrl exists */}
                {selectedCard.productUrl ? (
                  <a 
                    href={selectedCard.productUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="goodie-product-link"
                  >
                    {selectedCard.imageUrl ? (
                      <img 
                        src={selectedCard.imageUrl} 
                        alt={selectedCard.name}
                        className="modal-card-image"
                      />
                    ) : (
                      <div className="modal-card-emoji">{selectedCard.image}</div>
                    )}
                  </a>
                ) : (
                  selectedCard.imageUrl ? (
                    <img 
                      src={selectedCard.imageUrl} 
                      alt={selectedCard.name}
                      className="modal-card-image"
                    />
                  ) : (
                    <div className="modal-card-emoji">{selectedCard.image}</div>
                  )
                )}
                
                <div className="modal-card-name">{selectedCard.name}</div>
                <div className="modal-card-value">Original Value: ${selectedCard.value}</div>
                
                {selectedCard.winner ? (
                  <div className="modal-already-sold">
                    <div className="sold-badge">SOLD</div>
                    <div className="sold-to">
                      Owned by: {db.teams.find(t => t.id === selectedCard.winner.teamId)?.name}
                    </div>
                    <div className="sold-amount">Sold for: ${selectedCard.winner.bidAmount}</div>
                  </div>
                ) : (
                  <div className="modal-bidding-section">
                    <div className="modal-section-title">🔨 Bidding</div>
                    
                    {/* Bid Amount Input */}
                    <div className="modal-amount-input">
                      <label className="modal-label">Current Bid Amount:</label>
                      <div className="amount-input-wrapper">
                        <span className="dollar-sign">$</span>
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          className="modal-bid-input"
                          placeholder="Enter amount"
                          min={selectedCard.value}
                        />
                      </div>
                      <div className="bid-amount-hint">
                        Minimum: ${selectedCard.value}
                      </div>
                    </div>
                    
                    {/* Team Selection */}
                    <div className="modal-team-selection">
                      <label className="modal-label">Select Team:</label>
                      <div className="modal-team-select">
                        {db.teams.map(team => {
                          const canAfford = team.score >= parseInt(bidAmount || 0);
                          const isOriginalOwner = selectedCard.originalOwnerForReauction && 
                                                  team.id === selectedCard.originalOwnerForReauction.teamId;
                          
                          return (
                            <button
                              key={team.id}
                              className={`modal-team-btn ${soldToTeam === team.id ? 'selected' : ''} ${!canAfford ? 'disabled' : ''}`}
                              onClick={() => canAfford && setSoldToTeam(team.id)}
                              disabled={!canAfford}
                              style={{ position: 'relative' }}
                            >
                              <Star size={16} color="#FFD700" fill={soldToTeam === team.id ? "#FFD700" : "none"} />
                              <span className="team-btn-name">{team.name}</span>
                              <span className="team-btn-score">${team.score}</span>
                              {isOriginalOwner && (
                                <span className="owner-tag-modal">Owner</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Sold Button */}
                    <button
                      className="modal-sold-btn"
                      onClick={handleSoldToTeam}
                      disabled={!soldToTeam || !bidAmount || bidAmount < selectedCard.value}
                    >
                      <CheckCircle size={20} />
                      Mark as Sold
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Re-auction Team Selection Prompt (NEW) */}
        {showReauctionPrompt && reauctionItem && (
          <div className="reauction-overlay" onClick={closeReauctionPrompt}>
            <div className="reauction-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={closeReauctionPrompt}>✕</button>
              
              <div className="reauction-header">
                <div className="reauction-emoji">{reauctionItem.image}</div>
                <div className="reauction-title">Bring Back to Auction</div>
                <div className="reauction-item-name">{reauctionItem.name}</div>
              </div>
              
              <div className="reauction-info">
                <div className="reauction-info-row">
                  <span className="reauction-label">Current Owner:</span>
                  <span className="reauction-value">{reauctionItem.winner.teamName}</span>
                </div>
                <div className="reauction-info-row">
                  <span className="reauction-label">Current Price:</span>
                  <span className="reauction-value">${reauctionItem.winner.bidAmount}</span>
                </div>
                <div className="reauction-info-row highlight">
                  <span className="reauction-label">Re-auction Cost:</span>
                  <span className="reauction-value-big">${reauctionItem.winner.bidAmount * 2}</span>
                </div>
                <div className="reauction-info-row">
                  <span className="reauction-label">Remaining Re-auctions:</span>
                  <span className="reauction-value">{3 - (reauctionItem.reauctionCount || 0)}</span>
                </div>
              </div>
              
              <div className="reauction-section-title">Select Requesting Team:</div>
              
              <div className="reauction-team-grid">
                {db.teams.map(team => {
                  const doublePrice = reauctionItem.winner.bidAmount * 2;
                  const canAfford = team.score >= doublePrice;
                  const isOwner = team.id === reauctionItem.winner.teamId;
                  
                  return (
                    <button
                      key={team.id}
                      className={`reauction-team-btn ${!canAfford || isOwner ? 'disabled' : ''}`}
                      onClick={() => canAfford && !isOwner && handleReauctionRequest(team.id)}
                      disabled={!canAfford || isOwner}
                    >
                      <Star size={20} color="#FFD700" fill={canAfford && !isOwner ? "#FFD700" : "none"} />
                      <span className="reauction-team-name">{team.name}</span>
                      <span className="reauction-team-score">${team.score}</span>
                      {isOwner && <span className="owner-tag">Owner</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Celebration Winner Popup (NEW) */}
        {showCelebration && celebrationData && (
          <div className="celebration-overlay">
            <div className="celebration-content">
              {/* Confetti/Celebration Background */}
              <div className="celebration-confetti">
                <div className="confetti"></div>
                <div className="confetti"></div>
                <div className="confetti"></div>
                <div className="confetti"></div>
                <div className="confetti"></div>
                <div className="confetti"></div>
                <div className="confetti"></div>
                <div className="confetti"></div>
                <div className="confetti"></div>
                <div className="confetti"></div>
              </div>
              
              {/* Winner Banner */}
              <div className="celebration-banner">
                <div className="celebration-trophy">🏆</div>
                <div className="celebration-title">SOLD!</div>
                <div className="celebration-trophy">🏆</div>
              </div>
              
              {/* Winner Info */}
              <div className="celebration-winner">
                <div className="celebration-winner-label">Winner:</div>
                <div className="celebration-team-name">{celebrationData.teamName}</div>
              </div>
              
              {/* Item Display */}
              <div className="celebration-item">
                <div className="celebration-item-emoji">{celebrationData.itemEmoji}</div>
                <div className="celebration-item-name">{celebrationData.itemName}</div>
              </div>
              
              {/* Amount */}
              <div className="celebration-amount">
                <div className="celebration-amount-label">Sold For:</div>
                <div className="celebration-amount-value">${celebrationData.amount}</div>
              </div>
              
              {/* Close Button */}
              <button 
                className="celebration-close"
                onClick={() => {
                  setShowCelebration(false);
                  setCelebrationData(null);
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhiteElephantGameComplete;