export const themeCss = `
/* Pod Advisor Premium Theme */

.pa-dashboard {
  --pa-bg-app: #0f111a;
  --pa-bg-panel: #171b29;
  --pa-bg-panel-hover: #1c2132;
  --pa-border: #2a3045;
  --pa-text-primary: #e2e8f0;
  --pa-text-secondary: #94a3b8;
  --pa-text-muted: #64748b;
  
  --pa-primary: #00E5FF;
  --pa-primary-glow: rgba(0, 229, 255, 0.2);
  --pa-success: #10b981;
  --pa-success-glow: rgba(16, 185, 129, 0.2);
  --pa-warning: #f59e0b;
  --pa-warning-glow: rgba(245, 158, 11, 0.2);
  --pa-error: #ef4444;
  --pa-error-glow: rgba(239, 68, 68, 0.2);
  --pa-info: #3b82f6;

  --pa-font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  background-color: var(--pa-bg-app);
  color: var(--pa-text-primary);
  font-family: var(--pa-font-sans);
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pa-panel {
  background-color: var(--pa-bg-panel);
  border: 1px solid var(--pa-border);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.pa-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.pa-title {
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 8px 0;
}

.pa-subtitle {
  color: var(--pa-text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.pa-select {
  background-color: var(--pa-bg-panel);
  color: var(--pa-text-primary);
  border: 1px solid var(--pa-border);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}
.pa-select:focus {
  border-color: var(--pa-primary);
}

.pa-pill {
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.pa-pill-success {
  background-color: var(--pa-success-glow);
  color: var(--pa-success);
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.pa-pill-error {
  background-color: var(--pa-error-glow);
  color: var(--pa-error);
  border: 1px solid rgba(239, 68, 68, 0.3);
}
.pa-pill-warning {
  background-color: var(--pa-warning-glow);
  color: var(--pa-warning);
  border: 1px solid rgba(245, 158, 11, 0.3);
}
.pa-pill-info {
  background-color: rgba(59, 130, 246, 0.2);
  color: var(--pa-info);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.pa-button {
  background-color: var(--pa-bg-panel);
  color: var(--pa-text-primary);
  border: 1px solid var(--pa-border);
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.pa-button:hover {
  background-color: var(--pa-bg-panel-hover);
  border-color: var(--pa-primary);
}
.pa-button-primary {
  background-color: var(--pa-info);
  color: white;
  border: none;
}
.pa-button-primary:hover {
  background-color: #2563eb;
}

.pa-tabs {
  display: flex;
  gap: 2px;
  border-bottom: 1px solid var(--pa-border);
  margin-bottom: 24px;
}
.pa-tab {
  padding: 12px 24px;
  color: var(--pa-text-secondary);
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.pa-tab:hover {
  color: var(--pa-text-primary);
}
.pa-tab.active {
  color: var(--pa-primary);
  border-bottom-color: var(--pa-primary);
}

.pa-grid {
  display: grid;
  gap: 20px;
}
.pa-grid-top {
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
}
.pa-grid-mid {
  grid-template-columns: 1.2fr 1fr 1.2fr;
}
.pa-grid-bot {
  grid-template-columns: 2fr 1fr;
}

/* Timeline specific */
.pa-timeline-item {
  display: flex;
  gap: 16px;
  position: relative;
  padding-bottom: 24px;
}
.pa-timeline-item:last-child {
  padding-bottom: 0;
}
.pa-timeline-line {
  position: absolute;
  left: 5px;
  top: 14px;
  bottom: -14px;
  width: 2px;
  background-color: var(--pa-border);
}
.pa-timeline-item:last-child .pa-timeline-line {
  display: none;
}
.pa-timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px;
  z-index: 1;
}

/* Scrollbar styling */
.pa-dashboard::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.pa-dashboard::-webkit-scrollbar-track {
  background: var(--pa-bg-app);
}
.pa-dashboard::-webkit-scrollbar-thumb {
  background: var(--pa-border);
  border-radius: 4px;
}
.pa-dashboard::-webkit-scrollbar-thumb:hover {
  background: var(--pa-text-muted);
}
`;
