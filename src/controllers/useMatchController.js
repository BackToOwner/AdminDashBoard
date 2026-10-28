import {
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';

import { MatchModel } from '../models/MatchModel';

const AI_API_URL = 'http://localhost:8000';

export function useMatchController(lostItems = []) {
  const [matchPairs, setMatchPairs] = useState([]);

  const [
    activeVerificationPair,
    setActiveVerificationPair
  ] = useState(null);

  const [isScanning, setIsScanning] = useState(false);

  const [error, setError] = useState(null);

  /*
   * ============================================================
   * REMEMBER WHICH PENDING ITEMS WERE SCANNED
   * ============================================================
   */

  const lastScannedItemsKey = useRef('');

  /*
   * ============================================================
   * PENDING LOST ITEMS
   * ============================================================
   *
   * Only lost items that have NOT been verified as matched
   * are eligible for AI matching.
   */

  const pendingLostItems = lostItems.filter(
    (item) =>
      !['matched', 'returned', 'closed'].includes(
        String(item.status || '').toLowerCase()
      )
  );

  /*
   * ============================================================
   * CONVERT SUPABASE IMAGE URL → FILE
   * ============================================================
   */

  const imageUrlToFile = async (
    imageUrl,
    fileName = 'lost-item.jpg'
  ) => {
    if (!imageUrl) {
      throw new Error('Image URL is empty.');
    }

    console.log('Downloading image:', imageUrl);

    let response;

    try {
      response = await fetch(imageUrl);
    } catch (err) {
      throw new Error(
        'Could not download the Supabase image. Check the image URL and Supabase Storage access.'
      );
    }

    if (!response.ok) {
      throw new Error(
        `Unable to download image (${response.status})`
      );
    }

    const blob = await response.blob();

    if (!blob.size) {
      throw new Error(
        'Downloaded image is empty.'
      );
    }

    return new File(
      [blob],
      fileName,
      {
        type: blob.type || 'image/jpeg'
      }
    );
  };

  /*
   * ============================================================
   * GET CAMPUS + AREA
   * ============================================================
   */

  const getLocationParts = (lostItem) => {
    if (
      lostItem.campus ||
      lostItem.area
    ) {
      return {
        campus: lostItem.campus || '',
        area: lostItem.area || ''
      };
    }

    const location =
      lostItem.location || '';

    if (
      typeof location === 'string'
    ) {
      const parts = location
        .split('·')
        .map((part) => part.trim())
        .filter(Boolean);

      return {
        campus: parts[0] || '',
        area:
          parts
            .slice(1)
            .join(' · ') || ''
      };
    }

    return {
      campus: '',
      area: ''
    };
  };

  /*
   * ============================================================
   * SEND ONE LOST ITEM TO SIGLIP AI
   * ============================================================
   */

  const scanItem = async (lostItem) => {
    /*
     * Safety check.
     *
     * Already verified items must NEVER be sent
     * to the AI service.
     */

    if (
      ['matched', 'returned', 'closed'].includes(
        String(lostItem.status || '').toLowerCase()
      )
    ) {
      console.log(
        'Skipping already verified/matched item:',
        lostItem.title
      );

      return {
        success: true,
        matches: []
      };
    }

    console.log(
      '===================================='
    );

    console.log(
      'AI MATCHING ITEM'
    );

    console.log(
      'ID:',
      lostItem.id
    );

    console.log(
      'Title:',
      lostItem.title
    );

    console.log(
      'Status:',
      lostItem.status
    );

    console.log(
      'Images:',
      lostItem.images
    );

    console.log(
      'Location:',
      lostItem.location
    );

    console.log(
      'Category:',
      lostItem.category
    );

    /*
     * Lost item must have an image.
     */

    if (
      !lostItem.images ||
      !Array.isArray(lostItem.images) ||
      lostItem.images.length === 0
    ) {
      throw new Error(
        `No image available for "${lostItem.title}"`
      );
    }

    const imageUrl =
      lostItem.images[0];

    const imageFile =
      await imageUrlToFile(
        imageUrl,
        `${lostItem.id}.jpg`
      );

    /*
     * Get campus and area.
     */

    const {
      campus,
      area
    } = getLocationParts(lostItem);

    /*
     * Create multipart form.
     */

    const formData =
      new FormData();

    formData.append(
      'image',
      imageFile
    );

    formData.append(
      'title',
      lostItem.title || ''
    );

    formData.append(
      'campus',
      campus
    );

    formData.append(
      'area',
      area
    );

    /*
     * Support both possible field names:
     *
     * description
     * details
     */

    formData.append(
      'details',
      lostItem.description ||
      lostItem.details ||
      ''
    );

    formData.append(
      'category',
      lostItem.category ||
      'other'
    );

    console.log(
      'Sending lost item to SigLIP AI...'
    );

    console.log(
      'AI endpoint:',
      `${AI_API_URL}/match`
    );

    console.log(
      'Campus:',
      campus
    );

    console.log(
      'Area:',
      area
    );

    console.log(
      'Category:',
      lostItem.category
    );

    let response;

    try {
      response = await fetch(
        `${AI_API_URL}/match`,
        {
          method: 'POST',
          body: formData
        }
      );
    } catch (err) {
      console.error(
        'AI connection error:',
        err
      );

      throw new Error(
        `Cannot connect to AI service at ${AI_API_URL}. Make sure the FastAPI SigLIP service is running on port 8000.`
      );
    }

    /*
     * Parse JSON response.
     */

    let result;

    try {
      result = await response.json();
    } catch (err) {
      throw new Error(
        `AI service returned an invalid response (${response.status}).`
      );
    }

    /*
     * IMPORTANT DEBUG OUTPUT
     */

    console.log(
      '===================================='
    );

    console.log(
      'AI RESPONSE FOR:',
      lostItem.title
    );

    console.log(
      'AI RESPONSE:',
      result
    );

    console.log(
      'AI RESPONSE STATUS:',
      response.status
    );

    console.log(
      'AI MATCHES:',
      result?.matches
    );

    console.log(
      '===================================='
    );

    /*
     * HTTP error.
     */

    if (!response.ok) {
      throw new Error(
        result?.detail ||
        result?.message ||
        `AI matching failed (${response.status})`
      );
    }

    /*
     * Application-level error.
     */

    if (!result?.success) {
      throw new Error(
        result?.detail ||
        result?.message ||
        'AI matching returned an unsuccessful result.'
      );
    }

    /*
     * Always return a predictable structure.
     */

    return {
      ...result,
      matches: Array.isArray(
        result.matches
      )
        ? result.matches
        : []
    };
  };

  /*
   * ============================================================
   * CONVERT AI RESULT → MatchModel
   * ============================================================
   */

  const createMatchModel = (
    lostItem,
    aiMatch
  ) => {
    /*
     * AI returns match_percentage.
     *
     * Example:
     *
     * 90
     *
     * If unavailable, calculate from match_score.
     *
     * IMPORTANT:
     * Do not use || here because 0 is a valid number.
     */

    let score;

    if (
      aiMatch.match_percentage !==
      undefined &&
      aiMatch.match_percentage !==
      null
    ) {
      score = Number(
        aiMatch.match_percentage
      );
    } else {
      score =
        Number(
          aiMatch.match_score ??
          0
        ) * 100;
    }

    /*
     * Protect against invalid scores.
     */

    if (
      !Number.isFinite(score)
    ) {
      score = 0;
    }

    /*
     * Keep score within 0–100.
     */

    score = Math.max(
      0,
      Math.min(100, score)
    );

    /*
     * AI matching factors.
     */

    const factors = [
      {
        name: 'Image Similarity',

        detail:
          `${(
            Number(
              aiMatch.image_score ??
              0
            ) * 100
          ).toFixed(2)}% visual similarity`
      },

      {
        name: 'Text Similarity',

        detail:
          `${(
            Number(
              aiMatch.text_score ??
              0
            ) * 100
          ).toFixed(2)}% title similarity`
      },

      {
        name: 'Location Similarity',

        detail:
          `${(
            Number(
              aiMatch.location_score ??
              0
            ) * 100
          ).toFixed(2)}% location similarity`
      },

      {
        name: 'Category Similarity',

        detail:
          `${(
            Number(
              aiMatch.category_score ??
              0
            ) * 100
          ).toFixed(2)}% category similarity`
      }
    ];

    /*
     * Convert the AI result into the existing
     * MatchModel structure.
     */

    return new MatchModel({
      id:
        `MATCH-${lostItem.id}-${aiMatch.id}`,

      lostItem: {
        id:
          lostItem.id,

        title:
          lostItem.title,

        image:
          lostItem.images?.[0] ||
          lostItem.image ||
          '',

        location:
          lostItem.location ||
          'Unknown Location',

        reporter:
          lostItem.reporter?.name ||
          'Unknown',

        reward:
          lostItem.reward ??
          null,

        status:
          lostItem.status
      },

      foundItem: {
        // Only use the canonical reports UUID for admin verification.
        id:
          aiMatch.report_id,

        // Preserve the AI table ID separately.
        aiItemId:
          aiMatch.id,

        reportId:
          aiMatch.report_id || null,

        title:
          aiMatch.title ||
          'Found Item',

        image:
          aiMatch.image ||
          aiMatch.image_url ||
          '',

        location:
          formatLocation(
            aiMatch.location
          ),

        finder:
          aiMatch.finder ||
          'Found Item',

        date:
          aiMatch.created_at
            ? new Date(
                aiMatch.created_at
              ).toLocaleDateString()
            : new Date()
                .toLocaleDateString()
      },

      matchScore:
        score,

      confidenceLabel:
        MatchModel.getConfidenceLabel(
          score
        ),

      matchFactors:
        factors,

      status:
        'pending_admin_approval',

      createdAt:
        new Date().toISOString()
    });
  };

  /*
   * ============================================================
   * RUN AI MATCHING
   * ============================================================
   */

  const runAutoMatch =
    useCallback(
      async () => {
        console.log(
          '===================================='
        );

        console.log(
          'STARTING AUTOMATIC AI MATCHING'
        );

        /*
         * Recalculate the list every time.
         *
         * Already verified items are excluded.
         */

        const itemsToScan =
          lostItems.filter(
            (item) =>
              !['matched', 'returned', 'closed'].includes(
                String(item.status || '').toLowerCase()
              )
          );

        console.log(
          'ALL LOST ITEMS:',
          lostItems
        );

        console.log(
          'ITEMS ELIGIBLE FOR AI:',
          itemsToScan
        );

        console.log(
          'VERIFIED ITEMS EXCLUDED FROM AI:',
          lostItems.filter(
            (item) =>
              item.status ===
              'matched'
          )
        );

        /*
         * No pending items.
         */

        if (
          itemsToScan.length === 0
        ) {
          setMatchPairs([]);

          setError(
            'No pending lost items available for matching.'
          );

          return;
        }

        setIsScanning(true);

        setError(null);

        /*
         * Clear previous results before scanning.
         */

        setMatchPairs([]);

        const allMatches = [];

        const errors = [];

        /*
         * Track lost items that already received
         * a match.
         *
         * This prevents duplicate pairs for the
         * same lost item.
         */

        const matchedLostItemIds =
          new Set();

        try {
          /*
           * Process lost items one by one.
           */

          for (
            const lostItem of
            itemsToScan
          ) {
            try {
              /*
               * Final safety check.
               */

              if (
                ['matched', 'returned', 'closed'].includes(
                  String(lostItem.status || '').toLowerCase()
                )
              ) {
                console.log(
                  'Skipping matched item:',
                  lostItem.title
                );

                continue;
              }

              /*
               * Send item to FastAPI.
               */

              const result =
                await scanItem(
                  lostItem
                );

              /*
               * Make sure matches is always an array.
               */

              const matches =
                Array.isArray(
                  result?.matches
                )
                  ? result.matches
                  : [];

              console.log(
                `Matches returned for "${lostItem.title}":`,
                matches
              );

              /*
               * If AI found matches,
               * convert them to MatchModels.
               */

              if (
                matches.length > 0
              ) {
                matchedLostItemIds.add(
                  lostItem.id
                );

                matches.forEach(
                  (aiMatch) => {
                    /*
                     * Ignore malformed AI results.
                     */

                    if (
                      !aiMatch ||
                      !aiMatch.id ||
                      !aiMatch.report_id
                    ) {
                      console.warn(
                        'Ignoring malformed AI match:',
                        aiMatch
                      );

                      return;
                    }

                    allMatches.push(
                      createMatchModel(
                        lostItem,
                        aiMatch
                      )
                    );
                  }
                );
              } else {
                console.log(
                  `No matches returned for "${lostItem.title}".`
                );
              }

            } catch (
              itemError
            ) {
              console.error(
                `Failed to match "${lostItem.title}":`,
                itemError
              );

              errors.push(
                `${lostItem.title}: ${itemError.message}`
              );
            }
          }

          /*
           * Sort strongest matches first.
           */

          allMatches.sort(
            (a, b) =>
              b.matchScore -
              a.matchScore
          );

          console.log(
            '===================================='
          );

          console.log(
            'FINAL AI MATCH RESULTS:'
          );

          console.log(
            allMatches
          );

          console.log(
            'Total matches:',
            allMatches.length
          );

          console.log(
            'Lost items with matches:',
            [
              ...matchedLostItemIds
            ]
          );

          /*
           * Update UI.
           */

          setMatchPairs(
            allMatches
          );

          /*
           * Error handling.
           */

          if (
            allMatches.length === 0 &&
            errors.length > 0
          ) {
            setError(
              `AI matching failed:\n${errors.join('\n')}`
            );

          } else if (
            allMatches.length === 0
          ) {
            setError(
              'The AI service ran successfully, but returned no matching found items.'
            );

          } else if (
            errors.length > 0
          ) {
            setError(
              `${allMatches.length} matches found, but some lost items could not be processed.`
            );
          } else {
            /*
             * Successful matching.
             *
             * Remove any old error.
             */

            setError(null);
          }

        } catch (err) {
          console.error(
            'Auto-match failed:',
            err
          );

          setError(
            err.message ||
            'Failed to run AI matching.'
          );

          setMatchPairs([]);

        } finally {
          setIsScanning(false);

          console.log(
            'AI SCANNING FINISHED'
          );

          console.log(
            '===================================='
          );
        }
      },
      [lostItems]
    );

  /*
   * ============================================================
   * AUTOMATIC MATCHING
   * ============================================================
   *
   * Automatically scan when the set of pending lost items
   * changes.
   *
   * Example:
   *
   * Laptop = matched
   * ↓
   * removed from pending list
   *
   * Blue Backpack = active/open
   * ↓
   * remains eligible
   */

  useEffect(() => {
    const itemsToScan =
      lostItems.filter(
        (item) =>
          !['matched', 'returned', 'closed'].includes(
            String(item.status || '').toLowerCase()
          )
      );

    /*
     * No pending items.
     */

    if (
      itemsToScan.length === 0
    ) {
      setMatchPairs([]);

      /*
       * Reset this so that if a new pending item
       * appears later, it can be scanned.
       */

      lastScannedItemsKey.current =
        '';

      return;
    }

    /*
     * Create stable key from pending item IDs.
     */

    const itemsKey =
      itemsToScan
        .map(
          (item) =>
            item.id
        )
        .sort()
        .join(',');

    /*
     * Do not automatically scan the exact same
     * pending list repeatedly.
     */

    if (
      itemsKey ===
      lastScannedItemsKey.current
    ) {
      return;
    }

    lastScannedItemsKey.current =
      itemsKey;

    console.log(
      'Pending lost items changed.'
    );

    console.log(
      'Starting automatic AI matching...'
    );

    runAutoMatch();

  }, [
    lostItems,
    runAutoMatch
  ]);

  /*
   * ============================================================
   * APPROVE / VERIFY MATCH
   * ============================================================
   *
   * IMPORTANT:
   *
   * This function only selects the match for verification.
   *
   * App.jsx is responsible for updating Supabase.
   */

  const approveMatch =
    useCallback(
      (matchId) => {
        const targetMatch =
          matchPairs.find(
            (pair) =>
              pair.id ===
              matchId
          );

        if (
          !targetMatch
        ) {
          console.error(
            'Match not found:',
            matchId
          );

          return null;
        }

        console.log(
          'Preparing match for verification:',
          targetMatch
        );

        setActiveVerificationPair(
          targetMatch
        );

        return targetMatch;
      },
      [matchPairs]
    );

  /*
   * ============================================================
   * REMOVE VERIFIED MATCH
   * ============================================================
   *
   * App.jsx should call this AFTER the Supabase update
   * succeeds.
   *
   * This removes the verified pair from the AI Smart Match UI.
   */

  const removeMatch =
    useCallback(
      (matchId) => {
        console.log(
          'Removing verified match from AI Smart Match:',
          matchId
        );

        setMatchPairs(
          (prev) =>
            prev.filter(
              (pair) =>
                pair.id !==
                matchId
            )
        );

        setActiveVerificationPair(
          null
        );
      },
      []
    );

  /*
   * ============================================================
   * RETURN CONTROLLER
   * ============================================================
   */

  return {
    matchPairs,

    activeVerificationPair,

    setActiveVerificationPair,

    approveMatch,

    removeMatch,

    runAutoMatch,

    isScanning,

    error,

    pendingLostItems
  };
}

/*
 * ============================================================
 * FORMAT LOCATION
 * ============================================================
 */

function formatLocation(location) {
  if (!location) {
    return 'Unknown Location';
  }

  if (
    typeof location === 'string'
  ) {
    return location;
  }

  const parts = [
    location.campus,
    location.area
  ].filter(Boolean);

  return parts.length
    ? parts.join(' · ')
    : 'Unknown Location';
}

