import { useCallback, useEffect, useState } from 'react'
import {
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  MessageSquarePlus,
  Phone,
  RefreshCw,
  Search,
  UserCheck,
  X,
} from 'lucide-react'
import {
  ENQUIRY_STATUSES,
  SERVICES_CATALOG,
} from '../../../data/servicesCatalog.js'
import {
  getServiceEnquiries,
  getServiceEnquiryAssignees,
  getServiceEnquiryById,
  updateServiceEnquiry,
} from '../../../utils/serviceEnquiryStorage.js'

const PAGE_SIZE = 10

const STATUS_BADGE_CLASSES = {
  NEW: 'bg-sky-50 text-sky-800 border-sky-200',
  CONTACTED: 'bg-amber-50 text-amber-800 border-amber-200',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  QUOTED: 'bg-purple-50 text-purple-800 border-purple-200',
  CONVERTED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  CLOSED: 'bg-slate-100 text-slate-700 border-slate-300',
}

function formatDateTime(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return String(iso)
  }
}

export default function ServiceEnquiriesPage({ onUnreadCountChange }) {
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState({
    totalAll: 0,
    unreadCount: 0,
    statusCounts: {},
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  })
  const [assignees, setAssignees] = useState([])

  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedEntry, setSelectedEntry] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [detailNotice, setDetailNotice] = useState('')

  const [editStatus, setEditStatus] = useState('NEW')
  const [editAssigneeId, setEditAssigneeId] = useState('')
  const [noteInput, setNoteInput] = useState('')

  const loadList = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getServiceEnquiries({
        page,
        limit: PAGE_SIZE,
        q: searchQuery,
        status: statusFilter,
        serviceSlug: serviceFilter,
        unreadOnly,
      })
      setRows(Array.isArray(data.rows) ? data.rows : [])
      if (data.pagination) setPagination(data.pagination)
      if (data.summary) {
        setSummary(data.summary)
        onUnreadCountChange?.(data.summary.unreadCount || 0)
      }
    } catch (err) {
      setError(err?.message || 'Unable to load service enquiries.')
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, statusFilter, serviceFilter, unreadOnly, onUnreadCountChange])

  useEffect(() => {
    loadList()
  }, [loadList])

  useEffect(() => {
    let mounted = true
    getServiceEnquiryAssignees()
      .then((users) => {
        if (mounted) setAssignees(users)
      })
      .catch(() => {
        if (mounted) setAssignees([])
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => {
      setPage(1)
      setSearchQuery(searchInput)
    }, 300)
    return () => window.clearTimeout(t)
  }, [searchInput])

  const openDetail = async (row) => {
    setSelectedEntry(row)
    setEditStatus(row.status || 'NEW')
    setEditAssigneeId(row.assignedTo?.userId ? String(row.assignedTo.userId) : '')
    setNoteInput('')
    setDetailError('')
    setDetailNotice('')
    setDetailLoading(true)
    try {
      let fresh = await getServiceEnquiryById(row._id)
      if (!fresh.isReadByAdmin) {
        fresh = await updateServiceEnquiry(row._id, { isReadByAdmin: true })
        loadList()
      }
      setSelectedEntry(fresh)
      setEditStatus(fresh.status || 'NEW')
      setEditAssigneeId(
        fresh.assignedTo?.userId ? String(fresh.assignedTo.userId) : ''
      )
    } catch (err) {
      setDetailError(err?.message || 'Unable to load full enquiry details.')
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSaveChanges = async (event) => {
    event.preventDefault()
    if (!selectedEntry?._id || saving) return

    setSaving(true)
    setDetailError('')
    setDetailNotice('')
    try {
      const payload = {
        status: editStatus,
        assignedToUserId: editAssigneeId || null,
        isReadByAdmin: true,
      }
      if (noteInput.trim()) {
        payload.internalNote = noteInput.trim()
      }
      const updated = await updateServiceEnquiry(selectedEntry._id, payload)
      setSelectedEntry(updated)
      setEditStatus(updated.status || 'NEW')
      setEditAssigneeId(
        updated.assignedTo?.userId ? String(updated.assignedTo.userId) : ''
      )
      setNoteInput('')
      setDetailNotice('Enquiry updated successfully.')
      loadList()
    } catch (err) {
      setDetailError(err?.message || 'Failed to update enquiry.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-4">
      {/* Status Summary Strip */}
      <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-7">
        <button
          type="button"
          onClick={() => {
            setStatusFilter('')
            setPage(1)
          }}
          className={`rounded-2xl border p-3 text-left transition ${
            statusFilter === ''
              ? 'border-[#092754] bg-[#092754] text-white'
              : 'border-[#e2d2ae] bg-[#fffdf8] text-[#092754] hover:bg-[#fff8e9]'
          }`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
            All Enquiries
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {summary.totalAll || 0}
          </p>
        </button>

        {ENQUIRY_STATUSES.map((status) => {
          const active = statusFilter === status
          return (
            <button
              key={status}
              type="button"
              onClick={() => {
                setStatusFilter(active ? '' : status)
                setPage(1)
              }}
              className={`rounded-2xl border p-3 text-left transition ${
                active
                  ? 'border-[#092754] bg-[#092754] text-white'
                  : 'border-[#e2d2ae] bg-[#fffdf8] text-[#092754] hover:bg-[#fff8e9]'
              }`}
            >
              <p className="truncate text-[11px] font-semibold uppercase tracking-wide opacity-80">
                {status.replace('_', ' ')}
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {summary.statusCounts?.[status] ?? 0}
              </p>
            </button>
          )
        })}
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e2d2ae] bg-[#fffdf8] p-3.5">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8c5e0f]"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search ref code, client, business, mobile, city, service…"
            aria-label="Search service enquiries"
            className="w-full rounded-xl border border-[#d5c5a3] bg-white py-2 pr-3 pl-9 text-sm text-[#111d36] outline-none focus:border-[#092754]"
          />
        </div>

        <select
          value={serviceFilter}
          onChange={(e) => {
            setServiceFilter(e.target.value)
            setPage(1)
          }}
          aria-label="Filter by service"
          className="rounded-xl border border-[#d5c5a3] bg-white px-3 py-2 text-sm text-[#111d36] outline-none focus:border-[#092754]"
        >
          <option value="">All 15 Services</option>
          {SERVICES_CATALOG.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          aria-label="Filter by status"
          className="rounded-xl border border-[#d5c5a3] bg-white px-3 py-2 text-sm text-[#111d36] outline-none focus:border-[#092754]"
        >
          <option value="">All Statuses</option>
          {ENQUIRY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#e2d2ae] bg-[#fff8e9] px-3 py-2 text-xs font-semibold text-[#092754]">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => {
              setUnreadOnly(e.target.checked)
              setPage(1)
            }}
            className="accent-[#092754]"
          />
          Unread ({summary.unreadCount || 0})
        </label>

        <button
          type="button"
          onClick={loadList}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e2d2ae] bg-[#fff8e9] px-3 py-2 text-xs font-semibold text-[#092754] hover:bg-[#f5e6c4]"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {error ? (
        <article className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </article>
      ) : null}

      {/* Enquiries Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e2d2ae] bg-[#fffdf8]">
        {loading ? (
          <div className="p-8 text-center text-sm text-[#455168]">
            Loading service enquiries…
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#455168]">
            No service enquiries match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead className="border-b border-[#e2d2ae] bg-[#fff8e9] text-xs uppercase tracking-wide text-[#092754]">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assigned</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr
                    key={row._id}
                    className={`transition hover:bg-slate-50/90 ${
                      !row.isReadByAdmin ? 'bg-sky-50/40' : ''
                    }`}
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-900">
                        {!row.isReadByAdmin ? (
                          <span
                            className="h-2 w-2 rounded-full bg-sky-600"
                            title="Unread enquiry"
                          />
                        ) : null}
                        {row.referenceCode}
                      </div>
                      <span className="mt-1 inline-block text-[11px] text-slate-500">
                        {row.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top font-semibold text-slate-800">
                      {row.serviceName}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p className="font-semibold text-slate-900">{row.fullName}</p>
                      {row.businessName ? (
                        <p className="text-xs text-slate-500">{row.businessName}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-slate-600">
                      <p>{row.mobile}</p>
                      {row.email ? <p className="truncate max-w-[180px]">{row.email}</p> : null}
                      <p className="text-[11px] text-slate-400">
                        Prefers: {row.contactPreference}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                          STATUS_BADGE_CLASSES[row.status] ||
                          STATUS_BADGE_CLASSES.NEW
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-slate-600">
                      {row.assignedTo?.name || row.assignedTo?.email || 'Unassigned'}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-slate-500">
                      {formatDateTime(row.submittedAt || row.createdAt)}
                    </td>
                    <td className="px-4 py-3 align-top text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(row)}
                        className="rounded-lg bg-[#092754] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#10376e]"
                      >
                        View / Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          <span>
            Showing {rows.length} of {pagination.total} enquiries (Page{' '}
            {pagination.page} of {pagination.totalPages})
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold disabled:opacity-45"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold disabled:opacity-45"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Enquiry Detail & Management Modal */}
      {selectedEntry ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-5"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) setSelectedEntry(null)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Enquiry ${selectedEntry.referenceCode}`}
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#e2d2ae] bg-[#fffdf8] shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#e2d2ae] bg-[#fff8e9] px-5 py-4">
              <div>
                <p className="font-mono text-xs font-semibold text-[#8c5e0f]">
                  {selectedEntry.referenceCode}
                </p>
                <h2 className="text-lg font-bold text-[#092754]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  {selectedEntry.serviceName} — {selectedEntry.fullName}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close enquiry detail"
                onClick={() => setSelectedEntry(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5 text-sm">
              {detailLoading ? (
                <p className="text-slate-500">Refreshing enquiry details…</p>
              ) : null}

              {detailError ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                  {detailError}
                </p>
              ) : null}

              {detailNotice ? (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  {detailNotice}
                </p>
              ) : null}

              <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone size={15} className="text-[#044b47]" />
                  <span>
                    <strong>Mobile:</strong> {selectedEntry.mobile}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail size={15} className="text-[#044b47]" />
                  <span>
                    <strong>Email:</strong> {selectedEntry.email || '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Briefcase size={15} className="text-[#044b47]" />
                  <span>
                    <strong>Business:</strong>{' '}
                    {selectedEntry.businessName || '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin size={15} className="text-[#044b47]" />
                  <span>
                    <strong>City:</strong> {selectedEntry.city || '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock size={15} className="text-[#044b47]" />
                  <span>
                    <strong>Deadline:</strong>{' '}
                    {selectedEntry.preferredDeadline || '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <UserCheck size={15} className="text-[#044b47]" />
                  <span>
                    <strong>Contact Pref:</strong>{' '}
                    {selectedEntry.contactPreference} ·{' '}
                    <strong>Budget:</strong>{' '}
                    {selectedEntry.estimatedBudget || '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 sm:col-span-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>
                    Consent recorded:{' '}
                    {selectedEntry.consentAccepted ? 'Yes' : 'No'} · Submitted{' '}
                    {formatDateTime(
                      selectedEntry.submittedAt || selectedEntry.createdAt
                    )}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Project Requirement
                </h3>
                <p className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-slate-800">
                  {selectedEntry.requirement}
                </p>
              </div>

              <form
                onSubmit={handleSaveChanges}
                className="space-y-3 rounded-xl border border-[#e2d2ae] bg-[#fff8e9]/70 p-4"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="admin-enq-status"
                      className="mb-1 block text-xs font-semibold text-slate-700"
                    >
                      Enquiry Status
                    </label>
                    <select
                      id="admin-enq-status"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
                    >
                      {ENQUIRY_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="admin-enq-assignee"
                      className="mb-1 block text-xs font-semibold text-slate-700"
                    >
                      Assign To (Admin Users)
                    </label>
                    <select
                      id="admin-enq-assignee"
                      value={editAssigneeId}
                      onChange={(e) => setEditAssigneeId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
                    >
                      <option value="">Unassigned</option>
                      {assignees.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name ? `${u.name} (${u.email})` : u.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="admin-enq-note"
                    className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700"
                  >
                    <MessageSquarePlus size={14} /> Add Internal Note (Optional)
                  </label>
                  <textarea
                    id="admin-enq-note"
                    rows={2}
                    maxLength={1000}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Record call summary, quote details, or follow-up plan…"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEntry(null)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-[#092754] px-4 py-2 text-xs font-semibold text-white hover:bg-[#10376e] disabled:opacity-50"
                  >
                    {saving ? 'Saving…' : 'Save Update'}
                  </button>
                </div>
              </form>

              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Internal Notes History (
                  {selectedEntry.internalNotes?.length || 0})
                </h3>
                {selectedEntry.internalNotes?.length ? (
                  <ul className="space-y-2">
                    {[...selectedEntry.internalNotes]
                      .reverse()
                      .map((item, idx) => (
                        <li
                          key={item._id || idx}
                          className="rounded-xl border border-slate-200 bg-white p-3 text-xs"
                        >
                          <p className="text-slate-800">{item.note}</p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {item.addedByName || item.addedByEmail || 'Admin'} ·{' '}
                            {formatDateTime(item.createdAt)}
                          </p>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">
                    No internal notes added yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
