# Workflow Playwright Test

## Dữ liệu và danh sách test

Giữ mỗi ca dưới một ID nguồn. Khi dùng script kiểm coverage của skill, lưu file JSON dưới dạng mảng object có trường `id` và đặt ID ở đầu tiêu đề test, ví dụ `[TC-01] Danh mục đã thêm hiển thị sau reload`. Những field khác như input, expected và fixture phụ thuộc feature. Với CSV hoặc cấu trúc JSON sẵn có, có thể đối chiếu ID bằng công cụ tương ứng. [Playwright parameterize tests](https://playwright.dev/docs/test-parameterize)

Sau khi repo đã có config và test script, chạy từ thư mục package Playwright. Thay đường dẫn và project bằng tên thực tế. Dùng file discovery mới cho mỗi lần đối chiếu.

```powershell
$env:PLAYWRIGHT_JSON_OUTPUT_FILE = 'discovery.json'
npx playwright test tests/feature.spec.ts --list --reporter=json --no-deps
if ($LASTEXITCODE -ne 0) { throw 'Playwright collection failed' }
$skillDir = 'path/to/web-automation-testing'
node (Join-Path $skillDir 'scripts/check-discovery.mjs') data/feature.json discovery.json chromium firefox webkit
```

Script kiểm ID thiếu, ID trùng và test ngoài danh sách dữ liệu ở từng project được chỉ định. `--list` chỉ xác minh bước thu thập test. Kết quả thực thi và coverage thực tế lấy từ lượt chạy suite. [Script kiểm discovery](../scripts/check-discovery.mjs) · [Playwright CLI](https://playwright.dev/docs/test-cli) · [Playwright JSON reporter](https://playwright.dev/docs/test-reporters#json-reporter)

## Chạy và tạo HTML report

Chạy một cặp feature và browser mỗi lượt khi rubric cần report riêng. Chọn thư mục report mới và tạo timestamp tại thời điểm bắt đầu chạy. Ví dụ PowerShell cho một project đã có trong config.

```powershell
$studentId = '23120410'
$runTime = [DateTime]::UtcNow
$isoTime = $runTime.ToString('o')
$runId = $runTime.ToString('yyyyMMddTHHmmssfffffffZ')
$env:PLAYWRIGHT_HTML_TITLE = "Run by: $studentId | $isoTime"
$env:PLAYWRIGHT_HTML_OUTPUT_DIR = "reports/feature/chromium/$runId"
$env:PLAYWRIGHT_HTML_OPEN = 'never'
npx playwright test tests/feature.spec.ts --project=chromium --reporter=html
```

Đổi đường dẫn spec và project cho các lượt còn lại. Mở thư mục report bằng `npx playwright show-report <report-dir>` để kiểm title, test ID, browser và kết quả. Giữ các file đính kèm cùng thư mục report khi bàn giao. [Playwright HTML reporter](https://playwright.dev/docs/test-reporters#html-reporter)
