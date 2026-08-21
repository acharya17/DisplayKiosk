import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight, Search, Filter, X, ChevronLeft, CreditCard, 
  Calendar, CheckCircle, Clock, XCircle, AlertCircle, ShoppingBag, ArrowRight
} from 'lucide-react';
import DataTable from '../components/table/DataTable';

const KioskOrders = () => {
  const { orders, payments, kiosks } = useApp();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'payments'
  const [viewState, setViewState] = useState('list'); // 'list' or 'details'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [detailsItem, setDetailsItem] = useState(null);

  // Filters state
  const [activeFilters, setActiveFilters] = useState({
    orderStatus: '',
    paymentStatus: '',
    kioskId: '',
    paymentMethod: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setViewState('list');
    setSearchQuery('');
    setActiveFilters({ orderStatus: '', paymentStatus: '', kioskId: '', paymentMethod: '' });
  };

  const handleRowClick = (item) => {
    setDetailsItem(item);
    setViewState('details');
  };

  const handleBack = () => {
    setViewState('list');
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Status badges
  const getOrderStatusBadge = (status) => {
    let bg = '#f1f5f9', color = '#475569';
    if (status === 'Completed') { bg = '#dcfce7'; color = '#15803d'; }
    else if (status === 'Cancelled') { bg = '#fee2e2'; color = '#dc2626'; }
    else if (status === 'Payment Pending') { bg = '#fef3c7'; color = '#d97706'; }

    return (
      <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: bg, color }}>
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    let bg = '#f1f5f9', color = '#475569';
    if (status === 'Successful') { bg = '#dcfce7'; color = '#15803d'; }
    else if (status === 'Failed' || status === 'Cancelled') { bg = '#fee2e2'; color = '#dc2626'; }
    else if (status === 'Pending') { bg = '#fef3c7'; color = '#d97706'; }

    return (
      <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: bg, color }}>
        {status}
      </span>
    );
  };

  // Filter logic
  const filteredOrders = orders.filter(o => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = o.id?.toLowerCase().includes(q);
      const matchToken = o.token?.toString().includes(q);
      const matchKiosk = o.kioskName?.toLowerCase().includes(q);
      const matchCust = o.customerName?.toLowerCase().includes(q);
      if (!matchId && !matchToken && !matchKiosk && !matchCust) return false;
    }
    if (activeFilters.orderStatus && o.orderStatus !== activeFilters.orderStatus) return false;
    if (activeFilters.paymentStatus && o.paymentStatus !== activeFilters.paymentStatus) return false;
    if (activeFilters.kioskId && o.kioskId !== activeFilters.kioskId) return false;
    if (activeFilters.paymentMethod && o.paymentMethod !== activeFilters.paymentMethod) return false;
    return true;
  });

  const filteredPayments = payments.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTxn = p.transactionId?.toLowerCase().includes(q);
      const matchRef = p.referenceId?.toLowerCase().includes(q);
      const matchOrder = p.orderId?.toLowerCase().includes(q);
      const matchKiosk = p.kioskName?.toLowerCase().includes(q);
      if (!matchTxn && !matchRef && !matchOrder && !matchKiosk) return false;
    }
    if (activeFilters.paymentStatus && p.status !== activeFilters.paymentStatus) return false;
    if (activeFilters.kioskId && p.kioskId !== activeFilters.kioskId) return false;
    if (activeFilters.paymentMethod && p.paymentMethod !== activeFilters.paymentMethod) return false;
    return true;
  });

  // Table Columns
  const orderColumns = [
    { field: 'id', header: 'Order ID', render: (val) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{val}</span> },
    { field: 'token', header: 'Token No', render: (val) => <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>#{val}</span> },
    { field: 'kioskName', header: 'Source Kiosk' },
    { field: 'date', header: 'Date & Time', render: (val) => <span>{formatDate(val)}</span> },
    { 
      field: 'items', 
      header: 'Ordered Items', 
      render: (val) => {
        const count = val.reduce((sum, item) => sum + item.quantity, 0);
        return <span>{count} Items</span>;
      }
    },
    { field: 'totalAmount', header: 'Amount', render: (val) => <span style={{ fontWeight: 600 }}>₹{val.toFixed(2)}</span> },
    { field: 'paymentStatus', header: 'Payment Status', render: (val) => getPaymentStatusBadge(val) },
    { field: 'orderStatus', header: 'Order Status', render: (val) => getOrderStatusBadge(val) }
  ];

  const paymentColumns = [
    { field: 'transactionId', header: 'Transaction ID', render: (val) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{val || '—'}</span> },
    { field: 'referenceId', header: 'Reference ID', render: (val) => <span style={{ fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{val || '—'}</span> },
    { field: 'orderId', header: 'Order ID', render: (val) => <span style={{ fontFamily: 'monospace' }}>{val}</span> },
    { field: 'kioskName', header: 'Kiosk Source' },
    { field: 'amount', header: 'Amount', render: (val) => <span style={{ fontWeight: 600 }}>₹{val.toFixed(2)}</span> },
    { field: 'paymentMethod', header: 'Method', render: (val) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CreditCard size={12} />{val}</span> },
    { field: 'status', header: 'Transaction Status', render: (val) => getPaymentStatusBadge(val) },
    { field: 'timestamp', header: 'Timestamp', render: (val) => <span>{formatDate(val)}</span> }
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="breadcrumb">
        <span>Kiosk Admin</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active" onClick={handleBack} style={{ cursor: viewState !== 'list' ? 'pointer' : 'default' }}>
          Transactions & Monitoring
        </span>
        {viewState !== 'list' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">
              {activeTab === 'orders' ? 'Order Details' : 'Payment Details'}
            </span>
          </>
        )}
      </div>

      {/* Page Header */}
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {viewState !== 'list' && (
            <button onClick={handleBack} className="btn btn-outline" style={{ height: '36px', width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
              <ChevronLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>
              {viewState === 'list' ? 'Transactions & Monitoring' : activeTab === 'orders' ? 'Order Specification' : 'Payment Specification'}
            </h1>
            <p className="page-desc" style={{ margin: 0 }}>
              {viewState === 'list' ? 'Monitor orders and online payment transactions processed by order kiosks.' : 'Detailed transaction logs mapping product items, taxes, and refunds.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Selectors (only in list viewState) */}
      {viewState === 'list' && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '16px' }}>
          <button 
            onClick={() => handleTabChange('orders')}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'orders' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer'
            }}
          >
            Customer Orders
          </button>
          <button 
            onClick={() => handleTabChange('payments')}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'payments' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'payments' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer'
            }}
          >
            Online Payment Transactions
          </button>
        </div>
      )}

      {/* ─── LIST VIEW ─── */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ height: '36px', backgroundColor: '#e2e8f0', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite' }}></div>
        </div>
      ) : viewState === 'list' ? (
        <>
          <div className="toolbar">
            <div className="toolbar-left">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, maxWidth: '320px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                <input 
                  type="text" 
                  placeholder={activeTab === 'orders' ? 'Search by Order ID, Token, Kiosk...' : 'Search by Txn ID, Ref, Order ID...'} 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="form-control" 
                  style={{ width: '100%', paddingLeft: '36px', height: '36px' }} 
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={14} /></button>
                )}
              </div>
              <button onClick={() => setFilterOpen(true)} className="btn btn-outline" style={{ height: '36px' }}><Filter size={15} /><span>Filter</span></button>
            </div>
          </div>
          <DataTable
            columns={activeTab === 'orders' ? orderColumns : paymentColumns}
            data={activeTab === 'orders' ? filteredOrders : filteredPayments}
            onRowClick={handleRowClick}
            onView={handleRowClick}
            searchQuery={searchQuery}
            searchField={activeTab === 'orders' ? 'kioskName' : 'transactionId'}
            keyField="id"
          />
        </>

      /* ─── ORDER DETAILS VIEW ─── */
      ) : activeTab === 'orders' && detailsItem ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', alignItems: 'start' }}>
          {/* Left Column: Summary Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Order Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Order ID</span>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600 }}>{detailsItem.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Token Number</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>#{detailsItem.token}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Created On</span>
                  <span style={{ fontSize: '11px' }}>{formatDate(detailsItem.date)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Kiosk Source</span>
                  <span style={{ fontSize: '11px', fontWeight: 500 }}>{detailsItem.kioskName} ({detailsItem.kioskCode})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Order Status</span>
                  {getOrderStatusBadge(detailsItem.orderStatus)}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            {detailsItem.customerMobile ? (
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>Customer Contact</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Mobile</span>
                    <span style={{ fontWeight: 600 }}>{detailsItem.customerMobile}</span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Payments mapping */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>Payment Mappings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Payment Method</span>
                  <span style={{ fontWeight: 600 }}>{detailsItem.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Payment Status</span>
                  {getPaymentStatusBadge(detailsItem.paymentStatus)}
                </div>
                {detailsItem.transactionId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Transaction ID</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{detailsItem.transactionId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Ordered Items and Calculations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Order Details Items</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {detailsItem.items.map((item, idx) => {
                  const itemPrice = Number(item.price);
                  const subTotal = (itemPrice + item.customisations.reduce((sum, c) => sum + Number(c.price), 0)) * item.quantity;
                  return (
                    <div key={idx} style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: '#f8fafc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 700 }}>{item.name}</span>
                          <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginLeft: '6px' }}>{item.type}</span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600 }}>₹{subTotal.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        <span>Qty: {item.quantity} × ₹{itemPrice.toFixed(2)}</span>
                      </div>
                      {item.customisations.length > 0 && (
                        <div style={{ marginTop: '6px', borderTop: '1px dashed var(--color-border)', paddingTop: '4px' }}>
                          <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Selected Customisations:</div>
                          {item.customisations.map((c, cIdx) => (
                            <div key={cIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#16a34a' }}>
                              <span>+ {c.name}</span>
                              <span>₹{Number(c.price).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Cost Summary calculations */}
              <div style={{ marginTop: '16px', padding: '12px', borderTop: '1px solid var(--color-border)', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal Amount</span>
                  <span>₹{(detailsItem.totalAmount - detailsItem.taxAmount + detailsItem.discountAmount).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Taxes & G.S.T</span>
                  <span style={{ color: 'var(--color-text-main)' }}>+ ₹{Number(detailsItem.taxAmount).toFixed(2)}</span>
                </div>
                {detailsItem.discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-success)' }}>Applied Discounts / Offers</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>- ₹{Number(detailsItem.discountAmount).toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '6px', marginTop: '4px', fontSize: '12px', fontWeight: 700 }}>
                  <span>Total Bill Amount</span>
                  <span style={{ color: 'var(--color-primary)' }}>₹{detailsItem.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      /* ─── PAYMENT DETAILS VIEW ─── */
      ) : activeTab === 'payments' && detailsItem ? (
        (() => {
          const linkedOrder = orders.find(o => o.id === detailsItem.orderId);
          if (!linkedOrder) {
            return (
              <div style={{ maxWidth: '600px' }}>
                <div className="card" style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Transaction Receipt</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Transaction ID</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{detailsItem.transactionId || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Reference Ref ID</span>
                      <span style={{ fontFamily: 'monospace' }}>{detailsItem.referenceId || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Timestamp</span>
                      <span>{formatDate(detailsItem.timestamp)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Source Kiosk</span>
                      <span style={{ fontWeight: 500 }}>{detailsItem.kioskName} ({detailsItem.kioskCode})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Payment Rule</span>
                      <span>{detailsItem.paymentMethod}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Linked Order ID</span>
                      <span style={{ fontFamily: 'monospace', color: 'var(--color-primary)', fontWeight: 600 }}>{detailsItem.orderId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Total Paid Amount</span>
                      <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--color-primary)' }}>₹{detailsItem.amount.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '4px' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Status State</span>
                      {getPaymentStatusBadge(detailsItem.status)}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', alignItems: 'start' }}>
              {/* Left Column: Transaction + Customer Contact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="card" style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Transaction Receipt</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Transaction ID</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{detailsItem.transactionId || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Reference Ref ID</span>
                      <span style={{ fontFamily: 'monospace' }}>{detailsItem.referenceId || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Timestamp</span>
                      <span>{formatDate(detailsItem.timestamp)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Source Kiosk</span>
                      <span style={{ fontWeight: 500 }}>{detailsItem.kioskName} ({detailsItem.kioskCode})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Payment Rule</span>
                      <span>{detailsItem.paymentMethod}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Linked Order ID</span>
                      <span style={{ fontFamily: 'monospace', color: 'var(--color-primary)', fontWeight: 600 }}>{detailsItem.orderId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Total Paid Amount</span>
                      <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--color-primary)' }}>₹{detailsItem.amount.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '4px' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Status State</span>
                      {getPaymentStatusBadge(detailsItem.status)}
                    </div>
                  </div>
                </div>

                {linkedOrder.customerMobile ? (
                  <div className="card" style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>Customer Contact</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Mobile</span>
                        <span style={{ fontWeight: 600 }}>{linkedOrder.customerMobile}</span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Right Column: Linked Order Items & Pricing Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="card" style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Linked Order Specification (Token #{linkedOrder.token})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {linkedOrder.items.map((item, idx) => {
                      const itemPrice = Number(item.price);
                      const subTotal = (itemPrice + item.customisations.reduce((sum, c) => sum + Number(c.price), 0)) * item.quantity;
                      return (
                        <div key={idx} style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: '#f8fafc' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span style={{ fontSize: '11px', fontWeight: 700 }}>{item.name}</span>
                              <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginLeft: '6px' }}>{item.type}</span>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600 }}>₹{subTotal.toFixed(2)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                            <span>Qty: {item.quantity} × ₹{itemPrice.toFixed(2)}</span>
                          </div>
                          {item.customisations.length > 0 && (
                            <div style={{ marginTop: '6px', borderTop: '1px dashed var(--color-border)', paddingTop: '4px' }}>
                              <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Selected Customisations:</div>
                              {item.customisations.map((c, cIdx) => (
                                <div key={cIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#16a34a' }}>
                                  <span>+ {c.name}</span>
                                  <span>₹{Number(c.price).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Calculations */}
                  <div style={{ marginTop: '16px', padding: '12px', borderTop: '1px solid var(--color-border)', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal Amount</span>
                      <span>₹{(linkedOrder.totalAmount - linkedOrder.taxAmount + linkedOrder.discountAmount).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Taxes & G.S.T</span>
                      <span style={{ color: 'var(--color-text-main)' }}>+ ₹{Number(linkedOrder.taxAmount).toFixed(2)}</span>
                    </div>
                    {linkedOrder.discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-success)' }}>Applied Discounts</span>
                        <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>- ₹{Number(linkedOrder.discountAmount).toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '6px', marginTop: '4px', fontSize: '12px', fontWeight: 700 }}>
                      <span>Total Bill Amount</span>
                      <span style={{ color: 'var(--color-primary)' }}>₹{linkedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      ) : null}

      {/* ─── FILTER DIALOG ─── */}
      {filterOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '400px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Filter Transactions</h3>
              <button className="modal-close" onClick={() => setFilterOpen(false)}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeTab === 'orders' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Order Status</label>
                  <select value={activeFilters.orderStatus} onChange={(e) => setActiveFilters(prev => ({ ...prev, orderStatus: e.target.value }))} className="form-control" style={{ height: '32px', fontSize: '12px' }}>
                    <option value="">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Payment Pending">Payment Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Payment Status</label>
                <select value={activeFilters.paymentStatus} onChange={(e) => setActiveFilters(prev => ({ ...prev, paymentStatus: e.target.value }))} className="form-control" style={{ height: '32px', fontSize: '12px' }}>
                  <option value="">All States</option>
                  <option value="Successful">Successful</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Source Kiosk Terminal</label>
                <select value={activeFilters.kioskId} onChange={(e) => setActiveFilters(prev => ({ ...prev, kioskId: e.target.value }))} className="form-control" style={{ height: '32px', fontSize: '12px' }}>
                  <option value="">All Kiosks</option>
                  {kiosks.map(k => (
                    <option key={k.id} value={k.id}>{k.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Payment Method Rule</label>
                <select value={activeFilters.paymentMethod} onChange={(e) => setActiveFilters(prev => ({ ...prev, paymentMethod: e.target.value }))} className="form-control" style={{ height: '32px', fontSize: '12px' }}>
                  <option value="">All Methods</option>
                  <option value="UPI">UPI Pay</option>
                  <option value="Card">Debit/Credit Card</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => { setActiveFilters({ orderStatus: '', paymentStatus: '', kioskId: '', paymentMethod: '' }); setFilterOpen(false); }}>Reset Filters</button>
              <button className="btn btn-primary" onClick={() => setFilterOpen(false)}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KioskOrders;
