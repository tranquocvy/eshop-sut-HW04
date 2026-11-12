# HW04 — Báo cáo Automation Testing trên EShop

**Trần Quốc Vỹ · 23120410 · 23_3**

## 1. Phạm vi và nguồn yêu cầu

Bài kiểm thử gồm ba feature web từ HW02. Expected result được đối chiếu với đặc tả EShop.

| Pool | Feature | Yêu cầu SUT |
| --- | --- | --- |
| A | Đăng nhập và khóa tài khoản | [FR-02](https://github.com/ttbhanh/eshop-sut/blob/85af3ba875c88283615e22cb108f13e2fccaf0e9/README.md#fr-02-đăng-nhập--khóa-tài-khoản) |
| B | Giỏ hàng | [FR-07](https://github.com/ttbhanh/eshop-sut/blob/85af3ba875c88283615e22cb108f13e2fccaf0e9/README.md#fr-07-giỏ-hàng-shopping-cart) |
| C | Quản lý danh mục trên Web Admin | [FR-14](https://github.com/ttbhanh/eshop-sut/blob/85af3ba875c88283615e22cb108f13e2fccaf0e9/README.md#fr-14-quản-lý-danh-mục-category-crud) |

## 2. Thiết kế và triển khai automation

<!-- Ghi commit SUT, môi trường, runner và cách chạy. Dẫn script và file CSV/JSON dưới automation/. Giải thích cách ánh xạ ID ca HW02, thiết lập tiền điều kiện và các assertion pattern đã dùng. -->

### FR-02 — Đăng nhập và khóa tài khoản

<!-- Ghi các ca đã chọn, cách dùng AI qua từng bước, file dữ liệu, script và những ca chưa tự động hóa cùng lý do. -->

### FR-07 — Giỏ hàng

<!-- Ghi các ca đã chọn, cách dùng AI qua từng bước, file dữ liệu, script và những ca chưa tự động hóa cùng lý do. -->

### FR-14 — Quản lý danh mục

12 ca được chọn từ bộ test case FR-14 của HW02. Ca xem, thêm và xóa dựa trên FR-14. Ca quyền truy cập màn hình danh mục dựa thêm trên FR-12.

| ID ca HW02 | Kiểm tra trên Web Admin | Expected chính |
| --- | --- | --- |
| CAT-TC01 | Xem danh sách với fixture 0 danh mục | Danh sách rỗng và vẫn đúng sau reload. |
| CAT-TC02 | Xem danh sách với fixture 1 danh mục | Đúng một cặp ID/tên trước và sau reload. |
| CAT-TC03 | Xem danh sách với fixture 3 danh mục | Đúng ba cặp ID/tên, đủ và duy nhất. Thứ tự không thuộc oracle. |
| CAT-TC04 | Thêm tên tiếng Việt `Đồ học tập T03` | Thêm đúng một danh mục với tên đã nhập, giữ danh mục cũ và hiển thị sau reload. |
| CAT-TC05 | Submit tên rỗng, độ dài 0 | Từ chối thêm và giữ nguyên tập danh mục. |
| CAT-TC06 | Thêm tên `A`, độ dài 1 | Thêm đúng một danh mục và hiển thị sau reload. |
| CAT-TC07 | Thêm tên `AB`, độ dài 2 | Thêm đúng một danh mục và hiển thị sau reload. |
| CAT-TC11 | Xóa danh mục ở giữa fixture 3 danh mục, không có sản phẩm tham chiếu | Chỉ danh mục đích biến mất, hai danh mục còn lại giữ nguyên sau reload. |
| CAT-TC12 | Xóa danh mục duy nhất, không có sản phẩm tham chiếu | Danh sách rỗng sau reload. |
| CAT-TC13 | Guest mở Web Admin trong browser context mới | Yêu cầu xác thực hoặc từ chối quyền truy cập màn hình quản lý danh mục. |
| CAT-TC14 | User thường có thông tin hợp lệ thử đăng nhập Web Admin | User thường không truy cập được màn hình quản lý danh mục. |
| CAT-TC33 | Mở lại Web Admin với JWT hợp lệ của user thường trong phiên browser riêng | Web Admin từ chối quyền quản lý danh mục và dữ liệu danh mục giữ nguyên. |

Các ca xem/xóa dùng fixture có đúng số danh mục theo thiết kế HW02. Các ca thêm xác minh tên mục tiêu chưa tồn tại trước khi submit. Backend khởi tạo lại dữ liệu khi khởi động, nên phải xác minh fixture sau khi SUT sẵn sàng. Với CAT-TC33, JWT hợp lệ của user thường là dữ liệu setup. Mở lại UI và kiểm quyền là hành vi được đánh giá.

21 ca còn lại của bộ FR-14 HW02 thực hiện request trực tiếp để kiểm API. Phạm vi chọn ca HW04 ở trên tập trung vào Web Admin.

<!-- Bổ sung file dữ liệu, script, các bước dùng AI và thay đổi sau review vào mục này khi triển khai. -->

## 3. Review và sửa script do AI tạo

| Feature / test case | Sai sót hoặc phần AI bỏ sót | Nguyên nhân | Sửa đổi và cách xác minh |
| --- | --- | --- | --- |
| | | | |

## 4. Kết quả thực thi trên nhiều browser

| Feature | Browser | ISO timestamp | Pass | Fail | HTML report |
| --- | --- | --- | ---: | ---: | --- |
| | | | | | |

<!-- Dẫn HTML report thật trong reports/. Mỗi lượt chạy có Run by: 23120410 và ISO timestamp. Ghi rõ lỗi môi trường hoặc ca bị chặn nếu có. -->

## 5. Bug phát hiện

<!-- Ghi defect có căn cứ từ lần chạy, gồm ID ca, browser, expected, actual và link GitHub Issue có screenshot. Nếu phát hiện bug, bổ sung bug report để nộp. -->

## 6. Hồ sơ AI và demo

- [AI Audit Report và khai báo sử dụng AI](ai/AI_Audit_Report.md)
- [AI Critique](ai/AI_Critique.md)
- [Video demo](README.md#video-demo)
