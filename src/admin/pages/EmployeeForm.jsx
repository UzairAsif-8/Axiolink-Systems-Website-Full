import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const selectClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";

const EmployeeForm = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { status: "ACTIVE" },
  });

  const { data: item } = useQuery({
    queryKey: ["employee", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data: res } = await api.get(`/admin/employees/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        ...item,
        hireDate: item.hireDate ? String(item.hireDate).slice(0, 10) : "",
      });
    }
  }, [item, reset]);

  const saveMut = useMutation({
    mutationFn: (body) =>
      isNew ? api.post("/admin/employees", body) : api.put(`/admin/employees/${id}`, body),
    onSuccess: (res) => {
      toast.success(isNew ? "Employee created" : "Employee updated");
      qc.invalidateQueries({ queryKey: ["admin-employees"] });
      const employeeId = res.data?.data?.id || id;
      navigate(employeeId ? `/admin/employees/${employeeId}` : "/admin/employees");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Save failed"),
  });

  const onSubmit = (data) => {
    const body = {
      ...data,
      hireDate: data.hireDate || null,
    };
    saveMut.mutate(body);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        {isNew ? "New Employee" : "Edit Employee"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Employee code *" {...register("employeeCode", { required: true })} />
          <Input label="Full name *" {...register("fullName", { required: true })} />
          <Input label="Email *" type="email" {...register("email", { required: true })} />
          <Input label="Phone" {...register("phone")} />
          <Input label="Job title" {...register("jobTitle")} />
          <Input label="Designation" {...register("designation")} />
          <Input label="Department" placeholder="e.g. Engineering" {...register("department")} />
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select {...register("status")} className={selectClass}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ON_LEAVE">On leave</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Starting date</label>
            <input type="date" {...register("hireDate")} className={selectClass} />
          </div>
        </div>

        <Textarea label="Address" rows={2} {...register("address")} />
        <Textarea label="Notes" rows={3} {...register("notes")} />

        <div className="flex gap-3 pt-4">
          <Button type="submit" loading={saveMut.isPending}>
            {isNew ? "Create employee" : "Save changes"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/admin/employees")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
