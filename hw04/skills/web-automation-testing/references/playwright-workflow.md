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

Khi tách helper dùng chung, chạy lại cả các spec đã có để kiểm những đường thực thi mà bước thu thập test chưa chạm tới. Với ca kiểm persistence, nếu browser trả HTTP 304 sau reload, tiếp tục đối chiếu dữ liệu UI với expected của ca. Giữ report trước sửa để phân biệt lỗi script với hành vi của SUT.

Khi thuộc tính HTML là đối tượng kiểm thử, định vị control theo nhãn hoặc vùng chứa xác minh được trong DOM, rồi assert thuộc tính riêng. Ví dụ, kiểm `type=email` sau khi định vị ô email. Trong một chuỗi thao tác thật, nếu SUT tạo trạng thái sai trước bước cuối, ghi assertion fail với trạng thái quan sát được và bước chưa thực hiện. Dùng Blocked khi môi trường hoặc dữ liệu setup khiến ca chưa thể bắt đầu kiểm nghiệp vụ.

Khi một defect ngăn kiểm hành vi phía sau, giữ report chính và mở lượt chẩn đoán riêng. Ghi thao tác workaround, điều kiện áp dụng và assertion còn đánh giá được. Với FR-07, lượt chính kiểm thêm bằng một click. Lượt chẩn đoán dùng hai click để kiểm gộp dòng và tổng, đợi dòng sản phẩm render rồi mới đọc các ô. Giữ verdict theo lượt và đếm ID duy nhất một lần. [Ví dụ FR-07](../../../reports/fr07/phase-3/README.md#chẩn-đoán-sau-hai-click)

## Tương thích PowerShell khi ghép JSON

Với Windows PowerShell, đọc mỗi file bằng Get-Content -Raw -Encoding UTF8, chuyển JSON rồi duyệt từng object để ghép thành mảng phẳng. Kiểm mỗi phần tử có ID trước discovery. Khi chạy script trong PowerShell, dùng đường dẫn trực tiếp như .\Demo-FR02.ps1. Lệnh pwsh cần PowerShell 7 có trong PATH.

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
