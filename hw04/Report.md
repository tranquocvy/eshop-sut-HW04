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

Suite dùng Playwright Test 1.65.0 và SUT tại `85af3ba`. Dữ liệu JSON giữ ID ca HW02. Mỗi lần chạy xác minh fixture trước thao tác và lưu report riêng theo browser.

| Feature | Các assertion pattern dùng trong suite |
| --- | --- |
| FR-02 | `toHaveURL` kiểm điều hướng, `toHaveAttribute` kiểm input, `toEqual` kiểm counter/deadline và `toHaveValue` kiểm email hồ sơ. |
| FR-07 | `toHaveCount` kiểm số dòng, `toBeVisible` kiểm control/empty state và `toBe` kiểm quantity, thành tiền, tổng. |
| FR-14 | `toBeVisible` kiểm màn hình quản lý, `toHaveCount` kiểm số dòng và `toEqual` đối chiếu tập ID/tên. |

### FR-02 — Đăng nhập và khóa tài khoản

14 ca Web từ HW02 được chuyển sang Playwright Test theo ba task. T04 kiểm đăng nhập đúng, JWT và hồ sơ. T05 kiểm credential sai và HTML5 validation. T06 kiểm bộ đếm, ngưỡng và thời hạn khóa, đăng nhập trong khóa và thử từ context mới. Các ca kiểm biên thời gian ở mức mili giây W13–W15, chuỗi reset W16 và ảnh hưởng sang tài khoản khác W17 nằm ngoài bộ đã chọn. [Mapping, expected và cách chạy lại](reports/fr02/phase-2/README.md)

Mỗi test dùng context và tài khoản riêng trong bản runtime của SUT `85af3ba`. Các ca W04, W05 và W12 đi qua chuỗi đăng nhập sai trên Web. W11 và W18 bắt đầu với fixture đã khóa để kiểm hành vi trong khóa độc lập với lỗi kích hoạt khóa. Assertions bao gồm UI và điều hướng, DOM validity, request/JWT và trạng thái lưu trong SQLite. [T04](automation/tests/fr02-t04.spec.mjs) · [T05](automation/tests/fr02-t05.spec.mjs) · [T06](automation/tests/fr02-t06.spec.mjs)

### FR-07 — Giỏ hàng

15 ca Web từ HW02 được chuyển sang Playwright Test. T07 kiểm thêm sản phẩm và hiển thị giỏ, T08 kiểm nút đổi số lượng và tính tiền, T09 kiểm xác nhận xóa, giỏ rỗng và tiếp tục mua sắm. Mỗi ca dùng context độc lập, đối chiếu giỏ ban đầu và trạng thái quan sát được sau thao tác. Fixture nhiều đơn vị dùng thao tác UI để dựng giỏ riêng. Ca kiểm thêm từ trang chi tiết vẫn dùng đúng một click cho mỗi thao tác mục tiêu. [Mapping, test data và cách chạy](reports/fr07/phase-3/README.md)

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

#### T02 — Thêm danh mục và kiểm biên tên

T02 kiểm tên tiếng Việt và các độ dài 0, 1, 2 theo FR-14. Mỗi ca submit trên Web Admin, ghi phản hồi, đối chiếu danh sách trước và sau thao tác, rồi kiểm lại dữ liệu sau reload. Ca tên rỗng yêu cầu ứng dụng từ chối và giữ danh sách ban đầu. [Dữ liệu T02](automation/data/fr14-t02.json) · [Script T02](automation/tests/fr14-t02.spec.mjs)

#### T03 — Xóa danh mục và kiểm trạng thái sau reload

T03 xóa theo đúng ID của danh mục giữa trong fixture ba dòng hoặc danh mục duy nhất trong fixture một dòng. Script so sánh các dòng còn lại với tập kỳ vọng, rồi kiểm lại trên UI và API sau reload. [Dữ liệu T03](automation/data/fr14-t03.json) · [Script T03](automation/tests/fr14-t03.spec.mjs)

Để chạy cả phase, dùng bộ lọc `fr14-t0[123]\.spec` thay đường dẫn spec T01 trong lệnh Playwright. [Cấu hình dùng chung](automation/playwright.config.mjs) · [Fixture và thao tác dùng chung](automation/tests/fr14-support.mjs)

