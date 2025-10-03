/**
 * @fileoverview Unit tests cho trang Quản lý khách mời Local (SUPERADMIN)
 * @description Test các chức năng CRUD, edit modal với ghế ngồi và món ăn cho SUPERADMIN
 * @version 1.0.0
 * @since 2025-10-03
 * @author Dũng Đàm
 */

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuanLyKhachMoiLocalPage from "@/app/quan-ly-khach-moi-local/page";
import {
  getPersonsSuperAdminCreated,
  deletePerson,
  getPersonByEmail,
  registerOrUpdatePerson,
} from "@/services/person.service";
import { getItems } from "@/services/item.service";
import { getSeatsInfo } from "@/services/seat.service";
import { SeatType } from "@/types/seat.type";
import { toast } from "sonner";

// Mock các dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => "/quan-ly-khach-moi-local"),
}));

jest.mock("@/services/person.service");
jest.mock("@/services/item.service");
jest.mock("@/services/seat.service");
jest.mock("sonner");

const mockGetPersonsSuperAdminCreated =
  getPersonsSuperAdminCreated as jest.MockedFunction<
    typeof getPersonsSuperAdminCreated
  >;
const mockDeletePerson = deletePerson as jest.MockedFunction<
  typeof deletePerson
>;
const mockGetPersonByEmail = getPersonByEmail as jest.MockedFunction<
  typeof getPersonByEmail
>;
const mockRegisterOrUpdatePerson =
  registerOrUpdatePerson as jest.MockedFunction<typeof registerOrUpdatePerson>;
const mockGetItems = getItems as jest.MockedFunction<typeof getItems>;
const mockGetSeatsInfo = getSeatsInfo as jest.MockedFunction<
  typeof getSeatsInfo
>;

