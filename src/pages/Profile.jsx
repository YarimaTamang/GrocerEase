import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FiMapPin, FiGift, FiCreditCard, FiUser, FiEdit2, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi'
import { formatCurrency } from '../utils/helpers.js'
import { useAuth } from '../context/AuthContext.jsx'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  })
  
  // Load addresses from localStorage on component mount
  const [addresses, setAddresses] = useState(() => {
    const savedAddresses = localStorage.getItem(`addresses_${user?.id || 'guest'}`)
    return savedAddresses ? JSON.parse(savedAddresses) : [
      { id: 1, label: 'Home', detail: 'B-1203, Palm Residency, HSR Layout, Bengaluru' },
      { id: 2, label: 'Office', detail: 'GroceryEase HQ, Koramangala 5th Block, Bengaluru' },
    ]
  })
  
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: '', detail: '' })
  const [editingAddressId, setEditingAddressId] = useState(null)

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`addresses_${user?.id || 'guest'}`, JSON.stringify(addresses))
  }, [addresses, user?.id])

  // Mock profile data (in real app, this would come from backend)
  const profileData = {
    tier: 'Blink Green',
    wallet: 425,
    rewards: 4,
    recentOrders: [
      { id: 2342, value: 789, status: 'Delivered', eta: 'Nov 22, 8:10 PM' },
      { id: 2331, value: 356, status: 'Delivered', eta: 'Nov 20, 7:42 PM' },
    ],
  }

  const handleEdit = () => {
    setEditedUser({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || ''
    })
    setIsEditing(true)
  }

  const handleSave = () => {
    // In a real app, this would update the backend
    const updatedUser = { ...user, ...editedUser }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    window.location.reload() // Simple refresh to update the context
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedUser({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || ''
    })
  }

  const handleChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    })
  }

  // Address handling functions
  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.label.trim()) {
      toast.error('Please enter an address label (e.g., Home, Office)')
      return
    }
    if (!newAddress.detail || !newAddress.detail.trim()) {
      toast.error('Please enter the complete address')
      return
    }
    
    const address = {
      id: Date.now(),
      label: newAddress.label.trim(),
      detail: newAddress.detail.trim()
    }
    setAddresses([...addresses, address])
    setNewAddress({ label: '', detail: '' })
    setIsAddingAddress(false)
    toast.success('Address added successfully!')
  }

  const handleEditAddress = (id, field, value) => {
    const trimmedValue = value.trim()
    setAddresses(addresses.map(addr => 
      addr.id === id ? { ...addr, [field]: trimmedValue } : addr
    ))
  }

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id))
    toast.success('Address deleted successfully!')
  }

  const handleCancelEdit = () => {
    setEditingAddressId(null)
  }

  const handleSaveEdit = () => {
    const editedAddress = addresses.find(addr => addr.id === editingAddressId)
    if (!editedAddress.label.trim() || !editedAddress.detail.trim()) {
      toast.error('Address label and details cannot be empty')
      return
    }
    setEditingAddressId(null)
    toast.success('Address updated successfully!')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-slate-500">Please log in to view your profile</p>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-primary to-emerald-500 p-6 text-white shadow-card">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Your Kitchen ID</p>
            {isEditing ? (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleChange}
                  className="text-2xl font-semibold bg-white/20 border border-white/30 rounded px-2 py-1 w-full max-w-xs"
                  placeholder="Your Name"
                />
                <input
                  type="tel"
                  name="phone"
                  value={editedUser.phone}
                  onChange={handleChange}
                  className="text-white/80 bg-white/20 border border-white/30 rounded px-2 py-1 w-full max-w-xs block"
                  placeholder="Phone Number"
                />
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                  className="text-white/80 bg-white/20 border border-white/30 rounded px-2 py-1 w-full max-w-xs block"
                  placeholder="Email"
                />
              </div>
            ) : (
              <>
                <h1 className="mt-2 text-3xl font-semibold">{user.name || 'User'}</h1>
                <p className="text-white/80">{user.phone || 'No phone'}</p>
                <p className="text-white/80 text-sm">{user.email}</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-white/20 p-3 text-sm font-semibold">
              {profileData.tier}
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
                  title="Save"
                >
                  <FiSave size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
                  title="Cancel"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleEdit}
                className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
                title="Edit Profile"
              >
                <FiEdit2 size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-xs text-white/70">Wallet Balance</p>
            <p className="text-2xl font-semibold">{formatCurrency(profileData.wallet)}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-xs text-white/70">Rewards</p>
            <p className="text-2xl font-semibold">{profileData.rewards}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-xs text-white/70">Prime Slots</p>
            <p className="text-2xl font-semibold">6 left</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-card dark:bg-slate-900 dark:border dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-900">
            <FiMapPin /> <h2 className="text-lg font-semibold">Saved Addresses</h2>
          </div>
          
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-2xl border border-slate-100 px-4 py-3 text-sm text-slate-600"
            >
              {editingAddressId === address.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={address.label}
                    onChange={(e) => handleEditAddress(address.id, 'label', e.target.value)}
                    className="text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded px-2 py-1 w-full dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                    placeholder="Label"
                  />
                  <textarea
                    value={address.detail}
                    onChange={(e) => handleEditAddress(address.id, 'detail', e.target.value)}
                    className="text-slate-900 bg-slate-50 border border-slate-200 rounded px-2 py-1 w-full resize-none dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                    rows="2"
                    placeholder="Address details"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="text-xs font-semibold text-primary hover:text-primary/80"
                    >
                      <FiSave className="inline mr-1" />Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      <FiX className="inline mr-1" />Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{address.label}</p>
                      <p>{address.detail}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingAddressId(address.id)}
                        className="text-xs font-semibold text-primary hover:text-primary/80"
                        title="Edit address"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700"
                        title="Delete address"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <button className="mt-2 text-xs font-semibold text-primary">Deliver Here</button>
                </>
              )}
            </div>
          ))}

          {isAddingAddress ? (
            <div className="rounded-2xl border border-dashed border-primary bg-primary/5 p-4 dark:bg-slate-900/40">
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    className={`w-full text-sm font-semibold text-slate-900 bg-white border rounded px-3 py-2 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 ${
                      !newAddress.label.trim() ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="Address label (e.g., Home, Office)"
                    autoFocus
                  />
                  {!newAddress.label.trim() && (
                    <p className="mt-1 text-xs text-red-500">Please enter a label</p>
                  )}
                </div>
                <div>
                  <textarea
                    value={newAddress.detail}
                    onChange={(e) => setNewAddress({ ...newAddress, detail: e.target.value })}
                    className={`w-full text-slate-900 bg-white border rounded px-3 py-2 resize-none dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 ${
                      !newAddress.detail.trim() ? 'border-red-300' : 'border-slate-200'
                    }`}
                    rows="2"
                    placeholder="Enter complete address"
                  />
                  {!newAddress.detail.trim() && (
                    <p className="mt-1 text-xs text-red-500">Please enter the address</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddAddress}
                    disabled={!newAddress.label.trim() || !newAddress.detail.trim()}
                    className="text-xs font-semibold text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSave className="inline mr-1" />Save Address
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingAddress(false)
                      setNewAddress({ label: '', detail: '' })
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    <FiX className="inline mr-1" />Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingAddress(true)}
              className="w-full rounded-2xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 hover:border-primary hover:text-primary transition-colors"
            >
              <FiPlus className="inline mr-2" />Add New Address
            </button>
          )}
        </div>

        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-card dark:bg-slate-900 dark:border dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-900">
            <FiCreditCard /> <h2 className="text-lg font-semibold">Wallet & Rewards</h2>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <p className="text-xs uppercase text-slate-500">Wallet ID</p>
            <p className="text-lg font-semibold text-slate-900">GE-45281</p>
            <p className="mt-2">Use wallet balance for instant checkout.</p>
            <button className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
              Recharge Wallet
            </button>
          </div>
          <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm">
            <div className="flex items-center gap-2 text-amber-600">
              <FiGift /> <p className="font-semibold">Unlock style Rush Benefits</p>
            </div>
            <p className="mt-2 text-amber-700">2 orders away from free delivery for a week.</p>
            <button className="mt-3 text-xs font-semibold text-amber-700">View challenges →</button>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4 text-sm text-slate-600">
            <p className="text-xs uppercase text-slate-500">Invite & Earn</p>
            <p className="text-lg font-semibold text-slate-900">₹120 credit per friend</p>
            <button className="mt-2 text-xs font-semibold text-primary">Share referral link</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile
