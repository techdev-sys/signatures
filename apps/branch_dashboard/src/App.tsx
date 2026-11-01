import { MenuPage } from './features/menu/MenuPage';
import { OrdersPage } from './features/orders/OrdersPage';
import { DriversPage } from './features/drivers/DriversPage';
import {
  Bell,
  Bike,
  CheckCircle2,
  ChevronRight,
  Clock3,
  History,
  LayoutDashboard,
  Menu as MenuIcon,
  PackageCheck,
  ReceiptText,
  Search,
  Settings,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  X,
} from 'lucide-react';

import { useState } from 'react';
import './App.css';

type NavItem =
  | 'Overview'
  | 'Orders'
  | 'Menu'
  | 'Drivers'
  | 'History'
  | 'Settings';

type OrderStatus = 'New' | 'Preparing' | 'Ready';

type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: OrderStatus;
  time: string;
};

const orders: Order[] = [
  {
    id: 'SIG-1024',
    customer: 'T. Moyo',
    items: 3,
    total: 28.5,
    status: 'New',
    time: '2 min ago',
  },
  {
    id: 'SIG-1023',
    customer: 'N. Dube',
    items: 2,
    total: 17,
    status: 'Preparing',
    time: '8 min ago',
  },
  {
    id: 'SIG-1022',
    customer: 'K. Ndlovu',
    items: 4,
    total: 32.5,
    status: 'Ready',
    time: '14 min ago',
  },
  {
    id: 'SIG-1021',
    customer: 'R. Sibanda',
    items: 1,
    total: 12,
    status: 'Preparing',
    time: '18 min ago',
  },
];

const navItems = [
  {
    label: 'Overview' as NavItem,
    icon: LayoutDashboard,
  },
  {
    label: 'Orders' as NavItem,
    icon: ReceiptText,
    badge: '12',
  },
  {
    label: 'Menu' as NavItem,
    icon: UtensilsCrossed,
  },
  {
    label: 'Drivers' as NavItem,
    icon: Bike,
  },
  {
    label: 'History' as NavItem,
    icon: History,
  },
];

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  return (
    <span
      className={`status status-${status
        .toLowerCase()
        .replace(' ', '-')}`}
    >
      <span className="status-dot" />
      {status}
    </span>
  );
}

