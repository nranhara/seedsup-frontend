
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AHPSettings.css";

// const API = "http://localhost:5001/api/suppliers/ahp-config";
const API = `${import.meta.env.VITE_API_BASE_URL}/api/suppliers/ahp-config`;

const PAIRS = [
  { key: "price_rating", first: "Price", second: "Rating" },
  { key: "price_distance", first: "Price", second: "Distance" },
  { key: "price_stock", first: "Price", second: "Stock availability" },
  { key: "rating_distance", first: "Rating", second: "Distance" },
  { key: "rating_stock", first: "Rating", second: "Stock availability" },
  { key: "distance_stock", first: "Distance", second: "Stock availability" },
];

const SCALE = [
  { value: 1 / 9, label: "1/9 — Rating is extremely more important" },
  { value: 1 / 8, label: "1/8 — Rating is between very and extremely important" },
  { value: 1 / 7, label: "1/7 — Rating is very strongly more important" },
  { value: 1 / 6, label: "1/6 — Rating is between strongly and very strongly important" },
  { value: 1 / 5, label: "1/5 — Rating is strongly more important" },
  { value: 1 / 4, label: "1/4 — Rating is between moderately and strongly important" },
  { value: 1 / 3, label: "1/3 — Rating is moderately more important" },
  { value: 1 / 2, label: "1/2 — Rating is slightly more important" },
  { value: 1, label: "1 — Equally important" },
  { value: 2, label: "2 — First criterion is slightly more important" },
  { value: 3, label: "3 — First criterion is moderately more important" },
  { value: 4, label: "4 — First criterion is between moderate and strong" },
  { value: 5, label: "5 — First criterion is strongly more important" },
  { value: 6, label: "6 — First criterion is between strong and very strong" },
  { value: 7, label: "7 — First criterion is very strongly more important" },
  { value: 8, label: "8 — First criterion is between very strong and extreme" },
  { value: 9, label: "9 — First criterion is extremely more important" },
];

const DEFAULTS = {
  price_rating: 1,
  price_distance: 2,
  price_stock: 2,
  rating_distance: 2,
  rating_stock: 2,
  distance_stock: 1,
};

function getScaleValue(value) {
  const number = Number(value);

  return SCALE.find(
    (option) => Math.abs(Number(option.value) - number) < 0.000001
  )?.value ?? 1;
}

function formatWeight(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? `${(number * 100).toFixed(2)}%`
    : "—";
}

