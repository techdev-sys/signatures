import {
  Beer,
  ChevronDown,
  Coffee,
  Edit3,
  GlassWater,
  Martini,
  Plus,
  Search,
  UtensilsCrossed,
  Wine,
  X,
} from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import './MenuPage.css';

type Department = 'Food' | 'Drinks';

type PriceVariant = {
  id: string;
  label: string;
  price: number;
};

type MenuItem = {
  id: string;
  name: string;
  department: Department;
  category: string;
  description: string;
  price: number;
  available: boolean;
  variants?: PriceVariant[];
};

const initialMenu: MenuItem[] = [
  // FOOD
  {
    id: 'food-001',
    name: 'Beef Stew & Sadza',
    department: 'Food',
    category: 'Traditional & Local',
    description:
      'Slow-cooked beef stew served with sadza and seasonal vegetables.',
    price: 8.5,
    available: true,
  },
  {
    id: 'food-002',
    name: 'Roadrunner & Sadza',
    department: 'Food',
    category: 'Traditional & Local',
    description:
      'Traditional free-range chicken served with sadza and vegetables.',
    price: 10,
    available: true,
  },
  {
    id: 'food-003',
    name: 'Oxtail & Sadza',
    department: 'Food',
    category: 'Traditional & Local',
    description:
      'Slow-cooked oxtail served with sadza and vegetables.',
    price: 12,
    available: true,
  },
  {
    id: 'food-004',
    name: 'Goat Stew',
    department: 'Food',
    category: 'Traditional & Local',
    description:
      'Tender goat stew served with your choice of starch.',
    price: 10.5,
    available: true,
  },
  {
    id: 'food-005',
    name: 'Matemba & Sadza',
    department: 'Food',
    category: 'Traditional & Local',
    description:
      'Traditional dried fish served with sadza and vegetables.',
    price: 7.5,
    available: true,
  },
  {
    id: 'food-006',
    name: 'T-Bone Steak',
    department: 'Food',
    category: 'Grills & Braai',
    description:
      'Flame-grilled T-bone steak served with a side.',
    price: 14,
    available: true,
  },
  {
    id: 'food-007',
    name: 'Grilled Chicken',
    department: 'Food',
    category: 'Grills & Braai',
    description:
      'Marinated chicken grilled over an open flame.',
    price: 9,
    available: true,
  },
  {
    id: 'food-008',
    name: 'Pork Chops',
    department: 'Food',
    category: 'Grills & Braai',
    description:
      'Seasoned pork chops grilled and served with a side.',
    price: 11,
    available: true,
  },
  {
    id: 'food-009',
    name: 'Boerewors',
    department: 'Food',
    category: 'Grills & Braai',
    description:
      'Grilled boerewors served with your choice of side.',
    price: 8,
    available: true,
  },
  {
    id: 'food-010',
    name: 'Mixed Grill',
    department: 'Food',
    category: 'Platters',
    description:
      'A selection of grilled meats made for a hearty meal.',
    price: 18,
    available: true,
  },
  {
    id: 'food-011',
    name: 'Chicken Platter',
    department: 'Food',
    category: 'Platters',
    description:
      'Grilled chicken portions with chips and accompaniments.',
    price: 16,
    available: true,
  },
  {
    id: 'food-012',
    name: 'Fish & Chips',
    department: 'Food',
    category: 'Fish',
    description:
      'Crispy fish fillet served with golden chips.',
    price: 9.5,
    available: false,
  },
  {
    id: 'food-013',
    name: 'Sadza',
    department: 'Food',
    category: 'Sides',
    description: 'Traditional maize meal sadza.',
    price: 2,
    available: true,
  },
  {
    id: 'food-014',
    name: 'Chips',
    department: 'Food',
    category: 'Sides',
    description: 'Crispy golden chips.',
    price: 3,
    available: true,
  },
  {
    id: 'food-015',
    name: 'Traditional Vegetables',
    department: 'Food',
    category: 'Sides',
    description: 'Seasonal traditional vegetables.',
    price: 2.5,
    available: true,
  },

  // DRINKS
  {
    id: 'drink-001',
    name: 'Lager',
    department: 'Drinks',
    category: 'Lagers & Beers',
    description:
      'Chilled lager beer. Brand selection subject to availability.',
    price: 2,
    variants: [{ id: 'bottle', label: 'Bottle', price: 2 }],
    available: true,
  },
  {
    id: 'drink-002',
    name: 'Premium Lager',
    department: 'Drinks',
    category: 'Lagers & Beers',
    description: 'Premium chilled lager.',
    price: 2.5,
    variants: [{ id: 'bottle', label: 'Bottle', price: 2.5 }],
    available: true,
  },
  {
    id: 'drink-003',
    name: 'Dry Cider',
    department: 'Drinks',
    category: 'Ciders',
    description: 'Chilled dry cider.',
    price: 2.5,
    variants: [{ id: 'bottle', label: 'Bottle', price: 2.5 }],
    available: true,
  },
  {
    id: 'drink-004',
    name: 'Sweet Cider',
    department: 'Drinks',
    category: 'Ciders',
    description: 'Chilled fruit cider.',
    price: 2.5,
    variants: [{ id: 'bottle', label: 'Bottle', price: 2.5 }],
    available: true,
  },
  {
    id: 'drink-005',
    name: 'House Whisky',
    department: 'Drinks',
    category: 'Whisky',
    description:
      'House whisky selection served by measure.',
    price: 3,
    variants: [
      { id: 'single', label: 'Single', price: 3 },
      { id: 'double', label: 'Double', price: 5.5 },
      { id: 'bottle', label: 'Bottle', price: 35 },
    ],
    available: true,
  },
  {
    id: 'drink-006',
    name: 'Premium Whisky',
    department: 'Drinks',
    category: 'Whisky',
    description:
      'Premium whisky selection served by measure.',
    price: 5,
    variants: [{ id: 'single', label: 'Single', price: 5 }],
    available: true,
  },
  {
    id: 'drink-007',
    name: 'Vodka',
    department: 'Drinks',
    category: 'Vodka',
    description: 'Vodka served by measure.',
    price: 3,
    variants: [{ id: 'single', label: 'Single', price: 3 }],
    available: true,
  },
  {
    id: 'drink-008',
    name: 'Gin',
    department: 'Drinks',
    category: 'Gin',
    description: 'Gin served by measure.',
    price: 3,
    variants: [{ id: 'single', label: 'Single', price: 3 }],
    available: true,
  },
  {
    id: 'drink-009',
    name: 'Brandy',
    department: 'Drinks',
    category: 'Brandy',
    description: 'Brandy served by measure.',
    price: 3,
    variants: [{ id: 'single', label: 'Single', price: 3 }],
    available: true,
  },
  {
    id: 'drink-010',
    name: 'Rum',
    department: 'Drinks',
    category: 'Rum & Spirits',
    description: 'House rum served by measure.',
    price: 3,
    variants: [{ id: 'single', label: 'Single', price: 3 }],
    available: true,
  },
  {
    id: 'drink-011',
    name: 'Red Wine',
    department: 'Drinks',
    category: 'Wine',
    description: 'House red wine.',
    price: 4,
    variants: [
      { id: 'glass', label: 'Glass', price: 4 },
      { id: 'bottle', label: 'Bottle', price: 18 },
    ],
    available: true,
  },
  {
    id: 'drink-012',
    name: 'White Wine',
    department: 'Drinks',
    category: 'Wine',
    description: 'House white wine.',
    price: 4,
    variants: [
      { id: 'glass', label: 'Glass', price: 4 },
      { id: 'bottle', label: 'Bottle', price: 18 },
    ],
    available: true,
  },
  {
    id: 'drink-013',
    name: 'RosÃ© Wine',
    department: 'Drinks',
    category: 'Wine',
    description: 'House rosÃ© wine.',
    price: 4,
    variants: [
      { id: 'glass', label: 'Glass', price: 4 },
      { id: 'bottle', label: 'Bottle', price: 18 },
    ],
    available: true,
  },
  {
    id: 'drink-014',
    name: 'House Cocktail',
    department: 'Drinks',
    category: 'Cocktails',
    description: 'Signature house cocktail.',
    price: 5,
    variants: [{ id: 'glass', label: 'Glass', price: 5 }],
    available: true,
  },
  {
    id: 'drink-015',
    name: 'Soft Drink',
    department: 'Drinks',
    category: 'Soft Drinks & Mixers',
    description:
      'Selection of carbonated soft drinks.',
    price: 1.5,
    variants: [{ id: 'bottle', label: 'Bottle', price: 1.5 }],
    available: true,
  },
  {
    id: 'drink-016',
    name: 'Bottled Water',
    department: 'Drinks',
    category: 'Water',
    description: 'Chilled bottled water.',
    price: 1,
    variants: [{ id: 'bottle', label: 'Bottle', price: 1 }],
    available: true,
  },
];

