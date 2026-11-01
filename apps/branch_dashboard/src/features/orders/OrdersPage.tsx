import {
  Check,
  ChevronRight,
  Clock3,
  PackageCheck,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getBranchOrders,
  requestDriver as requestDriverApi,
  updateOrderStatus as updateOrderStatusApi,
  type ApiOrder,
} from '../../services/ordersApi';

export type BranchOrderStatus =
  | 'New'
  | 'Preparing'
  | 'Ready'
  | 'Awaiting Driver'
  | 'Driver Assigned'
  | 'Heading to Restaurant'
  | 'Arrived at Restaurant'
  | 'Picked Up'
  | 'On the Way'
  | 'Delivered'
  | 'Completed'
  | 'Rejected';

export type BranchOrderItem = {
  name: string;
  quantity: number;
  options?: string;
  price: number;
};

export type BranchOrder = {
  id: string;
  customer: string;
  phone: string;
  createdAt: string;
  elapsed: string;
  status: BranchOrderStatus;
  type: 'Delivery' | 'Pickup';
  address?: string;
  paymentMethod: string;
  items: BranchOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  driver?: {
    name: string;
    code: string;
  };
};

type Filter =
  | 'All'
  | 'New'
  | 'Preparing'
  | 'Ready'
  | 'Awaiting Driver';

const filters: Filter[] = [
  'All',
  'New',
  'Preparing',
  'Ready',
  'Awaiting Driver',
];

function statusClass(status: BranchOrderStatus) {
  return status.toLowerCase().replaceAll(' ', '-');
}

function mapApiStatus(
  status: string,
): BranchOrderStatus {
  switch (status) {
    case 'confirmed':
      return 'New';

    case 'preparing':
      return 'Preparing';

    case 'ready':
      return 'Ready';

    case 'awaiting_driver':
      return 'Awaiting Driver';

    case 'driver_assigned':
      return 'Driver Assigned';

    case 'heading_to_restaurant':
      return 'Heading to Restaurant';

    case 'arrived_at_restaurant':
      return 'Arrived at Restaurant';

    case 'picked_up':
      return 'Picked Up';

    case 'on_the_way':
      return 'On the Way';

    case 'delivered':
      return 'Delivered';

    case 'completed':
      return 'Completed';

    case 'rejected':
    case 'cancelled':
      return 'Rejected';

    default:
      return 'New';
  }
}

function formatElapsed(createdAt: string) {
  const created = new Date(createdAt);
  const now = new Date();

  const difference =
    now.getTime() - created.getTime();

  const minutes = Math.max(
    0,
    Math.floor(difference / 60000),
  );

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes === 1) {
    return '1 min ago';
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours === 1) {
    return '1 hr ago';
  }

  if (hours < 24) {
    return `${hours} hrs ago`;
  }

  return created.toLocaleDateString();
}

function mapApiOrder(
  order: ApiOrder,
): BranchOrder {
  const created = new Date(order.created_at);

  const delivery = Array.isArray(order.deliveries)
    ? order.deliveries[0]
    : order.deliveries;

  const assignedDriver = Array.isArray(
    delivery?.drivers,
  )
    ? delivery.drivers[0]
    : delivery?.drivers;

  return {
    id: order.order_number,

    customer: order.customer_name,

    phone:
      order.customer_phone ??
      'No phone provided',

    createdAt: created.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),

    elapsed: formatElapsed(order.created_at),

    status: mapApiStatus(
      delivery?.status ?? order.status,
    ),

    type:
      order.order_type === 'delivery'
        ? 'Delivery'
        : 'Pickup',

    address:
      order.delivery_address ?? undefined,

    paymentMethod:
      order.payment_method ?? 'Not specified',

    items: order.order_items.map((item) => ({
      name: item.item_name,
      quantity: item.quantity,

      options:
        item.variant_name ?? undefined,

      price: Number(item.total_price),
    })),

    subtotal: Number(order.subtotal),

    deliveryFee: Number(
      order.delivery_fee,
    ),

    total: Number(order.total),

    driver: assignedDriver
      ? {
          name: assignedDriver.full_name,
          code: assignedDriver.driver_code,
        }
      : undefined,
  };
}

