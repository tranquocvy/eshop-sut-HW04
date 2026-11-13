# AI Audit Report — HW04 Automation Testing

| Mục | Giá trị |
| --- | --- |
| Họ tên | TRẦN QUỐC VỸ |
| MSSV | 23120410 |
| Lớp / Khóa | 23_3 |
| Bài tập | HW04-AI |
| Ngày làm bài | 12/11/2026 (các lượt trong phạm vi audit này) |
| Công cụ đã dùng | OpenAI Codex |

## 1. Khai báo sử dụng AI

> I use AI tools for the following tasks

| Công cụ | Công việc hoặc giai đoạn có AI hỗ trợ | Phần sinh viên rà soát, chỉnh sửa hoặc xác minh |
| --- | --- | --- |
| OpenAI Codex | Đối chiếu đề, đề xuất cách chia phase/task và soạn Agent Skill cho automation web. | Sinh viên yêu cầu kiểm lại quy định về sinh script và xác minh việc dùng Playwright ở HW02. Sinh viên yêu cầu hoàn thiện hướng dẫn skill trước khi triển khai task. |
| OpenAI Codex | Chuyển sáu ca FR-14 T01 sang Playwright Test, chạy trên ba browser, sửa assertion sau lượt đầu và tổng hợp bằng chứng. | Sinh viên xác nhận đã review và chốt T01. [Xác nhận nghiệm thu](PromptLog.md#p-008). |
| OpenAI Codex | Tự động hóa T02–T03 từ bộ ca HW02, tách helper dùng chung, chạy tích hợp Phase 1 và tổng hợp HTML report. | Sinh viên xem report Phase 1, đối chiếu với phạm vi HW02 và xác nhận thấy kết quả ổn. [Phản hồi về report](PromptLog.md#p-013). |
| OpenAI Codex | Chuyển 14 ca Web FR-02 từ HW02 sang Playwright Test, chạy lần đầu, sửa script sau review, chạy pilot và đối chiếu ba browser. | Sinh viên review script và trực tiếp thêm kiểm trạng thái ở W04/W18, đổi W12 từ skip sang fail và giữ screenshot. Các chỉnh sửa nằm trong commit `c0cc5c9`. |

<!-- Điền theo công việc đã thực hiện. Dẫn mã prompt liên quan và nêu rõ phần sinh viên đã tự sửa. -->

## 2. Bảng Audit theo artifact

Verdict đánh giá output ban đầu của từng artifact. Codex đề xuất các verdict dưới đây. Phạm vi sinh viên xác nhận được ghi theo từng artifact.

| (1) Prompt + Công cụ | (2) Output AI | (3) Verdict | (4) Lý do | (5) Bản SV sửa |
| --- | --- | --- | --- | --- |
| A-01 — Brainstorm phạm vi và kế hoạch HW04. OpenAI Codex, 12/11/2026. [P-000](PromptLog.md#p-000), [P-003](PromptLog.md#p-003), [P-004](PromptLog.md#p-004), [P-005](PromptLog.md#p-005). | Phương án dùng lại ca web HW02, chọn Playwright Test, triển khai FR-14 trước rồi FR-02 và FR-07. [Kế hoạch chia task](PromptLog.md#p-005). | **INCOMPLETE** | Phương án ban đầu bám §5–6 về phạm vi, dữ liệu và browser nhưng còn thiếu bước kiểm kê runner Playwright HW02 để xác định thao tác, assertion và fixture có thể dùng lại. Sinh viên nêu điểm này ở P-004. | Sinh viên nhắc kiểm tra runner HW02 và đề xuất nghiệm thu, ghi audit theo từng task. Codex cập nhật phương án từ các yêu cầu đó. |
| A-02 — Agent Skill `web-automation-testing`. OpenAI Codex, 12/11/2026. [P-001](PromptLog.md#p-001), [P-002](PromptLog.md#p-002), [P-006](PromptLog.md#p-006). | [Bàn giao bản đầu](PromptLog.md#p-002) và [SKILL.md hiện hành](../skills/web-automation-testing/SKILL.md). | **INCOMPLETE** | §7 nêu cả sinh và bảo trì script data-driven trên nhiều browser. Bản đầu đề cập bảo trì trong một dòng. Bản chỉnh sửa bổ sung cách xác định phần bị ảnh hưởng, giữ ID ca, kiểm coverage và xác minh bằng lượt chạy mới. | Sinh viên yêu cầu đối chiếu đề gốc và hoàn thiện skill trước các task. Codex bổ sung đầu ra theo bước và quy trình bảo trì. |
| A-03 — FR-14 T01. OpenAI Codex, 12/11/2026. [P-007](PromptLog.md#p-007), [P-008](PromptLog.md#p-008). | [Script T01](../automation/tests/fr14-t01.spec.mjs), [test data](../automation/data/fr14-t01.json) và [kết quả đa browser](../Report.md#4-kết-quả-thực-thi-trên-nhiều-browser). | **INCOMPLETE** | Bản chạy đầu coi phản hồi HTTP 304 sau reload là lỗi tải dữ liệu. Firefox và WebKit vì vậy dừng trước assertion UI của CAT-TC01–03. | Codex sửa assertion để xử lý revalidation rồi vẫn đối chiếu số dòng và từng cặp ID/tên trên UI. Sinh viên xác nhận đã review và chốt T01. |
| A-04 — Bộ automation tích hợp FR-14 Phase 1. OpenAI Codex, 12/11/2026. [P-010](PromptLog.md#p-010), [P-013](PromptLog.md#p-013). | [Script T02](../automation/tests/fr14-t02.spec.mjs), [script T03](../automation/tests/fr14-t03.spec.mjs) và [kết quả lần chạy đầu và lần chạy lại](../Report.md#phase-1--fr-14). | **INCOMPLETE** | Bản tích hợp đầu phát hiện đủ 12 ID mỗi browser nhưng thiếu import `credentials` sau khi tách helper. CAT-TC14 và CAT-TC33 dừng do `ReferenceError` trước khi kiểm quyền. | Codex bổ sung export/import và chạy lại đủ 12 ca trên ba browser. Sinh viên đã xem và đồng ý với report. Chưa ghi nhận chỉnh sửa script do sinh viên thực hiện ở lượt này. |
| A-05 — FR-02 Phase 2. OpenAI Codex, 12/11/2026. [P-014](PromptLog.md#p-014), [P-015](PromptLog.md#p-015). | 14 ca Web data-driven. Bản AI gốc ở commit `8f1a6d0`. [Report và mapping](../reports/fr02/phase-2/README.md). | **INCOMPLETE** | Locator dựa vào `type=password` làm 42 lượt đầu dừng trước khi gửi request. W12 gọi `test.skip()` khi chuỗi thao tác thật tạo sai trạng thái theo FR-02. | Sinh viên sửa W12 thành fail có screenshot, bổ sung assertion W04 và W18 trong `c0cc5c9`. Codex sửa locator theo vùng nhãn và xác minh bằng pilot rồi chạy đủ ba browser. |

### A-01 — Brainstorm phạm vi và kế hoạch

AI đề xuất một skill dùng chung và FR-14 làm feature đầu tiên. Sau khi sinh viên nhắc đã dùng Playwright ở HW02, AI kiểm tra runner Python và báo cáo FR-14, rồi cập nhật cách triển khai. Giữ ID ca, expected và các thao tác đã có. Chuyển phần còn phù hợp sang suite data-driven chạy trên ba browser. Kế hoạch cuối chia theo hành vi để mỗi task có script, kết quả chạy và phần audit riêng. [Đối chiếu runner cũ và kế hoạch cập nhật](PromptLog.md#p-004).

### A-02 — Xây Agent Skill cho automation

Bản đầu mô tả cách chọn ca, lưu CSV/JSON, tạo và review test, chạy trên ba browser và lưu HTML report. Phần bảo trì ban đầu nằm trong một dòng ở mục thực thi. Sau khi đối chiếu §7, AI tách phần này thành quy trình xác định nguyên nhân, giữ ID ca, cập nhật dữ liệu hoặc script và chạy lại phạm vi bị ảnh hưởng. AI cũng bổ sung bước đối chiếu ID ca với test runner phát hiện và kiểm coverage theo browser. Phiên này đã kiểm cấu trúc file. Bằng chứng workflow và video demo sẽ lấy từ lượt chạy FR-14. [Đối chiếu bản hoàn thiện](PromptLog.md#p-006).

### A-03 — FR-14 T01

Codex dùng Agent Skill để chuyển sáu ca HW02 thành test data JSON và script Playwright. Báo cáo giữ lượt chạy đầu và lượt chạy lại sau sửa assertion HTTP. Lượt dùng để tổng hợp có 15 pass và 3 fail trên 18 lượt thực thi. Cả ba fail tái hiện cùng lỗi CAT-TC33. Sinh viên xác nhận đã review và chốt kết quả T01 ở P-008. [Bằng chứng T01](../Report.md#4-kết-quả-thực-thi-trên-nhiều-browser) · [Xác nhận nghiệm thu](PromptLog.md#p-008).

### A-04 — T02, T03 và lượt chạy tích hợp FR-14

T02 dùng bốn ca HW02 để kiểm thêm danh mục và biên độ dài tên. T03 dùng hai ca HW02 để kiểm xóa đúng dòng và trạng thái sau reload. Bước discovery chỉ xác nhận ID nên lỗi thiếu import chỉ lộ khi chạy thân test. Sau khi Codex sửa lỗi đó, mỗi browser ghi nhận 10 pass và 2 fail. Hai fail là CAT-TC05 (lưu được tên rỗng) và CAT-TC33 (user thường mở được màn hình danh mục). Lượt chạy đầu được giữ riêng để phân biệt lỗi script với defect SUT. [Test data T02](../automation/data/fr14-t02.json) · [Test data T03](../automation/data/fr14-t03.json) · [Báo cáo FR-14](../Report.md#phase-1--fr-14).

### A-05 — FR-02 và lượt chạy sau review

Bản AI đầu ghi 42 lỗi locator trước khi submit. Sinh viên phát hiện W12 có thể che lỗi chức năng dưới trạng thái Skipped. Sinh viên sửa thành Failed và giữ screenshot. W04 và W18 được bổ sung assertion về counter và deadline. Bản chỉnh locator theo kiểu input vẫn chưa tách được hai trường cùng có `type=text`. Codex định vị theo nhãn, giữ riêng assertion về kiểu email và bổ sung expected/actual cho W12. [Bản AI gốc, bản sửa và các lượt chạy](../reports/fr02/phase-2/README.md).

Sau pilot, lượt đa browser phát hiện W01 trên Firefox dừng tại assertion HTTP 2xx. Codex sửa kiểm tra để chấp nhận phản hồi revalidation HTTP 304, vẫn đối chiếu Bearer token và email trên UI. Lượt cuối có 24 pass và 18 fail trên 42 lượt thực thi. W12 hiện Failed có screenshot ở cả ba browser khi SUT khóa sớm, W18 pass với assertion bổ sung. W04 dừng khi mật khẩu đúng bị từ chối sau hai lần sai nên assertion reset chưa được thực thi. [Kết quả cuối và bằng chứng](../Report.md#phase-2--fr-02).

## 3. Tổng kết độ chính xác AI

| Chỉ số theo verdict đề xuất | Số lượng | Tỉ lệ |
| --- | ---: | ---: |
| Tổng artifact có verdict đề xuất | 5 | 100% |
| VALID | 0 | 0% |
| INVALID | 0 | 0% |
| INCOMPLETE | 5 | 100% |

## 4. Kết luận

<!-- Tóm tắt phần AI hỗ trợ được, vấn đề quan sát được và cách kiểm chứng. -->

## Phụ lục A — Prompt Log

[Nhật ký tương tác AI](PromptLog.md).

<!-- Khi xuất PDF của Audit, đưa nội dung Prompt Log vào phụ lục để từng lượt có đủ công cụ, ngày giờ, prompt và output. -->
