import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage, FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiCheck,
  FiStar, FiDollarSign, FiUsers, FiEye, FiEyeOff, FiLoader,
  FiAlertCircle, FiRefreshCw, FiSearch, FiInfo, FiBriefcase,
  FiCalendar, FiChevronDown, FiChevronUp, FiUnlock, FiLock,
  FiRotateCcw, FiMinus, FiTrendingUp, FiAward, FiZap
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const DEFAULT_PLAN = {
  id: '',
  name: '',
  enquiries: 10,
  price: 500,
  originalPrice: 700,
  popular: false,
  isActive: true,
  order: 0,
  badge: '',
  badgeColor: '#f97316',
  features: [''],
  description: '',
  validityDays: 365
};

const BADGE_COLORS = [
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Teal', value: '#14b8a6' }
];

// ============ MOCK DATA ============
const MOCK_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    enquiries: 10,
    price: 500,
    originalPrice: 700,
    popular: false,
    isActive: true,
    order: 0,
    badge: '',
    badgeColor: '#f97316',
    features: ['10 additional enquiries', 'Email & phone access', 'Priority support'],
    validityDays: 365
  },
  {
    id: 'standard',
    name: 'Standard',
    enquiries: 25,
    price: 1000,
    originalPrice: 1500,
    popular: true,
    isActive: true,
    order: 1,
    badge: 'MOST POPULAR',
    badgeColor: '#8b5cf6',
    features: ['25 additional enquiries', 'Email & phone access', 'Priority support', 'Better visibility'],
    validityDays: 365
  },
  {
    id: 'premium',
    name: 'Premium',
    enquiries: 50,
    price: 1800,
    originalPrice: 2800,
    popular: false,
    isActive: true,
    order: 2,
    badge: 'BEST VALUE',
    badgeColor: '#22c55e',
    features: ['50 additional enquiries', 'Email & phone access', 'Priority support', 'Better visibility', 'Featured badge'],
    validityDays: 365
  },
  {
    id: 'starter',
    name: 'Starter',
    enquiries: 5,
    price: 250,
    originalPrice: 400,
    popular: false,
    isActive: false,
    order: 3,
    badge: '',
    badgeColor: '#3b82f6',
    features: ['5 additional enquiries', 'Email access'],
    validityDays: 180
  }
];