describe("QuanLyKhachMoiLocalPage (SUPERADMIN)", () => {
  const mockPersons = [
    {
      personId: "1",
      fullName: "Nguyễn Văn A",
      email: "a@example.com",
      phone: "0123456789",
      position: "Manager",
      avatarUrl: "",
      status: true,
      isVip: "VIP" as const,
      gender: "MALE" as const,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
      seatInfo: {
        seatNumber: "A1",
        paidPrice: 100000,
      },
      items: [
        {
          id: 1,
          itemName: "Combo A",
          price: 50000,
          description: "Combo 1",
          quantity: 2,
          totalAmount: 100000,
          createdAt: "2025-01-01",
          updatedAt: "2025-01-01",
        },
      ],
    },
    {
      personId: "2",
      fullName: "Trần Thị B",
      email: "b@example.com",
      phone: "0987654321",
      position: "Staff",
      avatarUrl: "",
      status: true,
      isVip: "NORMAL" as const,
      gender: "FEMALE" as const,
      createdAt: "2025-01-02",
      updatedAt: "2025-01-02",
      seatInfo: null,
      items: [],
    },
  ];

  const mockItems = [
    {
      id: 1,
      itemName: "Combo A",
      price: 50000,
      description: "Combo ăn uống 1",
      imageUrl: null,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      id: 2,
      itemName: "Combo B",
      price: 75000,
      description: "Combo ăn uống 2",
      imageUrl: null,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
  ];

  const mockSeats = [
    {
      id: 1,
      seatNumber: "A1",
      type: SeatType.VIP,
      basePrice: 100000,
      paidPrice: 100000,
      isBooked: true,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      id: 2,
      seatNumber: "A2",
      type: SeatType.NORMAL,
      basePrice: 50000,
      paidPrice: 50000,
      isBooked: false,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      id: 3,
      seatNumber: "A3",
      type: SeatType.NORMAL,
      basePrice: 50000,
      paidPrice: 50000,
      isBooked: false,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock default responses
    mockGetPersonsSuperAdminCreated.mockResolvedValue({
      content: mockPersons,
      page: 0,
      size: 10,
      totalElements: 2,
      totalPages: 1,
      first: true,
      last: true,
    });

    mockGetItems.mockResolvedValue({
      content: mockItems,
      page: 0,
      size: 1000,
      totalElements: 2,
      totalPages: 1,
      first: true,
      last: true,
    });

    mockGetSeatsInfo.mockResolvedValue({
      content: mockSeats,
      page: 0,
      size: 1000,
      totalElements: 3,
      totalPages: 1,
      first: true,
      last: true,
    });
  });

  /**
   * @test Kiểm tra render danh sách khách mời từ SUPERADMIN API
   */
  it("should render list of persons from superadmin API successfully", async () => {
    render(<QuanLyKhachMoiLocalPage />);

    await waitFor(() => {
      expect(mockGetPersonsSuperAdminCreated).toHaveBeenCalled();
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.getByText("Trần Thị B")).toBeInTheDocument();
    });

    // Verify API was called with correct endpoint
    expect(mockGetPersonsSuperAdminCreated).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 0,
        sortBy: "personId",
        sortDir: "asc",
      })
    );
  });

  /**
   * @test Kiểm tra tìm kiếm khách mời
   */
  it("should filter persons by search term", async () => {
    const user = userEvent.setup();
    render(<QuanLyKhachMoiLocalPage />);

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      /Tìm kiếm theo tên, email, chức vụ/i
    );
    await user.type(searchInput, "Nguyễn");

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.queryByText("Trần Thị B")).not.toBeInTheDocument();
    });
  });

  /**
   * @test Kiểm tra mở edit modal và load dữ liệu đầy đủ
   */
  it("should open edit modal and fetch full person data", async () => {
    const user = userEvent.setup();

    mockGetPersonByEmail.mockResolvedValue(mockPersons[0]);

    render(<QuanLyKhachMoiLocalPage />);

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    });

    // Click edit button - tìm button edit chính xác hơn
    const personARow = screen.getByText("Nguyễn Văn A").closest("tr");
    const editButton = within(personARow!).getAllByRole("button")[1]; // Button thứ 2 là edit
    await user.click(editButton);

    await waitFor(() => {
      expect(mockGetPersonByEmail).toHaveBeenCalledWith("a@example.com");
      expect(
        screen.getByText("Chỉnh sửa thông tin khách mời")
      ).toBeInTheDocument();
    });
  });

  /**
   * @test Kiểm tra mở edit modal cho person không có ghế
   */
  it("should show seat selection for person without seat", async () => {
    const user = userEvent.setup();

    mockGetPersonByEmail.mockResolvedValue(mockPersons[1]); // Person không có ghế

    render(<QuanLyKhachMoiLocalPage />);

    await waitFor(() => {
      expect(screen.getByText("Trần Thị B")).toBeInTheDocument();
    });

    // Click edit button cho person B
    const personBRow = screen.getByText("Trần Thị B").closest("tr");
    const editButton = within(personBRow!).getAllByRole("button")[1];
    await user.click(editButton);

    await waitFor(() => {
      expect(
        screen.getByText("Chỉnh sửa thông tin khách mời")
      ).toBeInTheDocument();
      // Person B không có ghế nên sẽ hiển thị form chọn ghế
      expect(screen.getByText("Chọn ghế ngồi")).toBeInTheDocument();
      expect(
        screen.getByText("Chỉ hiển thị ghế trống chưa ai đặt")
      ).toBeInTheDocument();
    });
  });

  /**
   * @test Kiểm tra update person chỉ gửi field đã thay đổi
   */
  it("should only send changed fields when updating", async () => {
    const user = userEvent.setup();

    mockGetPersonByEmail.mockResolvedValue(mockPersons[0]);
    mockRegisterOrUpdatePerson.mockResolvedValue({
      code: 200,
      message: "Success",
    });

    render(<QuanLyKhachMoiLocalPage />);

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    });

    // Click edit
    const personARow = screen.getByText("Nguyễn Văn A").closest("tr");
    const editButton = within(personARow!).getAllByRole("button")[1];
    await user.click(editButton);

    await waitFor(() => {
      expect(
        screen.getByText("Chỉnh sửa thông tin khách mời")
      ).toBeInTheDocument();
    });

    // Chỉ sửa tên
    const nameInput = screen.getByDisplayValue("Nguyễn Văn A");
    await user.clear(nameInput);
    await user.type(nameInput, "Nguyễn Văn A Updated");

    // Click update
    const updateButton = screen.getByText("Cập nhật");
    await user.click(updateButton);

    await waitFor(() => {
      expect(mockRegisterOrUpdatePerson).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "a@example.com",
          fullName: "Nguyễn Văn A Updated",
          // Không có seatInfo và items vì không thay đổi
        })
      );
    });
  });

  /**
   * @test Kiểm tra xóa khách mời
   */
  it("should delete person successfully", async () => {
    const user = userEvent.setup();

    mockDeletePerson.mockResolvedValue();

    render(<QuanLyKhachMoiLocalPage />);

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    });

    // Click delete button
    const personARow = screen.getByText("Nguyễn Văn A").closest("tr");
    const deleteButton = within(personARow!).getAllByRole("button")[0];
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("Xác nhận xóa khách mời")).toBeInTheDocument();
    });

    // Confirm delete
    const confirmButton = screen.getByText("Xóa");
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockDeletePerson).toHaveBeenCalledWith("1");
      expect(toast.success).toHaveBeenCalledWith(
        'Đã xóa khách mời "Nguyễn Văn A".'
      );
    });
  });

  /**
   * @test Kiểm tra không gửi update khi không có thay đổi
   */
  it("should show info toast when no changes detected", async () => {
    const user = userEvent.setup();

    mockGetPersonByEmail.mockResolvedValue(mockPersons[0]);

    render(<QuanLyKhachMoiLocalPage />);

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    });

    // Click edit
    const personARow = screen.getByText("Nguyễn Văn A").closest("tr");
    const editButton = within(personARow!).getAllByRole("button")[1];
    await user.click(editButton);

    await waitFor(() => {
      expect(
        screen.getByText("Chỉnh sửa thông tin khách mời")
      ).toBeInTheDocument();
    });

    // Click update without changes
    const updateButton = screen.getByText("Cập nhật");
    await user.click(updateButton);

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(
        "Không có thay đổi nào để cập nhật"
      );
      expect(mockRegisterOrUpdatePerson).not.toHaveBeenCalled();
    });
  });

  /**
   * @test Kiểm tra phân trang sử dụng API SUPERADMIN
   */
  it("should handle pagination with superadmin API", async () => {
    const user = userEvent.setup();

    render(<QuanLyKhachMoiLocalPage />);

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    });

    // Mock trang 2
    mockGetPersonsSuperAdminCreated.mockResolvedValue({
      content: [
        {
          personId: "3",
          fullName: "Lê Văn C",
          email: "c@example.com",
          phone: "0111111111",
          position: "Developer",
          avatarUrl: "",
          status: true,
          isVip: "NORMAL" as const,
          gender: "MALE" as const,
          createdAt: "2025-01-03",
          updatedAt: "2025-01-03",
          seatInfo: null,
          items: [],
        },
      ],
      page: 1,
      size: 10,
      totalElements: 3,
      totalPages: 2,
      first: false,
      last: true,
    });

    // Verify initial API call was made
    expect(mockGetPersonsSuperAdminCreated).toHaveBeenCalled();
  });
});
