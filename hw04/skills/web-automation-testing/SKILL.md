---
name: web-automation-testing
description: Chuyển test case web đã có thành Playwright Test data-driven, review và bảo trì suite, rồi chạy Chromium, Firefox và WebKit với HTML report theo feature và browser. Dùng khi tạo hoặc cập nhật automation từ test case và đặc tả của SUT.
---

# Web Automation Testing

Nhận feature, test case gốc, đặc tả, phiên bản SUT, môi trường test và yêu cầu báo cáo. Với bài có rubric, lấy số lượng ca, số assertion pattern, trình duyệt, định dạng và thông tin người chạy từ rubric. Kiểm tra config, lệnh chạy, reporter và fixture hiện có trước khi tạo hoặc sửa suite.

Khi tạo suite, làm theo từng bước trong phạm vi task. Trình bày mapping trước, sau đó tạo dữ liệu và script dựa trên mapping, rồi kiểm chứng bằng lần chạy thật. Khi bảo trì suite, dùng mục 4 để xác định phạm vi thay đổi trước khi sửa file.

Dùng [reference Playwright](references/playwright-workflow.md) khi thiết lập data-driven test, đối chiếu danh sách ca theo browser hoặc xuất HTML report. Reference có lệnh gọi script đi kèm để kiểm tra coverage lúc Playwright thu thập test.

## 1. Chuyển test case thành test data

- Giữ ID nguồn cho từng ca. Xác định tiền điều kiện, input, thao tác web và expected từ đặc tả. Ghi rõ ca cần điều chỉnh cho web và ca chưa thể tự động hóa cùng lý do.
- Lưu input và expected có thể tham số hóa trong file CSV hoặc JSON riêng. Khi đọc dữ liệu, kiểm tra ID duy nhất và các trường bắt buộc để ca thiếu input hoặc oracle không lọt qua suite.
- Xác minh quyền truy cập, trạng thái ban đầu và dữ liệu dùng cho mỗi ca. Cô lập phiên trình duyệt và dữ liệu có thể thay đổi giữa các ca. Dùng fixture trong môi trường test riêng và giữ nguyên source SUT. Nếu thiếu tiền điều kiện, ghi ca bị chặn kèm lý do.
- Bàn giao mapping gồm ID nguồn, điều khoản đặc tả, tiền điều kiện, thao tác web và assertion dự kiến. File dữ liệu phải đủ thông tin để mỗi ID được chuyển thành một test có thể nhận diện trong report.

## 2. Tạo và review Playwright Test

- Tạo test có tên chứa ID ca và đọc dữ liệu ngoài script. Dùng locator theo role, label hoặc thuộc tính ổn định thực sự có trên UI. Đợi theo trạng thái quan sát được.
- Thực thi hành vi cần kiểm trên web. Có thể dùng API để chuẩn bị hoặc xác minh trạng thái khi test case cho phép. Với thao tác thay đổi dữ liệu, đối chiếu mục tiêu và dữ liệu xung quanh theo expected. Kiểm tra persistence sau reload nếu ca yêu cầu.
- Chọn assertion theo oracle, chẳng hạn khả năng truy cập màn hình, nội dung hoặc số lượng phần tử, và đối chiếu trạng thái trước–sau. Ca âm cần kiểm cả hành vi từ chối lẫn tác động lên dữ liệu khi expected có cả hai.
- Lưu output AI ban đầu để so sánh. Review locator, assertion, dữ liệu, timeout và phụ thuộc thứ tự. Ghi điểm AI làm sai hoặc bỏ sót, nguyên nhân, thay đổi và cách kiểm chứng. Ghi phần sinh viên review hoặc sửa khi có xác nhận cụ thể.
- Dùng chế độ liệt kê test của runner để đối chiếu ID trong file dữ liệu với danh sách test được phát hiện trên từng project. Xử lý ID thiếu, ID lặp hoặc project không phát hiện test trước khi chạy suite. Bàn giao script, file dữ liệu, cách chạy và các điểm sinh viên cần review.

## 3. Chạy đa trình duyệt và lưu bằng chứng

- Chạy thử một luồng để kiểm tra test data, fixture, assertion và reporter. Chạy suite theo cặp feature × browser với các Playwright project Chromium, Firefox và WebKit, hoặc bộ browser khác nếu rubric cho phép và đã được cấu hình.
- Mỗi lượt dùng thư mục đầu ra riêng và sinh HTML report từ lần chạy thật. Nếu rubric yêu cầu, hiển thị `Run by: <StudentID>` và ISO timestamp trong report. Mở report để xác minh thông tin người chạy, thời điểm, browser, ID và kết quả ca.
- Phân biệt assertion fail theo đặc tả, lỗi môi trường, ca bị chặn và ca chưa chạy. Gắn screenshot đúng ca, browser và lượt chạy. Khi chạy lại, giữ kết quả gốc và ghi rõ thay đổi. Chỉ kết luận defect khi có expected và quan sát hỗ trợ.
- Bàn giao đường dẫn report theo feature × browser, số ca theo ID, số lượt thực thi, trạng thái và lý do của ca bị chặn hoặc chưa chạy. Đối chiếu danh sách test đã chạy với danh sách dự kiến trước khi xác nhận coverage.

## 4. Bảo trì suite đã có

1. Đối chiếu thay đổi với đặc tả và kết quả của lượt chạy trước. Xác định lỗi thuộc fixture, locator, dữ liệu, oracle hay SUT.
2. Giữ ID ca còn áp dụng. Sửa file CSV/JSON khi input hoặc expected có căn cứ mới. Sửa script hoặc fixture khi cách thiết lập, thao tác hoặc quan sát cần thay đổi. Ghi điều khoản nguồn nếu sửa expected.
3. Chạy lại ca bị ảnh hưởng và các ca dùng chung phần đã sửa trên các project liên quan. Tạo report ở lượt mới và ghi liên kết đến lượt trước cùng lý do thay đổi.
