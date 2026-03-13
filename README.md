# VietQR Bulk Generator

Project này giúp bạn tạo hàng loạt mã QR MoMo từ danh sách số điện thoại.

## Cách sử dụng

1.  Mở terminal trong thư mục `vietqr-generator`.
2.  Chạy lệnh `npm install` để cài đặt thư viện (nếu chưa chạy).
3.  Chạy lệnh `npm run dev` để khởi động ứng dụng.
4.  Mở trình duyệt truy cập vào link hiện ra (thường là `http://localhost:5173`).
5.  Dán danh sách số điện thoại vào ô nhập liệu.
6.  Nhấn **Tạo mã QR**.

## Tính năng

-   Hỗ trợ tạo hàng loạt với số lượng lớn.
-   Tùy chỉnh số tiền (mặc định 2000đ).
-   Giao diện hiện đại, hỗ trợ Dark Mode.
-   Hỗ trợ In hoặc Lưu dưới dạng PDF.

## Công nghệ sử dụng

-   React + Vite
-   TypeScript
-   VietQR API (img.vietqr.io)
