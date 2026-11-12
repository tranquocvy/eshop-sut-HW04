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

<!-- Điền theo công việc đã thực hiện. Dẫn mã prompt liên quan và nêu rõ phần sinh viên đã tự sửa. -->

## 2. Bảng Audit theo artifact

Verdict và thống kê dưới đây là đề xuất của Codex để sinh viên rà soát. Verdict đánh giá output ban đầu của từng artifact.

| (1) Prompt + Công cụ | (2) Output AI | (3) Verdict | (4) Lý do | (5) Bản SV sửa |
| --- | --- | --- | --- | --- |
| A-01 — Brainstorm phạm vi và kế hoạch HW04. OpenAI Codex, 12/11/2026. [P-000](PromptLog.md#p-000), [P-003](PromptLog.md#p-003), [P-004](PromptLog.md#p-004), [P-005](PromptLog.md#p-005). | Phương án dùng lại ca web HW02, chọn Playwright Test, triển khai FR-14 trước rồi FR-02 và FR-07. [Kế hoạch chia task](PromptLog.md#p-005). | **INCOMPLETE** | Phương án ban đầu bám §5–6 về phạm vi, dữ liệu và browser nhưng còn thiếu bước kiểm kê runner Playwright HW02 để xác định thao tác, assertion và fixture có thể dùng lại. Sinh viên nêu điểm này ở P-004. | Sinh viên nhắc kiểm tra runner HW02 và đề xuất nghiệm thu, ghi audit theo từng task. Codex cập nhật phương án từ các yêu cầu đó. |
| A-02 — Agent Skill `web-automation-testing`. OpenAI Codex, 12/11/2026. [P-001](PromptLog.md#p-001), [P-002](PromptLog.md#p-002), [P-006](PromptLog.md#p-006). | [Bàn giao bản đầu](PromptLog.md#p-002) và [SKILL.md hiện hành](../skills/web-automation-testing/SKILL.md). | **INCOMPLETE** | §7 nêu cả sinh và bảo trì script data-driven trên nhiều browser. Bản đầu đề cập bảo trì trong một dòng. Bản chỉnh sửa bổ sung cách xác định phần bị ảnh hưởng, giữ ID ca, kiểm coverage và xác minh bằng lượt chạy mới. | Sinh viên yêu cầu đối chiếu đề gốc và hoàn thiện skill trước các task. Codex bổ sung đầu ra theo bước và quy trình bảo trì. |

### A-01 — Brainstorm phạm vi và kế hoạch

AI đề xuất một skill dùng chung và FR-14 làm feature đầu tiên. Sau khi sinh viên nhắc đã dùng Playwright ở HW02, AI kiểm tra runner Python và báo cáo FR-14, rồi cập nhật cách triển khai. Giữ ID ca, expected và các thao tác đã có. Chuyển phần còn phù hợp sang suite data-driven chạy trên ba browser. Kế hoạch cuối chia theo hành vi để mỗi task có script, kết quả chạy và phần audit riêng. [Đối chiếu runner cũ và kế hoạch cập nhật](PromptLog.md#p-004).

### A-02 — Xây Agent Skill cho automation

Bản đầu mô tả cách chọn ca, lưu CSV/JSON, tạo và review test, chạy trên ba browser và lưu HTML report. Phần bảo trì ban đầu nằm trong một dòng ở mục thực thi. Sau khi đối chiếu §7, AI tách phần này thành quy trình xác định nguyên nhân, giữ ID ca, cập nhật dữ liệu hoặc script và chạy lại phạm vi bị ảnh hưởng. AI cũng bổ sung bước đối chiếu ID ca với test runner phát hiện và kiểm coverage theo browser. Phiên này đã kiểm cấu trúc file. Bằng chứng workflow và video demo sẽ lấy từ lượt chạy FR-14. [Đối chiếu bản hoàn thiện](PromptLog.md#p-006).

## 3. Tổng kết độ chính xác AI

| Chỉ số theo verdict đề xuất | Số lượng | Tỉ lệ |
| --- | ---: | ---: |
| Tổng artifact có verdict đề xuất | 2 | 100% |
| VALID | 0 | 0% |
| INVALID | 0 | 0% |
| INCOMPLETE | 2 | 100% |

## 4. Kết luận

<!-- Tóm tắt phần AI hỗ trợ được, vấn đề quan sát được và cách kiểm chứng. -->

## Phụ lục A — Prompt Log

[Nhật ký tương tác AI](PromptLog.md).

<!-- Khi xuất PDF của Audit, đưa nội dung Prompt Log vào phụ lục để từng lượt có đủ công cụ, ngày giờ, prompt và output. -->