## 3. Review và sửa script do AI tạo

| Feature / test case | Sai sót hoặc phần AI bỏ sót | Nguyên nhân | Sửa đổi và cách xác minh |
| --- | --- | --- | --- |
| FR-14 / CAT-TC01–03 | Assertion ban đầu dùng điều kiện HTTP 2xx cho request danh mục sau reload. | Firefox và WebKit dùng revalidation và trả HTTP 304 cho dữ liệu danh mục giữ nguyên. | Chấp nhận 200 hoặc 304 ở request đọc, sau đó vẫn kiểm số dòng và tập ID/tên trên UI. Lượt chạy lại xác nhận cả ba ca pass trên cả ba browser. |
| FR-14 / CAT-TC33 | Bản AI đầu gắn listener cho request danh mục sau khi nhận phản hồi request kiểm phiên. | Chuỗi request trên UI có thể tiến nhanh hơn thời điểm listener được gắn. | Gắn listener trước khi mở trang hoặc reload. Lượt chạy sau sửa thu được quan sát và ảnh ở cả hai thời điểm trên ba browser. |
| FR-14 / CAT-TC14 và CAT-TC33 | Sau khi tách helper dùng chung, hai ca gọi hàm `credentials` chưa được import. | Playwright phát hiện đủ ID nhưng chưa thực thi thân test ở bước discovery. | Bổ sung export và import rồi chạy lại toàn bộ 12 ca trên ba browser. CAT-TC14 pass và CAT-TC33 ghi nhận lỗi quyền truy cập trên cả ba. |
| FR-02 / helper đăng nhập | Lượt đầu dừng trước submit vì locator email khớp cả hai input. | Script suy ô mật khẩu dùng `type=password`, còn baseline dùng `type=text` cho hai ô. | Codex định vị theo vùng có nhãn và giữ assertion `type=email` ở W07. Pilot đã kiểm được luồng JWT/hồ sơ và ghi nhận lỗi thật ở W07, W12. |
| FR-02 / W04, W12, W18 | W12 có thể skip khi các lần đăng nhập sai đã chạy và tạo sai trạng thái. W04/W18 thiếu kiểm trạng thái sau thao tác cuối. | Script dùng trạng thái khóa như tiền điều kiện để skip và chỉ kiểm kết quả đăng nhập ở hai điểm cuối. | Sinh viên đổi W12 thành Failed kèm screenshot và thêm assertion W04/W18 trong `c0cc5c9`. Codex bổ sung trạng thái thực tế vào lỗi W12 và chờ SQLite ghi thay đổi ở W04. |
| FR-02 / W01 | Assertion HTTP 2xx dừng ca Firefox khi reload hồ sơ. | Firefox có thể revalidate dữ liệu hồ sơ và nhận HTTP 304. | Codex kiểm 200 hoặc 304, xác minh cùng Bearer token và email hồ sơ trên UI. Lượt chạy riêng W01 trên Firefox pass với HTTP 304. |
| FR-07 / CART-W19 | Lượt pilot dừng ở assertion số dòng và bỏ qua assertion xác nhận xóa. | Kiểm hậu trạng thái bằng hard assertion trước khi ghi nhận kết quả dialog. | Codex ghi nhận assertion xác nhận bằng soft assertion trước, rồi đối chiếu các dòng còn lại. |
| FR-07 / T08 và CART-W23 | Pilot dừng tại nút giảm bị thiếu nên chưa đối chiếu giỏ sau bước thử. Nhánh giỏ có hàng của W23 dùng thuộc tính nội bộ Playwright. | Bản AI đầu coi control như điều kiện dừng và lấy baseURL từ đối tượng nội bộ. | Codex đối chiếu giỏ vẫn giữ nguyên nếu control vắng mặt và lấy origin từ URL của trang đã mở. |
| FR-07 / lượt chẩn đoán T07 | Lượt Chromium đầu đọc danh sách dòng quá sớm và ghi 0 dòng dù giao diện render hàng sau đó. | Lấy snapshot locator ngay sau khi route đổi. | Codex chờ dòng sản phẩm xuất hiện trước khi đọc các ô, rồi chạy lại cả ba browser. |

