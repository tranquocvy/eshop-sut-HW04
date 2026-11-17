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

- Báo cáo chính [Markdown](Report.md) · PDF trong ZIP, file Report.pdf
- AI Audit Report và khai báo sử dụng AI [Markdown](ai/AI_Audit_Report.md) · PDF kèm Prompt Log trong ZIP, file ai/AI_Audit_Report.pdf
- AI Critique [Markdown](ai/AI_Critique.md) · PDF trong ZIP, file ai/AI_Critique.pdf
- Git commit log trong ZIP, file GitCommitLog.txt · [Agent Skill](skills/web-automation-testing/SKILL.md)

## Bảng tự chấm

| STT | Tiêu chí | Điểm tối đa | Điểm tự chấm | Nhận xét và hướng cải thiện |
| --- | --- | ---: | ---: | --- |
| 1 | Task 1 — Feature A (FR-02) | 25 | 25 | 14 ca, ba browser và bằng chứng lỗi. |
| 1 | Task 1 — Feature B (FR-07) | 25 | 25 | 15 ca, ba browser và lượt chẩn đoán bổ sung. |
| 1 | Task 1 — Feature C (FR-14) | 25 | 25 | 12 ca, ba browser và kiểm dữ liệu sau reload. |
| 2 | Task 2 — Video demo | 15 | 15 | Demo chạy đa browser và trình bày bản sửa W12. |
| 3 | Agent Skill | 10 | 9 | Mic chất lượng thấp gây nhiều tiếng ồn và lỗi âm thanh. Tự trừ 1 điểm. Lần sau mua mic tốt hơn. |
| | **Tổng** | **100** | **99** | — |

## Test summary report

Số feature trong phạm vi: **3**.

| Feature | Test case tự động hóa | Lượt thực thi test case | Pass | Fail | Lượt chạy browser | Bug |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| FR-02 (Phase 2) | 14 | 42 | 24 | 18 | 3 | 3 |
| [FR-07 (Phase 3)](reports/fr07/phase-3/README.md) | 15 | 45 | 0 | 45 | 3 | 6 |
| FR-14 (Phase 1) | 12 | 36 | 30 | 6 | 3 | 2 |
| **Tổng các phase đã chạy** | **41** | **123** | **54** | **69** | **9** | **11** |

Ba lượt chẩn đoán FR-07 sau hai click bổ sung 15 lượt thực thi trên 5 ID đã có, gồm 9 pass và 6 fail. Tổng cộng có 12 lượt chạy feature × browser dùng trong báo cáo, gồm 9 lượt chính trong bảng và 3 lượt chẩn đoán. Lượt chẩn đoán xác nhận thêm một lỗi gộp dòng Web. [HTML report và verdict của lượt chẩn đoán](reports/fr07/phase-3/README.md#chẩn-đoán-sau-hai-click)

## Video demo

| Nội dung | Link YouTube unlisted |
| --- | --- |
| Task 2 — Automation chạy end-to-end trên nhiều browser | [Video 9 phút 21 giây](https://youtu.be/vJUG_TZbxtU) |
| Agent Skill — Demo trên một feature hoàn chỉnh | [Video 5 phút 6 giây](https://youtu.be/-OzCOso_a1M) |

## Căn cứ tự chấm

| Mục | Bằng chứng |
| --- | --- |
| FR-02, 25/25 | 14 ca Web data-driven, cô lập tài khoản, nhiều kiểu assertion, ba report và ba Issue có ảnh. W12 ghi Fail ở bước khóa sớm theo expected. |
| FR-07, 25/25 | 15 ca Web, kiểm giỏ trước và sau thao tác, ba report chính và ba report chẩn đoán. Sáu nhóm lỗi có Issue và ảnh. Ca thiếu nút chỉnh ghi đúng giới hạn thao tác đã kiểm. |
| FR-14, 25/25 | 12 ca Web về xem, thêm, xóa và quyền truy cập. Ba report, hai Issue có ảnh, kiểm dữ liệu sau reload. |
| Video Task 2, 15/15 | Video Unlisted dài hơn 5 phút, trình bày FR-02, bản sửa của sinh viên, thực thi đa browser và HTML report. |
| Agent Skill, 9/10 | Có skill, reference, script discovery và video áp dụng trên toàn FR-02. Trừ 1 điểm do mic gây ồn và lỗi âm thanh. Hướng cải thiện là mua mic tốt hơn cho lần quay sau. |

Điểm tự chấm là 99/100 theo các tiêu chí trên. Các ca Fail phản ánh sai lệch SUT có bằng chứng. Phạm vi chưa thực hiện sau điểm fail được mô tả trong báo cáo từng feature.

## Đối chiếu bộ nộp

- Ba feature, 41 ID ca duy nhất, dữ liệu JSON tách riêng và ít nhất ba kiểu assertion trên mỗi feature.
- Chín report chính có MSSV và ISO timestamp, tổng 123 lượt thực thi với 54 Pass, 69 Fail và 0 Skipped.
- Ba report chẩn đoán bổ sung 15 lượt với 9 Pass và 6 Fail. Tổng hai nhóm là 138 lượt, 63 Pass và 75 Fail, dùng lại cùng 41 ID.
- Public GitHub có source test, data, HTML report và 11 Issue có ảnh. Git log kèm 11 commit thay đổi file test script.
- Hai link video Unlisted, Agent Skill đầy đủ thư mục, báo cáo Markdown/PDF, AI Audit kèm Prompt Log, AI Critique 200–300 từ và Git commit log dạng text.
