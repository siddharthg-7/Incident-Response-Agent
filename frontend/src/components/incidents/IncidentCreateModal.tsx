import React, { useState } from 'react';
import { ShieldAlert, X, Plus, Terminal } from 'lucide-react';
import { Severity } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    incident_type: string;
    severity: Severity;
    source: string;
    target: string;
    indicators: string[];
    evidence: Record<string, any>;
  }) => Promise<void>;
}

export const IncidentCreateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('SSH Brute Force Surge on Perimeter Bastion');
  const [description, setDescription] = useState(
    'Rapid automated dictionary attack originating from external IP targeting exposed SSH daemon.'
  );
  const [incidentType, setIncidentType] = useState('ssh_brute_force');
  const [severity, setSeverity] = useState<Severity>('HIGH');
  const [source, setSource] = useState('198.51.100.99');
  const [target, setTarget] = useState('bastion-prod-02 (10.0.1.18)');
  const [indicatorsText, setIndicatorsText] = useState('198.51.100.99, root, port 22, sshd');
  const [evidenceJson, setEvidenceJson] = useState(
    JSON.stringify(
      {
        log_source: '/var/log/auth.log',
        failed_attempts: 1250,
        time_window: '6 minutes',
        protocol: 'SSH-2.0-OpenSSH_8.9p1',
      },
      null,
      2
    )
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTemplateClick = (template: 'ssh' | 'powershell' | 'c2') => {
    if (template === 'ssh') {
      setTitle('SSH Dictionary Attack on Bastion Node');
      setDescription('External botnet attempting root dictionary attack over port 22.');
      setIncidentType('ssh_brute_force');
      setSeverity('HIGH');
      setSource('198.51.100.120');
      setTarget('bastion-edge-03 (10.0.1.22)');
      setIndicatorsText('198.51.100.120, root, admin, port 22');
      setEvidenceJson(JSON.stringify({ failed_attempts: 850, time_window: '5 minutes' }, null, 2));
    } else if (template === 'powershell') {
      setTitle('Suspicious PowerShell Download Cradle on Workstation');
      setDescription('WINWORD spawned hidden powershell.exe executing base64 payload.');
      setIncidentType('powershell_execution');
      setSeverity('CRITICAL');
      setSource('10.0.4.92');
      setTarget('win-workstation-12');
      setIndicatorsText('powershell.exe, WINWORD.EXE, -enc, 45.33.32.180');
      setEvidenceJson(JSON.stringify({ process: 'powershell.exe', parent: 'WINWORD.EXE' }, null, 2));
    } else {
      setTitle('Anomalous Outbound TLS Beaconing');
      setDescription('Internal server initiating regular 45-second HTTPS connections to suspicious IP.');
      setIncidentType('outbound_beaconing');
      setSeverity('HIGH');
      setSource('10.0.2.33');
      setTarget('185.220.101.99:8443');
      setIndicatorsText('185.220.101.99, port 8443, periodic_beacon');
      setEvidenceJson(JSON.stringify({ interval_seconds: 45, bytes: 4820 }, null, 2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      let parsedEvidence: Record<string, any> = {};
      try {
        parsedEvidence = JSON.parse(evidenceJson);
      } catch {
        parsedEvidence = { raw: evidenceJson };
      }

      const indicators = indicatorsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await onSubmit({
        title,
        description,
        incident_type: incidentType,
        severity,
        source,
        target,
        indicators,
        evidence: parsedEvidence,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create incident');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-surface border border-border rounded-xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-primary/20 text-primary-light">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">Ingest New Security Incident</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Templates */}
        <div className="px-6 pt-4 pb-2 border-b border-border/60 bg-slate-900/50 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Quick Templates:</span>
          <button
            type="button"
            onClick={() => handleTemplateClick('ssh')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono border border-slate-700 transition"
          >
            SSH Brute-Force (Demo Loop)
          </button>
          <button
            type="button"
            onClick={() => handleTemplateClick('powershell')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono border border-slate-700 transition"
          >
            PowerShell Cradle
          </button>
          <button
            type="button"
            onClick={() => handleTemplateClick('c2')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono border border-slate-700 transition"
          >
            Outbound C2
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-danger/20 border border-danger/40 text-danger text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Incident Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Incident Type</label>
              <input
                type="text"
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-[11px] focus:outline-hidden focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-primary"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Source (IP or User)</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-[11px] focus:outline-hidden focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Asset</label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-[11px] focus:outline-hidden focus:border-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-hidden focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Indicators (comma separated)</label>
            <input
              type="text"
              value={indicatorsText}
              onChange={(e) => setIndicatorsText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-[11px] focus:outline-hidden focus:border-primary"
              placeholder="e.g. 198.51.100.45, root, port 22"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-medium flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>Evidence Telemetry (JSON)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Structured payload</span>
            </div>
            <textarea
              rows={3}
              value={evidenceJson}
              onChange={(e) => setEvidenceJson(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono text-[11px] focus:outline-hidden focus:border-primary"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {submitting ? 'Registering...' : 'Register Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