function App() {
  const [activePage, setActivePage] =
    useState<NavItem>('Overview');

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const selectPage = (page: NavItem) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="app">
      {sidebarOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${
          sidebarOpen ? 'sidebar-open' : ''
        }`}
      >
        <div className="brand">
          <div className="brand-mark">S</div>

          <div>
            <div className="brand-name">
              Signatures
            </div>
            <div className="brand-subtitle">
              Branch Operations
            </div>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="branch-card">
          <div className="branch-icon">
            <Store size={19} />
          </div>

          <div className="branch-info">
            <span className="branch-label">
              CURRENT BRANCH
            </span>
            <strong>Signatures Bulawayo</strong>
            <span className="online">
              <span />
              Open for orders
            </span>
          </div>
        </div>

        <nav className="navigation">
          <span className="nav-label">
            OPERATIONS
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`nav-item ${
                  activePage === item.label
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  selectPage(item.label)
                }
              >
                <Icon size={19} />

                <span>{item.label}</span>

                {item.badge && (
                  <span className="nav-badge">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            className={`nav-item ${
              activePage === 'Settings'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              selectPage('Settings')
            }
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="user-card">
            <div className="avatar">BM</div>

            <div className="user-info">
              <strong>Branch Manager</strong>
              <span>Manager account</span>
            </div>

            <ChevronRight size={17} />
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <MenuIcon size={22} />
            </button>

            <div>
              <span className="mobile-brand">
                SIGNATURES
              </span>

              <h2>{activePage}</h2>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="search">
              <Search size={17} />
              <input
                placeholder="Search orders..."
              />
              <span>Ã¢Å’Ëœ K</span>
            </div>

            <button className="icon-button">
              <Bell size={20} />
              <span className="notification-dot" />
            </button>
          </div>
        </header>

        <div className="page">
          {activePage === 'Overview' && (
            <Overview />
          )}

          {activePage === 'Orders' && (
            <OrdersPage />
          )}

          {activePage === 'Menu' && (
            <MenuPage />
          )}

          {activePage === 'Drivers' && (
            <DriversPage />
          )}

          {activePage !== 'Overview' &&
            activePage !== 'Orders' &&
            activePage !== 'Menu' &&
            activePage !== 'Drivers' && (
              <ComingSoon page={activePage} />
            )}
        </div>
      </main>
    </div>
  );
}

function Overview() {
  return (
    <>
      <section className="welcome">
        <div>
          <span className="eyebrow">
            TUESDAY Ã‚Â· BRANCH OPERATIONS
          </span>

          <h1>
            Good afternoon,
            <br />
            Signatures Bulawayo.
          </h1>

          <p>
            Here&apos;s what&apos;s happening at
            your restaurant today.
          </p>
        </div>

        <button className="primary-button">
          <ReceiptText size={18} />
          View all orders
        </button>
      </section>

      <section className="stats-grid">
        <StatCard
          label="New orders"
          value="12"
          detail="+4 in the last hour"
          icon={<ShoppingBag size={21} />}
          accent
        />

        <StatCard
          label="Preparing"
          value="8"
          detail="Kitchen is active"
          icon={<Clock3 size={21} />}
        />

        <StatCard
          label="Ready"
          value="4"
          detail="Awaiting pickup"
          icon={<PackageCheck size={21} />}
        />

        <StatCard
          label="Completed today"
          value="47"
          detail="$684.50 revenue"
          icon={<CheckCircle2 size={21} />}
        />
      </section>

      <div className="dashboard-grid">
        <section className="panel orders-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">
                LIVE
              </span>
              <h3>Current orders</h3>
            </div>

            <button className="text-button">
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>ITEMS</th>
                  <th>STATUS</th>
                  <th>TOTAL</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="order-id">
                        <strong>
                          #{order.id}
                        </strong>
                        <span>{order.time}</span>
                      </div>
                    </td>

                    <td>{order.customer}</td>

                    <td>
                      {order.items}{' '}
                      {order.items === 1
                        ? 'item'
                        : 'items'}
                    </td>

                    <td>
                      <StatusBadge
                        status={order.status}
                      />
                    </td>

                    <td>
                      <strong>
                        $
                        {order.total.toFixed(
                          2,
                        )}
                      </strong>
                    </td>

                    <td>
                      <button className="row-action">
                        <ChevronRight
                          size={18}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="right-column">
          <section className="panel activity-panel">
            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">
                  TODAY
                </span>
                <h3>Branch pulse</h3>
              </div>
            </div>

            <div className="pulse">
              <div className="pulse-ring">
                <strong>92%</strong>
                <span>On time</span>
              </div>

              <div className="pulse-stats">
                <div>
                  <span>Avg. prep</span>
                  <strong>18 min</strong>
                </div>

                <div>
                  <span>Avg. order</span>
                  <strong>$14.56</strong>
                </div>

                <div>
                  <span>Drivers</span>
                  <strong>6 online</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="panel quick-panel">
            <span className="panel-eyebrow">
              QUICK ACTION
            </span>

            <h3>Restaurant status</h3>

            <div className="restaurant-status">
              <div>
                <strong>
                  Accepting orders
                </strong>
                <span>
                  Customers can place new orders
                </span>
              </div>

              <button className="toggle">
                <span />
              </button>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <article
      className={`stat-card ${
        accent ? 'stat-accent' : ''
      }`}
    >
      <div className="stat-top">
        <span>{label}</span>
        <div className="stat-icon">
          {icon}
        </div>
      </div>

      <strong className="stat-value">
        {value}
      </strong>

      <span className="stat-detail">
        {detail}
      </span>
    </article>
  );
}

function ComingSoon({
  page,
}: {
  page: NavItem;
}) {
  return (
    <div className="coming-soon">
      <div className="coming-icon">
        <UtensilsCrossed size={28} />
      </div>

      <h1>{page}</h1>

      <p>
        We&apos;ll build the {page.toLowerCase()}{' '}
        workspace next.
      </p>
    </div>
  );
}

export default App;

