import { useState, useEffect } from "react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import PageHeader from "../components/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import toast from "react-hot-toast";

const SettingsAdmin = () => {
  const [form, setForm] = useState({
    companyName: "",
    contactEmail: "",
    phone: "",
    address: "",
    seoTitle: "",
    seoDescription: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const { data, isLoading, isError } = useAdminData(["admin-settings"], async () => {
    const { data: res } = await api.get("/admin/settings");
    return res.data;
  });

  const company = Array.isArray(data) ? data.find((s) => s.key === "company")?.value : null;
  const seo = Array.isArray(data) ? data.find((s) => s.key === "seo")?.value : null;

  useEffect(() => {
    if (company || seo) {
      setForm({
        companyName: company?.name || "",
        contactEmail: company?.email || "",
        phone: company?.phone || "",
        address: company?.address || "",
        seoTitle: seo?.defaultTitle || "",
        seoDescription: seo?.defaultDescription || "",
      });
    }
  }, [company, seo]);

  const handleSave = async () => {
    try {
      await api.put("/admin/settings/bulk", {
        company: {
          name: form.companyName,
          email: form.contactEmail,
          phone: form.phone,
          address: form.address,
        },
        seo: {
          defaultTitle: form.seoTitle,
          defaultDescription: form.seoDescription,
        },
      });
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Website Settings" description="Company information, SEO, branding, and account security." />
      {isError && <p className="text-sm text-red-600 mb-4">Failed to load settings.</p>}
      {isLoading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-slate-900">Company</h3>
            <Input label="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            <Input label="Contact Email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-slate-900">SEO Defaults</h3>
            <Input label="Default Page Title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
            <Textarea label="Default Meta Description" rows={3} value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
          </div>
          <Button onClick={handleSave}>Save Settings</Button>

          <form onSubmit={handleChangePassword} className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-slate-900">Change Password</h3>
            <p className="text-sm text-slate-500">Update your Super Admin password. You must enter your current password.</p>
            <Input
              label="Current password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
            <Input
              label="New password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
            <Input
              label="Confirm new password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
            />
            <Button type="submit" loading={changingPassword}>Update Password</Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingsAdmin;
