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

#### T01 — Xem danh mục và kiểm quyền truy cập

SUT ở commit `85af3ba`, chạy trên Windows với Node.js 24.14.0 và Playwright Test 1.65.0. T01 chuyển sáu ca xem danh mục và quyền truy cập từ runner Python HW02 sang Playwright Test. [Dữ liệu JSON](automation/data/fr14-t01.json) · [Script T01](automation/tests/fr14-t01.spec.mjs) · [Cấu hình Playwright](automation/playwright.config.mjs)

Mỗi ca chạy trong browser context mới. Fixture đặt 0, 1 hoặc 3 danh mục trong database của bản runtime riêng, sau đó đối chiếu với API trước khi thao tác Web Admin. Với ca xem danh sách, script chờ tải dữ liệu rồi kiểm heading, số dòng và tập cặp ID/tên trước và sau reload. Với ca quyền truy cập, script kiểm menu, panel, nút thêm, phản hồi xác thực và trạng thái dữ liệu trước/sau.

Để chạy lại, chuẩn bị một bản sao `backend/` và `frontend-admin/` từ cùng commit ở thư mục runtime ngoài repo. Chạy `npm ci` trong mỗi thư mục và tạo file đánh dấu `.hw04-isolated-runtime` ở gốc bản sao. Đặt `HW04_SUT_ROOT` tới bản sao và cấp bốn biến `HW04_ADMIN_EMAIL`, `HW04_ADMIN_PASSWORD`, `HW04_USER_EMAIL`, `HW04_USER_PASSWORD` từ tài khoản demo của SUT. Config tự khởi động hai service trên cổng 3000 và 5174. Trong `hw04/automation`, chạy `npm ci`, `npx playwright install chromium firefox webkit` và dùng lệnh trong reference với spec `tests/fr14-t01.spec.mjs`. [Cách chạy và tạo HTML report](skills/web-automation-testing/references/playwright-workflow.md)

## 3. Review và sửa script do AI tạo

| Feature / test case | Sai sót hoặc phần AI bỏ sót | Nguyên nhân | Sửa đổi và cách xác minh |
| --- | --- | --- | --- |
| FR-14 / CAT-TC01–03 | Assertion ban đầu dùng điều kiện HTTP 2xx cho request danh mục sau reload. | Firefox và WebKit dùng revalidation và trả HTTP 304 cho dữ liệu danh mục giữ nguyên. | Chấp nhận 200 hoặc 304 ở request đọc, sau đó vẫn kiểm số dòng và tập ID/tên trên UI. Lượt chạy lại xác nhận cả ba ca pass trên cả ba browser. |
| FR-14 / CAT-TC33 | Bản AI đầu gắn listener cho request danh mục sau khi nhận phản hồi request kiểm phiên. | Chuỗi request trên UI có thể tiến nhanh hơn thời điểm listener được gắn. | Gắn listener trước khi mở trang hoặc reload. Lượt chạy sau sửa thu được quan sát và ảnh ở cả hai thời điểm trên ba browser. |

## 4. Kết quả thực thi trên nhiều browser

| Feature | Browser | ISO timestamp | Pass | Fail | HTML report |
| --- | --- | --- | ---: | ---: | --- |
| FR-14 T01 | Chromium | 2026-11-12T08:01:14.2871371Z | 5 | 1 | [HTML report](reports/fr14/t01/chromium/20261112T0801142871371Z/index.html) |
| FR-14 T01 | Firefox | 2026-11-12T08:01:19.7026914Z | 5 | 1 | [HTML report](reports/fr14/t01/firefox/20261112T0801197026914Z/index.html) |
| FR-14 T01 | WebKit | 2026-11-12T08:01:43.1664819Z | 5 | 1 | [HTML report](reports/fr14/t01/webkit/20261112T0801431664819Z/index.html) |

T01 phát hiện đủ sáu ID trên mỗi project. Kết quả nghiệm thu kỹ thuật gồm 18 lượt thực thi, 15 pass và 3 fail cùng một defect CAT-TC33. Các lượt đầu được giữ để truy vết assertion HTTP đã sửa. [Chromium lần đầu](reports/fr14/t01/chromium/20261112T0800106785100Z/index.html) · [Firefox lần đầu](reports/fr14/t01/firefox/20261112T0800164680708Z/index.html) · [WebKit lần đầu](reports/fr14/t01/webkit/20261112T0800445354808Z/index.html)

<!-- Dẫn HTML report thật trong reports/. Mỗi lượt chạy có Run by: 23120410 và ISO timestamp. Ghi rõ lỗi môi trường hoặc ca bị chặn nếu có. -->

## 5. Bug phát hiện

### CAT-TC33 — User thường truy cập được màn hình quản lý danh mục khi khôi phục phiên Web Admin

- **Expected theo FR-12.** Phiên user thường bị từ chối truy cập màn hình và thao tác quản lý danh mục.
- **Cách tái hiện.** Đăng nhập lấy JWT hợp lệ của user thường, lưu vào `adminToken` trong phiên Web Admin riêng, mở lại trang và chọn **Danh mục**. Lặp quan sát sau reload.
- **Actual.** Menu **Danh mục**, heading **Quản lý Danh mục** và nút **Thêm mới** đều hiển thị trước và sau reload trên Chromium, Firefox và WebKit. Tập danh mục giữ nguyên trong lần kiểm quyền này.
- **Bằng chứng sau reload.** [Chromium](reports/fr14/t01/chromium/20261112T0801142871371Z/data/a58151896d862e839ae0273a293e67f2d2c1ebc7.png) · [Firefox](reports/fr14/t01/firefox/20261112T0801197026914Z/data/34a079ecc531f00b015891542f2f391dfd917319.png) · [WebKit](reports/fr14/t01/webkit/20261112T0801431664819Z/data/12cab9dcd32e8800d084c84710a9d90074dfedbb.png)

<!-- Ghi defect có căn cứ từ lần chạy, gồm ID ca, browser, expected, actual và link GitHub Issue có screenshot. Nếu phát hiện bug, bổ sung bug report để nộp. -->

## 6. Hồ sơ AI và demo

- [AI Audit Report và khai báo sử dụng AI](ai/AI_Audit_Report.md)
- [AI Critique](ai/AI_Critique.md)
- [Video demo](README.md#video-demo)