export function OrdersPage() {
  const [orders, setOrders] =
    useState<BranchOrder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [filter, setFilter] =
    useState<Filter>('All');

  const [search, setSearch] = useState('');

  const [selectedOrderId, setSelectedOrderId] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let firstLoad = true;
    let requestInFlight = false;

    async function loadOrders() {
      if (requestInFlight) {
        return;
      }

      requestInFlight = true;

      try {
        if (firstLoad) {
          setLoading(true);
          setLoadError(null);
        }

        const response =
          await getBranchOrders(
            'SIG-CHT-001',
          );

        if (cancelled) {
          return;
        }

        const mappedOrders =
          response.data.map(mapApiOrder);

        setOrders(mappedOrders);
        setLoadError(null);
      } catch (error) {
        console.error(
          'Failed to load orders:',
          error,
        );

        if (!cancelled && firstLoad) {
          setLoadError(
            'Could not load branch orders.',
          );
        }
      } finally {
        if (!cancelled && firstLoad) {
          setLoading(false);
        }

        firstLoad = false;
        requestInFlight = false;
      }
    }

    loadOrders();

    const refreshInterval = window.setInterval(
      loadOrders,
      5000,
    );

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') {
        loadOrders();
      }
    };

    document.addEventListener(
      'visibilitychange',
      refreshWhenVisible,
    );

    return () => {
      cancelled = true;
      window.clearInterval(refreshInterval);
      document.removeEventListener(
        'visibilitychange',
        refreshWhenVisible,
      );
    };
  }, []);

  const selectedOrder =
    orders.find(
      (order) => order.id === selectedOrderId,
    ) ?? null;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        filter === 'All' ||
        order.status === filter;

      const query = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, filter, search]);

  const counts = useMemo(
    () => ({
      All: orders.filter(
        (order) =>
          order.status !== 'Completed' &&
          order.status !== 'Delivered' &&
          order.status !== 'Rejected',
      ).length,

      New: orders.filter(
        (order) => order.status === 'New',
      ).length,

      Preparing: orders.filter(
        (order) =>
          order.status === 'Preparing',
      ).length,

      Ready: orders.filter(
        (order) => order.status === 'Ready',
      ).length,

      'Awaiting Driver': orders.filter(
        (order) =>
          order.status === 'Awaiting Driver',
      ).length,
    }),
    [orders],
  );

  const updateStatus = (
    orderId: string,
    status: BranchOrderStatus,
  ) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
            }
          : order,
      ),
    );
  };

  const acceptOrder = async (
    orderId: string,
  ) => {
    try {
      await updateOrderStatusApi(
        orderId,
        'preparing',
      );

      updateStatus(
        orderId,
        'Preparing',
      );
    } catch (error) {
      console.error(
        'Failed to accept order:',
        error,
      );

      window.alert(
        'Could not accept the order. Please try again.',
      );
    }
  };

  const rejectOrder = async (
    orderId: string,
  ) => {
    try {
      await updateOrderStatusApi(
        orderId,
        'rejected',
      );

      updateStatus(
        orderId,
        'Rejected',
      );
    } catch (error) {
      console.error(
        'Failed to reject order:',
        error,
      );

      window.alert(
        'Could not reject the order. Please try again.',
      );
    }
  };

  const markReady = async (
    orderId: string,
  ) => {
    try {
      await updateOrderStatusApi(
        orderId,
        'ready',
      );

      updateStatus(
        orderId,
        'Ready',
      );
    } catch (error) {
      console.error(
        'Failed to mark order ready:',
        error,
      );

      window.alert(
        'Could not mark the order as ready.',
      );
    }
  };

  const completePickup = async (
    orderId: string,
  ) => {
    try {
      await updateOrderStatusApi(
        orderId,
        'completed',
      );

      updateStatus(
        orderId,
        'Completed',
      );
    } catch (error) {
      console.error(
        'Failed to complete pickup:',
        error,
      );

      window.alert(
        'Could not complete the pickup order.',
      );
    }
  };

  const requestDriver = async (
    orderId: string,
  ) => {
    try {
      await requestDriverApi(orderId);

      updateStatus(
        orderId,
        'Awaiting Driver',
      );
    } catch (error) {
      console.error(
        'Failed to request driver:',
        error,
      );

      window.alert(
        'Could not request a driver. Please try again.',
      );
    }
  };

  return (
    <div className="orders-workspace">
      <section className="orders-heading">
        <div>
          <span className="eyebrow">
            LIVE OPERATIONS
          </span>

          <h1>Orders</h1>

          <p>
            Manage incoming orders and kitchen
            progress from one place.
          </p>
        </div>

        <div className="orders-live">
          <span className="live-dot" />
          LIVE
        </div>
      </section>

      <section className="order-filter-card">
        <div className="order-filters">
          {filters.map((item) => (
            <button
              key={item}
              className={`order-filter ${
                filter === item
                  ? 'order-filter-active'
                  : ''
              }`}
              onClick={() => setFilter(item)}
            >
              {item}

              <span>{counts[item]}</span>
            </button>
          ))}
        </div>

        <div className="orders-search">
          <Search size={16} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search order or customer..."
          />
        </div>
      </section>

      {loading ? (
        <section className="orders-empty">
          <div>
            <Clock3 size={26} />
          </div>

          <h3>Loading orders...</h3>

          <p>
            Fetching the latest Chitungwiza orders.
          </p>
        </section>
      ) : loadError ? (
        <section className="orders-empty">
          <div>
            <X size={26} />
          </div>

          <h3>Unable to load orders</h3>

          <p>{loadError}</p>
        </section>
      ) : filteredOrders.length === 0 ? (
        <section className="orders-empty">
          <div>
            <ShoppingBag size={26} />
          </div>

          <h3>No orders here</h3>

          <p>
            Orders matching this filter will
            appear here.
          </p>
        </section>
      ) : (
        <section className="order-list">
          {filteredOrders.map((order) => (
            <article
              key={order.id}
              className={`branch-order-card ${
                order.status === 'New'
                  ? 'branch-order-new'
                  : ''
              }`}
            >
              <button
                className="order-card-main"
                onClick={() =>
                  setSelectedOrderId(order.id)
                }
              >
                <div className="order-card-number">
                  <div
                    className={`order-type-icon ${
                      order.status === 'New'
                        ? 'new'
                        : ''
                    }`}
                  >
                    <ShoppingBag size={18} />
                  </div>

                  <div>
                    <strong>
                      #{order.id}
                    </strong>

                    <span>
                      {order.elapsed} •{' '}
                      {order.type}
                    </span>
                  </div>
                </div>

                <div className="order-customer">
                  <span>CUSTOMER</span>
                  <strong>
                    {order.customer}
                  </strong>
                </div>

                <div className="order-item-summary">
                  <span>ORDER</span>

                  <strong>
                    {order.items.reduce(
                      (total, item) =>
                        total +
                        item.quantity,
                      0,
                    )}{' '}
                    items
                  </strong>
                </div>

                <div className="order-tracking-cell">
                  <span
                    className={`branch-status status-${statusClass(
                      order.status,
                    )}`}
                  >
                    <span />
                    {order.status}
                  </span>

                  {order.driver && (
                    <span className="order-driver-name">
                      Driver assigned · {order.driver.name}
                    </span>
                  )}
                </div>

                <strong className="order-total">
                  ${order.total.toFixed(2)}
                </strong>

                <ChevronRight
                  size={19}
                  className="order-chevron"
                />
              </button>

              {order.status === 'New' && (
                <div className="new-order-actions">
                  <button
                    className="reject-button"
                    onClick={() =>
                      rejectOrder(order.id)
                    }
                  >
                    <X size={16} />
                    Reject
                  </button>

                  <button
                    className="accept-button"
                    onClick={() =>
                      acceptOrder(order.id)
                    }
                  >
                    <Check size={16} />
                    Accept order
                  </button>
                </div>
              )}

              {order.status ===
                'Preparing' && (
                <div className="new-order-actions">
                  <div className="kitchen-message">
                    <Clock3 size={16} />
                    Kitchen is preparing this order
                  </div>

                  <button
                    className="accept-button"
                    onClick={() =>
                      markReady(order.id)
                    }
                  >
                    <PackageCheck size={16} />
                    Mark ready
                  </button>
                </div>
              )}

              {order.status === 'Ready' && (
                <div className="new-order-actions">
                  <div className="kitchen-message ready">
                    <PackageCheck size={16} />
                    Food is packed and ready
                  </div>

                  {order.type ===
                  'Delivery' ? (
                    <button
                      className="accept-button"
                      onClick={() =>
                        requestDriver(
                          order.id,
                        )
                      }
                    >
                      Request driver
                      <ChevronRight
                        size={16}
                      />
                    </button>
                  ) : (
                    <button
                      className="accept-button"
                      onClick={() =>
                        completePickup(order.id)
                      }
                    >
                      Complete pickup
                    </button>
                  )}
                </div>
              )}
            </article>
          ))}
        </section>
      )}

      {selectedOrder && (
        <>
          <button
            className="drawer-overlay"
            aria-label="Close order details"
            onClick={() =>
              setSelectedOrderId(null)
            }
          />

          <aside className="order-drawer">
            <div className="drawer-header">
              <div>
                <span className="drawer-label">
                  ORDER
                </span>

                <h2>
                  #{selectedOrder.id}
                </h2>
              </div>

              <button
                className="drawer-close"
                onClick={() =>
                  setSelectedOrderId(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="drawer-content">
              <div className="drawer-status-row">
                <span
                  className={`branch-status status-${statusClass(
                    selectedOrder.status,
                  )}`}
                >
                  <span />
                  {selectedOrder.status}
                </span>

                <span>
                  {selectedOrder.elapsed}
                </span>
              </div>

              <section className="drawer-section">
                <span className="drawer-section-label">
                  CUSTOMER
                </span>

                <div className="customer-box">
                  <div className="customer-avatar">
                    <UserRound size={20} />
                  </div>

                  <div>
                    <strong>
                      {selectedOrder.customer}
                    </strong>

                    <span>
                      {selectedOrder.phone}
                    </span>
                  </div>
                </div>
              </section>

              <section className="drawer-section">
                <span className="drawer-section-label">
                  ORDER ITEMS
                </span>

                <div className="drawer-items">
                  {selectedOrder.items.map(
                    (item, index) => (
                      <div
                        className="drawer-item"
                        key={`${item.name}-${index}`}
                      >
                        <div className="item-quantity">
                          {item.quantity}×
                        </div>

                        <div className="drawer-item-info">
                          <strong>
                            {item.name}
                          </strong>

                          {item.options && (
                            <span>
                              {item.options}
                            </span>
                          )}
                        </div>

                        <strong>
                          $
                          {item.price.toFixed(
                            2,
                          )}
                        </strong>
                      </div>
                    ),
                  )}
                </div>
              </section>

              <section className="drawer-section">
                <span className="drawer-section-label">
                  FULFILMENT
                </span>

                <div className="fulfilment-box">
                  <div>
                    <span>Type</span>
                    <strong>
                      {selectedOrder.type}
                    </strong>
                  </div>

                  {selectedOrder.address && (
                    <div>
                      <span>Deliver to</span>
                      <strong>
                        {
                          selectedOrder.address
                        }
                      </strong>
                    </div>
                  )}

                  <div>
                    <span>Payment</span>
                    <strong>
                      {
                        selectedOrder.paymentMethod
                      }
                    </strong>
                  </div>
                </div>
              </section>

              {selectedOrder.driver && (
                <section className="drawer-section">
                  <span className="drawer-section-label">
                    DRIVER ASSIGNED
                  </span>

                  <div className="customer-box">
                    <div className="customer-avatar">
                      <UserRound size={20} />
                    </div>

                    <div>
                      <strong>
                        {selectedOrder.driver.name}
                      </strong>

                      <span>
                        {selectedOrder.driver.code}
                      </span>
                    </div>
                  </div>
                </section>
              )}

              <section className="drawer-section">
                <span className="drawer-section-label">
                  TOTAL
                </span>

                <div className="drawer-prices">
                  <div>
                    <span>Subtotal</span>
                    <strong>
                      $
                      {selectedOrder.subtotal.toFixed(
                        2,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Delivery</span>
                    <strong>
                      $
                      {selectedOrder.deliveryFee.toFixed(
                        2,
                      )}
                    </strong>
                  </div>

                  <div className="drawer-total">
                    <span>Total</span>
                    <strong>
                      $
                      {selectedOrder.total.toFixed(
                        2,
                      )}
                    </strong>
                  </div>
                </div>
              </section>
            </div>

            <div className="drawer-actions">
              {selectedOrder.status ===
                'New' && (
                <>
                  <button
                    className="reject-button drawer-action"
                    onClick={() =>
                      rejectOrder(
                        selectedOrder.id,
                      )
                    }
                  >
                    <X size={17} />
                    Reject
                  </button>

                  <button
                    className="accept-button drawer-action primary"
                    onClick={() =>
                      acceptOrder(
                        selectedOrder.id,
                      )
                    }
                  >
                    <Check size={17} />
                    Accept order
                  </button>
                </>
              )}

              {selectedOrder.status ===
                'Preparing' && (
                <button
                  className="accept-button drawer-action primary"
                  onClick={() =>
                    markReady(
                      selectedOrder.id,
                    )
                  }
                >
                  <PackageCheck size={17} />
                  Mark order ready
                </button>
              )}

              {selectedOrder.status ===
                'Ready' &&
                selectedOrder.type ===
                  'Delivery' && (
                  <button
                    className="accept-button drawer-action primary"
                    onClick={() =>
                      requestDriver(
                        selectedOrder.id,
                      )
                    }
                  >
                    Request a driver
                    <ChevronRight
                      size={17}
                    />
                  </button>
                )}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