const AdminPlan = () => {
  const [plans, setPlans] = useState(MOCK_PLANS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_PLAN);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ============ STATS ============
  const stats = useMemo(() => {
    return {
      total: plans.length,
      active: plans.filter(p => p.isActive).length,
      inactive: plans.filter(p => !p.isActive).length,
      featured: plans.find(p => p.popular)?.name || 'None'
    };
  }, [plans]);

  // ============ FILTER ============
  const filteredPlans = useMemo(() => {
    let list = [...plans];
    if (filterActive === 'active') list = list.filter(p => p.isActive);
    if (filterActive === 'inactive') list = list.filter(p => !p.isActive);
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(term));
    }
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [plans, filterActive, searchTerm]);

  // ============ VALIDATION ============
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Plan name is required';
    if (!formData.enquiries || formData.enquiries < 1) errors.enquiries = 'Must be at least 1';
    if (!formData.price || formData.price < 0) errors.price = 'Valid price required';
    if (formData.originalPrice && formData.originalPrice < formData.price) {
      errors.originalPrice = 'Original price should be ≥ selling price';
    }
    if (!formData.features || formData.features.filter(f => f.trim()).length === 0) {
      errors.features = 'At least one feature required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ============ HANDLERS ============
  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData({ ...DEFAULT_PLAN, order: plans.length, features: [''] });
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      ...DEFAULT_PLAN,
      ...plan,
      features: plan.features?.length ? plan.features : ['']
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    const cleanData = {
      ...formData,
      features: formData.features.filter(f => f.trim()),
      name: formData.name.trim(),
      badge: formData.badge?.trim() || ''
    };

    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...cleanData, id: editingPlan.id } : p));
      toast.success('Plan updated successfully!');
    } else {
      setPlans(prev => [...prev, { ...cleanData, id: `plan_${Date.now()}` }]);
      toast.success('Plan created successfully!');
    }
    setShowModal(false);
  };

  const handleDelete = (planId) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
    toast.success('Plan deleted');
    setDeleteConfirm(null);
  };

  const handleToggleActive = (plan) => {
    setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, isActive: !p.isActive } : p));
    toast.success(`Plan ${!plan.isActive ? 'activated' : 'deactivated'}`);
  };

  const handleTogglePopular = (plan) => {
    setPlans(prev => prev.map(p =>
      p.id === plan.id ? { ...p, popular: !p.popular } : { ...p, popular: false }
    ));
    toast.success('Featured plan updated');
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => setFormData({ ...formData, features: [...formData.features, ''] });

  const removeFeature = (index) => {
    if (formData.features.length <= 1) return;
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  // ============ STYLE HELPERS (matching AdminEnquiries) ============
  const getPlanAccentColor = (plan) => {
    if (plan.popular) return 'border-l-purple-400';
    if (!plan.isActive) return 'border-l-gray-300';
    return 'border-l-orange-400';
  };

  const getPriceColor = (plan) => {
    if (plan.popular) return 'text-purple-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 bg-orange-50 min-h-screen">

      {/* ============ HEADER ============ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiPackage className="text-orange-500" />
            Pricing Plans Management
          </h1>
          <p className="text-gray-500 mt-1">
            Configure enquiry plans that institutions can purchase
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.info('Refreshed')}
            disabled={isLoading}
            className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleOpenCreate}
            className="bg-orange-600 text-white px-5 py-2.5 rounded-lg hover:bg-orange-700 transition-all flex items-center gap-2 shadow-sm font-medium"
          >
            <FiPlus className="w-4 h-4" />
            Create Plan
          </button>
        </div>
      </div>

      {/* ============ STATS CARDS ============ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Plans</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Inactive</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.inactive}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Featured Plan</p>
              <p className="text-2xl font-bold text-purple-600 mt-1 truncate">{stats.featured}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ FILTERS ============ */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search plans by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            >
              <option value="all">All Plans</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============ PLANS LIST ============ */}
      {isLoading ? (
        <div className="bg-white rounded-xl p-12 text-center shadow">
          <FiLoader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading plans...</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow">
          <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Plans Found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterActive !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first pricing plan to get started'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 transition-all inline-flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Create First Plan
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPlans.map((plan) => {
            const isExpanded = expandedPlan === plan.id;
            const discount = plan.originalPrice > plan.price
              ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
              : 0;
            const pricePerEnquiry = Math.round(plan.price / plan.enquiries);

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl shadow hover:shadow-md transition-all overflow-hidden border-l-4 ${getPlanAccentColor(plan)} ${
                  !plan.isActive ? 'opacity-70' : ''
                }`}
              >
                {/* PLAN HEADER */}
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

                    {/* LEFT: PLAN INFO */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Plan Avatar */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                        plan.popular
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                          : 'bg-gradient-to-br from-orange-500 to-amber-500'
                      }`}>
                        <FiPackage className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title Row */}
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-lg font-bold text-gray-800 truncate">
                            {plan.name}
                          </h3>
                          {plan.popular && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 flex items-center gap-1">
                              <FiStar className="w-3 h-3 fill-purple-700" />
                              POPULAR
                            </span>
                          )}
                          {plan.badge && !plan.popular && (
                            <span
                              className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: plan.badgeColor || '#f97316' }}
                            >
                              {plan.badge}
                            </span>
                          )}
                          {plan.isActive ? (
                            <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                              <FiUnlock className="w-3 h-3" />
                              Active
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
                              <FiLock className="w-3 h-3" />
                              Inactive
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        {/* Price Row */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-2">
                          <span className="flex items-center gap-1">
                            <FiDollarSign className={`w-3.5 h-3.5 ${getPriceColor(plan)}`} />
                            <span className="font-bold text-gray-800 text-base">₹{plan.price.toLocaleString()}</span>
                            {plan.originalPrice > plan.price && (
                              <span className="text-gray-400 line-through text-xs ml-1">
                                ₹{plan.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiPackage className="w-3.5 h-3.5 text-orange-500" />
                            <strong className="text-gray-800">{plan.enquiries}</strong> enquiries
                          </span>
                          <span className="flex items-center gap-1 text-xs">
                            <FiTrendingUp className="w-3.5 h-3.5 text-blue-500" />
                            ₹{pricePerEnquiry}/enquiry
                          </span>
                          <span className="flex items-center gap-1 text-xs">
                            <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                            Valid {plan.validityDays} days
                          </span>
                        </div>

                        {/* Features Preview */}
                        {plan.features?.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            {plan.features.slice(0, 3).map((feature, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1"
                              >
                                <FiCheck className="w-3 h-3 text-green-600" />
                                {feature}
                              </span>
                            ))}
                            {plan.features.length > 3 && (
                              <button
                                onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                                className="text-xs px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors flex items-center gap-1"
                              >
                                +{plan.features.length - 3} more
                                {isExpanded ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT: ACTIONS */}
                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggleActive(plan)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                          plan.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                        title={plan.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {plan.isActive ? <FiEye className="w-3.5 h-3.5" /> : <FiEyeOff className="w-3.5 h-3.5" />}
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </button>

                      <button
                        onClick={() => handleTogglePopular(plan)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                          plan.popular
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="Set as featured"
                      >
                        <FiStar className={`w-3.5 h-3.5 ${plan.popular ? 'fill-purple-700' : ''}`} />
                        {plan.popular ? 'Featured' : 'Feature'}
                      </button>

                      <button
                        onClick={() => handleOpenEdit(plan)}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all text-sm flex items-center gap-2"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteConfirm(plan)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm flex items-center gap-1.5"
                        title="Delete"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* EXPANDED FEATURES */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 bg-gray-50 overflow-hidden"
                    >
                      <div className="p-5">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                          <FiCheck className="w-4 h-4 text-green-600" />
                          All Features ({plan.features.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {plan.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 bg-white rounded-lg p-2.5 border border-gray-200"
                            >
                              <FiCheck className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* ============ CREATE / EDIT MODAL ============ */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* MODAL HEADER */}
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      {editingPlan ? <FiEdit2 className="text-orange-500" /> : <FiPlus className="text-orange-500" />}
                      {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                    </h3>
                    <p className="text-sm font-bold text-orange-500 mt-1">
                      {editingPlan ? `Editing: ${editingPlan.name}` : 'Configure a new pricing plan'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* MODAL BODY */}
              <div className="p-6 space-y-5">

                {/* NAME */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Plan Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Basic, Standard, Premium"
                    className={`w-full px-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border focus:outline-none transition-all ${
                      formErrors.name
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-200 focus:border-orange-500 focus:bg-white'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" /> {formErrors.name}
                    </p>
                  )}
                </div>

                {/* PRICING ROW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Enquiries <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 w-4 h-4" />
                      <input
                        type="number"
                        min="1"
                        value={formData.enquiries}
                        onChange={(e) => setFormData({ ...formData, enquiries: parseInt(e.target.value) || 0 })}
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border focus:outline-none transition-all ${
                          formErrors.enquiries
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-orange-500 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Selling Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 w-4 h-4" />
                      <input
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border focus:outline-none transition-all ${
                          formErrors.price
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-orange-500 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Original Price (₹)
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        min="0"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border focus:outline-none transition-all ${
                          formErrors.originalPrice
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-orange-500 focus:bg-white'
                        }`}
                      />
                    </div>
                    {formData.originalPrice > formData.price && formData.price > 0 && (
                      <p className="text-green-600 text-xs mt-1 font-medium">
                        {Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)}% OFF
                      </p>
                    )}
                  </div>
                </div>

                {/* BADGE + VALIDITY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Badge Label (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g., BEST VALUE, SAVE 30%"
                      className="w-full px-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                    />
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {BADGE_COLORS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, badgeColor: color.value })}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${
                            formData.badgeColor === color.value
                              ? 'border-gray-800 scale-110'
                              : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Validity (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.validityDays}
                      onChange={(e) => setFormData({ ...formData, validityDays: parseInt(e.target.value) || 365 })}
                      className="w-full px-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* FEATURES */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Features <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium"
                    >
                      <FiPlus className="w-3 h-3" /> Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FiCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                          className="flex-1 px-3 py-2 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-sm"
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-all"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {formErrors.features && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" /> {formErrors.features}
                    </p>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="2"
                    placeholder="Brief description of this plan..."
                    className="w-full px-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* TOGGLES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, popular: !formData.popular })}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                      formData.popular
                        ? 'bg-purple-50 border-purple-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <FiStar className={`w-5 h-5 ${formData.popular ? 'text-purple-600 fill-purple-600' : 'text-gray-400'}`} />
                    <div className="text-left flex-1">
                      <p className={`text-sm font-medium ${formData.popular ? 'text-purple-700' : 'text-gray-700'}`}>
                        Most Popular
                      </p>
                      <p className="text-xs text-gray-500">Highlight this plan</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-all flex items-center px-0.5 ${
                      formData.popular ? 'bg-purple-500 justify-end' : 'bg-gray-300 justify-start'
                    }`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                      formData.isActive
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <FiEye className={`w-5 h-5 ${formData.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    <div className="text-left flex-1">
                      <p className={`text-sm font-medium ${formData.isActive ? 'text-green-700' : 'text-gray-700'}`}>
                        Active
                      </p>
                      <p className="text-xs text-gray-500">Visible to institutions</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-all flex items-center px-0.5 ${
                      formData.isActive ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'
                    }`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow" />
                    </div>
                  </button>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-2xl flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all font-medium flex items-center gap-2 shadow-md shadow-orange-500/20"
                >
                  <FiSave className="w-4 h-4" />
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ DELETE CONFIRMATION ============ */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-200 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <FiAlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Delete Plan?</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-5">
                Are you sure you want to delete{' '}
                <strong className="text-gray-800">"{deleteConfirm.name}"</strong> plan?
                Institutions will no longer be able to purchase this plan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPlan;