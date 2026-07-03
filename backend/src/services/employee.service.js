import prisma from "../config/database.js";
import { ApiError, parsePagination } from "../utils/helpers.js";
import { audit } from "./audit.service.js";

export const employeeService = {
  async listAdmin(query) {
    const { page, limit, skip } = parsePagination(query);
    const { department, status, search } = query;

    const where = {
      deletedAt: null,
      ...(department && { department }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { employeeCode: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await prisma.$transaction([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.employee.count({ where }),
    ]);

    return { data, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  },

  async getById(id) {
    const item = await prisma.employee.findFirst({
      where: { id, deletedAt: null },
      include: {
        documents: { where: { deletedAt: null }, orderBy: { createdAt: "desc" } },
      },
    });
    if (!item) throw new ApiError(404, "Employee not found");
    return item;
  },

  async create(body, actor, ip) {
    const item = await prisma.employee.create({
      data: {
        employeeCode: body.employeeCode,
        fullName: body.fullName,
        email: body.email.toLowerCase(),
        phone: body.phone,
        cnic: body.cnic,
        address: body.address,
        emergencyContact: body.emergencyContact,
        emergencyPhone: body.emergencyPhone,
        jobTitle: body.jobTitle,
        designation: body.designation,
        department: body.department,
        photoUrl: body.photoUrl,
        photoPublicId: body.photoPublicId,
        status: body.status || "ACTIVE",
        hireDate: body.hireDate ? new Date(body.hireDate) : null,
        trainingDate: body.trainingDate ? new Date(body.trainingDate) : null,
        probationEndDate: body.probationEndDate ? new Date(body.probationEndDate) : null,
        leavingDate: body.leavingDate ? new Date(body.leavingDate) : null,
        salary: body.salary,
        notes: body.notes,
      },
    });

    await audit({
      userId: actor.isEnvSuperAdmin ? null : actor.id,
      userEmail: actor.email,
      action: "EMPLOYEE_CREATED",
      entity: "Employee",
      entityId: item.id,
      ip,
    });

    return item;
  },

  async update(id, body, actor, ip) {
    await this.getById(id);
    const item = await prisma.employee.update({
      where: { id },
      data: {
        ...(body.fullName && { fullName: body.fullName }),
        ...(body.email && { email: body.email.toLowerCase() }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.cnic !== undefined && { cnic: body.cnic }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.emergencyContact !== undefined && { emergencyContact: body.emergencyContact }),
        ...(body.emergencyPhone !== undefined && { emergencyPhone: body.emergencyPhone }),
        ...(body.jobTitle !== undefined && { jobTitle: body.jobTitle }),
        ...(body.designation !== undefined && { designation: body.designation }),
        ...(body.department !== undefined && { department: body.department }),
        ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl }),
        ...(body.photoPublicId !== undefined && { photoPublicId: body.photoPublicId }),
        ...(body.status && { status: body.status }),
        ...(body.hireDate !== undefined && { hireDate: body.hireDate ? new Date(body.hireDate) : null }),
        ...(body.trainingDate && { trainingDate: new Date(body.trainingDate) }),
        ...(body.probationEndDate && { probationEndDate: new Date(body.probationEndDate) }),
        ...(body.leavingDate && { leavingDate: new Date(body.leavingDate) }),
        ...(body.salary !== undefined && { salary: body.salary }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
    });

    await audit({
      userId: actor.isEnvSuperAdmin ? null : actor.id,
      userEmail: actor.email,
      action: "EMPLOYEE_UPDATED",
      entity: "Employee",
      entityId: item.id,
      ip,
    });

    return item;
  },

  async remove(id, actor, ip) {
    await this.getById(id);
    await prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date(), status: "TERMINATED" },
    });

    await audit({
      userId: actor.isEnvSuperAdmin ? null : actor.id,
      userEmail: actor.email,
      action: "EMPLOYEE_DELETED",
      entity: "Employee",
      entityId: id,
      ip,
    });

    return { message: "Employee archived" };
  },

  async addDocument(employeeId, body, actor, ip) {
    await this.getById(employeeId);
    const doc = await prisma.employeeDocument.create({
      data: {
        employeeId,
        title: body.title,
        fileName: body.fileName,
        documentType: body.documentType || "OTHER",
        fileUrl: body.fileUrl,
        publicId: body.publicId,
        fileSize: body.fileSize,
        mimeType: body.mimeType,
        uploadedById: actor?.isEnvSuperAdmin ? null : actor?.id,
      },
    });

    await audit({
      userId: actor.isEnvSuperAdmin ? null : actor.id,
      userEmail: actor.email,
      action: "EMPLOYEE_DOCUMENT_ADDED",
      entity: "EmployeeDocument",
      entityId: doc.id,
      ip,
    });

    return doc;
  },
};
