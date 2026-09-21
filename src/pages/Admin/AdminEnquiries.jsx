import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiMail, FiPhone, FiEye, FiRefreshCw, FiInbox,
  FiLoader, FiX, FiCopy, FiUser, FiBookOpen, FiClock,
  FiCheckCircle, FiXCircle, FiInfo, FiAtSign, FiMessageSquare,
  FiBriefcase, FiCalendar, FiChevronDown, FiChevronUp,
  FiUnlock, FiLock, FiUsers, FiPlus, FiMinus, FiTrash2,
  FiAlertCircle, FiSave, FiRotateCcw, FiPackage
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import enquiryApi from '../../services/EnquiryApi';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [institutions, setInstitutions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expandedInstitutions, setExpandedInstitutions] = useState({});
  const [viewMode, setViewMode] = useState('institutions'); 
  const [copySuccess, setCopySuccess] = useState('');
  
  // Limit management state
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitData, setLimitData] = useState({
    institutionId: null,
    institutionName: '',
    customLimit: 10,
    selectedPlanId: '' // ✅ NEW
  });
  const [savingLimit, setSavingLimit] = useState(false);
  const [resettingLimit, setResettingLimit] = useState(null);

  // ✅ NEW: Plans state
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);

  const DEFAULT_FREE_LIMIT = 5;

  // ============ FETCH ENQUIRIES + LIMITS FROM BACKEND ============
  const fetchAllEnquiries = async () => {
    setIsLoading(true);
    try {
      // ✅ NEW: Fetch plans too
      setPlansLoading(true);
      try {
        const plansResult = await enquiryApi.getAllPlans();
        if (plansResult && plansResult.success && Array.isArray(plansResult.data)) {
          setPlans(plansResult.data);
          console.log(`📋 Loaded ${plansResult.data.length} plans`);
        }
      } catch (planErr) {
        console.warn('⚠️ Could not fetch plans:', planErr);
      } finally {
        setPlansLoading(false);
      }

      console.log('📡 Fetching all enquiries...');
      const result = await enquiryApi.getAllEnquiries({ limit: 500 });

      let enquiriesData = [];

      if (result && result.success && result.data) {
        enquiriesData = Array.isArray(result.data) ? result.data : [];
      } else if (result && Array.isArray(result)) {
        enquiriesData = result;
      } else if (result && result.enquiries) {
        enquiriesData = result.enquiries;
      }

      if (!Array.isArray(enquiriesData)) {
        enquiriesData = [];
      }

      console.log(`📋 Loaded ${enquiriesData.length} enquiries`);
      setEnquiries(enquiriesData);

      let savedLimits = {};
      try {
        const limitsResult = await enquiryApi.getAllInstitutionLimits();
        console.log('📊 Limits result:', limitsResult);
        
        if (limitsResult && limitsResult.success && Array.isArray(limitsResult.data)) {
          limitsResult.data.forEach(limit => {
            savedLimits[limit.institutionId] = {
              customLimit: limit.customLimit || 0,
              totalLimit: limit.totalLimit || DEFAULT_FREE_LIMIT,
              updatedAt: limit.updatedAt || limit.lastUpdatedAt,
              planName: limit.planName || null,  // ✅ NEW
              planId: limit.planId || null        // ✅ NEW
            };
          });
        }
      } catch (e) {
        console.warn('⚠️ Could not fetch limits from API, using localStorage');
        savedLimits = JSON.parse(localStorage.getItem('institutionLimits') || '{}');
      }

      // Group by institution
      const grouped = {};
      enquiriesData.forEach(enquiry => {
        const instId = enquiry.institutionId || 'unknown';
        if (!grouped[instId]) {
          const savedLimit = savedLimits[instId];
          grouped[instId] = {
            id: instId,
            name: enquiry.institutionName || 'Unknown Institution',
            type: enquiry.institutionType || 'Unknown',
            email: enquiry.institutionEmail,
            phone: enquiry.institutionPhone,
            enquiries: [],
            stats: {
              total: 0,
              pending: 0,
              responded: 0,
              closed: 0
            },
            // Limit info
            freeLimit: DEFAULT_FREE_LIMIT,
            customLimit: savedLimit?.customLimit || 0,
            totalLimit: DEFAULT_FREE_LIMIT + (savedLimit?.customLimit || 0),
            lastUpdated: savedLimit?.updatedAt || null,
            assignedPlan: savedLimit?.planName || null // ✅ NEW
          };
        }
        grouped[instId].enquiries.push(enquiry);
        grouped[instId].stats.total++;
        if (enquiry.status === 'pending') grouped[instId].stats.pending++;
        if (enquiry.status === 'responded') grouped[instId].stats.responded++;
        if (enquiry.status === 'closed') grouped[instId].stats.closed++;
      });

      setInstitutions(grouped);
      console.log(`📋 Grouped into ${Object.keys(grouped).length} institutions`);

    } catch (error) {
      console.error('❌ Error fetching enquiries:', error);
      toast.error('Failed to load enquiries');
    } finally {
      setIsLoading(false);
    }
  };

  // ============ UPDATE INSTITUTION LIMIT (BACKEND API) ============
  const handleUpdateLimit = async () => {
    const { institutionId, customLimit } = limitData;

    if (!institutionId) {
      toast.error('Institution not found');
      return;
    }

    if (customLimit < 0) {
      toast.warning('Limit cannot be negative');
      return;
    }

    setSavingLimit(true);

    try {
      const institution = institutions[institutionId];

      // ✅ Get the selected plan details
      const selectedPlan = plans.find(p => p.id === limitData.selectedPlanId);

      const result = await enquiryApi.setInstitutionLimit(institutionId, {
        customLimit: Number(customLimit),
        institutionName: institution?.name || '',
        institutionType: institution?.type || '',
        institutionEmail: institution?.email || '',
        // ✅ NEW: plan info
        planId: limitData.selectedPlanId || null,
        planName: selectedPlan?.name || null,
        planPrice: selectedPlan?.price || null,
        note: selectedPlan
          ? `Assigned plan: ${selectedPlan.name}`
          : 'Updated by admin from dashboard'
      });

      if (result && result.success) {
        toast.success(`Limit updated for ${limitData.institutionName}!`);

        // Update local state
        setInstitutions(prev => ({
          ...prev,
          [institutionId]: {
            ...prev[institutionId],
            customLimit: Number(customLimit),
            totalLimit: DEFAULT_FREE_LIMIT + Number(customLimit),
            lastUpdated: new Date().toISOString(),
            assignedPlan: selectedPlan?.name || prev[institutionId]?.assignedPlan // ✅ NEW
          }
        }));

        setShowLimitModal(false);
        setLimitData({
          institutionId: null,
          institutionName: '',
          customLimit: 10,
          selectedPlanId: '' // ✅ reset
        });
      } else {
        toast.error(result.message || 'Failed to update limit');
      }

    } catch (error) {
      console.error('Error updating limit:', error);
      toast.error('Failed to update limit');
    } finally {
      setSavingLimit(false);
    }
  };

  // ============ RESET LIMIT (BACKEND API) ============
  const handleResetLimit = async (institutionId) => {
    if (!window.confirm('Reset this institution limit to default (5 free)?')) return;

    setResettingLimit(institutionId);

    try {
      const result = await enquiryApi.resetInstitutionLimit(institutionId);

      if (result && result.success) {
        toast.success('Limit reset to default');

        setInstitutions(prev => ({
          ...prev,
          [institutionId]: {
            ...prev[institutionId],
            customLimit: 0,
            totalLimit: DEFAULT_FREE_LIMIT,
            lastUpdated: null,
            assignedPlan: null // ✅ NEW
          }
        }));
      } else {
        toast.error(result.message || 'Failed to reset limit');
      }
    } catch (error) {
      console.error('Error resetting limit:', error);
      toast.error('Failed to reset limit');
    } finally {
      setResettingLimit(null);
    }
  };

  // ============ INITIAL LOAD ============
  useEffect(() => {
    fetchAllEnquiries();
  }, []);

  // ============ COMPUTED DATA ============
  const institutionList = useMemo(() => {
    let list = Object.values(institutions);

    if (filterType !== 'all') {
      list = list.filter(inst => 
        inst.type?.toLowerCase().includes(filterType.toLowerCase())
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(inst =>
        inst.name?.toLowerCase().includes(term) ||
        inst.email?.toLowerCase().includes(term) ||
        inst.enquiries.some(e =>
          e.parentName?.toLowerCase().includes(term) ||
          e.parentEmail?.toLowerCase().includes(term) ||
          e.subject?.toLowerCase().includes(term)
        )
      );
    }

    list.sort((a, b) => b.stats.total - a.stats.total);
    return list;
  }, [institutions, filterType, searchTerm]);

  const stats = useMemo(() => {
    const all = Object.values(institutions);
    return {
      totalInstitutions: all.length,
      totalEnquiries: all.reduce((sum, i) => sum + i.stats.total, 0),
      pending: all.reduce((sum, i) => sum + i.stats.pending, 0),
      responded: all.reduce((sum, i) => sum + i.stats.responded, 0),
      closed: all.reduce((sum, i) => sum + i.stats.closed, 0),
      limitedInstitutions: all.filter(i => i.stats.total > i.totalLimit).length
    };
  }, [institutions]);

  // ============ HANDLERS ============
  const copyToClipboard = (text, label = 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(label);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const toggleInstitutionExpand = (instId) => {
    setExpandedInstitutions(prev => ({
      ...prev,
      [instId]: !prev[instId]
    }));
  };

  const handleUpdateStatus = async (enquiryId, newStatus) => {
    try {
      const result = await enquiryApi.updateEnquiryStatus(enquiryId, newStatus);
      if (result && result.success) {
        toast.success(`Status updated to ${newStatus}`);
        await fetchAllEnquiries();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    if (!window.confirm('Delete this enquiry?')) return;

    try {
      const result = await enquiryApi.deleteEnquiry(enquiryId);
      if (result && result.success) {
        toast.success('Enquiry deleted');
        await fetchAllEnquiries();
      } else {
        toast.error('Failed to delete enquiry');
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      toast.error('Failed to delete enquiry');
    }
  };

  const openLimitModal = (institution) => {
    setLimitData({
      institutionId: institution.id,
      institutionName: institution.name,
      customLimit: institution.customLimit || 0,
      selectedPlanId: '' // ✅ reset
    });
    setShowLimitModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'responded': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'closed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return FiClock;
      case 'responded': return FiCheckCircle;
      case 'closed': return FiXCircle;
      default: return FiClock;
    }
  };

  const getTypeColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('school')) return 'bg-blue-100 text-blue-700';
    if (t.includes('college') && !t.includes('pu')) return 'bg-purple-100 text-purple-700';
    if (t.includes('pu')) return 'bg-indigo-100 text-indigo-700';
    if (t.includes('coaching') || t.includes('tuition')) return 'bg-pink-100 text-pink-700';
    if (t.includes('teacher')) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  // ============ RENDER LIMIT MODAL ============
  const renderLimitModal = () => {
    if (!showLimitModal) return null;

    const institution = institutions[limitData.institutionId];
    if (!institution) return null;

    const currentLimit = institution.totalLimit;
    const totalEnquiries = institution.stats.total;
    const customLimit = limitData.customLimit;
    const newTotalLimit = DEFAULT_FREE_LIMIT + customLimit;
    const hasExistingCustomLimit = institution.customLimit > 0;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FiUnlock className="text-orange-500" />
                  Manage Enquiry Limit
                </h3>
                <p className="text-sm font-bold text-orange-500 mt-1">
                  {institution.name}  
                </p>
              </div>
              <button
                onClick={() => setShowLimitModal(false)}
                disabled={savingLimit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">

            {/* Current Status */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-800">{totalEnquiries}</p>
                <p className="text-xs text-gray-500 mt-1">Total Enquiries</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{currentLimit}</p>
                <p className="text-xs text-blue-600 mt-1">Current Limit</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{newTotalLimit}</p>
                <p className="text-xs text-green-600 mt-1">New Limit</p>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-blue-700 flex items-start gap-2">
                <FiInfo className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Default free limit is <strong>{DEFAULT_FREE_LIMIT}</strong> enquiries.
                  Add more to let the institution see additional enquiries.
                </span>
              </p>
            </div>

            {/* ✅ NEW: Select Plan Dropdown */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                <FiPackage className="w-4 h-4 text-orange-500" />
                Select Plan
              </label>
              <select
                value={limitData.selectedPlanId}
                onChange={(e) => {
                  const planId = e.target.value;
                  const selectedPlan = plans.find(p => p.id === planId);
                  setLimitData(prev => ({
                    ...prev,
                    selectedPlanId: planId,
                    // ✅ Auto-fill the custom limit from the plan
                    customLimit: selectedPlan ? Number(selectedPlan.enquiries) : prev.customLimit
                  }));
                }}
                disabled={savingLimit || plansLoading}
                className="w-full px-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-all disabled:opacity-50"
              >
                <option value="">
                  {plansLoading ? 'Loading plans...' : '— Choose a plan (or set manually below) —'}
                </option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} — {plan.enquiries} enquiries — ₹{plan.price.toLocaleString()}
                    {plan.isActive ? '' : ' (Inactive)'}
                  </option>
                ))}
              </select>

              {/* Show selected plan preview */}
              {limitData.selectedPlanId && (() => {
                const p = plans.find(x => x.id === limitData.selectedPlanId);
                if (!p) return null;
                return (
                  <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <span className="text-gray-600">
                        <strong className="text-gray-800">{p.name}</strong> — {p.enquiries} enquiries
                      </span>
                      <span className="font-bold text-orange-600">
                        ₹{p.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Custom Limit Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Additional Enquiries to Unlock
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLimitData(prev => ({
                    ...prev,
                    customLimit: Math.max(0, prev.customLimit - 5)
                  }))}
                  disabled={savingLimit}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <FiMinus className="w-4 h-4 text-gray-600" />
                </button>
                <input
                  type="number"
                  value={customLimit}
                  onChange={(e) => setLimitData(prev => ({
                    ...prev,
                    customLimit: Math.max(0, parseInt(e.target.value) || 0)
                  }))}
                  disabled={savingLimit}
                  className="flex-1 px-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:bg-white text-center font-semibold text-lg disabled:opacity-50"
                  min="0"
                />
                <button
                  onClick={() => setLimitData(prev => ({
                    ...prev,
                    customLimit: prev.customLimit + 5
                  }))}
                  disabled={savingLimit}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <FiPlus className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Quick Select */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[0, 5, 10, 20, 50, 100].map(num => (
                  <button
                    key={num}
                    onClick={() => setLimitData(prev => ({ ...prev, customLimit: num }))}
                    disabled={savingLimit}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      customLimit === num
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    {num === 0 ? 'None' : `+${num}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Free enquiries:</span>
                  <span className="font-semibold text-gray-800">{DEFAULT_FREE_LIMIT}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Additional unlocked:</span>
                  <span className="font-semibold text-green-600">+{customLimit}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                  <span className="text-sm font-semibold text-gray-700">Total visible to institution:</span>
                  <span className="font-bold text-orange-600 text-lg">{newTotalLimit}</span>
                </div>
              </div>
            </div>

            {/* Reset Option */}
            {hasExistingCustomLimit && (
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-red-700">Reset Limit</p>
                    <p className="text-xs text-red-600 mt-0.5">
                      Set back to default {DEFAULT_FREE_LIMIT} free enquiries
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowLimitModal(false);
                      handleResetLimit(institution.id);
                    }}
                    disabled={resettingLimit === institution.id}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm flex items-center gap-1 disabled:opacity-50"
                  >
                    {resettingLimit === institution.id ? (
                      <FiLoader className="w-4 h-4 animate-spin" />
                    ) : (
                      <FiRotateCcw className="w-4 h-4" />
                    )}
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLimitModal(false)}
                disabled={savingLimit}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateLimit}
                disabled={savingLimit}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {savingLimit ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============ RENDER DETAIL MODAL ============
  const renderDetailModal = () => {
    if (!showDetailModal || !selectedEnquiry) return null;

    const enquiry = selectedEnquiry;
    const StatusIcon = getStatusIcon(enquiry.status);

    return (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
        onClick={() => setShowDetailModal(false)}
      >
        <div 
          className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(enquiry.status)} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                  </span>
                  {enquiry.preferredContact && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1">
                      <FiAtSign className="w-3 h-3" />
                      Prefers: {enquiry.preferredContact}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{enquiry.subject}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  <FiCalendar className="inline w-3 h-3 mr-1" />
                  {new Date(enquiry.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Institution Info */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <h4 className="text-sm font-semibold text-orange-700 mb-3 flex items-center gap-2">
                <FiBriefcase className="w-4 h-4" />
                Institution Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-gray-800 font-medium">{enquiry.institutionName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-gray-800 font-medium">{enquiry.institutionType}</p>
                </div>
                {enquiry.institutionEmail && (
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a href={`mailto:${enquiry.institutionEmail}`} className="text-blue-600 hover:underline text-sm">
                      {enquiry.institutionEmail}
                    </a>
                  </div>
                )}
                {enquiry.institutionPhone && (
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <a href={`tel:${enquiry.institutionPhone}`} className="text-green-600 hover:underline text-sm">
                      {enquiry.institutionPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Parent Info */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FiUser className="w-4 h-4" />
                Parent Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-gray-800 font-medium">{enquiry.parentName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <a 
                      href={`mailto:${enquiry.parentEmail}?subject=Re: ${enquiry.subject}`}
                      className="text-blue-600 hover:underline text-sm truncate"
                    >
                      {enquiry.parentEmail}
                    </a>
                  </div>
                </div>
                {enquiry.parentPhone && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500">Phone</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href={`tel:${enquiry.parentPhone}`} className="text-green-600 hover:underline font-medium">
                        {enquiry.parentPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Student Info */}
            {(enquiry.studentName || enquiry.studentClass) && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <FiBookOpen className="w-4 h-4" />
                  Student Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {enquiry.studentName && (
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-gray-800 font-medium">{enquiry.studentName}</p>
                    </div>
                  )}
                  {enquiry.studentClass && (
                    <div>
                      <p className="text-xs text-gray-500">Class</p>
                      <p className="text-gray-800 font-medium">{enquiry.studentClass}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Message */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FiMessageSquare className="w-4 h-4" />
                Message
              </h4>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{enquiry.message}</p>
            </div>

            {/* Responses */}
            {enquiry.responses && enquiry.responses.length > 0 && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <FiMessageSquare className="w-4 h-4" />
                  Responses ({enquiry.responses.length})
                </h4>
                <div className="space-y-2">
                  {enquiry.responses.map((response, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700 font-medium">{response.responseBy}</span>
                        <span className="text-gray-500">
                          {new Date(response.createdAt).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{response.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <select
                value={enquiry.status}
                onChange={(e) => {
                  handleUpdateStatus(enquiry.id || enquiry.enquiryId, e.target.value);
                  setShowDetailModal(false);
                }}
                className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500"
              >
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>

              <button
                onClick={() => {
                  if (window.confirm('Delete this enquiry?')) {
                    handleDeleteEnquiry(enquiry.id || enquiry.enquiryId);
                    setShowDetailModal(false);
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2 ml-auto"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============ MAIN RENDER ============
  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiInbox className="text-orange-500" />
            Enquiries by Institution
          </h1>
          <p className="text-gray-500 mt-1">
            Manage enquiries grouped by institution and control visibility limits
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-lg p-1 shadow">
            <button
              onClick={() => setViewMode('institutions')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'institutions' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiBriefcase className="inline w-4 h-4 mr-1" />
              By Institution
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'all' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiInbox className="inline w-4 h-4 mr-1" />
              All Enquiries
            </button>
          </div>

          <button
            onClick={fetchAllEnquiries}
            disabled={isLoading}
            className="bg-orange-600 text-white px-5 py-2.5 rounded-lg hover:bg-orange-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Institutions</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalInstitutions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Enquiries</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalEnquiries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Limited Institutions</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.limitedInstitutions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search institutions, parents, enquiries..."
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            >
              <option value="all">All Institution Types</option>
              <option value="school">Schools</option>
              <option value="college">Colleges</option>
              <option value="pu">PU Colleges</option>
              <option value="coaching">Coaching/Tuition</option>
              <option value="teacher">Teachers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="bg-white rounded-xl p-12 text-center shadow">
          <FiLoader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading enquiries...</p>
        </div>
      ) : viewMode === 'institutions' ? (
        // ============ INSTITUTION VIEW ============
        <div className="space-y-4">
          {institutionList.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow">
              <FiInbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Institutions Found</h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No institutions have enquiries yet'}
              </p>
            </div>
          ) : (
            institutionList.map((institution) => {
              const isExpanded = expandedInstitutions[institution.id];
              const totalLimit = institution.totalLimit;
              const totalEnquiries = institution.stats.total;
              const visibleCount = Math.min(totalLimit, totalEnquiries);
              const lockedCount = Math.max(0, totalEnquiries - totalLimit);
              const isLimited = lockedCount > 0;

              return (
                <div
                  key={institution.id}
                  className="bg-white rounded-xl shadow hover:shadow-md transition-all overflow-hidden border-l-4 border-l-orange-400"
                >
                  {/* Institution Header */}
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Institution Avatar */}
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-white font-bold text-xl">
                            {institution.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-lg font-bold text-gray-800 truncate">
                              {institution.name}
                            </h3>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(institution.type)}`}>
                              {institution.type}
                            </span>
                            {isLimited ? (
                              <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
                                <FiLock className="w-3 h-3" />
                                {lockedCount} Hidden
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                                <FiUnlock className="w-3 h-3" />
                                All Visible
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            {institution.email && (
                              <span className="flex items-center gap-1">
                                <FiMail className="w-3.5 h-3.5 text-blue-500" />
                                {institution.email}
                              </span>
                            )}
                            {institution.phone && (
                              <span className="flex items-center gap-1">
                                <FiPhone className="w-3.5 h-3.5 text-green-500" />
                                {institution.phone}
                              </span>
                            )}
                          </div>

                          {/* Stats Row */}
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                              Total: <strong>{institution.stats.total}</strong>
                            </span>
                            <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                              Limit: <strong>{totalLimit}</strong>
                            </span>
                            <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full">
                              Visible: <strong>{visibleCount}</strong>
                            </span>
                            {isLimited && (
                              <span className="text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-full">
                                Hidden: <strong>{lockedCount}</strong>
                              </span>
                            )}
                          </div>

                          {/* Limit Info */}
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                            <FiInfo className="w-3 h-3" />
                            <span>
                              Free: <strong>{DEFAULT_FREE_LIMIT}</strong>
                              {institution.customLimit > 0 && (
                                <> • Additional: <strong className="text-green-600">+{institution.customLimit}</strong></>
                              )}
                              {institution.lastUpdated && (
                                <> • Updated: {new Date(institution.lastUpdated).toLocaleDateString('en-IN')}</>
                              )}
                            </span>
                          </div>

                          {/* ✅ NEW: Assigned Plan badge */}
                          {institution.assignedPlan && (
                            <div className="mt-2">
                              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full border border-orange-200 font-medium">
                                <FiPackage className="w-3 h-3" />
                                {institution.assignedPlan}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => openLimitModal(institution)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all text-sm flex items-center gap-2 shadow-md shadow-green-500/20"
                        >
                          <FiUnlock className="w-4 h-4" />
                          Manage Limit
                        </button>

                        {/* <button
                          onClick={() => toggleInstitutionExpand(institution.id)}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all text-sm flex items-center gap-2"
                        >
                          <FiEye className="w-4 h-4" />
                          {isExpanded ? 'Hide' : 'View'} Enquiries
                          {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                        </button> */}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Enquiries */}
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
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <FiInbox className="w-4 h-4 text-orange-500" />
                              Enquiries ({institution.enquiries.length})
                            </h4>
                            {isLimited && (
                              <span className="text-xs text-red-600 flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                                <FiLock className="w-3 h-3" />
                                {lockedCount} enquiries not visible to institution
                              </span>
                            )}
                          </div>

                          <div className="space-y-3">
                            {institution.enquiries
                              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                              .map((enquiry, index) => {
                                const StatusIcon = getStatusIcon(enquiry.status);
                                const isVisible = index < visibleCount;

                                return (
                                  <div
                                    key={enquiry.id || enquiry.enquiryId}
                                    className={`bg-white rounded-lg p-4 border transition-all ${
                                      isVisible 
                                        ? 'border-gray-200 hover:border-orange-300' 
                                        : 'border-red-200 bg-red-50/30'
                                    }`}
                                  >
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)} flex items-center gap-1`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {enquiry.status}
                                          </span>
                                          {isVisible ? (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                                              <FiEye className="w-3 h-3" />
                                              Visible to Institution
                                            </span>
                                          ) : (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs flex items-center gap-1">
                                              <FiLock className="w-3 h-3" />
                                              Hidden from Institution
                                            </span>
                                          )}
                                          <span className="text-xs text-gray-400">
                                            {new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
                                              day: '2-digit',
                                              month: 'short',
                                              year: 'numeric'
                                            })}
                                          </span>
                                        </div>

                                        <h5 className="font-semibold text-gray-800 text-sm">
                                          {enquiry.subject}
                                        </h5>

                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                                          <span className="flex items-center gap-1">
                                            <FiUser className="w-3 h-3 text-purple-500" />
                                            {enquiry.parentName}
                                          </span>
                                          
                                          {enquiry.studentClass && (
                                            <span className="flex items-center gap-1">
                                              <FiBookOpen className="w-3 h-3 text-orange-500" />
                                              Class {enquiry.studentClass}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                                        <button
                                          onClick={() => {
                                            setSelectedEnquiry(enquiry);
                                            setShowDetailModal(true);
                                          }}
                                          className="px-2.5 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all text-xs flex items-center gap-1"
                                        >
                                          <FiEye className="w-3 h-3" />
                                          View
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>

                          {/* Limit Info Banner */}
                          {isLimited && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                              <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-orange-100 rounded-lg">
                                    <FiLock className="w-5 h-5 text-orange-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-orange-700">
                                      {lockedCount} enquiries are hidden from this institution
                                    </p>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                      The institution can only see the first {totalLimit} enquiries. Contact support to increase their limit.
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => openLimitModal(institution)}
                                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all text-sm flex items-center gap-2 shadow-md shadow-green-500/20"
                                >
                                  <FiUnlock className="w-4 h-4" />
                                  Adjust Limit
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      ) : (
        // ============ ALL ENQUIRIES VIEW ============
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">
              All Enquiries ({Object.values(institutions).reduce((sum, i) => sum + i.stats.total, 0)})
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {Object.values(institutions).flatMap(inst => 
              inst.enquiries.map(e => ({ ...e, institutionName: inst.name }))
            )
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((enquiry) => {
              const StatusIcon = getStatusIcon(enquiry.status);
              return (
                <div
                  key={enquiry.id || enquiry.enquiryId}
                  className="p-5 hover:bg-gray-50 transition-all"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {enquiry.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(enquiry.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <h5 className="font-semibold text-gray-800">{enquiry.subject}</h5>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <FiBriefcase className="w-3 h-3 text-orange-500" />
                          {enquiry.institutionName}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiUser className="w-3 h-3 text-purple-500" />
                          {enquiry.parentName}
                        </span>
                        {enquiry.parentEmail && (
                          <span className="flex items-center gap-1">
                            <FiMail className="w-3 h-3 text-blue-500" />
                            {enquiry.parentEmail}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setSelectedEnquiry(enquiry);
                          setShowDetailModal(true);
                        }}
                        className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all text-sm flex items-center gap-1"
                      >
                        <FiEye className="w-3 h-3" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      {renderLimitModal()}
      {renderDetailModal()}
    </div>
  );
};

export default AdminEnquiries;