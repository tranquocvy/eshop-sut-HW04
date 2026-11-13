# FR-02 — Phase 2

SUT baseline `85af3ba875c88283615e22cb108f13e2fccaf0e9`. Bộ 14 ca giữ ID từ `features/fr02-login/test-cases.md` trong bộ nộp HW02. Expected lấy từ [FR-02 trong SRS EShop](../../../../README.md#fr-02-đăng-nhập--khóa-tài-khoản) và phần trace trong `features/fr02-login/design.md` của HW02. Các mục `A01–A03` giữ mức giả định như tài liệu nguồn.

## Mapping

| Task | ID nguồn | Tiền điều kiện và thao tác | Expected và căn cứ |
| --- | --- | --- | --- |
| T04 | W01 | User mới, đăng nhập đúng, mở và reload hồ sơ | JWT được lưu, request hồ sơ mang cùng Bearer token, hồ sơ đúng tài khoản. R01/R06. |
| T04 | W02 | Tài khoản role admin chưa khóa, đăng nhập đúng qua Web | Đăng nhập thành công. R01. |
| T04 | W19 | Tài khoản đã có mật khẩu `Ab1!`, đăng nhập qua Web | Mật khẩu đúng của tài khoản chưa khóa được chấp nhận. R01. |
| T05 | W03 | Tài khoản chưa khóa, nhập sai một lần | Lỗi, không JWT, counter `0 → 1`, chưa khóa. R02/R05. |
| T05 | W06 | Mật khẩu sai cho tài khoản tồn tại, sau đó thử email chắc chắn chưa đăng ký | Hai lỗi có cùng thông báo chung, không cấp JWT. R05. |
| T05 | W07, W08 | Nhập `plainaddress` hoặc `a@` | Ô email dùng `type=email` (W07), browser báo `typeMismatch` và chặn submit. R07. |
| T05 | W09, W10 | Bỏ trống email hoặc password | Browser báo `valueMissing`, không gửi request, không đổi counter hay token. A02. |
| T06 | W04 | Hai lần sai thật qua UI, sau đó nhập đúng | Counter `1, 2`, chưa khóa, lần đúng thành công. R01/R02/R03. |
| T06 | W05 | Ba lần sai thật, sau đó thử đúng trong thời gian khóa | Counter `1, 2, 3`, khóa ở lần ba trong 30 giây, từ chối mật khẩu đúng. R02/R03/R04. |
| T06 | W11 | Fixture khóa độc lập 30 giây, thử đúng khoảng 10 giây sau | Từ chối trong khóa (R03), giữ counter và deadline (A01). |
| T06 | W12 | Tạo khóa bằng đúng ba lần sai từ UI, thử sai lần tư trong khóa | Vẫn từ chối, không token (R03), giữ counter và deadline (A01). Ghi Fail nếu chuỗi UI đã chạy mà trạng thái khóa sai. |
| T06 | W18 | Fixture khóa độc lập, thử đúng sau reload và ở browser context mới | Cả hai lượt vẫn bị từ chối trong cùng thời gian khóa (A03), phiên mới giữ counter và deadline (A01). |

Ngoài phạm vi lượt đầu gồm W13–W15 (cần phép đo thời điểm server xử lý với độ chính xác mili giây), W16 (chuỗi reset sau đăng nhập thành công) và W17 (kiểm ảnh hưởng giữa hai tài khoản). Bộ đã chọn gồm 14 ID Web. Các pattern assertion gồm UI và điều hướng, DOM validity, request/JWT và đối chiếu trạng thái SQLite.

## Môi trường và dữ liệu

- Playwright 1.65.0, Node.js 24.14.0, Windows build 26300, một worker, `retries: 0`. Dùng backend và `frontend-web` tại bản sao baseline, chọn cấu hình bằng `HW04_FRONTEND=web` và `HW04_SUT_ROOT` trỏ đến runtime có marker `.hw04-isolated-runtime`.
- Mỗi ca dùng browser context riêng và tài khoản có email ngẫu nhiên. Fixture tạo và dọn riêng các bản ghi đó trong SQLite của runtime. W11/W18 được phép bắt đầu từ trạng thái khóa đã tạo. W04/W05/W12 đi qua chuỗi UI thực, giữ nguyên counter và thời hạn do SUT tạo.
- Discovery xác nhận đủ 14 ID ở từng project. Raw JSON, log, error-context và bản sao script/data/config ban đầu nằm trong thư mục local `.runtime/FR02-phase2-first` cạnh repo.

## Kết quả lượt đầu

| Browser | Pass | Fail theo Playwright | Blocked theo mục tiêu nghiệp vụ | HTML report |
| --- | ---: | ---: | ---: | --- |
| Chromium 158.0.8127.18 | 0 | 14 | 14 | [Chromium](chromium/20261112T0955155703651Z/index.html) |
| Firefox 159.0 | 0 | 14 | 14 | [Firefox](firefox/20261112T0956001808491Z/index.html) |
| WebKit 27.2 | 0 | 14 | 14 | [WebKit](webkit/20261112T0957590241209Z/index.html) |

Playwright bắt đầu 42 lượt thực thi trên 14 ID. Cả 42 lượt dừng tại `locator.fill` do strict mode violation trước khi submit. Vì vậy, 42 lượt đều bị chặn ở bước kiểm nghiệp vụ. Ba report đã được mở và đối chiếu với raw JSON, gồm `Run by: 23120410`, ISO timestamp, project và 14 ID trên mỗi report. Kiểm tra sau chạy cho thấy SQLite runtime còn 0 tài khoản fixture. Bản script, data và config trùng byte với snapshot trước lượt chạy.

## Review và chỉnh sửa

| Bản | Thay đổi và căn cứ |
| --- | --- |
| AI ban đầu `8f1a6d0` | Locator dựa vào `type=password` làm các ca dừng ở bước điền form. Giữ snapshot và report lượt đầu. |
| Sinh viên `c0cc5c9` | W04 thêm kiểm counter và deadline sau đăng nhập thành công. W12 chuyển `Skipped` thành `Failed` và giữ screenshot khi chuỗi thao tác thật tạo sai trạng thái khóa. W18 kiểm counter và deadline sau lần thử từ context mới. Assertion điều hướng dùng pathname. Thử đổi locator theo `type=text` vẫn khớp sai số ô vì cả hai input đều có kiểu này. |
| Codex sau review | Định vị theo vùng nhãn `Username` và `Mật khẩu`, giữ `type=email` là assertion độc lập. Đọc vùng báo lỗi trong DOM và so nội dung ở W06 theo R05. Chờ trạng thái SQLite được ghi ở W04 và bổ sung expected/actual vào lỗi W12. Bật screenshot khi fail trên Web. |
| Codex sau lượt đa browser | W01 trên Firefox dừng ở assertion HTTP 2xx. Chạy riêng sau khi sửa ghi nhận HTTP 304 khi reload hồ sơ. W01 chấp nhận 200 hoặc 304, vẫn đối chiếu Bearer token, heading và email trong UI. |

## Pilot và kiểm lại sau review

- Pilot Chromium ghi W01 pass, W07 và W12 fail tại assertion nghiệp vụ. W12 có screenshot và ghi rõ lần thử thứ tư chưa được gửi. [HTML pilot](pilot/chromium/20261112T1056292751870Z/index.html)
- Lượt đa browser sau pilot ghi thêm một lỗi assertion của W01 trên Firefox. [Chromium](reviewed/chromium/20261112T1057314250090Z/index.html) · [Firefox](reviewed/firefox/20261112T1057585686929Z/index.html) · [WebKit](reviewed/webkit/20261112T1059140418217Z/index.html)
- Lượt chạy riêng W01 trên Firefox pass với HTTP 304, cùng Bearer token và đúng email trên hồ sơ. [HTML kiểm lại W01](profile-recheck/firefox/20261112T1100222391465Z/index.html)

## Kết quả dùng để tổng hợp

| Browser | ISO timestamp | T04 pass/fail | T05 pass/fail | T06 pass/fail | HTML report |
| --- | --- | ---: | ---: | ---: | --- |
| Chromium | 2026-11-12T11:00:31.0960125Z | 3/0 | 3/3 | 2/3 | [Chromium](final/chromium/20261112T1100310960125Z/index.html) |
| Firefox | 2026-11-12T11:00:58.9230198Z | 3/0 | 3/3 | 2/3 | [Firefox](final/firefox/20261112T1100589230198Z/index.html) |
| WebKit | 2026-11-12T11:02:14.2641785Z | 3/0 | 3/3 | 2/3 | [WebKit](final/webkit/20261112T1102142641785Z/index.html) |

14 ID, 42 lượt, 24 pass, 18 fail và 0 skipped. W03, W04, W05, W07, W08 và W12 fail trên cả ba browser. W12 ghi Failed khi chuỗi thao tác thực tế tạo trạng thái sai. Bước thử lần thứ tư của W12 và assertion reset sau đăng nhập thành công ở W04 chưa được thực hiện vì tài khoản đã khóa sớm. W18 pass, gồm assertion counter và deadline mà sinh viên bổ sung. Raw report và snapshot script lần cuối nằm trong `.runtime/FR02-phase2-reviewed/final`.

## Cách chạy lại

Chuẩn bị bản sao baseline gồm `backend/` và `frontend-web/`. Chạy `npm ci` trong hai thư mục rồi tạo `.hw04-isolated-runtime` tại gốc bản sao. Trong `hw04/automation`, cài dependency và browser bằng `npm ci` và `npx playwright install chromium firefox webkit`. Dùng `HW04_SUT_ROOT` trỏ tới bản sao và `HW04_FRONTEND=web`. Cấu hình khởi động backend và Web lần lượt trên cổng 3000 và 5173. Dùng bộ lọc `fr02-t0` với từng `--project` và tham số reporter theo [reference của skill](../../../skills/web-automation-testing/references/playwright-workflow.md).
