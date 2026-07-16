"use client";

import { useState } from "react";
import { X, Video, Loader2, Plus, Trash2 } from "lucide-react";
import { useCreateTelemedicineSession } from "@/src/hooks/nurses/use-referrals";

interface TelemedicineModalProps {
  referralId: string;
  referralDisplayId: string;
  onClose: () => void;
}

export default function TelemedicineModal({
  referralId,
  referralDisplayId,
  onClose,
}: TelemedicineModalProps) {
  const [title, setTitle] = useState(`Telemedicine Session - ${referralDisplayId}`);
  const [duration, setDuration] = useState(60);
  const [scheduledFor, setScheduledFor] = useState("");
  const [note, setNote] = useState("");
  
  // Dynamic fields
  const [participants, setParticipants] = useState<{ name: string; email: string; role: string; is_host: boolean }[]>([]);
  
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate: createSession, isPending } = useCreateTelemedicineSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const payload: any = {
      title: title || undefined,
      duration_minutes: duration || undefined,
      scheduled_for: scheduledFor ? new Date(scheduledFor).toISOString() : undefined,
    };

    const medical_data: Record<string, string> = {};
    if (note) medical_data.note = note;

    if (Object.keys(medical_data).length > 0) {
      payload.medical_data = medical_data;
    }

    const additional_participants = participants
      .filter((p) => p.name && p.email)
      .map((p) => ({
        name: p.name,
        email: p.email,
        role: p.role || "guest",
        is_host: p.is_host,
      }));

    if (additional_participants.length > 0) {
      payload.additional_participants = additional_participants;
    }

    createSession(
      { referralId, payload },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "Failed to create telemedicine session. Please try again.";
          setErrorMsg(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 p-6 pb-4 shrink-0">
          <div>
            <div className="mb-1 flex items-center gap-2 text-purple-600">
              <Video size={20} />
              <h2 className="text-xl font-semibold text-gray-900">
                Schedule Meeting
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Create a telemedicine session for this referral.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6">
          {errorMsg && (
            <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              {errorMsg}
            </div>
          )}

          <form id="telemedicine-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Initial Consultation"
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Scheduled Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Medical Data Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Medical Data</h3>
              
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  General Note
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Add clinical notes..."
                  className="w-full resize-none rounded-lg border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Additional Participants Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Additional Participants</h3>
                <button
                  type="button"
                  onClick={() => setParticipants([...participants, { name: "", email: "", role: "", is_host: false }])}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700"
                >
                  <Plus size={14} /> Add Participant
                </button>
              </div>

              {participants.length === 0 && (
                <p className="text-xs text-gray-500 italic">No additional participants added.</p>
              )}

              {participants.map((p, idx) => (
                <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Name *"
                        value={p.name}
                        onChange={(e) => {
                          const newParts = [...participants];
                          newParts[idx].name = e.target.value;
                          setParticipants(newParts);
                        }}
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                      />
                      <input
                        type="email"
                        placeholder="Email *"
                        value={p.email}
                        onChange={(e) => {
                          const newParts = [...participants];
                          newParts[idx].email = e.target.value;
                          setParticipants(newParts);
                        }}
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Role (e.g. nurse)"
                        value={p.role}
                        onChange={(e) => {
                          const newParts = [...participants];
                          newParts[idx].role = e.target.value;
                          setParticipants(newParts);
                        }}
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                      />
                      <label className="flex items-center gap-2 text-sm text-gray-700 bg-white rounded-md border border-gray-300 px-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={p.is_host}
                          onChange={(e) => {
                            const newParts = [...participants];
                            newParts[idx].is_host = e.target.checked;
                            setParticipants(newParts);
                          }}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        Make Host
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newParts = [...participants];
                        newParts.splice(idx, 1);
                        setParticipants(newParts);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 shrink-0 bg-white border border-gray-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 pt-4 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            form="telemedicine-form"
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 shadow-sm disabled:opacity-70"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {isPending ? "Creating..." : "Create Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
}
