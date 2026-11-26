import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MonitorCog,
  Search,
  Settings,
  BadgeIndianRupee,
  Activity,
  Menu,
  ChevronLeft,
  ChevronDown,
  MessageSquare,
  CalendarDays,
  Layers,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import logo from '../../assets/icons-opt/logo.webp'
import LoadingScreen from '../LoadingScreen.jsx'
import CommunityJoinEntries from './landing/CommunityJoinEntries.jsx'
import ServiceEnquiriesPage from './landing/ServiceEnquiriesPage.jsx'
import { getCommunityJoinSubmissions } from '../../utils/communityJoinStorage.js'
import { getServiceEnquiries } from '../../utils/serviceEnquiryStorage.js'
import PaymentsPage from './payments/PaymentsPage'
import ReportsPage from './reports/ReportsPage'
import SettingsPage from './settings/SettingsPage'
import AboutCmsPage from '../../pages/admin/about/AboutCmsPage.jsx'
import ExpertiseCmsPage from '../../pages/admin/expertise/ExpertiseCmsPage.jsx'
import ProcessCmsPage from '../../pages/admin/process/ProcessCmsPage.jsx'
import ServicesCmsPage from '../../pages/admin/services/ServicesCmsPage.jsx'
import CaseStudyCmsPage from '../../pages/admin/caseStudy/CaseStudyCmsPage.jsx'
import FaqCmsPage from '../../pages/admin/faq/FaqCmsPage.jsx'
import HeroLeftCmsPage from '../../pages/admin/heroLeft/HeroLeftCmsPage.jsx'
import { clearMasterAdminSession } from '../../utils/masterAdminAuth.js'

const sideMenu = [
  {
    group: 'MAIN MENU',
    items: [
      'Dashboard',
      {
        label: 'Manage Landing Page',
        children: [
          'Hero left CMS',
          'About CMS',
          'Expertise CMS',
          'Process CMS',
          'Services CMS',
          'Case study CMS',
          'FAQ CMS',
        ],
      },
      'Community applications',
      'Service enquiries',
    ],
  },
  { group: 'COMPLIANCE', items: ['Payments', 'Reports', 'Settings'] },
]

/** CMS sections under “Manage Landing Page” — keep submenu open when one is active */
const LANDING_CMS_SECTIONS = [
  'Hero left CMS',
  'About CMS',
  'Expertise CMS',
  'Process CMS',
  'Services CMS',
  'Case study CMS',
  'FAQ CMS',
]

const itemIcon = {
  Dashboard: LayoutDashboard,
  'Manage Landing Page': MonitorCog,
  'Hero left CMS': ClipboardList,
  'About CMS': ClipboardList,
  'Expertise CMS': ClipboardList,
  'Process CMS': ClipboardList,
  'Services CMS': ClipboardList,
  'Case study CMS': ClipboardList,
  'FAQ CMS': ClipboardList,
  'Community applications': ClipboardList,
  'Service enquiries': MessageSquare,
  Payments: BadgeIndianRupee,
  Reports: Activity,
  Settings: Settings,
}

function formatShortWhen(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return '—'
  }
}

function submissionTimestamp(row) {
  const raw = row?.submittedAt || row?.createdAt
  if (!raw) return NaN
  const t = new Date(raw).getTime()
  return Number.isFinite(t) ? t : NaN
}

const DASHBOARD_POLL_MS = 10_000

