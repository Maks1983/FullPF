import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Database,
  EyeOff,
  FileWarning,
  Flame,
  Flag,
  FlaskConical,
  Lock,
  RefreshCw,
  Server,
  ShieldCheck,
  ShieldOff,
  Siren,
  StopCircle,
  Target,
  Users,
  UserCircle,
  Wrench,
} from "lucide-react";
import {
  useAdminFoundation,
  type DirectoryUser,
  type FeatureFlagKey,
  type LicenseTier,
  type UserRole,
} from "../../context/AdminFoundation";

const roleLabels: Record<UserRole, string> = {
  owner: "Owner (Admin)",
  manager: "Manager",
  user: "User",
  family: "Family User",
  readonly: "Read-only",
};

const tierLabels: Record<LicenseTier, string> = {
  free: "Free",
  advanced: "Advanced",
  premium: "Premium",
  family: "Family",
};

const severityBadgeStyles: Record<string, string> = {
  info: "bg-blue-50 text-blue-700 border border-blue-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  critical: "bg-rose-50 text-rose-700 border border-rose-200",
};

const formatTimestamp = (value: string | null | undefined) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const maskSecret = (value: string) => {
  if (!value) return "";
  if (value.length <= 4) return "****";
  const suffix = value.slice(-4);
  return `${"•".repeat(Math.max(4, value.length - 4))}${suffix}`;
};

const roleBadgeStyles: Record<UserRole, string> = {
  owner: "bg-purple-100 text-purple-700",
  manager: "bg-sky-100 text-sky-700",
  user: "bg-gray-100 text-gray-700",
  family: "bg-emerald-100 text-emerald-700",
  readonly: "bg-slate-100 text-slate-600",
};

const tierBadgeStyles: Record<LicenseTier, string> = {
  free: "bg-gray-100 text-gray-700",
  advanced: "bg-blue-100 text-blue-700",
  premium: "bg-purple-100 text-purple-700",
  family: "bg-emerald-100 text-emerald-700",
};