## 4. Kết quả thực thi trên nhiều browser

| Feature | Browser | Pass | Fail | Skipped | HTML report chính |
| --- | --- | ---: | ---: | ---: | --- |
| FR-02 | Chromium | 8 | 6 | 0 | [Report](reports/fr02/phase-2/final/chromium/20261112T1100310960125Z/index.html) |
| FR-02 | Firefox | 8 | 6 | 0 | [Report](reports/fr02/phase-2/final/firefox/20261112T1100589230198Z/index.html) |
| FR-02 | WebKit | 8 | 6 | 0 | [Report](reports/fr02/phase-2/final/webkit/20261112T1102142641785Z/index.html) |
| FR-07 | Chromium | 0 | 15 | 0 | [Report](reports/fr07/phase-3/final/chromium/20261113T0742417675299Z/index.html) |
| FR-07 | Firefox | 0 | 15 | 0 | [Report](reports/fr07/phase-3/final/firefox/20261113T0743353230947Z/index.html) |
| FR-07 | WebKit | 0 | 15 | 0 | [Report](reports/fr07/phase-3/final/webkit/20261113T0745314331071Z/index.html) |
| FR-14 | Chromium | 10 | 2 | 0 | [Report](reports/fr14/phase-1/chromium/20261112T0817472147505Z/index.html) |
| FR-14 | Firefox | 10 | 2 | 0 | [Report](reports/fr14/phase-1/firefox/20261112T0817575329174Z/index.html) |
| FR-14 | WebKit | 10 | 2 | 0 | [Report](reports/fr14/phase-1/webkit/20261112T0818434836706Z/index.html) |
| **Tổng** | **9 lượt** | **54** | **69** | **0** | **41 ID ca duy nhất** |

Ba report chẩn đoán FR-07 bổ sung 15 lượt trên 5 ID đã có, với 9 Pass và 6 Fail. Tổng chính và chẩn đoán là 138 lượt, 63 Pass và 75 Fail. Các report pilot, lượt lỗi harness và demo được giữ theo từng attempt và nằm ngoài số liệu chính.


### Phase 1 — FR-14

| Browser | ISO timestamp | T01 pass/fail | T02 pass/fail | T03 pass/fail | HTML report |
| --- | --- | ---: | ---: | ---: | --- |
| Chromium | 2026-11-12T08:17:47.2147505Z | 5/1 | 3/1 | 2/0 | [HTML report](reports/fr14/phase-1/chromium/20261112T0817472147505Z/index.html) |
| Firefox | 2026-11-12T08:17:57.5329174Z | 5/1 | 3/1 | 2/0 | [HTML report](reports/fr14/phase-1/firefox/20261112T0817575329174Z/index.html) |
| WebKit | 2026-11-12T08:18:43.4836706Z | 5/1 | 3/1 | 2/0 | [HTML report](reports/fr14/phase-1/webkit/20261112T0818434836706Z/index.html) |

Tổng hợp Phase 1 dùng ba report trên. Có 12 ca duy nhất và 36 lượt thực thi, gồm 30 pass và 6 fail. Hai ca `CAT-TC05` và `CAT-TC33` fail trên cả ba browser. Mỗi report hiển thị `Run by: 23120410`, ISO timestamp và đầy đủ 12 ID. Bước discovery của [Agent Skill](skills/web-automation-testing/SKILL.md) đã đối chiếu 12 ID JSON với mỗi project trước khi chạy.

Lượt chạy tích hợp đầu ghi nhận lỗi thiếu import ở hai ca T01. Các report đó được giữ để đối chiếu phần sửa. [Chromium](reports/fr14/phase-1/chromium/20261112T0816178151830Z/index.html) · [Firefox](reports/fr14/phase-1/firefox/20261112T0816287678164Z/index.html) · [WebKit](reports/fr14/phase-1/webkit/20261112T0817125051454Z/index.html)

### Pilot T01

