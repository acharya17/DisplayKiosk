import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight, Plus, Search, Filter, AlertTriangle, X, 
  ShoppingBag, CheckCircle, HelpCircle, Edit2, Trash2, 
  ChevronLeft, AlertCircle, FileText, Image, RefreshCw, Upload
} from 'lucide-react';
import DataTable from '../components/table/DataTable';

const KioskProducts = () => {
  const { 
    categories,
    products,
    addCategory,
    editCategory,
    deleteCategory,
    setCategoryStatus,
    addProduct,
    editProduct,
    deleteProduct,
    setProductStatus,
    customisations
  } = useApp();

  const catFileInputRef = useRef(null);
  const prodFileInputRef = useRef(null);

  // Upload progress simulation states
  const [uploadProgress, setUploadProgress] = useState(null); // null | number | 'done'
  const [uploadError, setUploadError] = useState('');

  // Active Context Tab: 'products' | 'categories'
  const [activeTab, setActiveTab] = useState('products');

  // Layout View States
  const [viewState, setViewState] = useState('list'); // 'list' | 'add' | 'edit' | 'detail'
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ categoryId: '', availability: '', status: '' });
  const [filterOpen, setFilterOpen] = useState(false);

  // Simulation loading / error states
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modals Open States
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(null);
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState(null);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [pendingBackAction, setPendingBackAction] = useState(null);

  // Form States
  const initialCategoryForm = {
    name: '',
    categoryId: '',
    description: '',
    image: '',
    status: 'Active'
  };

  const initialProductForm = {
    name: '',
    productId: '',
    categoryId: '',
    description: '',
    price: '',
    displayPrice: '',
    availability: 'In Stock',
    stockQty: 15,
    image: '',
    status: 'Active',
    customisationId: ''
  };

  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const triggerSimulatedLoad = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError('');
    setUploadProgress(0);

    const maxLimitBytes = 5 * 1024 * 1024; // 5MB limit for items
    if (file.size > maxLimitBytes) {
      setUploadError('File size exceeds the 5MB limit.');
      setUploadProgress(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Invalid format type. Please upload a standard image file.');
      setUploadProgress(null);
      return;
    }

    let pct = 0;
    const interval = setInterval(() => {
      pct += 25;
      setUploadProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        const url = URL.createObjectURL(file);
        if (activeTab === 'categories') {
          setCategoryForm(prev => ({ ...prev, image: url }));
        } else {
          setProductForm(prev => ({ ...prev, image: url }));
        }
        setUploadProgress('done');
      }
    }, 100);
  };

  const handleRemoveFile = () => {
    if (activeTab === 'categories') {
      setCategoryForm(prev => ({ ...prev, image: '' }));
      if (catFileInputRef.current) catFileInputRef.current.value = '';
    } else {
      setProductForm(prev => ({ ...prev, image: '' }));
      if (prodFileInputRef.current) prodFileInputRef.current.value = '';
    }
    setUploadProgress(null);
  };

  const handleOpenAdd = () => {
    setErrors({});
    setUploadProgress(null);
    setUploadError('');
    if (activeTab === 'categories') {
      setCategoryForm({
        ...initialCategoryForm,
        categoryId: 'CAT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        image: ''
      });
    } else {
      setProductForm({
        ...initialProductForm,
        productId: 'PROD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        categoryId: categories.filter(c => c.status === 'Active')[0]?.id || '',
        image: '',
        customisationId: ''
      });
    }
    setViewState('add');
  };

  const handleOpenEdit = (item) => {
    setErrors({});
    if (activeTab === 'categories') {
      setCategoryForm({ ...item });
      setUploadProgress(item.image ? 'done' : null);
    } else {
      setProductForm({
        ...item,
        customisationId: item.customisationId || ''
      });
      setUploadProgress(item.image ? 'done' : null);
    }
    setUploadError('');
    setViewState('edit');
  };

  const handleRowClick = (item) => {
    if (activeTab === 'products') {
      setSelectedProductId(item.id);
      setViewState('detail');
    }
  };

  const hasUnsavedChanges = () => {
    if (activeTab === 'categories') {
      if (viewState === 'add') {
        return categoryForm.name !== '' || categoryForm.description !== '';
      } else if (viewState === 'edit') {
        const original = categories.find(c => c.id === categoryForm.id) || {};
        return categoryForm.name !== original.name || categoryForm.description !== original.description || categoryForm.image !== original.image || categoryForm.status !== original.status;
      }
    } else {
      if (viewState === 'add') {
        return (
          productForm.name !== '' ||
          productForm.description !== '' ||
          productForm.price !== '' ||
          productForm.displayPrice !== '' ||
          productForm.availability !== 'In Stock' ||
          Number(productForm.stockQty) !== 15
        );
      } else if (viewState === 'edit') {
        const original = products.find(p => p.id === productForm.id) || {};
        return (
          productForm.name !== original.name ||
          productForm.categoryId !== original.categoryId ||
          productForm.description !== original.description ||
          Number(productForm.price) !== Number(original.price) ||
          Number(productForm.displayPrice) !== Number(original.displayPrice) ||
          productForm.availability !== original.availability ||
          Number(productForm.stockQty) !== Number(original.stockQty || 0) ||
          productForm.image !== original.image ||
          productForm.status !== original.status
        );
      }
    }
    return false;
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setPendingBackAction(() => () => setViewState('list'));
      setUnsavedModalOpen(true);
    } else {
      setViewState('list');
    }
  };

  const handleTabChange = (tab) => {
    if (hasUnsavedChanges()) {
      setPendingBackAction(() => () => {
        setActiveTab(tab);
        setViewState('list');
      });
      setUnsavedModalOpen(true);
    } else {
      setActiveTab(tab);
      setViewState('list');
      setSearchQuery('');
      setActiveFilters({ categoryId: '', availability: '', status: '' });
    }
  };

  const handleSaveCategory = () => {
    const tempErrors = {};
    if (!categoryForm.name.trim()) {
      tempErrors.name = 'Category Name is required.';
    } else {
      const isDuplicate = categories.some(
        c => c.id !== categoryForm.id && c.name.toLowerCase().trim() === categoryForm.name.toLowerCase().trim()
      );
      if (isDuplicate) {
        tempErrors.name = 'A category with this name already exists.';
      }
    }

    if (viewState === 'edit' && !categoryForm.categoryId.trim()) {
      tempErrors.categoryId = 'Category ID code is required.';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    if (viewState === 'add') {
      addCategory(categoryForm);
    } else {
      editCategory(categoryForm.id, categoryForm);
    }
    setViewState('list');
  };

  const handleSaveProduct = () => {
    const tempErrors = {};
    if (!productForm.name.trim()) {
      tempErrors.name = 'Product Name is required.';
    }
    if (viewState === 'edit' && !productForm.productId.trim()) {
      tempErrors.productId = 'Product ID code is required.';
    }
    if (!productForm.categoryId) {
      tempErrors.categoryId = 'Category assignment is required.';
    }
    if (productForm.price === '' || isNaN(productForm.price) || Number(productForm.price) < 0) {
      tempErrors.price = 'Base Price must be a valid non-negative number.';
    }
    if (productForm.displayPrice === '' || isNaN(productForm.displayPrice) || Number(productForm.displayPrice) < 0) {
      tempErrors.displayPrice = 'Display Price must be a valid non-negative number.';
    } else if (Number(productForm.displayPrice) > Number(productForm.price)) {
      tempErrors.displayPrice = 'Display Price should not be higher than Base Price.';
    }
    if (productForm.availability === 'In Stock') {
      if (productForm.stockQty === '' || isNaN(productForm.stockQty) || Number(productForm.stockQty) < 0) {
        tempErrors.stockQty = 'Available stock quantity must be a non-negative number.';
      }
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stockQty: productForm.availability === 'In Stock' ? Number(productForm.stockQty) : 0
    };

    if (viewState === 'add') {
      addProduct(payload);
    } else {
      editProduct(productForm.id, payload);
    }
    setViewState('list');
  };

  // Filters mapping
  const filteredCategories = categories.filter(cat => {
    if (searchQuery) {
      const matchName = cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) || cat.categoryId?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchName) return false;
    }
    return true;
  });

  const filteredProducts = products.filter(prod => {
    if (searchQuery) {
      const matchName = prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) || prod.productId?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchName) return false;
    }
    if (activeFilters.categoryId && prod.categoryId !== activeFilters.categoryId) return false;
    if (activeFilters.availability && prod.availability !== activeFilters.availability) return false;
    return true;
  });

  const selectedProduct = products.find(p => p.id === selectedProductId);

  // Table structures
  const categoryColumns = [
    { 
      field: 'image', 
      header: 'Icon',
      render: (val) => (
        <img 
          src={val || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=120"} 
          alt="Icon" 
          style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--color-border)' }} 
        />
      )
    },
    { field: 'name', header: 'Category Name', sortable: true },
    { field: 'categoryId', header: 'Category ID', sortable: true },
    { 
      field: 'productCount', 
      header: 'Products Count',
      render: (_, row) => products.filter(p => p.categoryId === row.id).length
    },
    { 
      field: 'status', 
      header: 'Status',
      render: (val, row) => (
        <label className="switch-control" onClick={(e) => e.stopPropagation()}>
          <input 
            type="checkbox" 
            checked={val === 'Active'} 
            onChange={() => {
              setCategoryStatus(row.id, val === 'Active' ? 'Inactive' : 'Active');
            }}
          />
          <span className="switch-slider"></span>
        </label>
      )
    }
  ];

  const productColumns = [
    { 
      field: 'image', 
      header: 'Product Image',
      render: (val) => (
        <img 
          src={val} 
          alt="Product" 
          style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--color-border)' }} 
        />
      )
    },
    { field: 'name', header: 'Product Name', sortable: true },
    { 
      field: 'productId', 
      header: 'Product ID', 
      sortable: true,
      render: (val, row) => val || row.id?.toUpperCase() || 'N/A'
    },
    { 
      field: 'categoryId', 
      header: 'Category',
      render: (val) => categories.find(c => c.id === val)?.name || 'Unknown'
    },
    { 
      field: 'price', 
      header: 'Pricing', 
      sortable: true,
      render: (_, row) => {
        const base = Number(row.price || 0);
        const display = Number(row.displayPrice || base);
        const hasDiscount = base > display;
        return (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>₹{display.toFixed(2)}</span>
            {hasDiscount && (
              <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '11px' }}>
                ₹{base.toFixed(2)}
              </span>
            )}
          </div>
        );
      }
    },
    { 
      field: 'availability', 
      header: 'Availability',
      render: (val, row) => (
        <span className={`badge ${val === 'In Stock' ? 'badge-active' : 'badge-inactive'}`}>
          {val === 'In Stock' ? `In Stock (${row.stockQty || 0})` : 'Out of Stock'}
        </span>
      )
    },
    { 
      field: 'status', 
      header: 'Status',
      render: (val, row) => (
        <label className="switch-control" onClick={(e) => e.stopPropagation()}>
          <input 
            type="checkbox" 
            checked={val === 'Active'} 
            onChange={() => {
              setProductStatus(row.id, val === 'Active' ? 'Inactive' : 'Active');
            }}
          />
          <span className="switch-slider"></span>
        </label>
      )
    }
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Kiosk Admin</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active" onClick={handleBack} style={{ cursor: viewState !== 'list' ? 'pointer' : 'default' }}>
          Categories & Products
        </span>
        {viewState === 'add' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">Add {activeTab === 'categories' ? 'Category' : 'Product'}</span>
          </>
        )}
        {viewState === 'edit' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">Edit {activeTab === 'categories' ? 'Category' : 'Product'}</span>
          </>
        )}
        {viewState === 'detail' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">Product Details</span>
          </>
        )}
      </div>

      {/* Header */}
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {viewState !== 'list' && (
            <button 
              onClick={handleBack} 
              className="btn btn-outline" 
              style={{ height: '36px', width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
              title="Back"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>
              {viewState === 'add' ? `Add ${activeTab === 'categories' ? 'Category' : 'Product'}` :
               viewState === 'edit' ? `Edit ${activeTab === 'categories' ? 'Category' : 'Product'}` :
               viewState === 'detail' ? 'Product Details' : 'Categories & Products'}
            </h1>
            <p className="page-desc" style={{ margin: 0 }}>
              {viewState === 'add' || viewState === 'edit' ? 'Fill out all required parameters.' :
               viewState === 'detail' ? 'Comprehensive view of product attributes.' :
               'Manage categories, products, stock status, and menu listings.'}
            </p>
          </div>
        </div>

        <div>
          {viewState === 'list' && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add {activeTab === 'categories' ? 'Category' : 'Product'}</span>
            </button>
          )}
          {viewState === 'detail' && selectedProduct && (
            <button className="btn btn-primary" onClick={() => handleOpenEdit(selectedProduct)}>
              <Edit2 size={14} style={{ marginRight: '6px' }} />
              <span>Edit Product</span>
            </button>
          )}
          {(viewState === 'add' || viewState === 'edit') && (
            <button 
              className="btn btn-primary" 
              onClick={activeTab === 'categories' ? handleSaveCategory : handleSaveProduct}
            >
              {activeTab === 'categories' ? 'Save Category' : 'Save Product'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs list */}
      {viewState === 'list' && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '16px' }}>
          <button 
            onClick={() => handleTabChange('products')}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'products' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'products' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer'
            }}
          >
            Products
          </button>
          <button 
            onClick={() => handleTabChange('categories')}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'categories' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'categories' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer'
            }}
          >
            Categories
          </button>
        </div>
      )}

      {/* View State Rendering */}
      {isError ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-error)' }}>
          <AlertCircle size={32} style={{ marginBottom: '8px' }} />
          <h3>System Loading Error</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', margin: '8px 0 16px' }}>
            We encountered a network failure retrieving kiosk menu indices.
          </p>
          <button className="btn btn-primary" onClick={() => { setIsError(false); triggerSimulatedLoad(); }}>
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ height: '36px', backgroundColor: '#e2e8f0', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ height: '44px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite', opacity: 0.8 }}></div>
          <div style={{ height: '44px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite', opacity: 0.6 }}></div>
        </div>
      ) : viewState === 'list' ? (
        /* LISTING VIEW */
        <>
          {/* Search Toolbar */}
          <div className="toolbar">
            <div className="toolbar-left">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, maxWidth: '320px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab === 'categories' ? 'categories' : 'products'}...`} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '36px', height: '36px' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              {activeTab === 'products' && (
                <button onClick={() => setFilterOpen(true)} className="btn btn-outline" style={{ height: '36px' }}>
                  <Filter size={15} />
                  <span>Filter {Object.values(activeFilters).filter(Boolean).length > 0 ? ` • ${Object.values(activeFilters).filter(Boolean).length}` : ''}</span>
                </button>
              )}
            </div>
          </div>

          <DataTable 
            columns={activeTab === 'categories' ? categoryColumns : productColumns}
            data={activeTab === 'categories' ? filteredCategories : filteredProducts}
            onEdit={handleOpenEdit}
            onDelete={(item) => activeTab === 'categories' ? setConfirmDeleteCategory(item) : setConfirmDeleteProduct(item)}
            searchQuery={searchQuery}
            searchField="name"
            keyField="id"
            onRowClick={activeTab === 'products' ? handleRowClick : undefined}
          />
        </>
      ) : viewState === 'detail' && selectedProduct ? (
        /* DETAILS PREVIEW DRAWER */
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
          {/* Main Info Column */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name} 
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }}
            />
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>{selectedProduct.name}</h2>
              <span className={`badge ${selectedProduct.availability === 'In Stock' ? 'badge-active' : 'badge-inactive'}`}>
                {selectedProduct.availability === 'In Stock' ? `In Stock (${selectedProduct.stockQty || 0})` : 'Out of Stock'}
              </span>
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Product ID</div>
              <div style={{ fontWeight: 500 }}>{selectedProduct.productId}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Category</div>
              <div style={{ fontWeight: 500 }}>
                {categories.find(c => c.id === selectedProduct.categoryId)?.name || 'Unresolved Category'}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Base Price</div>
                <div style={{ fontWeight: 500, fontSize: '13px', color: 'var(--color-text-secondary)', textDecoration: 'line-through' }}>
                  ₹{Number(selectedProduct.price).toFixed(2)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Display Price</div>
                <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-primary)' }}>
                  ₹{Number(selectedProduct.displayPrice || selectedProduct.price).toFixed(2)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setViewState('list')}>
                Back to List
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleOpenEdit(selectedProduct)}>
                <Edit2 size={14} />
                <span>Edit Product</span>
              </button>
            </div>
          </div>

          {/* Description & Extended Info */}
          <div className="card">
            <h3 style={{ fontSize: '14px', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '12px' }}>
              Product Specifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Description</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                  {selectedProduct.description || 'No description supplied.'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Customisation Assigned</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '4px' }}>
                  {(() => {
                    const matched = customisations.find(c => c.id === selectedProduct.customisationId);
                    return matched ? matched.name : 'None';
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ADD / EDIT SUB-PAGE FORM (2-column layout matching Banner configuration structure) */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', alignItems: 'start' }}>
          {activeTab === 'categories' ? (
            /* CATEGORY ADD/EDIT VIEW */
            <>
              {/* Left Column: Settings card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="card" style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Category Settings</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Category Name <span className="required">*</span></label>
                      <input 
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Biryani"
                        className={`form-control ${errors.name ? 'error' : ''}`}
                        style={{ height: '34px' }}
                      />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Description</label>
                      <textarea 
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Concise description of this food category..."
                        className="form-control"
                        rows={3}
                        style={{ resize: 'none' }}
                      />
                    </div>

                    {viewState === 'edit' && (
                      <>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Category ID</label>
                          <input 
                            type="text"
                            value={categoryForm.categoryId}
                            disabled
                            className="form-control"
                            style={{ height: '34px', opacity: 0.7 }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--color-border)', height: '48px', marginTop: '4px' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '11px' }}>Category Status</div>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                              {categoryForm.status}
                            </span>
                          </div>
                          <label className="switch-control" style={{ margin: 0 }}>
                            <input 
                              type="checkbox" 
                              checked={categoryForm.status === 'Active'} 
                              onChange={() => setCategoryForm(prev => ({ ...prev, status: prev.status === 'Active' ? 'Inactive' : 'Active' }))}
                            />
                            <span className="switch-slider"></span>
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Image Preview & Upload card */}
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Category Media</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div 
                    style={{ 
                      border: '1.5px dashed var(--color-border)',
                      borderRadius: '6px',
                      padding: '16px 12px',
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      minHeight: '120px'
                    }}
                    onClick={() => {
                      if (typeof uploadProgress !== 'number' && catFileInputRef.current) {
                        catFileInputRef.current.click();
                      }
                    }}
                  >
                    <input 
                      type="file" 
                      ref={catFileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleFileSelection}
                    />

                    {uploadProgress === null && !categoryForm.image && (
                      <>
                        <Upload size={24} style={{ color: 'var(--color-text-secondary)' }} />
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Choose image file</span>
                          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Drag files here or click to browse (Max 5MB)</span>
                        </div>
                      </>
                    )}

                    {typeof uploadProgress === 'number' && (
                      <div style={{ width: '100%', padding: '0 12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Uploading... {uploadProgress}%</div>
                        <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${uploadProgress}%`, backgroundColor: 'var(--color-primary)', transition: 'width 100ms ease' }} />
                        </div>
                      </div>
                    )}

                    {categoryForm.image && uploadProgress === 'done' && (
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ 
                          border: '1px solid var(--color-border)', 
                          borderRadius: '6px', 
                          overflow: 'hidden', 
                          backgroundColor: '#0f172a', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          aspectRatio: '16/9',
                          width: '100%',
                          maxHeight: '160px'
                        }}>
                          <img src={categoryForm.image} alt="prev" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                          <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                            Loaded Successfully
                          </span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); catFileInputRef.current.click(); }} 
                              className="btn btn-outline" 
                              style={{ height: '24px', fontSize: '9px', padding: '0 6px' }}
                            >
                              Replace
                            </button>
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }} 
                              className="btn btn-outline" 
                              style={{ height: '24px', fontSize: '9px', padding: '0 6px', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {uploadError && <span style={{ color: 'var(--color-error)', fontSize: '11px', display: 'block', marginTop: '4px' }}>{uploadError}</span>}
                </div>
              </div>
            </>
          ) : (
            /* PRODUCT ADD/EDIT VIEW */
            <>
              {/* Left Column: Settings card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="card" style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Product Settings</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {viewState === 'add' ? (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Product Name <span className="required">*</span></label>
                        <input 
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Mutton Biryani"
                          className={`form-control ${errors.name ? 'error' : ''}`}
                          style={{ height: '34px' }}
                        />
                        {errors.name && <span className="form-error">{errors.name}</span>}
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Product Name <span className="required">*</span></label>
                          <input 
                            type="text"
                            value={productForm.name}
                            onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g. Mutton Biryani"
                            className={`form-control ${errors.name ? 'error' : ''}`}
                            style={{ height: '34px' }}
                          />
                          {errors.name && <span className="form-error">{errors.name}</span>}
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Product ID</label>
                          <input 
                            type="text"
                            value={productForm.productId}
                            disabled
                            className="form-control"
                            style={{ height: '34px', opacity: 0.7 }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Category Assignment <span className="required">*</span></label>
                      <select 
                        value={productForm.categoryId}
                        onChange={(e) => setProductForm(prev => ({ ...prev, categoryId: e.target.value }))}
                        className={`form-control ${errors.categoryId ? 'error' : ''}`}
                        style={{ height: '34px' }}
                      >
                        <option value="">Select Category</option>
                        {categories.filter(c => c.status === 'Active' || c.id === productForm.categoryId).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      {errors.categoryId && <span className="form-error">{errors.categoryId}</span>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Base Price (₹) <span className="required">*</span></label>
                        <input 
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="e.g. 250"
                          className={`form-control ${errors.price ? 'error' : ''}`}
                          style={{ height: '34px' }}
                        />
                        {errors.price && <span className="form-error">{errors.price}</span>}
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Display Price (₹) <span className="required">*</span></label>
                        <input 
                          type="number"
                          value={productForm.displayPrice}
                          onChange={(e) => setProductForm(prev => ({ ...prev, displayPrice: e.target.value }))}
                          placeholder="e.g. 199"
                          className={`form-control ${errors.displayPrice ? 'error' : ''}`}
                          style={{ height: '34px' }}
                        />
                        {errors.displayPrice && <span className="form-error">{errors.displayPrice}</span>}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Availability</label>
                        <select 
                          value={productForm.availability}
                          onChange={(e) => setProductForm(prev => ({ 
                            ...prev, 
                            availability: e.target.value,
                            stockQty: e.target.value === 'In Stock' ? (prev.stockQty || 15) : 0
                          }))}
                          className="form-control"
                          style={{ height: '34px' }}
                        >
                          <option value="In Stock">In Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </div>

                      {productForm.availability === 'In Stock' ? (
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Available Stock Quantity <span className="required">*</span></label>
                          <input 
                            type="number"
                            value={productForm.stockQty}
                            onChange={(e) => setProductForm(prev => ({ ...prev, stockQty: e.target.value }))}
                            placeholder="e.g. 15"
                            className={`form-control ${errors.stockQty ? 'error' : ''}`}
                            style={{ height: '34px' }}
                          />
                          {errors.stockQty && <span className="form-error">{errors.stockQty}</span>}
                        </div>
                      ) : (
                        <div className="form-group" style={{ marginBottom: 0, opacity: 0.5 }}>
                          <label className="form-label">Available Stock Quantity</label>
                          <input 
                            type="number"
                            value={0}
                            disabled
                            className="form-control"
                            style={{ height: '34px' }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Description</label>
                      <textarea 
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Keep description concise and meaningful..."
                        className="form-control"
                        rows={2}
                        style={{ resize: 'none', fontSize: '12px' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Customisation</label>
                      <select 
                        value={productForm.customisationId || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, customisationId: e.target.value }))}
                        className="form-control"
                        style={{ height: '34px' }}
                      >
                        <option value="">Select Customisation</option>
                        {customisations.filter(c => c.status === 'Active' || c.id === productForm.customisationId).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {viewState === 'edit' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--color-border)', height: '48px', marginTop: '4px' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '11px' }}>Product Status</div>
                          <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                            {productForm.status}
                          </span>
                        </div>
                        <label className="switch-control" style={{ margin: 0 }}>
                          <input 
                            type="checkbox" 
                            checked={productForm.status === 'Active'} 
                            onChange={() => setProductForm(prev => ({ ...prev, status: prev.status === 'Active' ? 'Inactive' : 'Active' }))}
                          />
                          <span className="switch-slider"></span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Media Preview & Upload card */}
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Product Media</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div 
                    style={{ 
                      border: '1.5px dashed var(--color-border)',
                      borderRadius: '6px',
                      padding: '16px 12px',
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      minHeight: '120px'
                    }}
                    onClick={() => {
                      if (typeof uploadProgress !== 'number' && prodFileInputRef.current) {
                        prodFileInputRef.current.click();
                      }
                    }}
                  >
                    <input 
                      type="file" 
                      ref={prodFileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleFileSelection}
                    />

                    {uploadProgress === null && !productForm.image && (
                      <>
                        <Upload size={24} style={{ color: 'var(--color-text-secondary)' }} />
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Choose image file</span>
                          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Drag files here or click to browse (Max 5MB)</span>
                        </div>
                      </>
                    )}

                    {typeof uploadProgress === 'number' && (
                      <div style={{ width: '100%', padding: '0 12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Uploading... {uploadProgress}%</div>
                        <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${uploadProgress}%`, backgroundColor: 'var(--color-primary)', transition: 'width 100ms ease' }} />
                        </div>
                      </div>
                    )}

                    {productForm.image && uploadProgress === 'done' && (
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ 
                          border: '1px solid var(--color-border)', 
                          borderRadius: '6px', 
                          overflow: 'hidden', 
                          backgroundColor: '#0f172a', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          aspectRatio: '16/9',
                          width: '100%',
                          maxHeight: '160px'
                        }}>
                          <img src={productForm.image} alt="prev" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                          <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                            Loaded Successfully
                          </span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); prodFileInputRef.current.click(); }} 
                              className="btn btn-outline" 
                              style={{ height: '24px', fontSize: '9px', padding: '0 6px' }}
                            >
                              Replace
                            </button>
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }} 
                              className="btn btn-outline" 
                              style={{ height: '24px', fontSize: '9px', padding: '0 6px', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {uploadError && <span style={{ color: 'var(--color-error)', fontSize: '11px', display: 'block', marginTop: '4px' }}>{uploadError}</span>}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* FILTER DIALOG */}
      {filterOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '400px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Filter Products</h3>
              <button className="modal-close" onClick={() => setFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <select 
                  value={activeFilters.categoryId} 
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="form-control"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Availability</label>
                <select 
                  value={activeFilters.availability} 
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, availability: e.target.value }))}
                  className="form-control"
                >
                  <option value="">All Statuses</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => {
                  setActiveFilters({ categoryId: '', availability: '', status: '' });
                  setFilterOpen(false);
                }}
              >
                Reset
              </button>
              <button className="btn btn-primary" onClick={() => setFilterOpen(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNSAVED CHANGES MODAL */}
      {unsavedModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '380px', textAlign: 'center', padding: '24px' }}>
            <AlertTriangle size={32} style={{ color: 'var(--color-warning)', marginBottom: '8px' }} />
            <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 600 }}>Unsaved Changes</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', margin: '0 0 20px', lineHeight: 1.5 }}>
              You have modified form fields. If you leave now, these edits will be discarded.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  if (activeTab === 'categories') {
                    handleSaveCategory();
                  } else {
                    handleSaveProduct();
                  }
                  setUnsavedModalOpen(false);
                }}
              >
                Save & Go Back
              </button>
              <button 
                className="btn btn-outline" 
                style={{ color: 'var(--color-error)' }}
                onClick={() => {
                  setUnsavedModalOpen(false);
                  if (pendingBackAction) pendingBackAction();
                }}
              >
                Discard without Saving
              </button>
              <button className="btn btn-outline" onClick={() => setUnsavedModalOpen(false)}>
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODALS */}
      {confirmDeleteCategory && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '360px', textAlign: 'center', padding: '24px' }}>
            <AlertTriangle size={32} style={{ color: 'var(--color-error)', marginBottom: '8px' }} />
            <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 600 }}>Delete Category?</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', margin: '0 0 20px' }}>
              Are you sure you want to delete category <strong>{confirmDeleteCategory.name}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <button className="btn btn-outline" onClick={() => setConfirmDeleteCategory(null)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                onClick={() => {
                  deleteCategory(confirmDeleteCategory.id);
                  setConfirmDeleteCategory(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteProduct && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '360px', textAlign: 'center', padding: '24px' }}>
            <AlertTriangle size={32} style={{ color: 'var(--color-error)', marginBottom: '8px' }} />
            <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 600 }}>Delete Product?</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', margin: '0 0 20px' }}>
              Are you sure you want to delete product <strong>{confirmDeleteProduct.name}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <button className="btn btn-outline" onClick={() => setConfirmDeleteProduct(null)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                onClick={() => {
                  deleteProduct(confirmDeleteProduct.id);
                  setConfirmDeleteProduct(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KioskProducts;
