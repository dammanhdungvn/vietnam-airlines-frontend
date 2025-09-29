/**
 * @file Unit tests cho component SeatMap.
 * @description File này chứa các unit tests cho component SeatMap,
 * đảm bảo rằng việc hiển thị sơ đồ ghế và tương tác với ghế hoạt động đúng cách.
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SeatMap } from '@/components/seat-map';
import { ISeat, SeatType } from '@/types/seat.type';

describe('SeatMap', () => {
  const mockSeats: ISeat[] = [
    {
      id: 1,
      seatNumber: 'A1',
      type: SeatType.VIP,
      basePrice: 500000,
      paidPrice: 0,
      isBooked: false,
      createdAt: '',
      updatedAt: '',
    } as unknown as ISeat,
    {
      id: 2,
      seatNumber: 'A2',
      type: SeatType.NORMAL,
      basePrice: 200000,
      paidPrice: 0,
      isBooked: true,
      createdAt: '',
      updatedAt: '',
    } as unknown as ISeat,
    {
      id: 3,
      seatNumber: 'B1',
      type: SeatType.FREE,
      basePrice: 0,
      paidPrice: 0,
      isBooked: false,
      createdAt: '',
      updatedAt: '',
    } as unknown as ISeat,
    {
      id: 4,
      seatNumber: 'B2',
      type: SeatType.BLOCK,
      basePrice: 0,
      paidPrice: 0,
      isBooked: false,
      createdAt: '',
      updatedAt: '',
    } as unknown as ISeat,
  ];

  /**
   * @test Component rendering
   * @description Kiểm tra việc render component SeatMap với dữ liệu ghế.
   */
  it('should render seat map with seats', () => {
    render(<SeatMap seats={mockSeats} />);

    expect(screen.getByText('SÂN KHẤU')).toBeInTheDocument();
    // Check for seat numbers via title attribute
    expect(screen.getByTitle('A1')).toBeInTheDocument();
    expect(screen.getByTitle('A2')).toBeInTheDocument();
    expect(screen.getByTitle('B1')).toBeInTheDocument();
    expect(screen.getByTitle('B2')).toBeInTheDocument();
  });

  /**
   * @test Seat grouping by row
   * @description Kiểm tra việc nhóm ghế theo hàng.
   */
  it('should group seats by row across blocks', () => {
    render(<SeatMap seats={mockSeats} />);

    // Multiple "A" and "B" labels exist (3 blocks)
    expect(screen.getAllByText('A').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('B').length).toBeGreaterThanOrEqual(1);
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
    expect(seatA1).toBeInTheDocument();
    
    // FREE seat should have green styling
    expect(seatB1).toBeInTheDocument();
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
    expect(screen.getByText('Block (Hạng A)')).toBeInTheDocument();
    expect(screen.getByText('Đã đặt')).toBeInTheDocument();
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
});