| Feature | Browser | ISO timestamp | Pass | Fail | HTML report |
| --- | --- | --- | ---: | ---: | --- |
| FR-14 T01 | Chromium | 2026-11-12T08:01:14.2871371Z | 5 | 1 | [HTML report](reports/fr14/t01/chromium/20261112T0801142871371Z/index.html) |
| FR-14 T01 | Firefox | 2026-11-12T08:01:19.7026914Z | 5 | 1 | [HTML report](reports/fr14/t01/firefox/20261112T0801197026914Z/index.html) |
| FR-14 T01 | WebKit | 2026-11-12T08:01:43.1664819Z | 5 | 1 | [HTML report](reports/fr14/t01/webkit/20261112T0801431664819Z/index.html) |

T01 phát hiện đủ sáu ID trên mỗi project. Kết quả nghiệm thu kỹ thuật gồm 18 lượt thực thi, 15 pass và 3 fail cùng một defect CAT-TC33. Các lượt đầu được giữ để truy vết assertion HTTP đã sửa. [Chromium lần đầu](reports/fr14/t01/chromium/20261112T0800106785100Z/index.html) · [Firefox lần đầu](reports/fr14/t01/firefox/20261112T0800164680708Z/index.html) · [WebKit lần đầu](reports/fr14/t01/webkit/20261112T0800445354808Z/index.html)

### Phase 2 — FR-02