const foodCategories = [
  'All',
  'Traditional & Local',
  'Grills & Braai',
  'Platters',
  'Fish',
  'Sides',
];

const drinkCategories = [
  'All',
  'Lagers & Beers',
  'Ciders',
  'Whisky',
  'Vodka',
  'Gin',
  'Brandy',
  'Rum & Spirits',
  'Wine',
  'Cocktails',
  'Soft Drinks & Mixers',
  'Water',
];

function categoryIcon(category: string) {
  if (
    category.includes('Wine') ||
    category === 'Wine'
  ) {
    return <Wine size={19} />;
  }

  if (
    category.includes('Lager') ||
    category === 'Ciders'
  ) {
    return <Beer size={19} />;
  }

  if (
    category === 'Whisky' ||
    category === 'Vodka' ||
    category === 'Gin' ||
    category === 'Brandy' ||
    category.includes('Spirits') ||
    category === 'Cocktails'
  ) {
    return <Martini size={19} />;
  }

  if (
    category.includes('Soft') ||
    category === 'Water'
  ) {
    return <GlassWater size={19} />;
  }

  return <UtensilsCrossed size={19} />;
}

export function MenuPage() {
  const [items, setItems] =
    useState<MenuItem[]>(initialMenu);

  const [department, setDepartment] =
    useState<Department>('Food');

  const [category, setCategory] =
    useState('All');

  const [search, setSearch] = useState('');

  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);

  const [addingItem, setAddingItem] =
    useState(false);

  const categories =
    department === 'Food'
      ? foodCategories
      : drinkCategories;

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const correctDepartment =
        item.department === department;

      const correctCategory =
        category === 'All' ||
        item.category === category;

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category
          .toLowerCase()
          .includes(query);

      return (
        correctDepartment &&
        correctCategory &&
        matchesSearch
      );
    });
  }, [
    items,
    department,
    category,
    search,
  ]);

  const departmentCount = (type: Department) =>
    items.filter(
      (item) => item.department === type,
    ).length;

  const toggleAvailability = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              available: !item.available,
            }
          : item,
      ),
    );
  };

  const addItem = (item: MenuItem) => {
    setItems((current) => [item, ...current]);
    setDepartment(item.department);
    setCategory('All');
    setSearch('');
    setAddingItem(false);
  };

  const saveItem = (updated: MenuItem) => {
    setItems((current) =>
      current.map((item) =>
        item.id === updated.id
          ? updated
          : item,
      ),
    );

    setEditingItem(null);
  };

  const changeDepartment = (
    next: Department,
  ) => {
    setDepartment(next);
    setCategory('All');
    setSearch('');
  };

  return (
    <div className="menu-workspace">
      <section className="menu-heading">
        <div>
          <span className="eyebrow">
            RESTAURANT & BAR
          </span>

          <h1>Menu Management</h1>

          <p>
            Manage food, drinks, pricing and
            availability for this branch.
          </p>
        </div>

        <button
          className="menu-add-button"
          onClick={() => setAddingItem(true)}
        >
          <Plus size={17} />
          Add menu item
        </button>
      </section>

      <section className="department-switcher">
        <button
          className={
            department === 'Food'
              ? 'department-active'
              : ''
          }
          onClick={() =>
            changeDepartment('Food')
          }
        >
          <div className="department-icon">
            <UtensilsCrossed size={20} />
          </div>

          <div>
            <strong>Food</strong>
            <span>
              {departmentCount('Food')} menu
              items
            </span>
          </div>
        </button>

        <button
          className={
            department === 'Drinks'
              ? 'department-active'
              : ''
          }
          onClick={() =>
            changeDepartment('Drinks')
          }
        >
          <div className="department-icon">
            <Beer size={21} />
          </div>

          <div>
            <strong>Drinks</strong>
            <span>
              {departmentCount('Drinks')} menu
              items
            </span>
          </div>
        </button>
      </section>

      <section className="menu-toolbar">
        <div className="menu-categories">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? 'menu-category-active'
                  : ''
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {item}
            </button>
          ))}
        </div>

        <div className="menu-search">
          <Search size={16} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder={`Search ${department.toLowerCase()}...`}
          />
        </div>
      </section>

      <div className="menu-results-heading">
        <div>
          <span>
            {category === 'All'
              ? `All ${department}`
              : category}
          </span>

          <strong>
            {visibleItems.length}{' '}
            {visibleItems.length === 1
              ? 'item'
              : 'items'}
          </strong>
        </div>

        <button>
          Availability
          <ChevronDown size={14} />
        </button>
      </div>

      {visibleItems.length === 0 ? (
        <div className="menu-empty">
          <Coffee size={28} />
          <h3>No menu items found</h3>
          <p>
            Try another category or search.
          </p>
        </div>
      ) : (
        <section className="menu-grid">
          {visibleItems.map((item) => (
            <article
              className={`menu-product ${
                !item.available
                  ? 'menu-product-unavailable'
                  : ''
              }`}
              key={item.id}
            >
              <div className="menu-product-top">
                <div className="menu-product-icon">
                  {categoryIcon(item.category)}
                </div>

                <button
                  className="menu-edit"
                  onClick={() =>
                    setEditingItem(item)
                  }
                >
                  <Edit3 size={15} />
                </button>
              </div>

              <div className="menu-product-category">
                {item.category}
              </div>

              <h3>{item.name}</h3>

              <p>{item.description}</p>

              {item.variants && item.variants.length > 0 && (
                <div className="menu-variants-preview">
                  {item.variants.map((variant) => (
                    <span key={variant.id}>
                      {variant.label}
                      <strong>${variant.price.toFixed(2)}</strong>
                    </span>
                  ))}
                </div>
              )}

              <div className="menu-product-bottom">
                <strong>
                  {item.variants && item.variants.length > 1
                    ? `From $${Math.min(
                        ...item.variants.map((variant) => variant.price),
                      ).toFixed(2)}`
                    : `$${item.price.toFixed(2)}`}
                </strong>

                <div className="availability-control">
                  <span>
                    {item.available
                      ? 'Available'
                      : 'Sold out'}
                  </span>

                  <button
                    className={`availability-toggle ${
                      item.available
                        ? 'availability-on'
                        : ''
                    }`}
                    onClick={() =>
                      toggleAvailability(item.id)
                    }
                    aria-label={`Toggle ${item.name} availability`}
                  >
                    <span />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {editingItem && (
        <>
          <button
            className="menu-modal-overlay"
            onClick={() =>
              setEditingItem(null)
            }
            aria-label="Close editor"
          />

          <EditMenuItem
            item={editingItem}
            onClose={() =>
              setEditingItem(null)
            }
            onSave={saveItem}
          />
        </>
      )}

      {addingItem && (
        <>
          <button
            className="menu-modal-overlay"
            onClick={() => setAddingItem(false)}
            aria-label="Close add menu item"
          />
          <AddMenuItem
            defaultDepartment={department}
            onClose={() => setAddingItem(false)}
            onAdd={addItem}
          />
        </>
      )}
    </div>
  );
}

function AddMenuItem({
  defaultDepartment,
  onClose,
  onAdd,
}: {
  defaultDepartment: Department;
  onClose: () => void;
  onAdd: (item: MenuItem) => void;
}) {
  const [department, setDepartment] = useState<Department>(defaultDepartment);
  const [category, setCategory] = useState(
    defaultDepartment === 'Food' ? 'Traditional & Local' : 'Lagers & Beers',
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [variants, setVariants] = useState<PriceVariant[]>([]);

  const categories =
    department === 'Food'
      ? foodCategories.filter((item) => item !== 'All')
      : drinkCategories.filter((item) => item !== 'All');

  const changeDepartment = (value: Department) => {
    setDepartment(value);
    setCategory(value === 'Food' ? 'Traditional & Local' : 'Lagers & Beers');
    if (value === 'Food') setVariants([]);
  };

  const addVariant = () => {
    setVariants((current) => [
      ...current,
      { id: `variant-${Date.now()}`, label: '', price: 0 },
    ]);
  };

  const updateVariant = (
    id: string,
    field: 'label' | 'price',
    value: string,
  ) => {
    setVariants((current) =>
      current.map((variant) =>
        variant.id === id
          ? {
              ...variant,
              [field]: field === 'price' ? Number(value) : value,
            }
          : variant,
      ),
    );
  };

  const removeVariant = (id: string) => {
    setVariants((current) => current.filter((variant) => variant.id !== id));
  };

  const save = () => {
    if (!name.trim()) return;
    if (department === 'Food' && !price.trim()) return;

    const cleanVariants = variants.filter(
      (variant) => variant.label.trim() && variant.price >= 0,
    );
    if (department === 'Drinks' && cleanVariants.length === 0) return;

    const numericPrice = Number(price);
    const finalPrice =
      cleanVariants.length > 0
        ? Math.min(...cleanVariants.map((variant) => variant.price))
        : numericPrice;

    if (Number.isNaN(finalPrice) || finalPrice < 0) return;

    onAdd({
      id: `menu-${Date.now()}`,
      name: name.trim(),
      department,
      category,
      description: description.trim(),
      price: finalPrice,
      available,
      variants: cleanVariants.length > 0 ? cleanVariants : undefined,
    });
  };

  return (
    <aside className="menu-editor">
      <header>
        <div>
          <span>NEW MENU ITEM</span>
          <h2>Add to Signatures menu</h2>
        </div>
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </header>

      <div className="menu-editor-content">
        <label>
          Department
          <select
            value={department}
            onChange={(event) => changeDepartment(event.target.value as Department)}
          >
            <option value="Food">Food</option>
            <option value="Drinks">Drinks</option>
          </select>
        </label>

        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          Item name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={department === 'Food' ? 'e.g. Oxtail & Sadza' : 'e.g. Premium Whisky'}
          />
        </label>

        <label>
          Description
          <textarea
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe this menu item..."
          />
        </label>

        {department === 'Food' && (
          <label>
            Price
            <div className="price-input">
              <span>$</span>
              <input
                type="number"
                min="0"
                step="0.50"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0.00"
              />
            </div>
          </label>
        )}

        {department === 'Drinks' && (
          <div className="variant-editor">
            <div className="variant-heading">
              <div>
                <strong>Serving & pricing</strong>
                <span>Add Single, Double, Bottle, Glass, etc.</span>
              </div>
              <button type="button" onClick={addVariant}>
                <Plus size={14} />
                Add serving
              </button>
            </div>

            {variants.length === 0 && (
              <div className="variant-empty">No serving sizes added yet.</div>
            )}

            {variants.map((variant) => (
              <div className="variant-row" key={variant.id}>
                <input
                  placeholder="Single"
                  value={variant.label}
                  onChange={(event) => updateVariant(variant.id, 'label', event.target.value)}
                />
                <div className="variant-price">
                  <span>$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.50"
                    value={variant.price}
                    onChange={(event) => updateVariant(variant.id, 'price', event.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="variant-remove"
                  onClick={() => removeVariant(variant.id)}
                  aria-label={`Remove ${variant.label || 'serving'}`}
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="new-item-availability">
          <div>
            <strong>Available immediately</strong>
            <span>Customers can order this item.</span>
          </div>
          <button
            type="button"
            className={`availability-toggle ${available ? 'availability-on' : ''}`}
            onClick={() => setAvailable((current) => !current)}
            aria-label={available ? 'Mark unavailable' : 'Mark available'}
          >
            <span />
          </button>
        </div>
      </div>

      <footer>
        <button className="editor-cancel" onClick={onClose}>Cancel</button>
        <button className="editor-save" onClick={save}>Add menu item</button>
      </footer>
    </aside>
  );
}
function EditMenuItem({
  item,
  onClose,
  onSave,
}: {
  item: MenuItem;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
}) {
  const [name, setName] =
    useState(item.name);

  const [price, setPrice] = useState(
    String(item.price),
  );

  const [description, setDescription] =
    useState(item.description);

  const save = () => {
    const numericPrice = Number(price);

    if (
      !name.trim() ||
      Number.isNaN(numericPrice) ||
      numericPrice < 0
    ) {
      return;
    }

    onSave({
      ...item,
      name: name.trim(),
      price: numericPrice,
      description: description.trim(),
    });
  };

  return (
    <aside className="menu-editor">
      <header>
        <div>
          <span>EDIT MENU ITEM</span>
          <h2>{item.name}</h2>
        </div>

        <button onClick={onClose}>
          <X size={20} />
        </button>
      </header>

      <div className="menu-editor-content">
        <label>
          Item name
          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </label>

        <label>
          Category
          <input
            value={item.category}
            disabled
          />
        </label>

        <label>
          Price
          <div className="price-input">
            <span>$</span>
            <input
              type="number"
              min="0"
              step="0.50"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
            />
          </div>
        </label>

        <label>
          Description
          <textarea
            rows={5}
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
          />
        </label>

        <div className="editor-information">
          <span>Department</span>
          <strong>{item.department}</strong>
          {item.variants?.map((variant) => (
            <Fragment key={variant.id}>
              <span>{variant.label}</span>
              <strong>${variant.price.toFixed(2)}</strong>
            </Fragment>
          ))}
        </div>
      </div>

      <footer>
        <button
          className="editor-cancel"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          className="editor-save"
          onClick={save}
        >
          Save changes
        </button>
      </footer>
    </aside>
  );
}


