import { useState, useCallback, useEffect } from 'react';
import { matchesApi } from '../api';
import { formatDate } from '../utils/format';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&auto=format&fit=crop&q=80';

/**
 * The match views (MatchEngineView, MatchSuggestions, VerifyMatchModal) were
 * built against a flat mock shape: lostItem/foundItem carry a single string
 * reporter/finder name, one image, and a date string - rather than the full
 * report objects the API returns. Adapt at the boundary so those view
 * components don't need to change.
 */
function toFlatItem(report, role) {
  if (!report) return {};
  return {
    id: report.id,
    title: report.title,
    category: report.category,
    date: formatDate(report.createdAt),
    location: report.location,
    reward: report.reward,
    image: report.images?.[0] || FALLBACK_IMAGE,
    ...(role === 'lost'
      ? { reporter: report.reporter?.name || 'Unknown Reporter' }
      : { finder: report.finder?.name || 'Unknown Finder' }),
  };
}

function mapApiMatch(apiMatch) {
  return {
    id: apiMatch.id,
    lostItem: toFlatItem(apiMatch.lostItem, 'lost'),
    foundItem: toFlatItem(apiMatch.foundItem, 'found'),
    matchScore: apiMatch.matchScore,
    confidenceLabel: apiMatch.confidenceLabel,
    matchFactors: Array.isArray(apiMatch.matchFactors) ? apiMatch.matchFactors : [],
    status: apiMatch.status,
  };
}

export function useMatchController() {
  const [matchPairs, setMatchPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVerificationPair, setActiveVerificationPair] = useState(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await matchesApi.list('pending_admin_approval');
      setMatchPairs(data.map(mapApiMatch));
    } catch (err) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  /**
   * Approve match pair and resolve. Returns the (flat-shaped) match that was
   * approved so the caller can sync the two linked reports' status locally.
   */
  const approveMatch = useCallback(async (matchId) => {
    const targetMatch = matchPairs.find(p => p.id === matchId);
    if (!targetMatch) return null;

    await matchesApi.approve(matchId);
    setMatchPairs(prev => prev.filter(p => p.id !== matchId));
    return targetMatch;
  }, [matchPairs]);

  return {
    matchPairs,
    loading,
    error,
    activeVerificationPair,
    setActiveVerificationPair,
    approveMatch,
    refetchMatches: fetchMatches,
  };
}