function DashboardHome({ onNavigate }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statsUpdatedAt, setStatsUpdatedAt] = useState('')

  const reload = useCallback(async () => {
    try {
      setError('')
      const data = await getCommunityJoinSubmissions()
      setRows(Array.isArray(data) ? data : [])
      setStatsUpdatedAt(new Date().toISOString())
    } catch (err) {
      setError(err?.message || 'Unable to load enquiries')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()

    const poll = () => {
      if (document.visibilityState === 'visible') reload()
    }
    const id = setInterval(poll, DASHBOARD_POLL_MS)
    document.addEventListener('visibilitychange', poll)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', poll)
    }
  }, [reload])

  const stats = useMemo(() => {
    const startToday = new Date()
    startToday.setHours(0, 0, 0, 0)
    const todayStart = startToday.getTime()
    const monthMs = 30 * 24 * 60 * 60 * 1000
    const monthCut = Date.now() - monthMs

    let today = 0
    let last30 = 0
    let fromHome = 0
    let fromBuilding = 0

    for (const row of rows) {
      const t = submissionTimestamp(row)
      if (!Number.isFinite(t)) continue
      if (t >= todayStart) today++
      if (t >= monthCut) last30++
      if (row.source === 'building-creativity') fromBuilding++
      else fromHome++
    }

    const sorted = [...rows].sort((a, b) => submissionTimestamp(b) - submissionTimestamp(a))
    const latest = sorted[0] || null

    return {
      today,
      last30Days: last30,
      total: rows.length,
      fromHome,
      fromBuilding,
      latest,
    }
  }, [rows])

  const highlights = useMemo(() => {
    const items = []
    if (stats.today > 0) {
      items.push(`${stats.today} new ${stats.today === 1 ? 'enquiry' : 'enquiries'} today — review in Community applications.`)
    } else {
      items.push('No new enquiries yet today. Hero and Building Creativity forms feed this inbox.')
    }
    items.push(
      `Last 30 days: ${stats.last30Days} total — home hero vs dedicated landing tracked separately.`,
    )
    if (stats.latest && Number.isFinite(submissionTimestamp(stats.latest))) {
      items.push(`Latest lead: ${stats.latest.fullName || '—'} · ${formatShortWhen(stats.latest.submittedAt || stats.latest.createdAt)}`)
    } else {
      items.push('Share the site link to start collecting community join applications.')
    }
    return items
  }, [stats])

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[#e2d2ae] bg-gradient-to-br from-[#092754] via-[#10376e] to-[#061c3d] p-4 text-white shadow-sm sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-[#f3cf6d]/35">
              <Sparkles size={20} className="text-[#f3cf6d]" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug">Scholars Mediatech · Lead overview</p>
              <p className="mt-1 text-xs leading-relaxed text-white/80">
                Same community join forms as the public site: home hero (&quot;Join community&quot;) and{' '}
                <span className="font-medium text-[#f3cf6d]">/building-creativity</span>. Counts use each submission&apos;s
                date.
              </p>
              {statsUpdatedAt ? (
                <p className="mt-2 text-[11px] text-white/55">Updated {formatShortWhen(statsUpdatedAt)}</p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setLoading(true)
              reload()
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/15"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <article className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</article>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[#e2d2ae] bg-[#fffdf8] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#092754]">
            <MessageSquare size={16} className="text-[#8c5e0f]" />
            Today&apos;s enquiries
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-[#092754]">
            {loading ? '—' : stats.today}
          </p>
          <p className="mt-1 text-sm text-[#455168]">Calendar day (your local time)</p>
        </article>

        <article className="rounded-2xl border border-[#e2d2ae] bg-[#fffdf8] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#092754]">
            <CalendarDays size={16} className="text-[#8c5e0f]" />
            Last 30 days
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-[#092754]">
            {loading ? '—' : stats.last30Days}
          </p>
          <p className="mt-1 text-sm text-[#455168]">Rolling month of submissions</p>
        </article>

        <article className="rounded-2xl border border-[#e2d2ae] bg-[#fffdf8] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#092754]">
            <Layers size={16} className="text-[#8c5e0f]" />
            All-time total
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-[#092754]">
            {loading ? '—' : stats.total}
          </p>
          <p className="mt-1 text-sm text-[#455168]">Every stored application</p>
        </article>

        <article className="rounded-2xl border border-[#e2d2ae] bg-[#fffdf8] p-4">
          <p className="text-sm font-semibold text-[#092754]">By source</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-[#fff8e9] px-3 py-2 border border-[#ede1c6]">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#455168]">Home hero</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-[#092754]">
                {loading ? '—' : stats.fromHome}
              </p>
            </div>
            <div className="rounded-xl bg-[#fff8e9] px-3 py-2 border border-[#ede1c6]">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#455168]">Building Creativity</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-[#092754]">
                {loading ? '—' : stats.fromBuilding}
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,320px)]">
        <article className="rounded-2xl border border-[#e2d2ae] bg-[#fffdf8] p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-[#092754]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>What to do next</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-1">
            {highlights.map((item) => (
              <p key={item} className="rounded-xl bg-[#fff8e9] border border-[#ede1c6] px-3 py-3 text-sm leading-relaxed text-[#25334a]">
                {item}
              </p>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onNavigate?.('Service enquiries')}
              className="inline-flex items-center gap-2 rounded-full bg-[#092754] px-4 py-2 text-sm font-medium text-white hover:bg-[#10376e]"
            >
              Open Service enquiries
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('Community applications')}
              className="inline-flex items-center gap-2 rounded-full border border-[#e2d2ae] bg-white px-4 py-2 text-sm font-medium text-[#092754] hover:bg-[#fff8e9]"
            >
              Community applications
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('Hero left CMS')}
              className="inline-flex items-center gap-2 rounded-full border border-[#e2d2ae] bg-white px-4 py-2 text-sm font-medium text-[#092754] hover:bg-[#fff8e9]"
            >
              Hero left CMS
            </button>
          </div>
        </article>

        <article className="rounded-2xl border border-[#e2d2ae] bg-[#fffdf8] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[#092754]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Recent enquiries</h2>
            {!loading && rows.length > 0 ? (
              <button
                type="button"
                onClick={() => onNavigate?.('Community applications')}
                className="text-xs font-semibold text-[#8c5e0f] hover:underline"
              >
                View all
              </button>
            ) : null}
          </div>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              No submissions yet. When visitors use the join form on the landing page, they appear here.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {rows.slice(0, 5).map((row) => (
                <li
                  key={row.id || row._id || `${row.workEmail}-${row.submittedAt}`}
                  className="rounded-xl border border-[#ede1c6] bg-[#fff8e9]/70 px-3 py-2.5 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#092754]">{row.fullName || '—'}</p>
                      <p className="truncate text-xs text-[#8c5e0f]">{row.workEmail || '—'}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-[#455168] ring-1 ring-[#e2d2ae]">
                      {row.source === 'building-creativity' ? 'Landing' : 'Home'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#455168]">{formatShortWhen(row.submittedAt || row.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  )
}

export default function MasterDashboard() {
  const [activeSection, setActiveSection] = useState('Dashboard')
  const [sectionLoading, setSectionLoading] = useState(true)
  const [adminEmail, setAdminEmail] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [landingMenuOpen, setLandingMenuOpen] = useState(false)
  const [unreadEnquiries, setUnreadEnquiries] = useState(0)

  const refreshUnreadEnquiries = useCallback(async () => {
    try {
      const data = await getServiceEnquiries({ page: 1, limit: 1, unreadOnly: true })
      setUnreadEnquiries(data?.summary?.unreadCount || 0)
    } catch {
      // ignore background poll failures
    }
  }, [])

  useEffect(() => {
    refreshUnreadEnquiries()
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') refreshUnreadEnquiries()
    }, DASHBOARD_POLL_MS)
    return () => window.clearInterval(id)
  }, [refreshUnreadEnquiries])

  useEffect(() => {
    try {
      const adminData = localStorage.getItem('__master_admin__')
      if (adminData) {
        const parsed = JSON.parse(adminData)
        setAdminEmail(parsed.email || '')
      }
    } catch {
      setAdminEmail('')
    }
  }, [])

  useEffect(() => {
    setSectionLoading(true)
    const timeout = window.setTimeout(() => setSectionLoading(false), 450)
    return () => window.clearTimeout(timeout)
  }, [activeSection])

  useEffect(() => {
    setSidebarOpen(false)
  }, [activeSection])

  useEffect(() => {
    if (LANDING_CMS_SECTIONS.includes(activeSection)) {
      setLandingMenuOpen(true)
    }
  }, [activeSection])

  const handleSignOut = () => {
    clearMasterAdminSession()
    window.location.href = '/master-admin'
  }

  const sectionHeading = useMemo(() => {
    if (activeSection === 'Dashboard') {
      return 'Enquiry pulse from your public site: today’s count, last 30 days, and quick links to CMS and applications.'
    }
    if (activeSection === 'Community applications') {
      return 'Review community join form submissions from public forms.'
    }
    if (activeSection === 'Service enquiries') {
      return 'Manage incoming client service enquiries, status pipeline, assignments and internal notes.'
    }
    if (activeSection === 'Hero left CMS') {
      return 'Control landing hero headline, body copy, bullets and CTAs on the left column.'
    }
    if (activeSection === 'About CMS') {
      return 'Control About section content, status and visibility from one place.'
    }
    if (activeSection === 'Expertise CMS') {
      return 'Control Expertise section cards, heading, status and visibility.'
    }
    if (activeSection === 'Process CMS') {
      return 'Control Process section steps, heading, status and visibility.'
    }
    if (activeSection === 'Services CMS') {
      return 'Control Services section cards, headings, status and visibility.'
    }
    if (activeSection === 'Case study CMS') {
      return 'Control case study highlight strip, metrics and visibility.'
    }
    if (activeSection === 'FAQ CMS') {
      return 'Control FAQ questions, answers and visibility.'
    }
    return `${activeSection} management with realistic demo data for ready frontend presentation.`
  }, [activeSection])

  const sectionComponentMap = {
    Dashboard: <DashboardHome onNavigate={setActiveSection} />,
    'Hero left CMS': <HeroLeftCmsPage />,
    'About CMS': <AboutCmsPage />,
    'Expertise CMS': <ExpertiseCmsPage />,
    'Process CMS': <ProcessCmsPage />,
    'Services CMS': <ServicesCmsPage />,
    'Case study CMS': <CaseStudyCmsPage />,
    'FAQ CMS': <FaqCmsPage />,
    'Community applications': <CommunityJoinEntries />,
    'Service enquiries': (
      <ServiceEnquiriesPage onUnreadCountChange={setUnreadEnquiries} />
    ),
    Payments: <PaymentsPage />,
    Reports: <ReportsPage />,
    Settings: <SettingsPage />,
  }

  return (
    <section className="min-h-screen w-full bg-[#fff8e9]">
      <div className="relative grid min-h-screen w-full grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] lg:h-screen">
        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-[#092754]/45 lg:hidden"
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex h-full max-h-[100dvh] w-[82%] max-w-[320px] flex-col overflow-hidden border-r border-[#e2d2ae] bg-[#fffdf8] p-4 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:min-h-0 lg:w-72 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:p-5 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex shrink-0 items-center gap-2.5 border-b border-[#ede1c6] pb-3.5">
            <img
              src={logo}
              alt="Scholars Mediatech"
              className="h-9 w-11 shrink-0 object-contain"
            />
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="truncate text-[15px] font-extrabold leading-snug tracking-tight text-[#092754]">
                Scholars <span className="text-[#8c5e0f]">Mediatech</span>
              </p>
              <p className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.06em] text-[#455168]">
                Master Admin
              </p>
            </div>
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e2d2ae] bg-white text-[#092754] lg:hidden"
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          <div className="mt-5 min-h-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(9,39,84,0.28)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#092754]/22 hover:[&::-webkit-scrollbar-thumb]:bg-[#092754]/38">
            {sideMenu.map((menu) => (
              <div key={menu.group}>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8c5e0f]">
                  {menu.group}
                </p>
                <div className="space-y-1.5">
                  {menu.items.map((item) => {
                    if (typeof item === 'string') {
                      const Icon = itemIcon[item]
                      const active = item === activeSection
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setActiveSection(item)}
                          className={`flex w-full min-w-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                            active ? 'bg-[#092754] text-white shadow-sm' : 'text-[#111d36] hover:bg-[#fff8e9]'
                          }`}
                        >
                          <Icon size={16} className="shrink-0" />
                          <span className="min-w-0 flex-1 truncate">{item}</span>
                          {item === 'Service enquiries' && unreadEnquiries > 0 ? (
                            <span className="shrink-0 rounded-full bg-[#c28b22] px-1.5 py-0.5 text-[10px] font-bold text-[#092754]">
                              {unreadEnquiries}
                            </span>
                          ) : null}
                        </button>
                      )
                    }

                    const parentActive = item.children.includes(activeSection)
                    return (
                      <div key={item.label}>
                        <button
                          type="button"
                          onClick={() => setLandingMenuOpen((prev) => !prev)}
                          className={`flex w-full min-w-0 items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                            parentActive ? 'bg-[#092754] text-white' : 'text-[#111d36] hover:bg-[#fff8e9]'
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <MonitorCog size={16} className="shrink-0" />
                            <span className="min-w-0 truncate">{item.label}</span>
                          </span>
                          <ChevronDown
                            size={14}
                            className={`shrink-0 opacity-90 transition-transform ${landingMenuOpen ? 'rotate-180' : ''}`}
                          />
                        </button>

                        {landingMenuOpen ? (
                          <div className="mt-1 ml-3 space-y-1">
                            {item.children.map((child) => {
                              const childActive = child === activeSection
                              return (
                                <button
                                  key={child}
                                  type="button"
                                  onClick={() => setActiveSection(child)}
                                  className={`flex w-full min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                                    childActive
                                      ? 'border border-[#e2d2ae] bg-[#fff8e9] text-[#8c5e0f]'
                                      : 'text-[#455168] hover:bg-[#fff8e9]'
                                  }`}
                                >
                                  <ClipboardList size={14} className="shrink-0" />
                                  <span className="min-w-0 truncate">{child}</span>
                                </button>
                              )
                            })}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="min-h-screen w-full min-w-0 bg-[#fffaf0] p-3 sm:p-4 lg:h-screen lg:overflow-y-auto lg:p-6">
          {/* Mobile / tablet top bar */}
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-[#e2d2ae] bg-[#fffdf8] px-2.5 py-2 sm:px-3 lg:hidden">
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e2d2ae] text-[#092754]"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#092754]">{activeSection}</p>
              <p className="truncate text-[11px] text-[#455168]">{adminEmail || 'master-admin'}</p>
            </div>
            <button
              type="button"
              aria-label={`Service enquiry notifications (${unreadEnquiries} unread)`}
              onClick={() => setActiveSection('Service enquiries')}
              className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e2d2ae] bg-white text-[#092754]"
            >
              <Bell size={16} />
              {unreadEnquiries > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#c28b22] px-1 text-[10px] font-bold text-[#092754]">
                  {unreadEnquiries}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-[#092754] px-2.5 text-xs font-semibold text-white sm:px-3"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>

          {/* Desktop toolbar */}
          <div className="mb-4 hidden items-center justify-between gap-3 lg:flex">
            <div className="flex min-w-0 max-w-md flex-1 items-center gap-3 rounded-full border border-[#e2d2ae] bg-[#fffdf8] px-3.5 py-2 text-sm text-[#455168]">
              <Search size={16} className="shrink-0 text-[#8c5e0f]" />
              <span className="truncate">Search CMS sections, applications, enquiries…</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label={`Service enquiry notifications (${unreadEnquiries} unread)`}
                onClick={() => setActiveSection('Service enquiries')}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e2d2ae] bg-[#fffdf8] text-[#092754] hover:bg-[#fff8e9]"
              >
                <Bell size={16} />
                {unreadEnquiries > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#c28b22] px-1 text-[10px] font-bold text-[#092754]">
                    {unreadEnquiries}
                  </span>
                ) : null}
              </button>
              <div
                className="max-w-[220px] truncate rounded-full border border-[#e2d2ae] bg-[#fffdf8] px-3 py-2 text-sm font-medium text-[#092754]"
                title={adminEmail || 'master-admin'}
              >
                {adminEmail || 'master-admin'}
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#092754] px-4 py-2 text-sm font-semibold text-white hover:bg-[#10376e]"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile / tablet search */}
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-[#e2d2ae] bg-[#fffdf8] px-3 py-2.5 text-sm text-[#455168] lg:hidden">
            <Search size={16} className="shrink-0 text-[#8c5e0f]" />
            <span className="min-w-0 truncate">Search CMS sections, applications, enquiries…</span>
          </div>

          <div className="mb-4">
            <h1 className="text-lg font-extrabold text-[#092754] sm:text-xl lg:text-2xl" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{activeSection}</h1>
            <p className="mt-1 text-xs leading-relaxed text-[#455168] sm:text-sm">{sectionHeading}</p>
          </div>

          {sectionLoading ? (
            <LoadingScreen />
          ) : (
            sectionComponentMap[activeSection]
          )}
        </main>
      </div>
    </section>
  )
}