Kết quả cuối gồm 14 ID và 42 lượt thực thi trên Chromium, Firefox và WebKit, với 24 pass, 18 fail và 0 skipped. Sáu ca fail giống nhau trên cả ba browser. W12 ghi Failed kèm screenshot ở bước phát hiện chuỗi sai. Bước thử lần thứ tư chưa diễn ra do tài khoản khóa sớm. [Các HTML report cuối và lịch sử lần chạy](reports/fr02/phase-2/README.md#kết-quả-dùng-để-tổng-hợp)

### Phase 3 — FR-07

15 ID và 45 lượt thực thi, gồm 0 pass, 45 fail, 0 skipped. Chromium, Firefox và WebKit đều tái hiện cùng các sai lệch sau khi script đã xác minh giỏ ban đầu. T08 dừng thao tác chỉnh ở nút bị thiếu và đối chiếu giỏ vẫn giữ nguyên. W07 dừng chuỗi ở lần thêm đầu tiên. [HTML report, thời gian và kết quả theo browser](reports/fr07/phase-3/README.md#kết-quả-dùng-để-tổng-hợp)

## 5. Bug phát hiện

### CAT-TC05 — Web Admin lưu danh mục tên rỗng

- [GitHub Issue #1](https://github.com/tranquocvy/eshop-sut-HW04/issues/1) · [Ảnh chụp trang issue](reports/fr14/phase-1/github-issues/HW04-issue-01-CAT-TC05.png)

- **Expected theo FR-14.** Tên danh mục bắt buộc. Submit tên rỗng phải bị từ chối và danh sách danh mục giữ nguyên.
- **Cách tái hiện.** Đăng nhập Web Admin, mở **Danh mục**, để trống ô **Tên danh mục mới**, bấm **Thêm mới** và reload.
- **Actual.** Request thêm trả HTTP 200. Một dòng danh mục tên rỗng xuất hiện và vẫn tồn tại sau reload trên cả ba browser.
- **Bằng chứng sau reload.** [Chromium](reports/fr14/phase-1/chromium/20261112T0817472147505Z/data/f380ee78dca2185ff413078acab62f0c16101d50.png) · [Firefox](reports/fr14/phase-1/firefox/20261112T0817575329174Z/data/267046d0a6e9f0af33ee2d08d06a6ca278c8373c.png) · [WebKit](reports/fr14/phase-1/webkit/20261112T0818434836706Z/data/2d1fb00e85a40db92bf8a66455b7b1aaf2233b30.png)

### CAT-TC33 — User thường truy cập được màn hình quản lý danh mục khi khôi phục phiên Web Admin

- [GitHub Issue #2](https://github.com/tranquocvy/eshop-sut-HW04/issues/2) · [Ảnh chụp trang issue](reports/fr14/phase-1/github-issues/HW04-issue-02-CAT-TC33.png)

- **Expected theo FR-12.** Phiên user thường bị từ chối truy cập màn hình và thao tác quản lý danh mục.
- **Cách tái hiện.** Đăng nhập lấy JWT hợp lệ của user thường, lưu vào `adminToken` trong phiên Web Admin riêng, mở lại trang và chọn **Danh mục**. Lặp quan sát sau reload.
- **Actual.** Menu **Danh mục**, heading **Quản lý Danh mục** và nút **Thêm mới** đều hiển thị trước và sau reload trên Chromium, Firefox và WebKit. Tập danh mục giữ nguyên trong lần kiểm quyền này.
- **Bằng chứng sau reload.** [Chromium](reports/fr14/phase-1/chromium/20261112T0817472147505Z/data/a58151896d862e839ae0273a293e67f2d2c1ebc7.png) · [Firefox](reports/fr14/phase-1/firefox/20261112T0817575329174Z/data/34a079ecc531f00b015891542f2f391dfd917319.png) · [WebKit](reports/fr14/phase-1/webkit/20261112T0818434836706Z/data/12cab9dcd32e8800d084c84710a9d90074dfedbb.png)

### FR02-BUG01 — Email sai định dạng vẫn gửi request đăng nhập

- [GitHub Issue #3](https://github.com/tranquocvy/eshop-sut-HW04/issues/3) · [Ảnh chụp trang issue](reports/fr02/phase-2/github-issues/HW04-issue-03-FR02-BUG01.png)
- **Expected theo FR-02.** Ô email có `type=email`, browser chặn submit nếu định dạng không hợp lệ.
- **Cách tái hiện.** Mở `/login`, điền `plainaddress` hoặc `a@` vào ô Username, điền mật khẩu và bấm **Sign In**.
- **Actual.** Ô email có `type=text`, `validity.typeMismatch` là `false` và form gửi một `POST /api/login` trên mỗi browser. Quan sát từ W07 và W08.
- **Ảnh W07.** [Chromium](reports/fr02/phase-2/final/chromium/20261112T1100310960125Z/data/55bc2d4ea74af68b24d1593b91d6878c8a2fb041.png) · [Firefox](reports/fr02/phase-2/final/firefox/20261112T1100589230198Z/data/58b7d5425b5a49d0ea2f376e0deea3d423ea6e5d.png) · [WebKit](reports/fr02/phase-2/final/webkit/20261112T1102142641785Z/data/7714b1f02b9b31d7320332f72bfabbc4f3e823ab.png)

### FR02-BUG02 — Bộ đếm tăng hai và khóa tài khoản ở lần sai thứ hai

- [GitHub Issue #4](https://github.com/tranquocvy/eshop-sut-HW04/issues/4) · [Ảnh chụp trang issue](reports/fr02/phase-2/github-issues/HW04-issue-04-FR02-BUG02.png)
- **Expected theo FR-02.** Mỗi lần nhập sai làm counter tăng một. Hai lần sai vẫn cho phép đăng nhập bằng mật khẩu đúng. Khóa bắt đầu ở lần sai thứ ba liên tiếp.
- **Cách tái hiện.** Với tài khoản mới, thử sai mật khẩu một lần rồi kiểm counter. Thử sai lần hai, sau đó nhập mật khẩu đúng trong vòng 30 giây.
- **Actual.** Counter đi `0 → 2 → 4`. Tài khoản đã khóa sau lần sai thứ hai và từ chối cả mật khẩu đúng. Quan sát từ W03, W04, W05 và W12 trên ba browser.
- **Ảnh W12 kèm log chuỗi trong HTML report.** [Chromium](reports/fr02/phase-2/final/chromium/20261112T1100310960125Z/data/0047aef00eb13dd7e45b9d47ab0363335c6f429c.png) · [Firefox](reports/fr02/phase-2/final/firefox/20261112T1100589230198Z/data/beaf18a5188b45ad120a26aa4e651f8f4878b8ff.png) · [WebKit](reports/fr02/phase-2/final/webkit/20261112T1102142641785Z/data/2769cf880ad8de34b125ce5df1b9d3b057926b61.png)

### FR02-BUG03 — Thời hạn khóa được đặt khoảng 180 giây

- [GitHub Issue #5](https://github.com/tranquocvy/eshop-sut-HW04/issues/5) · [Ảnh chụp trang issue](reports/fr02/phase-2/github-issues/HW04-issue-05-FR02-BUG03.png)
- **Expected theo FR-02.** Thời hạn khóa demo là 30 giây kể từ lần đăng nhập sai kích hoạt khóa.
- **Cách tái hiện.** Nhập sai mật khẩu liên tiếp qua Web với một tài khoản mới. Ghi thời điểm trước và sau request đầu tiên tạo `locked_until`, rồi đối chiếu deadline lưu trong SQLite.
- **Actual.** W05 ghi khoảng 179.987–180.027 giây trên Chromium, 179.994–180.026 giây trên Firefox và 179.999–180.018 giây trên WebKit. Đây là thời hạn lưu được suy từ cửa sổ thời gian của request. Các ca biên thời điểm mở khóa W13–W15 nằm ngoài lượt chạy.
- **Ảnh W05 và số đo trong HTML report.** [Chromium](reports/fr02/phase-2/final/chromium/20261112T1100310960125Z/data/efe47519206e697acf600c9c276bd7c419567aa5.png) · [Firefox](reports/fr02/phase-2/final/firefox/20261112T1100589230198Z/data/1256eb060ce67358382737177ca1751d466285a9.png) · [WebKit](reports/fr02/phase-2/final/webkit/20261112T1102142641785Z/data/cf87d62113e11be5dad18b4aa01308e8b7b301aa.png)

### FR-07 — Giỏ hàng

Phase 3 tái hiện năm nhóm defect Web từ HW02, gồm click thêm đầu không có tác dụng, thiếu minh họa giỏ rỗng, sai cột đơn giá và thiếu nút chỉnh số lượng, sai nhãn tổng, và xóa không hỏi xác nhận. [Expected, actual, ca liên quan và ảnh từng browser](reports/fr07/phase-3/README.md#defect-tái-hiện)

Lượt chẩn đoán sau hai click kiểm được lỗi gộp dòng Web ở W04 và W07. Giỏ tạo nhiều dòng cùng sản phẩm dù tổng số lượng và tổng tiền vẫn đúng. [Report và bằng chứng lỗi gộp dòng](reports/fr07/phase-3/README.md#chẩn-đoán-sau-hai-click)

## 6. Hồ sơ AI và demo

- [AI Audit Report và khai báo sử dụng AI](ai/AI_Audit_Report.md)
- [AI Critique](ai/AI_Critique.md)
- [Video Task 2](https://youtu.be/vJUG_TZbxtU), dài 9 phút 21 giây, trình bày FR-02, bản sửa W12 và kết quả thực thi đa browser.
- [Video Agent Skill](https://youtu.be/-OzCOso_a1M), dài 5 phút 6 giây, trình bày skill, reference, script kiểm discovery và kết quả kiểm chứng feature FR-02.
- [Agent Skill và workflow](skills/web-automation-testing/SKILL.md)
- Git commit log trong ZIP, file GitCommitLog.txt ghi 11 commit có thay đổi file `.spec.mjs`.

Video Agent Skill được tự chấm 9/10 do mic chất lượng thấp gây nhiều tiếng ồn và lỗi âm thanh. Hướng cải thiện cho lần sau là mua mic tốt hơn để lời thuyết minh rõ và ổn định.

## 7. Kết luận

Ba feature đã được chuyển thành 41 ca Web data-driven và thực thi trên Chromium, Firefox, WebKit. Chín report chính ghi 54 Pass và 69 Fail trên 123 lượt. Các assertion fail tái hiện 11 nhóm defect, tính cả lỗi gộp dòng được xác nhận trong lượt chẩn đoán FR-07. Mỗi nhóm có GitHub Issue, ảnh lỗi SUT và ảnh trang Issue. Báo cáo ghi cụ thể bước dừng do lỗi SUT và giới hạn coverage phía sau để kết quả có thể đối chiếu với expected. Kết quả review, bản sửa sinh viên và cách dùng Agent Skill được trình bày trong hai video và hồ sơ AI.
