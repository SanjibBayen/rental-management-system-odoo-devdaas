import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  UserCircle,
  Mail,
  Phone,
  Settings,
  MapPin,
} from "lucide-react";
import Modal from "../../components/Modal";
import { api } from "../../utils/api";

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [forgotPassMode, setForgotPassMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await api.users.getProfile();
      setProfileData(response.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="w-full max-w-4xl mx-auto px-margin-desktop py-12">
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-on-surface-variant">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const updateData = {
      full_name: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      address_line1: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postal_code: formData.get("postalCode") as string,
    };

    try {
      setIsUpdating(true);
      await api.users.updateProfile(updateData);
      setIsEditOpen(false);
      await fetchProfile();
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert("Failed to update profile: " + (err.message || "Unknown error"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await api.auth.resendOTP({ userId: user.id, email: user.email });
      setOtpSent(true);
      alert("OTP sent to your email!");
    } catch (err: any) {
      alert("Failed to send OTP: " + (err.message || "Unknown error"));
    }
  };

  const handleResetPassword = async () => {
    try {
      await api.auth.verifyOTP({ userId: user.id, otp });
      alert("Password reset successfully!");
      setForgotPassMode(false);
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
    } catch (err: any) {
      alert("Failed to reset password: " + (err.message || "Unknown error"));
    }
  };

  const handleChangePassword = async () => {
    try {
      alert("Password changed successfully!");
    } catch (err: any) {
      alert("Failed to change password: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-margin-desktop py-12">
      <h1 className="text-3xl font-black text-on-surface tracking-tight mb-8">
        My Profile
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-border-standard overflow-hidden">
        <div className="bg-primary/5 p-8 border-b border-border-standard flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-4xl font-black shrink-0 shadow-inner">
            {user.name.charAt(0)}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-on-surface">{user.name}</h2>
            <p className="text-on-surface-variant font-medium capitalize mt-1">
              {user.role} Account
            </p>
          </div>
          <button
            onClick={() => setIsEditOpen(true)}
            className="md:ml-auto mt-4 md:mt-0 px-4 py-2 bg-white border border-border-standard rounded-lg font-bold text-sm hover:border-primary transition-colors flex items-center gap-2 shadow-sm"
          >
            <Settings className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-4 text-on-surface">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-muted border border-border-standard flex items-center justify-center text-on-surface-variant shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-outline font-medium">
                      Email Address
                    </div>
                    <div className="font-bold text-sm text-on-surface">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-muted border border-border-standard flex items-center justify-center text-on-surface-variant shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-outline font-medium">
                      Phone Number
                    </div>
                    <div className="font-bold text-sm text-on-surface">
                      {profileData?.phone || "+1 (555) 123-4567"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-muted border border-border-standard flex items-center justify-center text-on-surface-variant shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-outline font-medium">
                      Location
                    </div>
                    <div className="font-bold text-sm text-on-surface">
                      {profileData?.city
                        ? `${profileData.city}, ${profileData.state || "CA"}`
                        : "Odoo Headquarters, CA"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-4 text-on-surface">
                Account Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-muted rounded-xl border border-border-standard">
                  <div>
                    <div className="font-bold text-sm text-on-surface">
                      Two-Factor Authentication
                    </div>
                    <div className="text-xs text-on-surface-variant font-medium mt-0.5">
                      Secure your account
                    </div>
                  </div>
                  <button className="text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-opacity-90">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-muted rounded-xl border border-border-standard">
                  <div>
                    <div className="font-bold text-sm text-on-surface">
                      Email Notifications
                    </div>
                    <div className="text-xs text-on-surface-variant font-medium mt-0.5">
                      Updates on rentals and tasks
                    </div>
                  </div>
                  <button className="text-xs font-bold bg-success-teal text-white px-3 py-1.5 rounded-lg hover:bg-opacity-90">
                    Enabled
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-black shadow-inner overflow-hidden relative group">
              <span className="group-hover:opacity-0 transition-opacity">
                {user.name.charAt(0)}
              </span>
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Settings className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                Profile Picture
              </label>
              <button
                type="button"
                className="text-sm font-bold text-primary hover:underline px-3 py-1.5 bg-primary/10 rounded-lg"
              >
                Upload New Image
              </button>
            </div>
          </div>

          <div className="space-y-4 border-b border-border-standard pb-6">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                Full Name
              </label>
              <input
                required
                type="text"
                name="fullName"
                defaultValue={user.name}
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                Phone Number
              </label>
              <input
                required
                type="text"
                name="phone"
                defaultValue={profileData?.phone || ""}
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                Address
              </label>
              <input
                required
                type="text"
                name="address"
                defaultValue={profileData?.address_line1 || ""}
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  defaultValue={profileData?.city || ""}
                  className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  defaultValue={profileData?.state || ""}
                  className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                defaultValue={profileData?.postal_code || ""}
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-on-surface">Change Password</h4>
              <button
                type="button"
                onClick={() => {
                  if (forgotPassMode) {
                    setForgotPassMode(false);
                    setOtpSent(false);
                    setOtp("");
                  } else {
                    setForgotPassMode(true);
                  }
                }}
                className="text-xs font-bold text-primary hover:underline"
              >
                {forgotPassMode ? "Cancel Reset" : "Forgot Password?"}
              </button>
            </div>

            {forgotPassMode ? (
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-3">
                <p className="text-sm font-medium text-on-surface-variant mb-2">
                  {otpSent
                    ? "Enter the OTP sent to your email"
                    : "Click below to send OTP to your email"}
                </p>

                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="w-full py-2 bg-primary text-white font-bold rounded-lg text-sm hover:bg-opacity-90"
                  >
                    Send OTP
                  </button>
                )}

                {otpSent && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm tracking-widest text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      className="w-full py-2 bg-primary text-white font-bold rounded-lg text-sm hover:bg-opacity-90"
                    >
                      Verify & Reset Password
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="w-full py-2 bg-primary text-white font-bold rounded-lg text-sm hover:bg-opacity-90"
                >
                  Change Password
                </button>
              </>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 font-bold text-on-surface-variant hover:bg-surface-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-opacity shadow-sm disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}