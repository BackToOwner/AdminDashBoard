import React, { useState } from 'react';

import {
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  RefreshCw,
  Sliders,
  SearchX
} from 'lucide-react';

export default function MatchEngineView({
  matchPairs = [],
  lostItems = [],
  savedMatches = [],
  savedMatchesLoading = false,
  savedMatchesError = '',
  onRefreshSavedMatches,
  onVerifyMatch,
  onRunAutoMatch,
  isScanning,
  error
}) {
  const [minConfidence, setMinConfidence] =
    useState(80);

  /*
   * ==========================================================
   * FILTER AI MATCHES
   * ==========================================================
   */

  const filteredPairs = matchPairs.filter(
    (pair) =>
      Number(pair.matchScore || 0) >=
      minConfidence
  );

  /*
   * ==========================================================
   * HELPER: NORMALIZE IDS
   * ==========================================================
   *
   * Different parts of the application may call the same
   * database ID by different property names.
   *
   * We check all reasonable possibilities.
   */

  const normalizeId = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return '';
    }

    return String(value).trim();
  };

  /*
   * ==========================================================
   * GET LOST ITEM IDENTIFIER FROM MATCH
   * ==========================================================
   */

  const getLostItemIdFromPair = (pair) => {
    const possibleIds = [
      pair?.lostItem?.id,
      pair?.lostItem?.reportId,
      pair?.lostItemId,
      pair?.lostId,
      pair?.reportId,
      pair?.lostReportId
    ];

    for (const value of possibleIds) {
      const normalized = normalizeId(value);

      if (normalized) {
        return normalized;
      }
    }

    return '';
  };

  /*
   * ==========================================================
   * GET LOST ITEM TITLE FROM MATCH
   * ==========================================================
   *
   * Title is used only as a fallback when an ID is not
   * available in the MatchModel.
   */

  const getLostItemTitleFromPair = (pair) => {
    return String(
      pair?.lostItem?.title ||
      pair?.lostTitle ||
      ''
    )
      .trim()
      .toLowerCase();
  };

  /*
   * ==========================================================
   * BUILD MATCHED LOST ITEM SET
   * ==========================================================
   */

  const matchedLostItemIds = new Set();
  const matchedLostItemTitles = new Set();

  matchPairs.forEach((pair) => {
    const lostItemId =
      getLostItemIdFromPair(pair);

    const lostItemTitle =
      getLostItemTitleFromPair(pair);

    if (lostItemId) {
      matchedLostItemIds.add(
        lostItemId
      );
    }

    if (lostItemTitle) {
      matchedLostItemTitles.add(
        lostItemTitle
      );
    }
  });

  /*
   * ==========================================================
   * FIND LOST ITEMS WITHOUT A MATCH
   * ==========================================================
   *
   * IMPORTANT:
   *
   * We check the actual lost item's ID against every possible
   * ID stored inside the MatchModel.
   *
   * If the ID is unavailable, we fall back to the title.
   */

  const unmatchedLostItems =
    lostItems.filter((item) => {
      /*
       * Already reconciled in Supabase.
       */
      if (
        ['matched', 'returned', 'closed'].includes(
          String(item.status || '').toLowerCase()
        )
      ) {
        return false;
      }

      const itemId =
        normalizeId(item.id);

      const itemReportId =
        normalizeId(item.reportId);

      const itemTitle =
        String(item.title || '')
          .trim()
          .toLowerCase();

      /*
       * Check ID.
       */
      if (
        itemId &&
        matchedLostItemIds.has(itemId)
      ) {
        return false;
      }

      /*
       * Check reportId.
       */
      if (
        itemReportId &&
        matchedLostItemIds.has(
          itemReportId
        )
      ) {
        return false;
      }

      /*
       * Fallback: title.
       */
      if (
        itemTitle &&
        matchedLostItemTitles.has(
          itemTitle
        )
      ) {
        return false;
      }

      return true;
    });

  /*
   * ==========================================================
   * DEBUG INFORMATION
   * ==========================================================
   *
   * These logs will help us verify exactly what React sees.
   */

  console.log(
    'MATCH ENGINE - lostItems:',
    lostItems
  );

  console.log(
    'MATCH ENGINE - matchPairs:',
    matchPairs
  );

  console.log(
    'MATCH ENGINE - matchedLostItemIds:',
    [...matchedLostItemIds]
  );

  console.log(
    'MATCH ENGINE - matchedLostItemTitles:',
    [...matchedLostItemTitles]
  );

  console.log(
    'MATCH ENGINE - unmatchedLostItems:',
    unmatchedLostItems
  );

  return (
    <div className="animate-fade-in">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#0F172A'
              }}
            >
              AI Smart Match Engine
            </h1>

            <span
              style={{
                background:
                  'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
                color: '#FFFFFF',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 800
              }}
            >
              SigLIP Multimodal AI
            </span>
          </div>

          <p
            style={{
              fontSize: '13px',
              color: '#64748B',
              marginTop: '3px'
            }}
          >
            Multimodal item matching using image, text,
            location, and category similarity
          </p>
        </div>

        {/* REAL AI SCANNER */}

        <button
          className="btn-primary"
          onClick={onRunAutoMatch}
          disabled={isScanning}
          style={{
            gap: '8px'
          }}
        >
          <RefreshCw
            size={16}
            className={
              isScanning
                ? 'animate-spin'
                : ''
            }
          />

          <span>
            {isScanning
              ? 'Scanning Active Database...'
              : 'Run Auto-Match Scanner'}
          </span>
        </button>
      </div>

      {/* ======================================================
          AI ERROR
          ====================================================== */}

      {error && (
        <div
          style={{
            background: '#FEF2F2',
            border:
              '1px solid #FECACA',
            color: '#991B1B',
            padding:
              '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: 600,
            whiteSpace:
              'pre-line'
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* ======================================================
          CONTROL BANNER
          ====================================================== */}

      <div
        className="bto-card"
        style={{
          padding: '18px 24px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Sliders
              size={18}
              color="#0077EE"
            />

            <span
              style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#0F172A'
              }}
            >
              Minimum Match Confidence Threshold:
            </span>

            <span
              style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#6366F1',
                background: '#EEF2FF',
                padding: '2px 8px',
                borderRadius: '8px'
              }}
            >
              {minConfidence}%
            </span>
          </div>

          <input
            type="range"
            min="60"
            max="98"
            value={minConfidence}
            onChange={(e) =>
              setMinConfidence(
                parseInt(
                  e.target.value,
                  10
                )
              )
            }
            style={{
              width: '220px',
              accentColor:
                '#6366F1'
            }}
          />
        </div>
      </div>

      {/* ======================================================
          AI MATCH CARDS
          ====================================================== */}

      {filteredPairs.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {filteredPairs.map(
            (pair) => (
              <div
                key={pair.id}
                className="bto-card"
                style={{
                  padding: '24px',
                  borderLeft:
                    '4px solid #6366F1'
                }}
              >

                {/* MATCH HEADER */}

                <div
                  style={{
                    display: 'flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'space-between',
                    marginBottom:
                      '16px'
                  }}
                >
                  <div
                    style={{
                      display:
                        'flex',
                      alignItems:
                        'center',
                      gap: '10px'
                    }}
                  >
                    <span
                      className="match-score-badge"
                      style={{
                        fontSize:
                          '13px',
                        padding:
                          '5px 14px'
                      }}
                    >
                      <Sparkles
                        size={14}
                      />

                      {pair.matchScore}%
                      {' '}
                      Match Score
                    </span>

                    <span
                      style={{
                        fontSize:
                          '13px',
                        fontWeight: 700,
                        color:
                          '#059669'
                      }}
                    >
                      ●{' '}
                      {
                        pair.confidenceLabel
                      }
                    </span>

                    <span
                      style={{
                        fontSize:
                          '12px',
                        color:
                          '#94A3B8'
                      }}
                    >
                      Pair ID:{' '}
                      {pair.id}
                    </span>
                  </div>

                  <button
                    className="btn-primary"
                    onClick={() =>
                      onVerifyMatch(
                        pair
                      )
                    }
                    style={{
                      padding:
                        '8px 20px',
                      fontSize:
                        '13px'
                    }}
                  >
                    <ShieldCheck
                      size={16}
                    />

                    <span>
                      Verify & Reconcile Case
                    </span>
                  </button>
                </div>

                {/* SIDE-BY-SIDE COMPARISON */}

                <div
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      '1.2fr auto 1.2fr',
                    gap: '20px',
                    alignItems:
                      'center',
                    marginBottom:
                      '20px'
                  }}
                >

                  {/* LOST ITEM */}

                  <div
                    style={{
                      background:
                        '#FFF5F5',
                      border:
                        '1px solid #FECACA',
                      borderRadius:
                        '16px',
                      padding:
                        '18px',
                      display:
                        'flex',
                      gap: '14px'
                    }}
                  >
                    <img
                      src={
                        pair.lostItem
                          ?.image
                      }
                      alt={
                        pair.lostItem
                          ?.title ||
                        'Lost item'
                      }
                      style={{
                        width:
                          '80px',
                        height:
                          '80px',
                        borderRadius:
                          '12px',
                        objectFit:
                          'cover'
                      }}
                    />

                    <div>
                      <span
                        className="badge-lost"
                        style={{
                          marginBottom:
                            '6px'
                        }}
                      >
                        LOST CLAIM
                      </span>

                      <div
                        style={{
                          fontWeight:
                            800,
                          fontSize:
                            '16px',
                          color:
                            '#991B1B'
                        }}
                      >
                        {
                          pair.lostItem
                            ?.title
                        }
                      </div>

                      <div
                        style={{
                          fontSize:
                            '12px',
                            color:
                              '#4B5563',
                          marginTop:
                            '2px'
                        }}
                      >
                        📍{' '}
                        {
                          pair.lostItem
                            ?.location
                        }
                      </div>

                      <div
                        style={{
                          fontSize:
                            '12px',
                          color:
                            '#1F2937',
                          marginTop:
                            '4px'
                        }}
                      >
                        <strong>
                          Owner:
                        </strong>{' '}
                        {
                          pair.lostItem
                            ?.reporter ||
                          'Unknown'
                        }
                      </div>

                      {pair.lostItem
                        ?.reward && (
                        <div
                          style={{
                            fontSize:
                              '12px',
                            color:
                              '#D97706',
                            fontWeight:
                              700,
                            marginTop:
                              '2px'
                          }}
                        >
                          🏆 $
                          {
                            pair
                              .lostItem
                              .reward
                          }{' '}
                          Reward
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CONNECTING ICON */}

                  <div
                    style={{
                      width:
                        '42px',
                      height:
                        '42px',
                      borderRadius:
                        '50%',
                      background:
                        '#EEF2FF',
                      display:
                        'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      color:
                        '#6366F1'
                    }}
                  >
                    <ArrowRight
                      size={20}
                    />
                  </div>

                  {/* FOUND ITEM */}

                  <div
                    style={{
                      background:
                        '#ECFDF5',
                      border:
                        '1px solid #A7F3D0',
                      borderRadius:
                        '16px',
                      padding:
                        '18px',
                      display:
                        'flex',
                      gap: '14px'
                    }}
                  >
                    <img
                      src={
                        pair.foundItem
                          ?.image
                      }
                      alt={
                        pair.foundItem
                          ?.title ||
                        'Found item'
                      }
                      style={{
                        width:
                          '80px',
                        height:
                          '80px',
                        borderRadius:
                          '12px',
                        objectFit:
                          'cover'
                      }}
                    />

                    <div>
                      <span
                        className="badge-found"
                        style={{
                          marginBottom:
                            '6px'
                        }}
                      >
                        FOUND ITEM
                      </span>

                      <div
                        style={{
                          fontWeight:
                            800,
                          fontSize:
                            '16px',
                          color:
                            '#065F46'
                        }}
                      >
                        {
                          pair.foundItem
                            ?.title
                        }
                      </div>

                      <div
                        style={{
                          fontSize:
                            '12px',
                          color:
                            '#4B5563',
                          marginTop:
                            '2px'
                        }}
                      >
                        📍{' '}
                        {
                          pair.foundItem
                            ?.location
                        }
                      </div>

                      <div
                        style={{
                          fontSize:
                            '12px',
                          color:
                            '#1F2937',
                          marginTop:
                            '4px'
                        }}
                      >
                        <strong>
                          Finder:
                        </strong>{' '}
                        {
                          pair.foundItem
                            ?.finder ||
                          'Unknown'
                        }
                      </div>

                      <div
                        style={{
                          fontSize:
                            '12px',
                          color:
                            '#047857',
                          fontWeight:
                            600,
                          marginTop:
                            '2px'
                        }}
                      >
                        Date:{' '}
                        {
                          pair.foundItem
                            ?.date ||
                          'Unknown'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* MATCH EVIDENCE */}

                <div
                  style={{
                    background:
                      '#F8FAFC',
                    borderRadius:
                      '12px',
                    padding:
                      '14px 18px'
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        '12px',
                      fontWeight:
                        700,
                      color:
                        '#475569',
                      textTransform:
                        'uppercase',
                      marginBottom:
                        '10px'
                    }}
                  >
                    AI Correlation Factors & Visual Verification:
                  </div>

                  <div
                    style={{
                      display:
                        'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(240px, 1fr))',
                      gap:
                        '12px'
                    }}
                  >
                    {(pair.matchFactors || [])
                      .map(
                        (
                          factor,
                          idx
                        ) => (
                          <div
                            key={
                              idx
                            }
                            style={{
                              background:
                                '#FFFFFF',
                              padding:
                                '10px 12px',
                              borderRadius:
                                '8px',
                              border:
                                '1px solid #E2E8F0'
                            }}
                          >
                            <div
                              style={{
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                gap:
                                  '6px',
                                fontSize:
                                  '12px',
                                fontWeight:
                                  700,
                                color:
                                  '#0F172A'
                              }}
                            >
                              <Check
                                size={
                                  14
                                }
                                color={
                                  '#10B981'
                                }
                              />

                              <span>
                                {
                                  factor.name
                                }
                              </span>
                            </div>

                            <div
                              style={{
                                fontSize:
                                  '11.5px',
                                color:
                                  '#64748B',
                                marginTop:
                                  '3px'
                              }}
                            >
                              {
                                factor.detail
                              }
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ======================================================
          LOST ITEMS WITH NO AI MATCH
          ====================================================== */}

      {!isScanning &&
        unmatchedLostItems.length >
          0 && (
          <div
            style={{
              marginTop:
                filteredPairs.length
                  ? '24px'
                  : '0'
            }}
          >
            <div
              style={{
                display:
                  'flex',
                alignItems:
                  'center',
                gap: '8px',
                marginBottom:
                  '12px'
              }}
            >
              <SearchX
                size={18}
                color="#64748B"
              />

              <h3
                style={{
                  fontSize:
                    '15px',
                  fontWeight:
                    800,
                  color:
                    '#334155',
                  margin: 0
                }}
              >
                Lost Items Without a Current Match
              </h3>
            </div>

            <div
              style={{
                display:
                  'flex',
                flexDirection:
                  'column',
                gap: '12px'
              }}
            >
              {unmatchedLostItems.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    className="bto-card"
                    style={{
                      padding:
                        '18px 20px',
                      borderLeft:
                        '4px solid #94A3B8',
                      display:
                        'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'space-between',
                      gap:
                        '16px'
                    }}
                  >
                    <div
                      style={{
                        display:
                          'flex',
                        alignItems:
                          'center',
                        gap:
                          '14px'
                      }}
                    >
                      {item
                        .images?.[0] ? (
                        <img
                          src={
                            item
                              .images[0]
                          }
                          alt={
                            item.title
                          }
                          style={{
                            width:
                              '64px',
                            height:
                              '64px',
                            borderRadius:
                              '10px',
                            objectFit:
                              'cover'
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width:
                              '64px',
                            height:
                              '64px',
                            borderRadius:
                              '10px',
                            background:
                              '#F1F5F9',
                            display:
                              'flex',
                            alignItems:
                              'center',
                            justifyContent:
                              'center'
                          }}
                        >
                          <SearchX
                            size={
                              24
                            }
                            color={
                              '#94A3B8'
                            }
                          />
                        </div>
                      )}

                      <div>
                        <div
                          style={{
                            fontSize:
                              '15px',
                            fontWeight:
                              800,
                            color:
                              '#334155'
                          }}
                        >
                          {
                            item.title
                          }
                        </div>

                        <div
                          style={{
                            fontSize:
                              '12px',
                            color:
                              '#64748B',
                            marginTop:
                              '3px'
                          }}
                        >
                          📍{' '}
                          {
                            item.location ||
                            'Unknown Location'
                          }
                        </div>

                        <div
                          style={{
                            fontSize:
                              '12px',
                            color:
                              '#64748B',
                            marginTop:
                              '4px'
                          }}
                        >
                          Category:{' '}
                          {
                            item.category ||
                            'Other'
                          }
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        background:
                          '#F1F5F9',
                        color:
                          '#64748B',
                        padding:
                          '7px 12px',
                        borderRadius:
                          '999px',
                        fontSize:
                          '12px',
                        fontWeight:
                          700,
                        whiteSpace:
                          'nowrap'
                      }}
                    >
                      No Match Found
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* ======================================================
          NOTHING TO SHOW
          ====================================================== */}

      {!isScanning &&
        filteredPairs.length ===
          0 &&
        unmatchedLostItems.length ===
          0 && (
          <div
            className="bto-card"
            style={{
              padding:
                '40px',
              textAlign:
                'center'
            }}
          >
            <Sparkles
              size={32}
              color="#6366F1"
              style={{
                marginBottom:
                  '12px'
              }}
            />

            <h3
              style={{
                fontSize:
                  '16px',
                fontWeight:
                  800,
                color:
                  '#0F172A',
                marginBottom:
                  '6px'
              }}
            >
              No pending AI matches
            </h3>

            <p
              style={{
                fontSize:
                  '13px',
                color:
                  '#64748B'
              }}
            >
              All current lost items have either
              been matched or are waiting for new
              matching data.
            </p>
          </div>
        )}

    </div>
  );
}