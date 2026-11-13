# Phase 3 — FR-07 Giỏ hàng

SUT `85af3ba875c88283615e22cb108f13e2fccaf0e9`, Windows build 26300, Node.js 24.14.0, Playwright Test 1.65.0. Chạy Web ở localhost:5173 và backend ở localhost:3000 trong runtime riêng.

## Mapping từ HW02

Nguồn là `features/fr07-cart/test-cases.md` trong bộ nộp HW02. Expected lấy từ [FR-06 và FR-07 của SRS](https://github.com/ttbhanh/eshop-sut/blob/85af3ba875c88283615e22cb108f13e2fccaf0e9/README.md#fr-06-xem-chi-tiết-sản-phẩm). Trong bảng, P là iPhone 15 Pro Max (30 triệu ₫), Q là Samsung Galaxy S24 Ultra (28 triệu ₫), H là Tai nghe AirPods Pro 2 (6 triệu ₫). Mỗi ca kiểm tên, số dòng, số lượng, đơn giá, thành tiền và tổng phù hợp với giỏ trước và sau thao tác. Không phụ thuộc dấu phân cách hàng nghìn cụ thể.

| Task / ID HW02 | Giỏ ban đầu | Thao tác Web và expected chính |
| --- | --- | --- |
| T07 / CART-W02 | Rỗng | Thêm P×1 bằng một click tại trang chi tiết. Có phản hồi, đúng một dòng P và tổng 30 triệu ₫, đúng cấu trúc bảng. |
| T07 / CART-W03 | Rỗng | Thêm P×3 bằng một click. Một dòng P×3, tổng 90 triệu ₫. |
| T07 / CART-W04 | P×2 | Thêm P×3 bằng một click. Gộp thành một dòng P×5, tổng 150 triệu ₫. |
| T07 / CART-W07 | Rỗng | Ba lượt vào trang chi tiết, mỗi lượt thêm P×1 bằng một click. Một dòng P với q=1, 2, 3 sau từng lượt. |
| T07 / CART-W09 | P×1 | Kiểm đủ năm cột, hai nút chỉnh và nhãn “Tổng cộng”. |
| T07 / CART-W34 | Rỗng | Thêm P×2 bằng một click. Một dòng P×2, tổng 60 triệu ₫ và có phản hồi. |
| T08 / CART-W16 | P×1 | Bấm +, thành P×2 và tổng 60 triệu ₫. |
| T08 / CART-W17 | P×2 | Bấm −, còn P×1 và tổng 30 triệu ₫. |
| T08 / CART-W18 | P×1 | Giảm tại q=1 phải bị chặn hoặc hỏi xác nhận xóa. Nếu có xác nhận thì hủy và đối chiếu P×1. |
| T08 / CART-W31 | P×2, Q×3, H×4 | Bấm + ở Q rồi − ở H, tổng lần lượt 196 và 190 triệu ₫. P giữ nguyên. |
| T09 / CART-W01 | Rỗng | Mở giỏ và kiểm thông báo, minh họa, 0 dòng, không có tổng cũ. |
| T09 / CART-W19 | P×2, Q×3, H×4 | Bấm xóa Q rồi hủy xác nhận. Giữ nguyên ba dòng và tổng 168 triệu ₫. |
| T09 / CART-W20 | P×1 | Bấm xóa và xác nhận. Giỏ về 0 dòng, có thông báo và minh họa. |
| T09 / CART-W21 | P×2, Q×3, H×4 | Xóa Q rồi xác nhận. Giữ P×2 và H×4, tổng 84 triệu ₫. |
| T09 / CART-W23 | Giỏ rỗng và P×1 ở hai context | Đi tiếp mua sắm từ cả hai trạng thái, về `/`, rồi mở lại giỏ để đối chiếu trạng thái. Kiểm empty state ở nhánh rỗng. |

W05–W06, W08 và W22 mở rộng các chuỗi thêm/xóa đã chọn. W10–W15, W26 và W32 kiểm validation FR-06, khó tách kết quả từ chối input khỏi lỗi click đầu trên baseline. W24–W25, W27–W30 có thêm oracle đề xuất, khảo sát cú pháp, fixture đặc thù hoặc persistence ngoài FR-07. W33 mở rộng chuỗi điều chỉnh nhiều lần của T08. 26 ca API HW02 nằm ngoài phạm vi Web.

## Dựng giỏ và chạy lại

Mỗi test bắt đầu trong context mới. Đọc catalog để đối chiếu seed, tìm link chi tiết theo tên và lấy ID từ link. Giỏ chỉ được dựng qua Web UI. Với fixture cần nhiều đơn vị một dòng, helper quan sát giỏ sau click đầu. Khi chưa có dòng, helper mở lại trang chi tiết và dùng hai click liên tiếp để dựng fixture, rồi đối chiếu đủ giỏ trước khi test thao tác mục tiêu. Ca kiểm nút thêm ở trang chi tiết bấm đúng một lần mỗi bước. Assertions bao gồm điều hướng, UI/DOM, số dòng và giá trị tiền/số lượng.

- [T07 script](../../../automation/tests/fr07-t07.spec.mjs) · [JSON](../../../automation/data/fr07-t07.json)
- [T08 script](../../../automation/tests/fr07-t08.spec.mjs) · [JSON](../../../automation/data/fr07-t08.json)
- [T09 script](../../../automation/tests/fr07-t09.spec.mjs) · [JSON](../../../automation/data/fr07-t09.json)
- [Helper](../../../automation/tests/fr07-support.mjs) · [Catalog fixture](../../../automation/data/fr07-products.json)

Chuẩn bị bản sao `backend/` và `frontend-web/` từ commit baseline ở runtime ngoài repo. Chạy `npm ci` trong mỗi thư mục và tạo file `.hw04-isolated-runtime` ở gốc runtime. Đặt `HW04_SUT_ROOT` đến runtime và `HW04_FRONTEND=web`. Trong `hw04/automation`, chạy `npm ci` và cài engine bằng `npx playwright install chromium firefox webkit` nếu cần. Dùng bộ lọc `fr07-t0[789]\.spec` theo [workflow tạo HTML report](../../../skills/web-automation-testing/references/playwright-workflow.md).

## Kết quả dùng để tổng hợp

| Browser | ISO timestamp | T07 pass/fail | T08 pass/fail | T09 pass/fail | HTML report |
| --- | --- | ---: | ---: | ---: | --- |
| Chromium 158.0.8127.18 | 2026-11-13T07:42:41.7675299Z | 0/6 | 0/4 | 0/5 | [HTML report](final/chromium/20261113T0742417675299Z/index.html) |
| Firefox 159.0 | 2026-11-13T07:43:35.3230947Z | 0/6 | 0/4 | 0/5 | [HTML report](final/firefox/20261113T0743353230947Z/index.html) |
| WebKit 27.2 | 2026-11-13T07:45:31.4331071Z | 0/6 | 0/4 | 0/5 | [HTML report](final/webkit/20261113T0745314331071Z/index.html) |

15 ID duy nhất, 45 lượt thực thi, 0 pass, 45 fail, 0 skipped, 0 retry. Cả ba browser tái hiện cùng nhóm assertion fail sau khi fixture đã được xác minh. Mở và đối chiếu từng HTML report với JSON gốc, gồm tiêu đề `Run by: 23120410`, timestamp, project, ID, kết quả và ảnh đính kèm. W07 chưa thực hiện lần thêm thứ hai và thứ ba sau fail bước đầu. T08 chưa thực hiện phép chỉnh và tính lại tiền vì thiếu nút yêu cầu. Việc gộp sản phẩm ở W04 chưa được kiểm chứng độc lập vì click mục tiêu không thêm sản phẩm.

[Pilot Chromium](pilot/chromium/20261113T0741346025000Z/index.html) chạy W02, W17, W19 và W23, lúc 2026-11-13T07:41:34.6025000Z. Lượt cuối ghi riêng xác nhận xóa trước khi đối chiếu hậu trạng thái, kiểm giỏ khi thiếu nút chỉnh và bổ sung ảnh ở trang chi tiết/giỏ rỗng. Bản AI đầu và raw pilot được giữ local để đối chiếu.

## Chẩn đoán sau hai click

Bộ chẩn đoán dùng năm ID T07 bị lỗi click đầu che khuất. Sau click đầu, lưu screenshot và ghi nhận chưa có phản hồi thành công hoặc thay đổi link giỏ. Sau click thứ hai trên cùng trang chi tiết, mở giỏ và đối chiếu số dòng, số lượng, đơn giá, thành tiền và tổng. Kết quả chỉ đánh giá các assertion sau workaround. Verdict một click ở lượt chính vẫn là Fail.

| Browser | ISO timestamp | Pass | Fail | HTML report |
| --- | --- | ---: | ---: | --- |
| Chromium | 2026-11-13T08:04:05.4659308Z | 3 | 2 | [HTML report](diagnostic-reviewed/chromium/20261113T0804054659308Z/index.html) |
| Firefox | 2026-11-13T08:04:17.9616390Z | 3 | 2 | [HTML report](diagnostic-reviewed/firefox/20261113T0804179616390Z/index.html) |
| WebKit | 2026-11-13T08:04:47.3624948Z | 3 | 2 | [HTML report](diagnostic-reviewed/webkit/20261113T0804473624948Z/index.html) |

W02, W03 và W34 pass phần kiểm sau workaround. W04 và W07 fail assertion gộp dòng trên cả ba browser. W04 ghi hai dòng P×2 và P×3 thay vì một dòng P×5, tổng vẫn đúng 150 triệu ₫. W07 ghi lần lượt một, hai và ba dòng P×1 sau ba lượt thêm, tổng vẫn đúng 30, 60 và 90 triệu ₫. Đây là lỗi gộp dòng Web theo FR-07. [Ảnh W04](diagnostic-reviewed/chromium/20261113T0804054659308Z/data/81fe35b9497800fc915eb0c10b8188abd8aed238.png) · [Firefox](diagnostic-reviewed/firefox/20261113T0804179616390Z/data/b472c0ca351af62fb9cd73928f493344066a3542.png) · [WebKit](diagnostic-reviewed/webkit/20261113T0804473624948Z/data/6af8938d77b9fb38da3171dda394eb3600c34dd3.png).

Lượt chẩn đoán đầu trên Chromium lấy snapshot dòng trước khi React render. [Report lượt đầu](diagnostic/chromium/20261113T0803029768469Z/index.html). Bộ dùng để tổng hợp chạy lại trên cả ba browser sau khi bổ sung chờ dòng và đính kèm số liệu UI. Có 15 lượt thực thi bổ sung, 9 pass, 6 fail và 0 skipped, dùng lại 5 ID.

Để chạy lại, dùng cùng runtime Web, đặt `HW04_FR07_DIAGNOSTIC=1` và chọn `fr07-t07-diagnostic\.spec` theo workflow tạo HTML report. [Script chẩn đoán](../../../automation/tests/fr07-t07-diagnostic.spec.mjs).

## Defect tái hiện

Năm lỗi Web từ HW02 tái hiện ở lượt chính, và lỗi gộp dòng Web được xác nhận ở lượt chẩn đoán. W09 liên quan nhiều assertion fail, còn W20 liên quan cả xác nhận xóa và minh họa.

### CART-BUG01 — Click đầu ở trang chi tiết không thêm sản phẩm

- [GitHub Issue #6](https://github.com/tranquocvy/eshop-sut-HW04/issues/6) · [Ảnh chụp trang Issue](github-issues/HW04-issue-06-FR07-BUG01.png)
- **Ca.** W02, W03, W04, W07, W34.
- **Expected.** Một click thêm đúng số lượng và có phản hồi theo FR-06. Khi trùng sản phẩm, FR-07 yêu cầu gộp dòng.
- **Actual.** Không thấy phản hồi và giỏ không đổi. W04 vẫn có P×2 thay vì P×5. W07 dừng ngay sau lần thêm thứ nhất.
- **Ảnh từ CART-W02.** [Chromium](final/chromium/20261113T0742417675299Z/data/32d047d6bcf30976f539a50f9c8caacd6f24d741.png) · [Firefox](final/firefox/20261113T0743353230947Z/data/e2c247caa74cb7b449a7b83eb1b2deecef552b5c.png) · [WebKit](final/webkit/20261113T0745314331071Z/data/b30ff1302144001a75b0d9c037c295f7658b4dc6.png)

### CART-BUG02 — Giỏ rỗng thiếu hình minh họa

- [GitHub Issue #7](https://github.com/tranquocvy/eshop-sut-HW04/issues/7) · [Ảnh chụp trang Issue](github-issues/HW04-issue-07-FR07-BUG02.png)
- **Ca.** W01, W20, W23.
- **Expected.** Giỏ rỗng có thông báo và hình minh họa theo FR-07.
- **Actual.** Có thông báo và 0 dòng, không có minh họa nhìn thấy. W23 vẫn quay về trang chủ và mở lại đúng giỏ ở cả hai nhánh.
- **Ảnh từ CART-W01.** [Chromium](final/chromium/20261113T0742417675299Z/data/73338f02ed2fbd5a3e817fa9efd8a51809af8ee8.png) · [Firefox](final/firefox/20261113T0743353230947Z/data/7dfd9cf1f963ec916ad420b3d7254aa92997394b.png) · [WebKit](final/webkit/20261113T0745314331071Z/data/b9155575dd10d5be371e33c30c45fa495e0b294a.png)

### CART-BUG03 — Bảng giỏ thiếu nút +/− và cột Đơn giá ghi Giá

- [GitHub Issue #8](https://github.com/tranquocvy/eshop-sut-HW04/issues/8) · [Ảnh chụp trang Issue](github-issues/HW04-issue-08-FR07-BUG03.png)
- **Ca.** W09, W16, W17, W18, W31.
- **Expected.** FR-07 yêu cầu cột Đơn giá và nút +/− trong cột Số lượng.
- **Actual.** Cột đơn giá ghi “Giá” và số lượng chỉ hiển thị dưới dạng văn bản. T08 kiểm được giỏ ban đầu và giỏ giữ nguyên khi thiếu nút. Bước chỉnh số lượng và tính lại tiền chưa thể thực hiện.
- **Ảnh từ CART-W09.** [Chromium](final/chromium/20261113T0742417675299Z/data/7896fa519e698301ea6bf39279ec8c579bd9fd17.png) · [Firefox](final/firefox/20261113T0743353230947Z/data/43af0e666e13e071427ad256903c94a7f4017d55.png) · [WebKit](final/webkit/20261113T0745314331071Z/data/0b2d019a71bf8ef9bb626a6ab850cec22b6b188b.png)

### CART-BUG04 — Sai nhãn tổng tiền

- [GitHub Issue #9](https://github.com/tranquocvy/eshop-sut-HW04/issues/9) · [Ảnh chụp trang Issue](github-issues/HW04-issue-09-FR07-BUG04.png)
- **Ca.** W09.
- **Expected.** Nhãn hiển thị đúng “Tổng cộng” theo FR-07.
- **Actual.** Hiển thị “Tổng tạm tính” dù số tiền fixture P×1 vẫn là 30 triệu ₫.
- **Ảnh từ CART-W09.** [Chromium](final/chromium/20261113T0742417675299Z/data/7896fa519e698301ea6bf39279ec8c579bd9fd17.png) · [Firefox](final/firefox/20261113T0743353230947Z/data/43af0e666e13e071427ad256903c94a7f4017d55.png) · [WebKit](final/webkit/20261113T0745314331071Z/data/0b2d019a71bf8ef9bb626a6ab850cec22b6b188b.png)

### CART-BUG05 — Bấm xóa làm mất dòng ngay, không có xác nhận

- [GitHub Issue #10](https://github.com/tranquocvy/eshop-sut-HW04/issues/10) · [Ảnh chụp trang Issue](github-issues/HW04-issue-10-FR07-BUG05.png)
- **Ca.** W19, W20, W21.
- **Expected.** FR-07 yêu cầu xác nhận trước khi xóa. Hủy giữ nguyên giỏ.
- **Actual.** Dòng biến mất ngay, không thể hủy ở W19. W20 về giỏ rỗng và W21 giữ đúng hai dòng còn lại, nhưng đều thiếu bước xác nhận.
- **Ảnh từ CART-W19.** [Chromium](final/chromium/20261113T0742417675299Z/data/9d3ad3bd54c75b9257aadd2f1026603aef15dda9.png) · [Firefox](final/firefox/20261113T0743353230947Z/data/1e9ea6b3ab175b7ad5d8d706dc79aa25130bf6f9.png) · [WebKit](final/webkit/20261113T0745314331071Z/data/84f868f76d7b9d7276dac30dd66e54b45b767d7d.png)

### FR07-BUG06 — Thêm trùng sản phẩm tạo nhiều dòng trong giỏ Web

- [GitHub Issue #11](https://github.com/tranquocvy/eshop-sut-HW04/issues/11) · [Ảnh chụp trang Issue](github-issues/HW04-issue-11-FR07-BUG06.png)
- **Ca.** W04 và W07 ở [lượt chẩn đoán](#chẩn-đoán-sau-hai-click).
- **Expected.** Thêm cùng sản phẩm tăng số lượng trên một dòng.
- **Actual.** W04 hiện hai dòng iPhone ×2 và ×3, tổng vẫn đúng 150 triệu ₫. W07 hiện hai rồi ba dòng iPhone ×1.
