# HW04 — Automation Testing trên EShop

| Mục | Thông tin |
| --- | --- |
| Sinh viên | Trần Quốc Vỹ |
| MSSV | 23120410 |
| Lớp | 23_3 |
| Bài tập | HW04-AI |
| Repository | [eshop-sut-HW04](https://github.com/tranquocvy/eshop-sut-HW04) |

## Phạm vi

- Pool A — FR-02 Đăng nhập và khóa tài khoản.
- Pool B — FR-07 Giỏ hàng.
- Pool C — FR-14 Quản lý danh mục trên Web Admin.

## Tài liệu

- [Báo cáo chính](Report.md)
- [AI Audit Report và khai báo sử dụng AI](ai/AI_Audit_Report.md)
- [AI Critique](ai/AI_Critique.md)

<!-- Xuất Report.pdf, ai/AI_Audit_Report.pdf (kèm nội dung Prompt Log) và ai/AI_Critique.pdf từ nội dung đã hoàn tất. Đưa HTML report từ reports/ và GitCommitLog.txt vào ZIP. Thêm bug report nếu có defect. Nếu thực hiện mục Agent Skill, kèm skill và link demo của mục đó. Tên ZIP theo mẫu 23120410_HW04_AI_Automation_<điểm tự chấm 3 chữ số>.zip. -->

## Bảng tự chấm

| STT | Tiêu chí | Điểm tối đa | Điểm tự chấm |
| --- | --- | ---: | ---: |
| 1 | Task 1 — Feature A (FR-02) | 25 | |
| 1 | Task 1 — Feature B (FR-07) | 25 | |
| 1 | Task 1 — Feature C (FR-14) | 25 | |
| 2 | Task 2 — Video demo | 15 | |
| 3 | Agent Skill | 10 | |
| | **Tổng** | **100** | |

## Test summary report

Số feature trong phạm vi: **3**.

| Feature | Test case tự động hóa | Lượt thực thi test case | Pass | Fail | Lượt chạy browser | Bug |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| FR-02 (Phase 2) | 14 | 42 | 24 | 18 | 3 | 3 |
| [FR-07 (Phase 3)](reports/fr07/phase-3/README.md) | 15 | 45 | 0 | 45 | 3 | 6 |
| FR-14 (Phase 1) | 12 | 36 | 30 | 6 | 3 | 2 |
| **Tổng các phase đã chạy** | **41** | **123** | **54** | **69** | **9** | **11** |

<!-- Đếm test case tự động hóa theo ID duy nhất. Thống kê lượt thực thi, pass và fail theo các HTML report được dùng để tổng hợp. Ghi cách xử lý retry, skip và blocked nếu phát sinh. -->

Ba lượt chẩn đoán FR-07 sau hai click bổ sung 15 lượt thực thi trên 5 ID đã có, gồm 9 pass và 6 fail. Tổng cộng có 12 lượt chạy feature × browser dùng trong báo cáo, gồm 9 lượt chính trong bảng và 3 lượt chẩn đoán. Lượt chẩn đoán xác nhận thêm một lỗi gộp dòng Web. [HTML report và verdict của lượt chẩn đoán](reports/fr07/phase-3/README.md#chẩn-đoán-sau-hai-click)

## Video demo

| Nội dung | Link YouTube unlisted |
| --- | --- |
| Task 2 — Automation chạy end-to-end trên nhiều browser | |

<!-- Bổ sung link demo Agent Skill khi nộp mục này. -->
