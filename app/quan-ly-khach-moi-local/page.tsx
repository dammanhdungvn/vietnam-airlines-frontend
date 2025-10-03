"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Filter,
  Upload,
  Plus,
  Star,
  Trash2,
  Edit,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/page-container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import {
  getPersonsSuperAdminCreated,
  deletePerson,
  importPersons,
  addPerson,
  validateAndUploadFace,
  registerOrUpdatePerson,
  getPersonByEmail,
} from "@/services/person.service";
import {
  Person,
  PaginatedApiResponse,
  AddPersonPayload,
  RegistrationPayload,
} from "@/types/person.type";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getItems } from "@/services/item.service";
import { IItem } from "@/types/item.type";
import { getSeatsInfo } from "@/services/seat.service";
import { ISeat } from "@/types/seat.type";
import { Minus, Utensils, MapPin } from "lucide-react";

/**
 * Trang Quản lý khách mời Local (SUPERADMIN)
 * Hiển thị danh sách khách mời được tạo bởi SUPERADMIN với các tính năng lọc, tìm kiếm và quản lý
 */
export default function QuanLyKhachMoiLocalPage() {
  const router = useRouter();

  const [persons, setPersons] = useState<Person[]>([]);
  const [allPersons, setAllPersons] = useState<Person[]>([]);
  const [pagination, setPagination] = useState<
    Omit<PaginatedApiResponse<Person>, "content">
  >({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [sortBy, setSortBy] = useState("personId");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [vipFilter, setVipFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPersonData, setNewPersonData] = useState<AddPersonPayload>({
    email: "",
    fullName: "",
    phone: "",
    position: "",
    avatarUrl: "", // Sẽ được cập nhật sau khi upload avatar
    status: "TRUE",
    isVip: "NORMAL",
    gender: "MALE",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // States for available items and seats
  const [availableItems, setAvailableItems] = useState<IItem[]>([]);
  const [availableSeats, setAvailableSeats] = useState<ISeat[]>([]);

  // State for original person data (for change detection)
  const [originalPersonData, setOriginalPersonData] = useState<Person | null>(
    null
  );

  const fetchPersonsFull = useCallback(async () => {
    setIsLoading(true);
    try {
      const first = await getPersonsSuperAdminCreated({
        page: 0,
        size: 1,
        sortBy: sortBy,
        sortDir: sortDir,
      });
      const total = first.totalElements || 0;
      if (total > 0) {
        const all = await getPersonsSuperAdminCreated({
          page: 0,
          size: total,
          sortBy: sortBy,
          sortDir: sortDir,
        });
        setAllPersons(all.content);
      } else {
        setAllPersons([]);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách khách mời.");
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, sortDir]);

  useEffect(() => {
    fetchPersonsFull();
  }, [fetchPersonsFull]);

  /**
   * Effect để load danh sách món ăn và ghế available
   */
  useEffect(() => {
    const loadAvailableData = async () => {
      try {
        // Load available items
        const itemsData = await getItems({
          page: 0,
          size: 1000,
          sortBy: "itemName",
          sortDir: "asc",
        });
        setAvailableItems(itemsData.content);

        // Load all seats (not filtering by status to get complete list)
        // We'll filter in the UI based on isBooked and occupied by others
        const seatsData = await getSeatsInfo({
          page: 0,
          size: 1000,
          sortBy: "seatNumber",
          sortDir: "asc",
        });
        setAvailableSeats(seatsData.content);
      } catch (error) {
        console.error("Error loading available data:", error);
      }
    };
    loadAvailableData();
  }, []);

  const translateGender = (gender: "MALE" | "FEMALE" | "OTHER" | string) => {
    switch (gender) {
      case "MALE":
        return "Nam";
      case "FEMALE":
        return "Nữ";
      case "OTHER":
        return "Khác";
      default:
        return gender;
    }
  };

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Person>>({});
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete confirmation states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null);

  const editAvatarInputRef = useRef<HTMLInputElement>(null);

  /**
   * Hàm xử lý khi click edit guest - fetch full person details bằng API
   */
  const handleEditGuest = async (person: Person) => {
    try {
      setIsUpdating(true);
      // Gọi API để lấy thông tin đầy đủ của person bằng email
      const fullPersonData = await getPersonByEmail(person.email);

      // Set original data for change detection
      setOriginalPersonData(fullPersonData);

      // Set editing person and form data
      setEditingPerson(fullPersonData);
      setEditFormData({
        fullName: fullPersonData.fullName,
        email: fullPersonData.email,
        phone: fullPersonData.phone,
        position: fullPersonData.position,
        gender: fullPersonData.gender,
        status: fullPersonData.status,
        isVip: fullPersonData.isVip,
        seatInfo: fullPersonData.seatInfo,
        items: fullPersonData.items,
      });
      setEditAvatarFile(null);
      setIsEditModalOpen(true);
    } catch (error) {
      toast.error("Không thể tải thông tin khách hàng");
      console.error("Error fetching person details:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewDetails = (person: Person) => {
    handleEditGuest(person);
  };

  const handleDeleteGuest = (person: Person) => {
    setDeletingPerson(person);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingPerson) return;
    try {
      await deletePerson(deletingPerson.personId);
      toast.success(`Đã xóa khách mời "${deletingPerson.fullName}".`);
      setIsDeleteDialogOpen(false);
      setDeletingPerson(null);
      fetchPersonsFull();
    } catch (error) {
      toast.error(`Không thể xóa khách mời "${deletingPerson.fullName}".`);
    }
  };

  const handleEditAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditAvatarFile(file);
    }
  };

  /**
   * Hàm check xem có thay đổi dữ liệu không
   */
  const hasDataChanged = (): boolean => {
    if (!originalPersonData || !editingPerson) return false;

    // Check basic fields
    if (editFormData.fullName !== originalPersonData.fullName) return true;
    if (editFormData.phone !== originalPersonData.phone) return true;
    if (editFormData.position !== originalPersonData.position) return true;
    if (editFormData.gender !== originalPersonData.gender) return true;
    if (editFormData.status !== originalPersonData.status) return true;
    if (editFormData.isVip !== originalPersonData.isVip) return true;

    // Check avatar
    if (editAvatarFile) return true;

    // Check seat info
    const originalSeat = originalPersonData.seatInfo;
    const currentSeat = editFormData.seatInfo;
    if ((!originalSeat && currentSeat) || (originalSeat && !currentSeat))
      return true;
    if (originalSeat && currentSeat) {
      if (originalSeat.seatNumber !== currentSeat.seatNumber) return true;
      if (originalSeat.paidPrice !== currentSeat.paidPrice) return true;
    }

    // Check items
    const originalItems = originalPersonData.items || [];
    const currentItems = editFormData.items || [];
    if (originalItems.length !== currentItems.length) return true;

    for (let i = 0; i < originalItems.length; i++) {
      const orig = originalItems[i];
      const curr = currentItems[i];
      if (
        orig.id !== curr.id ||
        orig.quantity !== curr.quantity ||
        orig.totalAmount !== curr.totalAmount
      ) {
        return true;
      }
    }

    return false;
  };

  const handleUpdateSubmit = async () => {
    if (!editingPerson || !originalPersonData) return;

    // Check if data has changed
    if (!hasDataChanged()) {
      toast.info("Không có thay đổi nào để cập nhật");
      setIsEditModalOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      // Upload avatar if changed
      if (editAvatarFile) {
        try {
          await validateAndUploadFace(editingPerson.personId, editAvatarFile);
          toast.success("Đã cập nhật ảnh đại diện");
        } catch (avatarError) {
          toast.warning(
            "Upload avatar thất bại, nhưng sẽ tiếp tục cập nhật thông tin."
          );
        }
      }

      // Build payload for update - ensure all fields are correct type
      const status =
        editFormData.status !== undefined
          ? editFormData.status
          : editingPerson.status;

      const payload: any = {
        email: editFormData.email || editingPerson.email,
        fullName: editFormData.fullName || editingPerson.fullName,
        phone: editFormData.phone || editingPerson.phone,
        position: editFormData.position || editingPerson.position,
        gender: (editFormData.gender || editingPerson.gender) as
          | "MALE"
          | "FEMALE"
          | "OTHER",
        status: Boolean(status), // Ensure boolean
      };

      // Include isVip if available
      const vipLevel = editFormData.isVip || editingPerson.isVip;
      if (vipLevel) {
        payload.isVip = vipLevel;
      }

      // Only include seatInfo if it was changed from original
      const originalSeat = originalPersonData?.seatInfo;
      const currentSeat = editFormData.seatInfo;

      // Check if seat was changed
      const hadSeat = originalSeat && originalSeat.seatNumber;
      const hasSeat = currentSeat && currentSeat.seatNumber;
      const seatChanged =
        hadSeat !== hasSeat ||
        originalSeat?.seatNumber !== currentSeat?.seatNumber ||
        originalSeat?.paidPrice !== currentSeat?.paidPrice;

      if (seatChanged) {
        if (hasSeat) {
          // Seat was changed or added
          payload.seatInfo = {
            seatNumber: currentSeat.seatNumber,
            paidPrice: Number(currentSeat.paidPrice) || 0,
          };
        } else if (hadSeat && !hasSeat) {
          // Seat was removed - send null to indicate removal
          payload.seatInfo = null;
        }
      }

      // Only include items if they were changed from original
      const originalItems = originalPersonData?.items || [];
      const currentItems = editFormData.items || [];

      // Check if items changed
      const itemsChanged =
        originalItems.length !== currentItems.length ||
        originalItems.some((orig, idx) => {
          const curr = currentItems[idx];
          return (
            !curr ||
            orig.id !== curr.id ||
            orig.quantity !== curr.quantity ||
            orig.totalAmount !== curr.totalAmount
          );
        });

      if (itemsChanged) {
        if (currentItems.length > 0) {
          // Items were changed or added
          payload.items = currentItems.map((item: any) => ({
            itemId: Number(item.id),
            quantity: Number(item.quantity),
            paidAmount: Number(item.totalAmount),
          }));
        } else if (originalItems.length > 0 && currentItems.length === 0) {
          // All items were removed - send empty array to indicate removal
          payload.items = [];
        }
      }

      await registerOrUpdatePerson(payload);
      toast.success("Thông tin khách mời đã được cập nhật.");
      setIsEditModalOpen(false);
      setEditingPerson(null);
      setEditFormData({});
      setEditAvatarFile(null);
      setOriginalPersonData(null);
      fetchPersonsFull();
    } catch (error: any) {
      console.error("Update error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể cập nhật thông tin khách mời.";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Hàm xử lý thay đổi ghế ngồi
   */
  const handleSeatChange = (seatNumber: string) => {
    const seat = availableSeats.find((s) => s.seatNumber === seatNumber);
    if (seat) {
      setEditFormData({
        ...editFormData,
        seatInfo: {
          seatNumber: seat.seatNumber,
          paidPrice: seat.paidPrice || 0,
        },
      });
    }
  };

  /**
   * Hàm xóa ghế ngồi
   */
  const handleRemoveSeat = () => {
    setEditFormData({
      ...editFormData,
      seatInfo: null,
    });
  };

  /**
   * Hàm thêm món ăn
   */
  const handleAddItem = (itemId: number) => {
    const item = availableItems.find((i) => i.id === itemId);
    if (!item) return;

    const currentItems = editFormData.items || [];
    const existingItem = currentItems.find((i: any) => i.id === itemId);

    if (existingItem) {
      // Increase quantity
      const updatedItems = currentItems.map((i: any) =>
        i.id === itemId
          ? {
              ...i,
              quantity: i.quantity + 1,
              totalAmount: (i.quantity + 1) * i.price,
            }
          : i
      );
      setEditFormData({
        ...editFormData,
        items: updatedItems,
      });
    } else {
      // Add new item
      const newItem = {
        id: item.id,
        itemName: item.itemName,
        price: item.price,
        description: item.description,
        quantity: 1,
        totalAmount: item.price,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
      setEditFormData({
        ...editFormData,
        items: [...currentItems, newItem],
      });
    }
  };

  /**
   * Hàm giảm số lượng món ăn
   */
  const handleDecreaseItemQuantity = (itemId: number) => {
    const currentItems = editFormData.items || [];
    const item = currentItems.find((i: any) => i.id === itemId);
    if (!item) return;

    if (item.quantity <= 1) {
      // Remove item
      setEditFormData({
        ...editFormData,
        items: currentItems.filter((i: any) => i.id !== itemId),
      });
    } else {
      // Decrease quantity
      const updatedItems = currentItems.map((i: any) =>
        i.id === itemId
          ? {
              ...i,
              quantity: i.quantity - 1,
              totalAmount: (i.quantity - 1) * i.price,
            }
          : i
      );
      setEditFormData({
        ...editFormData,
        items: updatedItems,
      });
    }
  };

  /**
   * Hàm xóa món ăn
   */
  const handleRemoveItem = (itemId: number) => {
    const currentItems = editFormData.items || [];
    setEditFormData({
      ...editFormData,
      items: currentItems.filter((i: any) => i.id !== itemId),
    });
  };

  const handleTriggerImport = () => {
    if (isImporting) return;
    fileInputRef.current?.click();
  };

  const handleImportFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.info("Bạn chưa chọn file để import.");
      return;
    }
    try {
      setIsImporting(true);
      await importPersons(file);
      toast.success("Đã nhập danh sách khách mời thành công.");
      fetchPersonsFull(); // Tải lại danh sách
    } catch (error) {
      toast.error("Không thể nhập danh sách khách mời từ file.");
    } finally {
      // Reset input & state
      event.target.value = "";
      setIsImporting(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Tạo preview URL cho avatar
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPersonData((prev) => ({
          ...prev,
          avatarUrl: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = async () => {
    // Basic validation
    if (!newPersonData.fullName || !newPersonData.email) {
      toast.error("Vui lòng điền các trường bắt buộc (Họ tên, Email).");
      return;
    }

    setIsSubmitting(true);
    try {
      // Bước 1: Tạo người dùng trước theo schema mới (không có personId)
      const createResponse = await addPerson(newPersonData);

      // Bước 2: Nếu có avatar file và tạo thành công, upload avatar
      if (avatarFile && createResponse?.data?.personId) {
        try {
          await validateAndUploadFace(createResponse.data.personId, avatarFile);
          toast.success("Đã thêm khách mời mới và upload avatar thành công.");
        } catch (avatarError) {
          // Nếu upload avatar thất bại nhưng tạo người dùng thành công
          toast.warning(
            "Đã thêm khách mời mới nhưng upload avatar thất bại. Bạn có thể cập nhật avatar sau."
          );
        }
      } else {
        toast.success("Đã thêm khách mời mới.");
      }

      // Reset form và đóng modal
      setNewPersonData({
        email: "",
        fullName: "",
        phone: "",
        position: "",
        avatarUrl: "",
        status: "TRUE",
        isVip: "NORMAL",
        gender: "MALE",
      });
      setAvatarFile(null);
      setIsAddModalOpen(false);
      fetchPersonsFull(); // Tải lại danh sách
    } catch (error) {
      toast.error("Không thể thêm khách mời mới. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Debounce search term (client-side) and reset to first page
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
      setPagination((prev) => ({ ...prev, page: 0 }));
    }, 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const filteredPersons = (allPersons.length ? allPersons : persons).filter(
    (person) => {
      // Search filter
      const matchesSearch =
        person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.position.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "registered" && person.status) ||
        (statusFilter === "unregistered" && !person.status);

      // VIP filter
      const matchesVip =
        vipFilter === "all" ||
        (vipFilter === "SUPER_VIP" && person.isVip === "SUPER_VIP") ||
        (vipFilter === "VIP" && person.isVip === "VIP") ||
        (vipFilter === "NORMAL" && person.isVip === "NORMAL");

      return matchesSearch && matchesStatus && matchesVip;
    }
  );

  const clientTotalPages = Math.max(
    1,
    Math.ceil(filteredPersons.length / pagination.size)
  );
  const isFirstPage = pagination.page <= 0;
  const isLastPage = pagination.page >= clientTotalPages - 1;

  return (
    <PageContainer>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleImportFile}
        className="hidden"
      />
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />
      <input
        ref={editAvatarInputRef}
        type="file"
        accept="image/*"
        onChange={handleEditAvatarChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý khách mời (Local)
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên, email, chức vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex items-center gap-2 sm:ml-2">
            {/* Status Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="registered">Đăng ký</option>
              <option value="unregistered">Chưa đăng ký</option>
            </select>

            {/* VIP Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-auto"
              value={vipFilter}
              onChange={(e) => setVipFilter(e.target.value)}
            >
              <option value="all">Tất cả loại khách</option>
              <option value="SUPER_VIP">Siêu VIP</option>
              <option value="VIP">VIP</option>
              <option value="NORMAL">Thường</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleTriggerImport}
              disabled={isImporting}
              className="flex-1 sm:flex-none"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? "Đang import..." : "Import"}
            </Button>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 flex-1 sm:flex-none"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full table-auto">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên khách mời
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chức vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giới tính
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  VIP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: pagination.size }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-12" />
                    </td>
                    <td className="px-6 py-4" colSpan={7}>
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredPersons.length > 0 ? (
                filteredPersons
                  .slice(
                    pagination.page * pagination.size,
                    pagination.page * pagination.size + pagination.size
                  )
                  .map((person, idx) => (
                    <tr key={person.personId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pagination.page * pagination.size + idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div
                              className="text-sm font-medium text-gray-900 cursor-pointer hover:text-orange-600"
                              onClick={() => handleViewDetails(person)}
                            >
                              {person.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {person.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {person.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {person.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {translateGender(person.gender)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={person.status ? "default" : "secondary"}
                          className={
                            person.status
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {person.status ? "Đăng ký" : "Chưa đăng ký"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {person.isVip === "SUPER_VIP" ? (
                          <Badge className="bg-purple-100 text-purple-800">
                            Siêu VIP
                          </Badge>
                        ) : person.isVip === "VIP" ? (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            VIP
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            Thường
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGuest(person)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditGuest(person)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    Không tìm thấy khách mời nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (client-side) */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700 hidden sm:block">
            Hiển thị {pagination.page * pagination.size + 1} đến{" "}
            {Math.min(
              (pagination.page + 1) * pagination.size,
              filteredPersons.length
            )}{" "}
            trong tổng số {filteredPersons.length} khách mời
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={isFirstPage}
            >
              ← Trước
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: clientTotalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant="outline"
                    size="sm"
                    className={
                      pagination.page + 1 === page
                        ? "bg-orange-500 text-white"
                        : ""
                    }
                    onClick={() => handlePageChange(page - 1)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={isLastPage}
            >
              Sau →
            </Button>
          </div>
        </div>
      </div>

      {/* Modal form thêm khách mời */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="w-[min(95vw,700px)] max-w-none sm:max-w-none">
          <DialogHeader>
            <DialogTitle>Thêm khách mời mới</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email*</label>
              <Input
                type="email"
                value={newPersonData.email}
                onChange={(e) =>
                  setNewPersonData({ ...newPersonData, email: e.target.value })
                }
                placeholder="Nhập email"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Họ và tên*</label>
              <Input
                value={newPersonData.fullName}
                onChange={(e) =>
                  setNewPersonData({
                    ...newPersonData,
                    fullName: e.target.value,
                  })
                }
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                value={newPersonData.phone}
                onChange={(e) =>
                  setNewPersonData({ ...newPersonData, phone: e.target.value })
                }
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chức vụ</label>
              <Input
                value={newPersonData.position}
                onChange={(e) =>
                  setNewPersonData({
                    ...newPersonData,
                    position: e.target.value,
                  })
                }
                placeholder="Nhập chức vụ"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Giới tính</label>
              <Select
                value={newPersonData.gender}
                onValueChange={(value: "MALE" | "FEMALE") =>
                  setNewPersonData({ ...newPersonData, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Nam</SelectItem>
                  <SelectItem value="FEMALE">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select
                value={newPersonData.status}
                onValueChange={(value: "TRUE" | "FALSE") =>
                  setNewPersonData({ ...newPersonData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRUE">Đăng ký</SelectItem>
                  <SelectItem value="FALSE">Chưa đăng ký</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* VIP */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Loại khách</label>
              <Select
                value={newPersonData.isVip}
                onValueChange={(value: "SUPER_VIP" | "VIP" | "NORMAL") =>
                  setNewPersonData({ ...newPersonData, isVip: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại khách" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_VIP">Siêu VIP</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="NORMAL">Thường</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Avatar Upload */}
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Ảnh đại diện</label>
              <div className="flex items-center space-x-4">
                {newPersonData.avatarUrl && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                      src={newPersonData.avatarUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatarFile ? "Thay đổi ảnh" : "Chọn ảnh"}
                </Button>
                {avatarFile && (
                  <span className="text-sm text-gray-500">
                    {avatarFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              onClick={handleAddSubmit}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Thêm khách mời"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[95vw] sm:w-[640px] md:w-[720px] lg:w-[780px] max-w-none sm:max-w-none md:max-w-none lg:max-w-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin khách mời</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email*</label>
              <Input
                type="email"
                value={editFormData.email || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
                placeholder="Nhập email"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Họ và tên*</label>
              <Input
                value={editFormData.fullName || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, fullName: e.target.value })
                }
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                value={editFormData.phone || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phone: e.target.value })
                }
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chức vụ</label>
              <Input
                value={editFormData.position || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, position: e.target.value })
                }
                placeholder="Nhập chức vụ"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Giới tính</label>
              <Select
                value={editFormData.gender || ""}
                onValueChange={(value: "MALE" | "FEMALE") =>
                  setEditFormData({ ...editFormData, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Nam</SelectItem>
                  <SelectItem value="FEMALE">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select
                value={editFormData.status ? "TRUE" : "FALSE"}
                onValueChange={(value: "TRUE" | "FALSE") =>
                  setEditFormData({ ...editFormData, status: value === "TRUE" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRUE">Đăng ký</SelectItem>
                  <SelectItem value="FALSE">Chưa đăng ký</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* VIP */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Loại khách</label>
              <Select
                value={editFormData.isVip || ""}
                onValueChange={(value: "SUPER_VIP" | "VIP" | "NORMAL") =>
                  setEditFormData({ ...editFormData, isVip: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại khách" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_VIP">Siêu VIP</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="NORMAL">Thường</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Avatar Upload */}
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Ảnh đại diện</label>
              <div className="flex items-center space-x-4">
                {editingPerson?.avatarUrl && !editAvatarFile && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                      src={`data:image/jpeg;base64,${editingPerson.avatarUrl}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editAvatarInputRef.current?.click()}
                >
                  {editAvatarFile ? "Thay đổi ảnh" : "Chọn ảnh mới"}
                </Button>
                {editAvatarFile && (
                  <span className="text-sm text-gray-500">
                    {editAvatarFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Seat Selection Section */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Ghế ngồi</h3>
            </div>

            {editFormData.seatInfo ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Số ghế</p>
                    <p className="text-lg font-semibold">
                      {editFormData.seatInfo.seatNumber}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Giá:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(editFormData.seatInfo.paidPrice || 0)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveSeat}
                  >
                    Xóa ghế
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">Chọn ghế ngồi</label>
                <Select value="" onValueChange={handleSeatChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ghế..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      // Lấy danh sách ghế đã được đặt bởi người khác
                      const occupiedSeats = allPersons
                        .filter(
                          (p) =>
                            p.personId !== editingPerson?.personId &&
                            p.seatInfo?.seatNumber
                        )
                        .map((p) => p.seatInfo!.seatNumber);

                      // Filter ghế: chỉ hiển thị ghế chưa được book và chưa ai đặt
                      const availableSeatsFiltered = availableSeats.filter(
                        (seat) =>
                          !seat.isBooked &&
                          !occupiedSeats.includes(seat.seatNumber)
                      );

                      return availableSeatsFiltered
                        .sort((a, b) =>
                          a.seatNumber.localeCompare(b.seatNumber, undefined, {
                            numeric: true,
                          })
                        )
                        .map((seat) => (
                          <SelectItem key={seat.id} value={seat.seatNumber}>
                            {seat.seatNumber} - {seat.type} (
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(seat.paidPrice || 0)}
                            )
                          </SelectItem>
                        ));
                    })()}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Chỉ hiển thị ghế trống chưa ai đặt
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdating}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateSubmit}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isUpdating}
            >
              {isUpdating ? "Đang xử lý..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa khách mời</DialogTitle>
          </DialogHeader>

          {deletingPerson && (
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-600">
                Bạn có chắc chắn muốn xóa khách mời sau? Hành động này không thể
                hoàn tác.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Họ và tên</p>
                    <p className="text-sm font-medium text-gray-900">
                      {deletingPerson.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {deletingPerson.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Số điện thoại</p>
                    <p className="text-sm font-medium text-gray-900">
                      {deletingPerson.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Chức vụ</p>
                    <p className="text-sm font-medium text-gray-900">
                      {deletingPerson.position}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Giới tính</p>
                    <p className="text-sm font-medium text-gray-900">
                      {translateGender(deletingPerson.gender)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Loại khách</p>
                    <Badge
                      className={
                        deletingPerson.isVip === "SUPER_VIP"
                          ? "bg-purple-100 text-purple-800"
                          : deletingPerson.isVip === "VIP"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {deletingPerson.isVip === "SUPER_VIP"
                        ? "Siêu VIP"
                        : deletingPerson.isVip === "VIP"
                        ? "VIP"
                        : "Thường"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