export default function AHPSettings() {
  const [open, setOpen] = useState(false);
  const [expertName, setExpertName] = useState("");
  const [comparisons, setComparisons] = useState(DEFAULTS);
  const [config, setConfig] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);

  const loadConfig = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API);
      const data = response.data;

      setConfig(data);

      if (data?.comparisons) {
        setComparisons((previous) => ({
          ...previous,
          ...data.comparisons,
        }));
      }

      if (data?.expertName) {
        setExpertName(data.expertName);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load AHP settings. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // Keep the page behind the popup from scrolling.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !busy) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, busy]);

  const openSettings = () => {
    setError("");
    setMessage("");
    setDirty(false);
    setOpen(true);
  };

  const closeSettings = () => {
    if (busy) return;
    setOpen(false);
    setError("");
    setMessage("");
  };

  const updateComparison = (key, value) => {
    setComparisons((previous) => ({
      ...previous,
      [key]: Number(value),
    }));

    setDirty(true);
    setMessage("");
    setError("");
  };

  const save = async (event) => {
    event.preventDefault();

    if (!expertName.trim()) {
      setError("Please enter the expert name or ID.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.put(API, {
        expertName: expertName.trim(),
        comparisons,
      });

      setConfig(response.data);
      setDirty(false);
      setMessage("AHP settings saved successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save the settings. Please check the backend and try again."
      );

      if (err.response?.data?.weights) {
        setConfig((previous) => ({
          ...previous,
          ...err.response.data,
        }));
      }
    } finally {
      setBusy(false);
    }
  };

  const weights = config?.weights || {};

  return (
    <section className="ahp-config-card">
      <div className="ahp-config-content">
        <div className="ahp-config-copy">
          <p className="ahp-eyebrow">RECOMMENDATION SETTINGS</p>

          <h2>Expert AHP Configuration</h2>

          <p className="ahp-config-description">
            Configure the importance of each supplier criterion using expert
            judgements.
          </p>

          <div className="ahp-current-weights">
            <span>
              Price{" "}
              <strong>{formatWeight(weights.price ?? weights.priceWeight)}</strong>
            </span>
            <span>
              Rating{" "}
              <strong>
                {formatWeight(weights.rating ?? weights.ratingWeight)}
              </strong>
            </span>
            <span>
              Distance{" "}
              <strong>
                {formatWeight(
                  weights.distance ??
                    weights.distance_km ??
                    weights.distanceWeight
                )}
              </strong>
            </span>
            <span>
              Stock{" "}
              <strong>{formatWeight(weights.stock ?? weights.stockWeight)}</strong>
            </span>
          </div>
        </div>

        <button
          type="button"
          className="ahp-open-button"
          onClick={openSettings}
        >
          Configure AHP
        </button>
      </div>

      {open && (
        <div
          className="ahp-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSettings();
            }
          }}
        >
          <section
            className="ahp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ahp-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="ahp-modal-header">
              <div>
                <p className="ahp-eyebrow">SEEDAI · SUPPLIER MATCHING</p>
                <h2 id="ahp-modal-title">AHP Settings</h2>
                <p className="ahp-modal-subtitle">
                  Expert-based criteria weighting
                </p>
              </div>

              <button
                type="button"
                className="ahp-close-button"
                onClick={closeSettings}
                disabled={busy}
                aria-label="Close settings"
              >
                ×
              </button>
            </header>

            <form className="ahp-modal-form" onSubmit={save}>
              <div className="ahp-modal-body">
                <p className="ahp-intro">
                  Compare two criteria at a time. Your judgements determine
                  the weights used to rank eligible suppliers.
                </p>

                

                <div className="ahp-field">
                  <label htmlFor="ahp-expert-name">
                    Expert name or ID <span>*</span>
                  </label>

                  <input
                    id="ahp-expert-name"
                    type="text"
                    value={expertName}
                    onChange={(event) => {
                      setExpertName(event.target.value);
                      setDirty(true);
                    }}
                    placeholder="e.g. Agricultural Expert 01"
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="ahp-comparison-heading">
                  <div>
                    <h3>Pairwise comparisons</h3>
                    <p>Select how important the first criterion is compared
                      with the second.</p>
                  </div>
                  <span className="ahp-count">6 comparisons</span>
                </div>

                <div className="ahp-comparison-list">
                  {PAIRS.map((pair, index) => (
                    <div className="ahp-comparison-card" key={pair.key}>
                      <div className="ahp-comparison-top">
                        <span className="ahp-comparison-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="ahp-pair-labels">
                          <span>{pair.first}</span>
                          <span className="ahp-versus">compared with</span>
                          <span>{pair.second}</span>
                        </div>
                      </div>

                      <label
                        className="ahp-select-label"
                        htmlFor={`ahp-${pair.key}`}
                      >
                        Importance level
                      </label>

                      <select
                        id={`ahp-${pair.key}`}
                        value={getScaleValue(comparisons[pair.key])}
                        onChange={(event) =>
                          updateComparison(pair.key, event.target.value)
                        }
                      >
                        {SCALE.map((option) => (
                          <option
                            key={`${pair.key}-${option.value}`}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <p className="ahp-comparison-help">
                        {Number(comparisons[pair.key]) === 1
                          ? "Both criteria are equally important."
                          : Number(comparisons[pair.key]) > 1
                          ? `${pair.first} is more important than ${pair.second}.`
                          : `${pair.second} is more important than ${pair.first}.`}
                      </p>
                    </div>
                  ))}
                </div>

                {config?.consistencyRatio !== undefined && (
                  <div className="ahp-consistency">
                    <span>Consistency ratio</span>
                    <strong>
                      {Number(config.consistencyRatio).toFixed(4)}
                    </strong>
                    <p>
                      A consistency ratio of 0.10 or less is generally
                      considered acceptable.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="ahp-feedback ahp-feedback-error" role="alert">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="ahp-feedback ahp-feedback-success" role="status">
                    {message}
                  </div>
                )}

                {loading && (
                  <p className="ahp-loading">Loading saved configuration...</p>
                )}
              </div>

              <footer className="ahp-modal-footer">
                <span className="ahp-save-status">
                  {dirty ? "Unsaved changes" : " "}
                </span>

                <div className="ahp-footer-actions">
                  <button
                    type="button"
                    className="ahp-cancel-button"
                    onClick={closeSettings}
                    disabled={busy}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="ahp-save-button"
                    disabled={busy || loading}
                  >
                    {busy ? "Saving..." : "Save AHP Settings"}
                  </button>
                </div>
              </footer>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
