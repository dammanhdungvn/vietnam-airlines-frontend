/**
 * @file Unit tests cho component SeatMap.
 * @description File này chứa các unit tests cho component SeatMap,
 * đảm bảo rằng việc hiển thị sơ đồ ghế và tương tác với ghế hoạt động đúng cách.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SeatMap } from '@/components/seat-map';
import { ISeat, SeatStatus, SeatType } from '@/types/seat.type';

describe('SeatMap', () => {
  const mockSeats: ISeat[] = [
    {
      id: 1,
      seatNumber: 'A1',
      type: SeatType.VIP,
      basePrice: 500000,
      status: SeatStatus.AVAILABLE,
    },
    {
      id: 2,
      seatNumber: 'A2',
      type: SeatType.NORMAL,
      basePrice: 200000,
      status: SeatStatus.TAKEN,
    },
    {
      id: 3,
      seatNumber: 'B1',
      type: SeatType.FREE,
      basePrice: null,
      status: SeatStatus.AVAILABLE,
    },
    {
      id: 4,
      seatNumber: 'B2',
      type: SeatType.BLOCK,
      basePrice: null,
      status: SeatStatus.AVAILABLE,
    },
  ];

  /**
   * @test Component rendering
   * @description Kiểm tra việc render component SeatMap với dữ liệu ghế.
   */
  it('should render seat map with seats', () => {
    render(<SeatMap seats={mockSeats} />);

    expect(screen.getByText('SÂN KHẤU')).toBeInTheDocument();
    // Check for seat numbers in buttons
    expect(screen.getByTitle('A1')).toBeInTheDocument();
    expect(screen.getByTitle('A2')).toBeInTheDocument();
    expect(screen.getByTitle('B1')).toBeInTheDocument();
    expect(screen.getByTitle('B2')).toBeInTheDocument();
  });

  /**
   * @test Seat grouping by row
   * @description Kiểm tra việc nhóm ghế theo hàng.
   */
  it('should group seats by row', () => {
    render(<SeatMap seats={mockSeats} />);

    // Check row labels
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  /**
   * @test Seat selection
   * @description Kiểm tra chức năng chọn ghế.
   */
  it('should allow selecting available seats', () => {
    render(<SeatMap seats={mockSeats} />);

    const seatA1 = screen.getByTitle('A1');
    expect(seatA1).not.toBeDisabled();

    fireEvent.click(seatA1);

    // Check if seat selection info is displayed
    expect(screen.getByText('Ghế: A1')).toBeInTheDocument();
    expect(screen.getByText('Loại: VIP | Trạng thái: Trống')).toBeInTheDocument();
    expect(screen.getByText('500.000đ')).toBeInTheDocument();
  });

  /**
   * @test Disabled seats
   * @description Kiểm tra việc vô hiệu hóa ghế đã đặt và ghế bị khóa.
   */
  it('should disable taken and blocked seats', () => {
    render(<SeatMap seats={mockSeats} />);

    const seatA2 = screen.getByTitle('A2');
    const seatB2 = screen.getByTitle('B2');

    expect(seatA2).toBeDisabled();
    expect(seatB2).toBeDisabled();
  });

  /**
   * @test Seat styling
   * @description Kiểm tra việc áp dụng style cho các loại ghế khác nhau.
   */
  it('should apply correct styling for different seat types', () => {
    render(<SeatMap seats={mockSeats} />);

    const seatA1 = screen.getByTitle('A1');
    const seatB1 = screen.getByTitle('B1');

    // VIP seat should have yellow styling
    expect(seatA1).toHaveClass('bg-yellow-100');
    
    // FREE seat should have green styling
    expect(seatB1).toHaveClass('bg-green-100');
  });

  /**
   * @test Legend display
   * @description Kiểm tra việc hiển thị chú thích.
   */
  it('should display seat type legend', () => {
    render(<SeatMap seats={mockSeats} />);

    expect(screen.getByText('VIP')).toBeInTheDocument();
    expect(screen.getByText('Thường')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Bị khóa')).toBeInTheDocument();
    expect(screen.getByText('Đã đặt')).toBeInTheDocument();
    expect(screen.getByText('Đang chọn')).toBeInTheDocument();
  });

  /**
   * @test Empty seats array
   * @description Kiểm tra việc xử lý khi không có ghế nào.
   */
  it('should handle empty seats array', () => {
    render(<SeatMap seats={[]} />);

    expect(screen.getByText('SÂN KHẤU')).toBeInTheDocument();
    // Should not crash or display any seats
    expect(screen.queryByTitle('A1')).not.toBeInTheDocument();
  });

  /**
   * @test Seat price display
   * @description Kiểm tra việc hiển thị giá ghế.
   */
  it('should display seat price correctly', () => {
    render(<SeatMap seats={mockSeats} />);

    const seatA1 = screen.getByTitle('A1');
    fireEvent.click(seatA1);

    expect(screen.getByText('500.000đ')).toBeInTheDocument();
  });

  /**
   * @test Free seat price display
   * @description Kiểm tra việc hiển thị giá cho ghế miễn phí.
   */
  it('should display "Miễn phí" for free seats', () => {
    render(<SeatMap seats={mockSeats} />);

    const seatB1 = screen.getByTitle('B1');
    fireEvent.click(seatB1);

    expect(screen.getByText('Miễn phí')).toBeInTheDocument();
  });

  /**
   * @test Seat status display
   * @description Kiểm tra việc hiển thị trạng thái ghế.
   */
  it('should display seat status correctly', () => {
    render(<SeatMap seats={mockSeats} />);

    const seatA1 = screen.getByTitle('A1');
    fireEvent.click(seatA1);

    expect(screen.getByText(/Trạng thái: Trống/)).toBeInTheDocument();
  });
});
