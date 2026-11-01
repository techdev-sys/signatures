import {
  Bike,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  MoreHorizontal,
  Navigation,
  PackageCheck,
  Search,
  Star,
  UsersRound,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import './DriversPage.css';

type DriverStatus =
  | 'Available'
  | 'Delivering'
  | 'Offline';

type Driver = {
  id: string;
  name: string;
  initials: string;
  phone: string;
  vehicle: string;
  registration: string;
  rating: number;
  deliveriesToday: number;
  status: DriverStatus;
};

type DeliveryStatus =
  | 'Awaiting Driver'
  | 'Heading to Restaurant'
  | 'Picked Up'
  | 'On the Way';

type Delivery = {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  total: number;
  requested: string;
  status: DeliveryStatus;
  driverId?: string;
  eta?: string;
};

const initialDrivers: Driver[] = [
  {
    id: 'DRV-001',
    name: 'Tawanda Moyo',
    initials: 'TM',
    phone: '+263 77 000 2001',
    vehicle: 'Motorbike',
    registration: 'ABC 1234',
    rating: 4.9,
    deliveriesToday: 24,
    status: 'Available',
  },
  {
    id: 'DRV-002',
    name: 'Brian Ncube',
    initials: 'BN',
    phone: '+263 77 000 2002',
    vehicle: 'Motorbike',
    registration: 'ABD 4821',
    rating: 4.8,
    deliveriesToday: 18,
    status: 'Available',
  },
  {
    id: 'DRV-003',
    name: 'Simba Dube',
    initials: 'SD',
    phone: '+263 77 000 2003',
    vehicle: 'Motorbike',
    registration: 'ABE 9012',
    rating: 4.7,
    deliveriesToday: 16,
    status: 'Delivering',
  },
  {
    id: 'DRV-004',
    name: 'Kuda Ndlovu',
    initials: 'KN',
    phone: '+263 77 000 2004',
    vehicle: 'Motorbike',
    registration: 'ABF 3310',
    rating: 4.9,
    deliveriesToday: 21,
    status: 'Delivering',
  },
  {
    id: 'DRV-005',
    name: 'Tinashe Sibanda',
    initials: 'TS',
    phone: '+263 77 000 2005',
    vehicle: 'Motorbike',
    registration: 'ABG 7274',
    rating: 4.6,
    deliveriesToday: 9,
    status: 'Offline',
  },
];

const initialDeliveries: Delivery[] = [
  {
    id: 'DEL-1001',
    orderId: 'SIG-1022',
    customer: 'N. Dube',
    address: 'Hillside',
    total: 27.5,
    requested: '2 min ago',
    status: 'Awaiting Driver',
  },
  {
    id: 'DEL-1002',
    orderId: 'SIG-1019',
    customer: 'P. Ncube',
    address: 'Burnside',
    total: 21,
    requested: '9 min ago',
    status: 'Heading to Restaurant',
    driverId: 'DRV-003',
    eta: '6 min',
  },
  {
    id: 'DEL-1003',
    orderId: 'SIG-1017',
    customer: 'R. Moyo',
    address: 'Bulawayo CBD',
    total: 18.5,
    requested: '17 min ago',
    status: 'On the Way',
    driverId: 'DRV-004',
    eta: '8 min',
  },
];

function statusClass(value: string) {
  return value.toLowerCase().replaceAll(' ', '-');
}

export function DriversPage() {
  const [drivers, setDrivers] =
    useState<Driver[]>(initialDrivers);

  const [deliveries, setDeliveries] =
    useState<Delivery[]>(initialDeliveries);

  const [search, setSearch] = useState('');

  const [selectedDeliveryId, setSelectedDeliveryId] =
    useState<string | null>(null);

  const [selectedDriverId, setSelectedDriverId] =
    useState<string | null>(null);

  const selectedDelivery =
    deliveries.find(
      (delivery) =>
        delivery.id === selectedDeliveryId,
    ) ?? null;

  const selectedDriver =
    drivers.find(
      (driver) =>
        driver.id === selectedDriverId,
    ) ?? null;

  const availableDrivers = useMemo(
    () =>
      drivers.filter(
        (driver) =>
          driver.status === 'Available',
      ),
    [drivers],
  );

  const activeDeliveries = useMemo(
    () =>
      deliveries.filter(
        (delivery) =>
          delivery.status !==
          'Awaiting Driver',
      ),
    [deliveries],
  );

  const awaitingDeliveries = useMemo(
    () =>
      deliveries.filter(
        (delivery) =>
          delivery.status ===
          'Awaiting Driver',
      ),
    [deliveries],
  );

  const visibleDrivers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return drivers;
    }

    return drivers.filter(
      (driver) =>
        driver.name
          .toLowerCase()
          .includes(query) ||
        driver.id
          .toLowerCase()
          .includes(query) ||
        driver.registration
          .toLowerCase()
          .includes(query),
    );
  }, [drivers, search]);

  const assignDriver = (
    deliveryId: string,
    driverId: string,
  ) => {
    setDeliveries((current) =>
      current.map((delivery) =>
        delivery.id === deliveryId
          ? {
              ...delivery,
              driverId,
              status:
                'Heading to Restaurant',
              eta: '8 min',
            }
          : delivery,
      ),
    );

    setDrivers((current) =>
      current.map((driver) =>
        driver.id === driverId
          ? {
              ...driver,
              status: 'Delivering',
            }
          : driver,
      ),
    );

    setSelectedDeliveryId(null);
  };

  return (
    <div className="drivers-workspace">
      <section className="drivers-heading">
        <div>
          <span className="eyebrow">
            DELIVERY OPERATIONS
          </span>

          <h1>Drivers</h1>

          <p>
            Monitor driver availability,
            dispatches and active deliveries.
          </p>
        </div>

        <div className="dispatch-live">
          <span />
          DISPATCH LIVE
        </div>
      </section>

      <section className="driver-stats">
        <DriverStat
          label="Available"
          value={availableDrivers.length}
          detail="Ready for delivery"
          icon={<CheckCircle2 size={20} />}
        />

        <DriverStat
          label="Active deliveries"
          value={activeDeliveries.length}
          detail="Currently in progress"
          icon={<Bike size={20} />}
        />

        <DriverStat
          label="Awaiting driver"
          value={awaitingDeliveries.length}
          detail="Ready for dispatch"
          icon={<Clock3 size={20} />}
          warning
        />

        <DriverStat
          label="Drivers"
          value={
            drivers.filter(
              (driver) =>
                driver.status !== 'Offline',
            ).length
          }
          detail={`${drivers.length} registered`}
          icon={<UsersRound size={20} />}
        />
      </section>

      <div className="drivers-layout">
        <div className="drivers-main-column">
          <section className="driver-panel awaiting-panel">
            <div className="driver-panel-header">
              <div>
                <span className="driver-panel-label">
                  DISPATCH QUEUE
                </span>

                <h3>Awaiting assignment</h3>
              </div>

              <span className="queue-count">
                {awaitingDeliveries.length}
              </span>
            </div>

            {awaitingDeliveries.length === 0 ? (
              <div className="dispatch-empty">
                <PackageCheck size={23} />

                <strong>
                  Dispatch queue is clear
                </strong>

                <span>
                  New delivery requests will
                  appear here.
                </span>
              </div>
            ) : (
              <div className="dispatch-list">
                {awaitingDeliveries.map(
                  (delivery) => (
                    <article
                      className="dispatch-card"
                      key={delivery.id}
                    >
                      <div className="dispatch-order">
                        <div className="dispatch-icon">
                          <PackageCheck
                            size={18}
                          />
                        </div>

                        <div>
                          <span>ORDER</span>
                          <strong>
                            #
                            {
                              delivery.orderId
                            }
                          </strong>

                          <small>
                            {
                              delivery.requested
                            }
                          </small>
                        </div>
                      </div>

                      <div className="dispatch-customer">
                        <span>CUSTOMER</span>

                        <strong>
                          {delivery.customer}
                        </strong>

                        <small>
                          <MapPin size={11} />
                          {delivery.address}
                        </small>
                      </div>

                      <strong className="dispatch-total">
                        $
                        {delivery.total.toFixed(
                          2,
                        )}
                      </strong>

                      <button
                        className="assign-button"
                        onClick={() =>
                          setSelectedDeliveryId(
                            delivery.id,
                          )
                        }
                      >
                        Assign driver
                        <ChevronRight
                          size={15}
                        />
                      </button>
                    </article>
                  ),
                )}
              </div>
            )}
          </section>

          <section className="driver-panel">
            <div className="driver-panel-header">
              <div>
                <span className="driver-panel-label">
                  ON THE ROAD
                </span>

                <h3>Active deliveries</h3>
              </div>

              <button className="driver-text-button">
                View history
                <ChevronRight size={14} />
              </button>
            </div>

            {activeDeliveries.length ===
            0 ? (
              <div className="dispatch-empty">
                <Bike size={23} />
                <strong>
                  No active deliveries
                </strong>
              </div>
            ) : (
              <div className="active-deliveries">
                {activeDeliveries.map(
                  (delivery) => {
                    const driver =
                      drivers.find(
                        (item) =>
                          item.id ===
                          delivery.driverId,
                      );

                    return (
                      <article
                        className="active-delivery"
                        key={delivery.id}
                      >
                        <div className="active-delivery-top">
                          <div>
                            <span>
                              #
                              {
                                delivery.orderId
                              }
                            </span>

                            <strong>
                              {
                                delivery.customer
                              }
                            </strong>
                          </div>

                          <span
                            className={`delivery-status delivery-${statusClass(
                              delivery.status,
                            )}`}
                          >
                            <span />
                            {
                              delivery.status
                            }
                          </span>
                        </div>

                        <div className="delivery-route">
                          <div className="route-point">
                            <span className="route-dot restaurant" />

                            <div>
                              <span>
                                PICKUP
                              </span>

                              <strong>
                                Signatures
                                Bulawayo
                              </strong>
                            </div>
                          </div>

                          <div className="route-line" />

                          <div className="route-point">
                            <span className="route-dot customer" />

                            <div>
                              <span>
                                DELIVER TO
                              </span>

                              <strong>
                                {
                                  delivery.address
                                }
                              </strong>
                            </div>
                          </div>
                        </div>

                        <div className="active-driver-row">
                          <div className="small-avatar">
                            {driver?.initials ??
                              '--'}
                          </div>

                          <div>
                            <span>DRIVER</span>

                            <strong>
                              {driver?.name ??
                                'Finding driver'}
                            </strong>
                          </div>

                          {delivery.eta && (
                            <div className="delivery-eta">
                              <Navigation
                                size={13}
                              />
                              ETA{' '}
                              {delivery.eta}
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            )}
          </section>
        </div>

        <aside className="driver-panel driver-roster">
          <div className="driver-panel-header">
            <div>
              <span className="driver-panel-label">
                DRIVER NETWORK
              </span>

              <h3>Drivers</h3>
            </div>
          </div>

          <div className="driver-search">
            <Search size={15} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search drivers..."
            />
          </div>

          <div className="driver-list">
            {visibleDrivers.map(
              (driver) => (
                <button
                  className="driver-row"
                  key={driver.id}
                  onClick={() =>
                    setSelectedDriverId(
                      driver.id,
                    )
                  }
                >
                  <div className="driver-avatar">
                    {driver.initials}

                    <span
                      className={`driver-presence presence-${driver.status.toLowerCase()}`}
                    />
                  </div>

                  <div className="driver-row-info">
                    <strong>
                      {driver.name}
                    </strong>

                    <span>
                      {driver.vehicle} •{' '}
                      {driver.registration}
                    </span>

                    <small>
                      <Star size={11} />
                      {driver.rating.toFixed(
                        1,
                      )}
                      <span>•</span>
                      {
                        driver.deliveriesToday
                      }{' '}
                      today
                    </small>
                  </div>

                  <span
                    className={`driver-state state-${driver.status.toLowerCase()}`}
                  >
                    {driver.status}
                  </span>

                  <MoreHorizontal
                    size={16}
                  />
                </button>
              ),
            )}
          </div>
        </aside>
      </div>

      {selectedDelivery && (
        <>
          <button
            className="driver-modal-overlay"
            onClick={() =>
              setSelectedDeliveryId(null)
            }
            aria-label="Close driver assignment"
          />

          <aside className="assignment-drawer">
            <header>
              <div>
                <span>
                  MANUAL DISPATCH
                </span>

                <h2>
                  Assign #
                  {
                    selectedDelivery.orderId
                  }
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedDeliveryId(
                    null,
                  )
                }
              >
                <X size={20} />
              </button>
            </header>

            <div className="assignment-content">
              <div className="assignment-order">
                <div>
                  <span>CUSTOMER</span>
                  <strong>
                    {
                      selectedDelivery.customer
                    }
                  </strong>
                </div>

                <div>
                  <span>DESTINATION</span>
                  <strong>
                    {
                      selectedDelivery.address
                    }
                  </strong>
                </div>

                <div>
                  <span>ORDER TOTAL</span>
                  <strong>
                    $
                    {selectedDelivery.total.toFixed(
                      2,
                    )}
                  </strong>
                </div>
              </div>

              <div className="assignment-heading">
                <span>
                  AVAILABLE DRIVERS
                </span>

                <strong>
                  {
                    availableDrivers.length
                  }{' '}
                  online
                </strong>
              </div>

              <div className="assignment-drivers">
                {availableDrivers.length ===
                0 ? (
                  <div className="no-drivers">
                    <Bike size={25} />

                    <strong>
                      No drivers available
                    </strong>

                    <span>
                      Keep this order in the
                      dispatch queue.
                    </span>
                  </div>
                ) : (
                  availableDrivers.map(
                    (driver) => (
                      <button
                        key={driver.id}
                        onClick={() =>
                          assignDriver(
                            selectedDelivery.id,
                            driver.id,
                          )
                        }
                      >
                        <div className="driver-avatar">
                          {
                            driver.initials
                          }

                          <span className="driver-presence presence-available" />
                        </div>

                        <div>
                          <strong>
                            {driver.name}
                          </strong>

                          <span>
                            {driver.vehicle} •{' '}
                            {
                              driver.registration
                            }
                          </span>

                          <small>
                            <Star
                              size={11}
                            />
                            {
                              driver.rating
                            }{' '}
                            •{' '}
                            {
                              driver.deliveriesToday
                            }{' '}
                            today
                          </small>
                        </div>

                        <span className="assign-driver-action">
                          Assign
                          <ChevronRight
                            size={14}
                          />
                        </span>
                      </button>
                    ),
                  )
                )}
              </div>
            </div>
          </aside>
        </>
      )}

      {selectedDriver && (
        <>
          <button
            className="driver-modal-overlay"
            onClick={() =>
              setSelectedDriverId(null)
            }
            aria-label="Close driver details"
          />

          <aside className="assignment-drawer">
            <header>
              <div>
                <span>DRIVER PROFILE</span>
                <h2>
                  {selectedDriver.name}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedDriverId(null)
                }
              >
                <X size={20} />
              </button>
            </header>

            <div className="driver-profile-content">
              <div className="profile-driver-avatar">
                {selectedDriver.initials}
              </div>

              <h3>
                {selectedDriver.name}
              </h3>

              <span
                className={`driver-state state-${selectedDriver.status.toLowerCase()}`}
              >
                {selectedDriver.status}
              </span>

              <div className="driver-profile-stats">
                <div>
                  <Star size={17} />
                  <strong>
                    {selectedDriver.rating}
                  </strong>
                  <span>Rating</span>
                </div>

                <div>
                  <PackageCheck
                    size={17}
                  />
                  <strong>
                    {
                      selectedDriver.deliveriesToday
                    }
                  </strong>
                  <span>Today</span>
                </div>
              </div>

              <div className="driver-details">
                <div>
                  <span>Driver ID</span>
                  <strong>
                    {selectedDriver.id}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>
                    {
                      selectedDriver.phone
                    }
                  </strong>
                </div>

                <div>
                  <span>Vehicle</span>
                  <strong>
                    {
                      selectedDriver.vehicle
                    }
                  </strong>
                </div>

                <div>
                  <span>Registration</span>
                  <strong>
                    {
                      selectedDriver.registration
                    }
                  </strong>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function DriverStat({
  label,
  value,
  detail,
  icon,
  warning = false,
}: {
  label: string;
  value: number;
  detail: string;
  icon: React.ReactNode;
  warning?: boolean;
}) {
  return (
    <article
      className={`driver-stat ${
        warning ? 'driver-stat-warning' : ''
      }`}
    >
      <div>
        <span>{label}</span>
        <div>{icon}</div>
      </div>

      <strong>{value}</strong>

      <small>{detail}</small>
    </article>
  );
}