const StepUpVerificationCard: React.FC = () => {
  const { verifyStepUp, isStepUpValid, stepUpState, STEP_UP_CODE } = useAdminFoundation();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const success = verifyStepUp(code);
    if (success) {
      setStatus("success");
      setMessage("Step-up verification confirmed for the next sensitive action.");
      setCode("");
    } else {
      setStatus("error");
      setMessage("Invalid code. Please try again.");
    }
  };

  const verified = isStepUpValid();

  return (
    <div className="bg-white border border-purple-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className={`h-6 w-6 ${verified ? "text-emerald-500" : "text-purple-500"}`} />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Step-Up Authentication</h2>
            <p className="text-sm text-gray-600">
              Sensitive actions (impersonation, config edits, restores, deletions) require a recent
              verification. Use the demo TOTP code <span className="font-semibold text-purple-600">{STEP_UP_CODE}</span> to simulate 2FA.
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 text-sm font-medium rounded-full ${verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
          {verified ? "Verified" : "Verification Needed"}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          inputMode="numeric"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Enter 6-digit code"
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-600 hover:to-purple-700"
        >
          <ShieldCheck className="h-4 w-4" />
          Verify
        </button>
      </form>

      {message && (
        <div
          className={`mt-3 flex items-center gap-2 text-sm ${
            status === "success" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {status === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <span>{message}</span>
        </div>
      )}

      {stepUpState.lastVerifiedAt && (
        <p className="mt-2 text-xs text-gray-500">
          Last verified at {formatTimestamp(stepUpState.lastVerifiedAt)} (valid for 5 minutes).
        </p>
      )}
    </div>
  );
};

const ImpersonationSection: React.FC = () => {
  const {
    session,
    effectiveSession,
    impersonation,
    users,
    startImpersonation,
    stopImpersonation,
    isStepUpValid,
    canManageUsers,
  } = useAdminFoundation();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canImpersonate = session?.role === "owner";

  const handleImpersonate = async (user: DirectoryUser) => {
    setFeedback(null);
    setError(null);
    if (!canImpersonate) {
      setError("Only the Owner can impersonate other users.");
      return;
    }
    if (!isStepUpValid()) {
      setError("Complete step-up verification before impersonating.");
      return;
    }
    const result = startImpersonation(user.id, "support-session");
    if (result.success) {
      setFeedback(`Impersonation active as ${user.displayName}.`);
    } else {
      setError(result.message);
    }
  };

  const handleStop = () => {
    setFeedback(null);
    setError(null);
    stopImpersonation();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-purple-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Role & Impersonation Controls</h3>
            <p className="text-sm text-gray-600">
              {canImpersonate
                ? "Launch a support session by assuming another user's perspective after step-up verification."
                : "Review user access. Only the Owner can impersonate accounts."}
            </p>
          </div>
        </div>
        {impersonation && (
          <button
            onClick={handleStop}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100"
          >
            <StopCircle className="h-4 w-4" />
            Stop Impersonation
          </button>
        )}
      </div>

      {(feedback || error) && (
        <div
          className={`rounded-xl px-3 py-2 text-sm ${
            feedback
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {feedback ?? error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Tier</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => {
              const isYou = session?.id === user.id;
              const isImpersonated = impersonation?.target.id === user.id;
              const isEffective = effectiveSession?.id === user.id;
              const statusBadge = isImpersonated
                ? "bg-amber-100 text-amber-700"
                : isYou
                ? "bg-purple-100 text-purple-700"
                : isEffective
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-700";
              const statusLabel = isImpersonated
                ? "Impersonating"
                : isYou
                ? "Signed in"
                : isEffective
                ? "Effective user"
                : "Available";
              const disableAction = !canImpersonate || isYou || !canManageUsers;

              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{user.displayName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${roleBadgeStyles[user.role]}`}>
                      <ShieldCheck className="h-3 w-3" />
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${tierBadgeStyles[user.tier]}`}>
                      <Flag className="h-3 w-3" />
                      {tierLabels[user.tier]}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusBadge}`}>
                      <Activity className="h-3 w-3" />
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleImpersonate(user)}
                      disabled={disableAction || isImpersonated}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                        disableAction || isImpersonated
                          ? "cursor-not-allowed border-gray-200 text-gray-400"
                          : "border-purple-200 text-purple-600 hover:bg-purple-50"
                      }`}
                    >
                      <Siren className="h-4 w-4" />
                      {isImpersonated ? "Active" : "Impersonate"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FeatureFlagsSection: React.FC = () => {
  const {
    featureFlags,
    updateFeatureFlag,
    session,
    impersonation,
    featureAvailability,
  } = useAdminFoundation();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = (key: FeatureFlagKey, value: boolean) => {
    setFeedback(null);
    setError(null);
    const result = updateFeatureFlag(key, value, {
      reason: "Admin panel toggle",
    });
    if (result.success) {
      setFeedback("Feature flag updated successfully.");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <FlaskConical className="h-6 w-6 text-purple-500" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Feature Flags</h3>
          <p className="text-sm text-gray-600">
            Instance-level toggles. Owner overrides only; no changes allowed while impersonating.
          </p>
        </div>
      </div>

      {(feedback || error) && (
        <div
          className={`rounded-xl px-3 py-2 text-sm ${
            feedback
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {feedback ?? error}
        </div>
      )}

      <div className="space-y-3">
        {Object.values(featureFlags).map((flag) => {
          const canToggle = flag.overridableBy.includes(session?.role ?? "readonly") && !impersonation;
          const isActiveForUser = featureAvailability(flag.key);
          return (
            <div
              key={flag.key}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-100 rounded-xl p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-purple-400" />
                  <h4 className="font-medium text-gray-900">{flag.description}</h4>
                </div>
                <div className="mt-1 text-xs text-gray-500 flex flex-wrap items-center gap-2">
                  <span>Last updated {formatTimestamp(flag.lastChangedAt)}</span>
                  {flag.overriddenByUserId && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                      <ClipboardList className="h-3 w-3" />
                      Override by {flag.overriddenByUserId}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" />
                    {isActiveForUser ? "Available to current context" : "Currently gated"}
                  </span>
                </div>
              </div>
              <label className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  checked={flag.value}
                  onChange={(event) => handleToggle(flag.key, event.target.checked)}
                  disabled={!canToggle}
                />
                <span className={`text-sm ${canToggle ? "text-gray-700" : "text-gray-400"}`}>
                  {flag.value ? "Enabled" : "Disabled"}
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AuditLogSection: React.FC = () => {
  const { auditLogs } = useAdminFoundation();
  const [severityFilter, setSeverityFilter] = useState<"all" | "info" | "warning" | "critical">("all");

  const filteredLogs = useMemo(() => {
    if (severityFilter === "all") {
      return [...auditLogs].reverse();
    }
    return auditLogs.filter((log) => log.severity === severityFilter).reverse();
  }, [auditLogs, severityFilter]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-6 w-6 text-purple-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
            <p className="text-sm text-gray-600">
              All admin-sensitive actions are recorded, including impersonation context.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 uppercase">Filter</span>
          <select
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value as typeof severityFilter)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="all">All severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-3 py-2">Timestamp</th>
              <th className="px-3 py-2">Actor</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Target</th>
              <th className="px-3 py-2">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLogs.slice(0, 12).map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-xs text-gray-500">{formatTimestamp(log.timestamp)}</td>
                <td className="px-3 py-2">
                  <div className="text-gray-900 font-medium">{log.actorDisplayName}</div>
                  {log.impersonatedDisplayName && (
                    <div className="text-xs text-gray-500">
                      Acting as {log.impersonatedDisplayName}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium text-gray-900">{log.action}</div>
                  {Object.keys(log.metadata ?? {}).length > 0 && (
                    <div className="text-xs text-gray-500">{JSON.stringify(log.metadata)}</div>
                  )}
                </td>
                <td className="px-3 py-2 text-gray-700">{log.targetEntity}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    severityBadgeStyles[log.severity] ?? "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}>
                    {log.severity === "critical" ? (
                      <AlertOctagon className="h-3 w-3" />
                    ) : log.severity === "warning" ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : (
                      <Activity className="h-3 w-3" />
                    )}
                    {log.severity.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-500">No audit entries for this filter.</div>
        )}
      </div>
    </div>
  );
};

const ConfigSection: React.FC = () => {
  const {
    configItems,
    updateConfigItem,
    canModifyConfig,
    isStepUpValid,
  } = useAdminFoundation();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState<string>("");
  const [draftNote, setDraftNote] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const beginEdit = (key: string, currentValue: string, masked: boolean) => {
    setEditingKey(key);
    setDraftValue(masked ? "" : currentValue);
    setDraftNote("");
    setFeedback(null);
    setError(null);
  };

  const handleSave = (itemKey: string) => {
    setFeedback(null);
    setError(null);
    if (!isStepUpValid()) {
      setError("Step-up verification required before saving secrets.");
      return;
    }
    const result = updateConfigItem(itemKey, draftValue, {
      note: draftNote.trim() || undefined,
    });
    if (result.success) {
      setFeedback("Configuration value updated.");
      setEditingKey(null);
      setDraftValue("");
      setDraftNote("");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <Lock className="h-6 w-6 text-purple-500" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Config & Secrets</h3>
          <p className="text-sm text-gray-600">
            Stored securely in encrypted storage. Editing requires Owner access plus step-up verification.
          </p>
        </div>
      </div>

      {(feedback || error) && (
        <div
          className={`rounded-xl px-3 py-2 text-sm ${
            feedback
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {feedback ?? error}
        </div>
      )}

      <div className="grid gap-4">
        {configItems.map((item) => {
          const isEditing = editingKey === item.key;
          const displayValue = item.masked ? maskSecret(item.value) : item.value;
          return (
            <div key={item.key} className="rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-400" />
                    <h4 className="font-semibold text-gray-900">{item.key}</h4>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  <p className="mt-2 text-sm font-mono text-gray-800 break-all">
                    {displayValue || <span className="text-gray-400">(not set)</span>}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.encrypted ? "Encrypted" : "Plaintext"} • {item.requiresStepUp ? "Step-up required" : "Basic edit"}
                    {item.lastUpdatedAt && (
                      <span className="ml-2">Last updated {formatTimestamp(item.lastUpdatedAt)}</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    item.encrypted ? "bg-purple-50 text-purple-600" : "bg-gray-100 text-gray-600"
                  }`}>
                    <ShieldOff className="h-3 w-3" />
                    {item.encrypted ? "Encrypted" : "Plain"}
                  </span>
                  {item.masked && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] text-amber-600">
                      <EyeOff className="h-3 w-3" />
                      Masked
                    </span>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={draftValue}
                    onChange={(event) => setDraftValue(event.target.value)}
                    placeholder={item.masked ? "Enter new secret value" : undefined}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    rows={item.masked ? 2 : 1}
                  />
                  <input
                    value={draftNote}
                    onChange={(event) => setDraftNote(event.target.value)}
                    placeholder="Optional change note"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSave(item.key)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-600 hover:to-purple-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Save secret
                    </button>
                    <button
                      onClick={() => {
                        setEditingKey(null);
                        setDraftValue("");
                        setDraftNote("");
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <button
                    onClick={() => beginEdit(item.key, item.value, item.masked)}
                    disabled={!canModifyConfig}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      canModifyConfig
                        ? "border-purple-200 text-purple-600 hover:bg-purple-50"
                        : "cursor-not-allowed border-gray-200 text-gray-400"
                    }`}
                  >
                    <Wrench className="h-4 w-4" />
                    {canModifyConfig ? "Edit secret" : "Owner only"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const InfrastructureSection: React.FC = () => {
  const {
    infrastructure,
    triggerBackup,
    triggerRestore,
    scheduleDeletion,
    cancelDeletion,
    canRunCriticalOps,
    isStepUpValid,
    instanceName,
    instanceConfirmationToken,
  } = useAdminFoundation();
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const [backupError, setBackupError] = useState<string | null>(null);
  const [restoreId, setRestoreId] = useState<string>("backup-demo-2025-09-01");
  const [restoreDryRun, setRestoreDryRun] = useState<boolean>(true);
  const [restoreNote, setRestoreNote] = useState<string>("");
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [deletionConfirm, setDeletionConfirm] = useState<string>("");
  const [deletionMessage, setDeletionMessage] = useState<string | null>(null);
  const [deletionError, setDeletionError] = useState<string | null>(null);

  const handleBackup = (mode: "manual" | "scheduled") => {
    setBackupMessage(null);
    setBackupError(null);
    const result = triggerBackup(mode);
    if (result.success) {
      setBackupMessage(result.message);
    } else {
      setBackupError(result.message);
    }
  };

  const handleRestore = () => {
    setRestoreMessage(null);
    setRestoreError(null);
    if (!restoreId.trim()) {
      setRestoreError("Backup identifier is required.");
      return;
    }
    const result = triggerRestore({
      backupId: restoreId.trim(),
      dryRun: restoreDryRun,
      note: restoreNote.trim() || undefined,
    });
    if (result.success) {
      setRestoreMessage(result.message);
    } else {
      setRestoreError(result.message);
    }
  };

  const handleDeletion = () => {
    setDeletionMessage(null);
    setDeletionError(null);
    if (!isStepUpValid()) {
      setDeletionError("Step-up verification required before scheduling deletion.");
      return;
    }
    const result = scheduleDeletion({
      confirmationText: deletionConfirm.trim().toLowerCase(),
      requestedAt: new Date().toISOString(),
    });
    if (result.success) {
      setDeletionMessage(result.message);
      setDeletionConfirm("");
    } else {
      setDeletionError(result.message);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-3">
        <Server className="h-6 w-6 text-purple-500" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Infrastructure Controls</h3>
          <p className="text-sm text-gray-600">
            Run backups, restore snapshots, and manage full instance deletion with layered safeguards.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-500" />
            <h4 className="font-semibold text-gray-900">Backups</h4>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Last backup: {formatTimestamp(infrastructure.lastBackupAt)} ({infrastructure.lastBackupMode ?? "n/a"}).
          </p>
          {(backupMessage || backupError) && (
            <div className={`mt-3 rounded-lg px-3 py-2 text-xs ${backupMessage ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {backupMessage ?? backupError}
            </div>
          )}
          <div className="mt-3 flex flex-col gap-2">
            <button
              onClick={() => handleBackup("manual")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-600 hover:to-purple-700"
            >
              <RefreshCw className="h-4 w-4" />Manual backup
            </button>
            <button
              onClick={() => handleBackup("scheduled")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Clock className="h-4 w-4" />Mark scheduled
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-purple-500" />
            <h4 className="font-semibold text-gray-900">Restore</h4>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Dry-run changes metadata only; full restore requires step-up and is owner-only.
          </p>
          <input
            value={restoreId}
            onChange={(event) => setRestoreId(event.target.value)}
            className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            placeholder="Backup identifier"
          />
          <textarea
            value={restoreNote}
            onChange={(event) => setRestoreNote(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            placeholder="Optional note"
            rows={2}
          />
          <label className="mt-2 inline-flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={restoreDryRun}
              onChange={(event) => setRestoreDryRun(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            Perform dry-run only
          </label>
          {(restoreMessage || restoreError) && (
            <div className={`mt-3 rounded-lg px-3 py-2 text-xs ${restoreMessage ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {restoreMessage ?? restoreError}
            </div>
          )}
          <button
            onClick={handleRestore}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-purple-200 px-3 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50"
          >
            <Activity className="h-4 w-4" />
            {restoreDryRun ? "Run dry-run" : "Schedule restore"}
          </button>
        </div>

        <div className="rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Siren className="h-5 w-5 text-rose-500" />
            <h4 className="font-semibold text-gray-900">Full deletion</h4>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Type <span className="font-mono text-sm font-semibold text-rose-600">{instanceConfirmationToken}</span> and confirm after step-up. Destructive actions disabled while impersonating.
          </p>
          <input
            value={deletionConfirm}
            onChange={(event) => setDeletionConfirm(event.target.value)}
            placeholder="Type confirmation token"
            className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
          {(deletionMessage || deletionError) && (
            <div className={`mt-3 rounded-lg px-3 py-2 text-xs ${deletionMessage ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {deletionMessage ?? deletionError}
            </div>
          )}
          <button
            onClick={handleDeletion}
            disabled={!canRunCriticalOps}
            className={`mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              canRunCriticalOps
                ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700"
                : "cursor-not-allowed bg-rose-100 text-rose-400"
            }`}
          >
            <AlertOctagon className="h-4 w-4" />
            Schedule deletion
          </button>
          {infrastructure.deletionScheduledFor && (
            <div className="mt-3 space-y-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-600">
              <div>
                Deletion scheduled for {formatTimestamp(infrastructure.deletionScheduledFor)} on {instanceName}.
              </div>
              <button
                onClick={cancelDeletion}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2 py-1 font-semibold text-rose-600 hover:bg-rose-100"
              >
                <ShieldOff className="h-3 w-3" /> Cancel deletion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MonitoringSection: React.FC = () => {
  const { monitoring, refreshMonitoring } = useAdminFoundation();

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-purple-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Monitoring Snapshot</h3>
            <p className="text-sm text-gray-600">
              Lightweight health indicators for the demo environment.
            </p>
          </div>
        </div>
        <button
          onClick={refreshMonitoring}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MonitoringCard
          title="DB connectivity"
          icon={<Database className="h-5 w-5" />}
          status={monitoring.dbConnection === "healthy" ? "Online" : monitoring.dbConnection}
          tone={monitoring.dbConnection === "healthy" ? "success" : monitoring.dbConnection === "degraded" ? "warning" : "critical"}
        />
        <MonitoringCard
          title="SMTP status"
          icon={<Server className="h-5 w-5" />}
          status={monitoring.smtpStatus.toUpperCase()}
          tone={monitoring.smtpStatus === "ok" ? "success" : monitoring.smtpStatus === "warning" ? "warning" : "critical"}
        />
        <MonitoringCard
          title="CPU utilization"
          icon={<Flame className="h-5 w-5" />}
          status={`${monitoring.cpuUtilization}%`}
          tone={monitoring.cpuUtilization < 70 ? "success" : monitoring.cpuUtilization < 85 ? "warning" : "critical"}
        />
        <MonitoringCard
          title="Memory utilization"
          icon={<Activity className="h-5 w-5" />}
          status={`${monitoring.memoryUtilization}%`}
          tone={monitoring.memoryUtilization < 70 ? "success" : monitoring.memoryUtilization < 85 ? "warning" : "critical"}
        />
        <MonitoringCard
          title="Queue backlog"
          icon={<ClipboardList className="h-5 w-5" />}
          status={`${monitoring.queueBacklog} items`}
          tone={monitoring.queueBacklog === 0 ? "success" : monitoring.queueBacklog < 5 ? "warning" : "critical"}
        />
        <MonitoringCard
          title="Uptime"
          icon={<Clock className="h-5 w-5" />}
          status={formatUptime(monitoring.uptimeSeconds)}
          tone="success"
        />
        <MonitoringCard
          title="Last updated"
          icon={<CheckCircle2 className="h-5 w-5" />}
          status={formatTimestamp(monitoring.lastUpdatedAt)}
          tone="info"
        />
      </div>
    </div>
  );
};

type MonitoringTone = "success" | "warning" | "critical" | "info";

const monitoringToneClass: Record<MonitoringTone, string> = {
  success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border border-amber-100",
  critical: "bg-rose-50 text-rose-700 border border-rose-100",
  info: "bg-blue-50 text-blue-700 border border-blue-100",
};

const MonitoringCard: React.FC<{
  title: string;
  status: string;
  icon: React.ReactNode;
  tone: MonitoringTone;
}> = ({ title, status, icon, tone }) => (
  <div className={`rounded-xl p-4 text-sm ${monitoringToneClass[tone]}`}>
    <div className="flex items-center gap-2">
      {icon}
      <span className="font-semibold">{title}</span>
    </div>
    <div className="mt-2 text-lg font-semibold">{status}</div>
  </div>
);

const LicenseSection: React.FC = () => {
  const { license, overrideLicenseTier, canRunCriticalOps, tierFeatures } = useAdminFoundation();
  const [overrideSelection, setOverrideSelection] = useState<string>(license.overrideActive ? license.overrideTier ?? "" : "none");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOverride = (value: string) => {
    setMessage(null);
    setError(null);
    setOverrideSelection(value);
    const tier = value === "none" ? null : (value as LicenseTier);
    const result = overrideLicenseTier(tier);
    if (result.success) {
      setMessage(result.message);
    } else {
      setError(result.message);
    }
  };

  const statusBadge = {
    valid: "bg-emerald-100 text-emerald-700",
    expiring: "bg-amber-100 text-amber-700",
    expired: "bg-rose-100 text-rose-700",
  }[license.status];

  const tierToDisplay = license.overrideActive && license.overrideTier ? license.overrideTier : license.tier;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-purple-500" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">License & Feature Access</h3>
          <p className="text-sm text-gray-600">
            Local validation for demo licenses. Owner can temporarily override tiers for support scenarios.
          </p>
        </div>
      </div>

      {(message || error) && (
        <div className={`rounded-xl px-3 py-2 text-sm ${message ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {message ?? error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-100 p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900">Current license</h4>
          <p className="mt-2 text-sm text-gray-600">ID: {license.licenseId}</p>
          <p className="text-sm text-gray-600">Tier: {tierLabels[tierToDisplay]}</p>
          <p className="text-sm text-gray-600">Expires: {formatTimestamp(license.expiresAt)}</p>
          <p className="text-sm text-gray-600">Last validated: {formatTimestamp(license.lastValidatedAt)}</p>
          <span className={`inline-flex mt-2 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadge}`}>
            <ShieldCheck className="h-3 w-3" />
            {license.status.toUpperCase()}
          </span>
        </div>

        <div className="rounded-xl border border-gray-100 p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900">Override tier</h4>
          <p className="mt-2 text-sm text-gray-600">
            Use for debug/support after verifying with step-up. Overrides only apply while the Owner is not impersonating.
          </p>
          <select
            value={overrideSelection}
            onChange={(event) => handleOverride(event.target.value)}
            disabled={!canRunCriticalOps}
            className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="none">No override</option>
            <option value="free">Force Free</option>
            <option value="advanced">Force Advanced</option>
            <option value="premium">Force Premium</option>
            <option value="family">Force Family</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-900">Feature matrix</h4>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-sm">
          {Object.entries(tierFeatures).map(([tier, features]) => (
            <div key={tier} className="rounded-lg bg-gray-50 p-3">
              <div className="font-semibold text-gray-800">{tierLabels[tier as LicenseTier]}</div>
              <ul className="mt-2 space-y-1 text-xs text-gray-600">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    {feature.replace(/_/g, " ")}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminHeader: React.FC = () => {
  const { session, effectiveSession, impersonation, canAccessAdmin } = useAdminFoundation();

  if (!canAccessAdmin) {
    return null;
  }

  return (
    <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 p-6 text-white shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Control Center</h1>
          <p className="mt-1 text-sm text-purple-100">
            Manage roles, premium access, infrastructure safeguards, and audit visibility from one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {session && (
            <div className="rounded-2xl bg-white/15 px-4 py-2">
              <p className="text-xs text-purple-100">Signed in as</p>
              <p className="text-sm font-semibold">{session.displayName}</p>
              <p className="text-xs text-purple-100">{roleLabels[session.role]}</p>
            </div>
          )}
          {impersonation && (
            <div className="rounded-2xl bg-white/20 px-4 py-2">
              <p className="text-xs text-purple-100">Impersonating</p>
              <p className="text-sm font-semibold">{impersonation.target.displayName}</p>
              <p className="text-xs text-purple-100">{roleLabels[impersonation.target.role]}</p>
            </div>
          )}
        </div>
      </div>
      {impersonation && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-amber-200" />
          You are impersonating {impersonation.target.displayName}. All actions are logged with full context.
        </div>
      )}
      {!impersonation && effectiveSession && session && effectiveSession.id !== session.id && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm">
          <Flag className="h-4 w-4 text-emerald-200" />
          Effective access aligned with {effectiveSession.displayName}.
        </div>
      )}
    </div>
  );
};

const RestrictedAdminNotice: React.FC = () => (
  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-700">
    <div className="flex items-center gap-3">
      <AlertTriangle className="h-5 w-5" />
      <div>
        <p className="font-semibold">Admin access required</p>
        <p className="text-sm">Only Owner and Manager roles can open the admin console.</p>
      </div>
    </div>
  </div>
);

const AdminPanel: React.FC = () => {
  const { canAccessAdmin, session } = useAdminFoundation();

  if (!session) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5" />
          <div>
            <p className="font-semibold">Authentication required</p>
            <p className="text-sm">Sign in to access the admin console.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!canAccessAdmin) {
    return <RestrictedAdminNotice />;
  }

  return (
    <div className="space-y-6">
      <AdminHeader />
      <StepUpVerificationCard />
      <ImpersonationSection />
      <FeatureFlagsSection />
      <div className="grid gap-6 lg:grid-cols-2">
        <AuditLogSection />
        <MonitoringSection />
      </div>
      <ConfigSection />
      <InfrastructureSection />
      <LicenseSection />
    </div>
  );
};

export default AdminPanel;