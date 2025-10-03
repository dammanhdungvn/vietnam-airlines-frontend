/**
 * @fileoverview Unit tests cho trang Đăng ký hộ Local (SUPERADMIN)
 * @description Test quy trình đăng ký 3 bước cho SUPERADMIN - đơn giản hóa chỉ test API calls
 * @version 1.0.0
 * @since 2025-10-03
 * @author Dũng Đàm
 */

import { render, screen, waitFor } from "@testing-library/react";
import DangKyHoLocalPage from "@/app/dang-ky-ho-local/page";
import { getPersonsSuperAdminCreated } from "@/services/person.service";
import { getSeatsInfo } from "@/services/seat.service";
import { getItems } from "@/services/item.service";
import { SeatType } from "@/types/seat.type";

// Mock các dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => "/dang-ky-ho-local"),
}));

jest.mock("@/services/person.service");
jest.mock("@/services/seat.service");
jest.mock("@/services/item.service");
jest.mock("sonner");

const mockGetPersonsSuperAdminCreated =
  getPersonsSuperAdminCreated as jest.MockedFunction<
    typeof getPersonsSuperAdminCreated
  >;
const mockGetSeatsInfo = getSeatsInfo as jest.MockedFunction<
  typeof getSeatsInfo
>;
const mockGetItems = getItems as jest.MockedFunction<typeof getItems>;

describe("DangKyHoLocalPage (SUPERADMIN)", () => {
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
      seatInfo: null,
      items: [],
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

  const mockSeats = [
    {
      id: 1,
      seatNumber: "A1",
      type: SeatType.VIP,
      basePrice: 100000,
      paidPrice: 100000,
      isBooked: false,
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

    mockGetSeatsInfo.mockResolvedValue({
      content: mockSeats,
      page: 0,
      size: 1000,
      totalElements: 2,
      totalPages: 1,
      first: true,
      last: true,
    });

    mockGetItems.mockResolvedValue({
      content: mockItems,
      page: 0,
      size: 1000,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    });
  });

  /**
   * @test Kiểm tra component render và gọi API SUPERADMIN
   */
  it("should render and call superadmin API on mount", async () => {
    render(<DangKyHoLocalPage />);

    await waitFor(() => {
      expect(mockGetPersonsSuperAdminCreated).toHaveBeenCalled();
    });

    // Verify API was called with correct parameters
    expect(mockGetPersonsSuperAdminCreated).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 0,
        sortBy: "personId",
        sortDir: "asc",
      })
    );
  });

  /**
   * @test Kiểm tra sử dụng API superadmin-created thay vì paginated
   */
  it("should use superadmin-created endpoint instead of paginated", async () => {
    render(<DangKyHoLocalPage />);

    await waitFor(() => {
      expect(mockGetPersonsSuperAdminCreated).toHaveBeenCalled();
    });

    // Verify the correct API function was called (có thể gọi nhiều lần do pagination/filtering)
    expect(mockGetPersonsSuperAdminCreated).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 0,
        sortBy: "personId",
        sortDir: "asc",
      })
    );
  });
});
