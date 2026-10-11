"use client";
import { Button, Input, MultiSelect } from "@dragorbit/ui";
import {
  AlertCircle,
  Briefcase,
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  Send,
  User,
} from "lucide-react";
export function InviteStaffDrawerView({ model }) {
  const {
    handleSubmit,
    name,
    setName,
    email,
    setEmail,
    roleName,
    setRoleName,
    setSelectedPreset,
    storeOptions,
    managedStoreIds,
    setManagedStoreIds,
    PRESET_ROLES,
    applyPreset,
    selectedPreset,
    permissions,
    MODULES,
    isModuleEnabled,
    getModulePerms,
    expandedModules,
    toggleModule,
    setExpandedModules,
    ACTIONS,
    toggleAction,
    error,
    isLoading,
    onCancel,
  } = model;
  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Basic Info Row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Staff Name */}
          <div>
            <Input
              label="Name"
              type="text"
              value={name}
              onChange={(val) => setName(val)}
              placeholder="Ravi Kumar"
              leftIcon={User}
              required
            />
          </div>

          {/* Staff Email */}
          <div>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(val) => setEmail(val)}
              placeholder="staff@example.com"
              leftIcon={Mail}
              required
            />
          </div>

          {/* Role Name */}
          <div>
            <Input
              label="Role Title"
              type="text"
              value={roleName}
              onChange={(val) => {
                setRoleName(val);
                setSelectedPreset(null);
              }}
              placeholder="e.g. Cashier"
              leftIcon={Briefcase}
              required
            />
          </div>
        </div>

        {/* Store Selection */}
        <div className="bg-[rgb(var(--color-bg-secondary))]/50 p-4 rounded-xl border border-[rgb(var(--color-border-primary))]">
          <label className="block text-xs font-semibold text-[rgb(var(--color-text-secondary))] mb-2 uppercase tracking-wide">
            Store Access Assignment
          </label>
          <MultiSelect
            options={storeOptions}
            value={managedStoreIds}
            onChange={(vals) => setManagedStoreIds(vals)}
            placeholder="Select stores the staff can manage..."
            required
          />
          <p className="text-[0.625rem] text-[rgb(var(--color-text-tertiary))] mt-2 italic">
            * Staff will be able to switch between these stores after login.
          </p>
        </div>

        {/* Quick Presets */}
        <div>
          <label className="block text-xs font-semibold text-[rgb(var(--color-text-secondary))] mb-2 uppercase tracking-wide">
            Quick Role Presets
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_ROLES.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPreset === preset.label
                    ? "border-[rgb(var(--color-primary))] bg-[rgba(var(--color-primary),0.05)]"
                    : "border-[rgb(var(--color-border-primary))] hover:border-[rgb(var(--color-primary))]/50 bg-[rgb(var(--color-bg-secondary))]"
                }`}
              >
                <p className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">
                  {preset.label}
                </p>
                <p className="text-[0.625rem] text-[rgb(var(--color-text-secondary))] mt-0.5 leading-tight">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Module Permissions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wide">
              Module Permissions
            </label>
            <span className="text-xs text-[rgb(var(--color-text-secondary))]">
              {permissions.length}/{MODULES.length} enabled
            </span>
          </div>

          <div className="space-y-2">
            {MODULES.map((mod) => {
              const enabled = isModuleEnabled(mod.key);
              const perms = getModulePerms(mod.key);
              const expanded = expandedModules[mod.key];

              return (
                <div
                  key={mod.key}
                  className={`rounded-xl border transition-all ${
                    enabled
                      ? "border-[rgb(var(--color-primary))]/30 bg-[rgba(var(--color-primary),0.03)]"
                      : "border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]"
                  }`}
                >
                  {/* Module Header */}
                  <div className="flex items-center gap-3 p-3">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.key)}
                      className={`w-9 h-5 rounded-full transition-all flex-shrink-0 relative ${
                        enabled
                          ? "bg-[rgb(var(--color-primary))]"
                          : "bg-[rgb(var(--color-border-primary))]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          enabled ? "left-4" : "left-0.5"
                        }`}
                      />
                    </button>

                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${enabled ? "text-[rgb(var(--color-text-primary))]" : "text-[rgb(var(--color-text-secondary))]"}`}
                      >
                        {mod.label}
                      </p>
                      <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                        {mod.description}
                      </p>
                    </div>

                    {enabled && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedModules((prev) => ({
                            ...prev,
                            [mod.key]: !prev[mod.key],
                          }))
                        }
                        className="p-1 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors"
                      >
                        {expanded ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Actions Grid */}
                  {enabled && expanded && perms && (
                    <div className="px-3 pb-3">
                      <div className="flex flex-wrap gap-2">
                        {ACTIONS.map((action) => (
                          <button
                            key={action.key}
                            type="button"
                            onClick={() => toggleAction(mod.key, action.key)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                              perms[action.key]
                                ? "bg-[rgb(var(--color-primary))] text-white"
                                : "bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-secondary))] hover:border-[rgb(var(--color-primary))]/50"
                            }`}
                          >
                            {perms[action.key] && <Check size={10} />}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertCircle
              size={15}
              className="text-red-500 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}
      </div>

      {/* ── Sticky Footer ── */}
      <div className="flex-shrink-0 border-t border-[rgb(var(--color-border-primary))] p-4 bg-[rgb(var(--color-bg-primary))]">
        <div className="flex items-center space-x-3">
          <Button type="submit" loading={isLoading} leftIcon={Send}>
            {isLoading ? "Sending..." : "Send Invite"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
