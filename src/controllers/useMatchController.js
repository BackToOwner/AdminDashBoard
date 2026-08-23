import { useState, useCallback } from 'react';
import { aiMatchPairs } from '../data/mockData';
import { MatchModel } from '../models/MatchModel';

export function useMatchController() {
  const [matchPairs, setMatchPairs] = useState(() => 
    aiMatchPairs.map(data => new MatchModel(data))
  );
  const [activeVerificationPair, setActiveVerificationPair] = useState(null);

  /**
   * Approve match pair and resolve
   */
  const approveMatch = useCallback((matchId) => {
    const targetMatch = matchPairs.find(p => p.id === matchId);
    if (!targetMatch) return null;

    setMatchPairs(prev => prev.filter(p => p.id !== matchId));
    return targetMatch;
  }, [matchPairs]);

  return {
    matchPairs,
    activeVerificationPair,
    setActiveVerificationPair,
    approveMatch
  };
}
