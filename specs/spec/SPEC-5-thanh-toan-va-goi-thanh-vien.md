---
id: SPEC-5
title: Thanh toán và gói thành viên
version: 0.3.0
status: approved
owner: Honda
flow: project
risk: high
review: specs/review/SPEC-5-0.3.0.md
parent: [BRIEF-1@0.1.0]
supersedes:
approved_by: Honda
approved_at: 2026-09-30
approved_hash: sha256:d00bb3c09ecc393a092ebfc8
---

# SPEC-5: Thanh toán và gói thành viên

<!-- Skyline SPEC (project flow): the exact logic. One row, one fact. Bare codes (R-01) are this SPEC; anything else is qualified (BRIEF-1/C-02). Every rule has a Source and at least one AC. Each unknown becomes a CLARIFY marker; never guess. -->

## 1. Scope

Implements BRIEF-1/C-11, BRIEF-1/C-12, BRIEF-1/C-13, BRIEF-1/C-14 và BRIEF-1/C-15, cùng phần audit log của các sự kiện gói thành viên trong BRIEF-1/C-40 và ràng buộc BRIEF-1/K-02: nam mua gói trên website, tự gia hạn, hủy và bật lại, đổi thời hạn, thanh toán gia hạn thất bại, hoàn tiền, chargeback, app nhận biết trạng thái gói, và quản lý gói trên website. Điều kiện huy hiệu xanh để mua nằm ở SPEC-2; admin xem gói, đặt giá, hoàn tiền và xử lý cờ nằm ở SPEC-9; admin không thao tác thay nam.

## 2. Glossary

| Code | Term | Definition | Source |
| --- | --- | --- | --- |
| T-01 | Gói thành viên | Gói duy nhất trong MVP, bán theo 3 thời hạn 1 tháng, 3 tháng và 12 tháng; ba thời hạn có cùng quyền lợi, chỉ khác giá | SRC-1#L238, SRC-17#L19, SRC-17#L35 |
| T-02 | Kỳ | Khoảng thời gian một lần thu tiền mua được: từ periodStart tới cùng giờ, cùng ngày của tháng lịch UTC sau 1, 3 hoặc 12 tháng; nếu tháng đó không có ngày ấy thì lấy ngày cuối tháng | SRC-17#L21, SRC-18#L19, SRC-18#L40 |
| T-03 | Gói còn hiệu lực | Subscription ở Active, Cancelling hoặc PastDue; đây là điều kiện "nam có gói" mà SPEC-2, SPEC-3 và SPEC-4 dùng | SRC-17#L22, SRC-17#L24, SRC-17#L35 |
| T-04 | Bộ xử lý thanh toán | Dịch vụ ngoài thu tiền, gia hạn, hoàn tiền và báo kết quả về bằng webhook; tài khoản thuộc về khách | BRIEF-1/A-07, SRC-1#L238-L240, BRIEF-1/K-11 |
| T-05 | Chargeback | Khi người trả tiền khiếu nại với ngân hàng và bộ xử lý thanh toán báo khoản thu bị đòi lại | SRC-1#L239, SRC-17#L25 |
| T-06 | Mốc thời gian | Một thời hạn được coi là đã qua khi thời gian đã trôi ≥ đúng thời hạn đó | SRC-10#L37, SRC-10#L54 |
| T-07 | Payment của kỳ hiện tại | Payment đã trả cho kỳ đang chạy; với Subscription PastDue là Payment đã trả cho kỳ vừa hết | SRC-18#L25, SRC-18#L40 |

## 3. Data

| Code | Field | Type | Required | Constraint | Source |
| --- | --- | --- | --- | --- | --- |
| DF-01 | Subscription.status | enum {Active, Cancelling, PastDue, Ended} | yes | máy trạng thái Subscription; mỗi nam tối đa một Subscription còn hiệu lực (R-02) | SRC-1#L238-L240, SRC-17#L21-L25 |
| DF-02 | Subscription.term | enum {1 tháng, 3 tháng, 12 tháng} | yes | R-01 | SRC-17#L19 |
| DF-03 | Subscription.nextTerm | enum {1 tháng, 3 tháng, 12 tháng} | khi nam đổi thời hạn | R-09 | SRC-17#L26 |
| DF-04 | Subscription.periodStart, Subscription.periodEnd | thời điểm UTC | yes | T-02 | SRC-17#L21, SRC-18#L19 |
| DF-05 | Subscription.firstFailureAt, Subscription.retryCount | thời điểm UTC; số nguyên 0–3 | khi PastDue | R-07 | SRC-17#L24, SRC-18#L30 |
| DF-06 | Subscription.lockedPrice | giá USD của thời hạn đang dùng, chốt lúc mua hoặc lúc đổi thời hạn | yes | R-04, R-09 | SRC-18#L28 |
| DF-07 | Payment | nam, Subscription, số tiền USD, thuế, thời điểm UTC, kết quả (thành công, thất bại), loại (mua, gia hạn), số tiền đã hoàn | yes | R-06, R-11, R-14, R-15 | SRC-1#L238-L240, SRC-17#L29, SRC-17#L32, SRC-18#L27 |
| DF-08 | Refund | Payment được hoàn, số tiền USD (gồm thuế nếu hoàn thuế), admin, lý do không chỉ gồm ký tự trắng, trạng thái {chờ xác nhận, đã xác nhận, bị từ chối}, thời điểm UTC bộ xử lý xác nhận hoặc từ chối | khi hoàn tiền | R-06 | SRC-17#L23, SRC-18#L26-L27, SRC-27#L21, SRC-28#L30 |
| DF-09 | ReviewFlag | nam, loại (chargeback, thu tiền muộn), Payment liên quan, thời điểm UTC, trạng thái {Open, Closed}; admin đóng theo SPEC-9 | khi R-07 hoặc R-08 tạo | R-07, R-08, R-20 | SRC-17#L25, SRC-18#L22-L23, SRC-27#L22-L23 |
| DF-10 | PurchaseBlock | nam, cờ chargeback liên quan; hết khi cờ đó Closed | khi R-08 tạo | R-08 | SRC-17#L25, SRC-18#L22, SRC-27#L22 |
| DF-11 | Price | giá USD cho mỗi thời hạn, chưa gồm thuế, từ 1,00 đến 9.999,99 USD với tối đa 2 chữ số lẻ, áp dụng cho lần mua và lần đổi thời hạn mới | yes | R-01, R-09, R-11; do admin Cấp cao nhất đặt (SPEC-9) | SRC-17#L20, SRC-17#L29, SRC-17#L36, SRC-18#L28, SRC-27#L20 |

## 4. States

| Code | Machine | State | Kind |
| --- | --- | --- | --- |
| S-01 | Subscription | Active | initial |
| S-02 | Subscription | Cancelling | normal |
| S-03 | Subscription | PastDue | normal |
| S-04 | Subscription | Ended | terminal |

| Code | From | Event | Guard | To | Rules |
| --- | --- | --- | --- | --- | --- |
| X-01 | S-01 | cancel | | S-02 | R-05, R-14 |
| X-02 | S-02 | resume | | S-01 | R-05, R-14 |
| X-03 | S-02 | period_end | | S-04 | R-05, R-18, R-14 |
| X-04 | S-01 | renewal_failed | | S-03 | R-07, R-14 |
| X-05 | S-03 | retry_succeeded | | S-01 | R-07, R-14, R-15 |
| X-06 | S-03 | grace_expired | | S-04 | R-07, R-18, R-14 |
| X-07 | S-01 | current_payment_fully_refunded | | S-04 | R-06, R-14 |
| X-08 | S-02 | current_payment_fully_refunded | | S-04 | R-06, R-14 |
| X-09 | S-03 | current_payment_fully_refunded | | S-04 | R-06, R-14 |
| X-10 | S-01 | chargeback | | S-04 | R-08, R-14 |
| X-11 | S-02 | chargeback | | S-04 | R-08, R-14 |
| X-12 | S-03 | chargeback | | S-04 | R-08, R-14 |
| X-13 | S-03 | cancel | | S-04 | R-05, R-14 |
| X-14 | S-01 | account_suspended | | S-02 | R-17, R-14 |
| X-15 | S-03 | account_suspended | | S-04 | R-17, R-14 |
| X-16 | S-01 | account_deleted_by_admin | | S-04 | R-19, R-14 |
| X-17 | S-02 | account_deleted_by_admin | | S-04 | R-19, R-14 |
| X-18 | S-03 | account_deleted_by_admin | | S-04 | R-19, R-14 |

## 5. Rules

| Code | Rule | Source |
| --- | --- | --- |
| R-01 | Có một gói thành viên với 3 thời hạn 1 tháng, 3 tháng và 12 tháng, cùng quyền lợi; giá mỗi thời hạn là giá USD do admin đặt (DF-11) | SRC-1#L238, SRC-17#L19-L20, SRC-17#L35-L36, BRIEF-1/C-11 |
| R-02 | Chỉ nam có huy hiệu xanh (SPEC-2), không có gói còn hiệu lực và không có PurchaseBlock mới mua được gói; nam đang có gói còn hiệu lực muốn đổi thời hạn thì dùng R-09; nữ không thấy trang mua gói và không mua được; khi hai lần thanh toán mua của cùng một nam đều được bộ xử lý xác nhận, lần được xác nhận trước tạo Subscription, lần sau được tự động hoàn tiền toàn phần | SRC-1#L187-L189, SRC-8#L42, SRC-17#L26, SRC-17#L31, SRC-17#L33, SRC-17#L35, SRC-18#L24, SRC-18#L40, BRIEF-1/K-16 |
| R-03 | Gói chỉ mua được trên website, không qua in-app purchase của Apple hay Google; nút "Mua gói" trong app mở trình duyệt của điện thoại tới trang mua trên website; khi bộ xử lý thanh toán xác nhận thu tiền thành công, Subscription được tạo ở Active với periodStart là thời điểm xác nhận; số tiền thu và lockedPrice là giá của thời hạn đã chọn tại lúc nam bấm thanh toán, kể cả khi admin đổi giá trước lúc bộ xử lý xác nhận; thanh toán lần đầu thất bại thì không tạo Subscription và hiện lỗi; app nhận biết gói theo N-01 | SRC-1#L60-L62, SRC-1#L191-L194, SRC-17#L27, SRC-17#L35, SRC-18#L28, BRIEF-1/C-11, BRIEF-1/C-14, BRIEF-1/K-02, SRC-28#L31, SRC-28#L45 |
| R-04 | Khi tới periodEnd của một Subscription Active, hệ thống thu tiền gia hạn cho một kỳ mới đúng thời hạn đang dùng (hoặc nextTerm nếu có, R-09) theo lockedPrice, không theo giá admin đặt sau này; thu thành công thì Subscription vẫn Active với kỳ mới; thu thất bại thì theo R-07 | SRC-1#L238, SRC-17#L21, SRC-17#L35, SRC-18#L28, SRC-18#L40 |
| R-05 | Nam hủy gói khi Subscription Active thì tự gia hạn tắt, Subscription chuyển sang Cancelling và vẫn còn hiệu lực tới periodEnd; không hoàn tiền phần còn lại; nam bật lại tự gia hạn (về Active) khi còn Cancelling; nam hủy khi Subscription PastDue thì Ended ngay; thao tác được ghi trước periodEnd thì thắng, từ đúng periodEnd thì hủy, bật lại và đổi thời hạn đều bị từ chối; hủy khi đã Cancelling hoặc bật lại khi đang Active bị từ chối kèm thông báo trạng thái hiện tại | SRC-1#L238-L240, SRC-17#L22, SRC-17#L35, SRC-18#L20, SRC-18#L34, SRC-18#L40, BRIEF-1/C-12 |
| R-06 | Không có hoàn tiền tự động (trừ R-02, R-19 và R-20); chỉ admin Cấp cao nhất hoàn tiền một Payment theo trang Refund Policy của khách, kèm lý do không chỉ gồm ký tự trắng, kể cả khi tài khoản của nam đã bị xóa hoặc bị cấm; hoàn tiền có hiệu lực khi bộ xử lý thanh toán xác nhận, không phải lúc admin bấm; mỗi lần hoàn ≥ 0,01 USD với tối đa 2 chữ số lẻ, và tổng các lần hoàn đã được xác nhận cộng các lần hoàn đang chờ xác nhận không vượt quá số tiền của Payment (gồm thuế), vượt thì từ chối; lần hoàn bị bộ xử lý từ chối được ghi là bị từ chối, không tính vào tổng đó và không đổi trạng thái Subscription; Payment đã bị chargeback thì không hoàn được; khi hai admin hoàn cùng một Payment cùng lúc, lần được ghi trước thắng; một Payment được coi là hoàn toàn phần khi tổng các lần hoàn bằng số tiền cộng thuế của nó; khi Payment của kỳ hiện tại (T-07) được hoàn toàn phần thì Subscription chuyển sang Ended ngay; hoàn toàn phần một Payment cũ hơn, hoặc hoàn một phần, không đổi trạng thái Subscription | SRC-1#L239, SRC-17#L23, SRC-17#L35, SRC-18#L25-L27, SRC-18#L40, BRIEF-1/C-13, SRC-27#L21, SRC-27#L43, SRC-28#L29-L30, SRC-28#L45 |
| R-07 | Khi thu tiền gia hạn thất bại, Subscription chuyển sang PastDue và vẫn còn hiệu lực; hệ thống thử thu lại tối đa 3 lần trong 168 giờ (7 ngày) kể từ firstFailureAt; nam đổi thẻ khi đang PastDue thì hệ thống thử thu ngay và lần đó tính vào 3 lần; một lần thử thành công thì về Active với kỳ mới bắt đầu tại periodEnd cũ; từ đúng mốc 168 giờ mà chưa thu được thì Ended (R-18); kết quả thu thành công đến sau khi Subscription đã Ended thì Payment vẫn được ghi, Subscription vẫn Ended, và hệ thống tạo một cờ "thu tiền muộn" để admin quyết định hoàn tiền hay kích hoạt lại | SRC-1#L239, SRC-17#L24, SRC-17#L35, SRC-18#L23, SRC-18#L30, SRC-18#L40, BRIEF-1/C-13 |
| R-08 | Khi bộ xử lý thanh toán báo chargeback cho bất kỳ Payment nào của nam, kể cả Payment của một Subscription đã Ended, hệ thống gắn một cờ chargeback cho admin và tạo PurchaseBlock; nếu nam đang có gói còn hiệu lực thì Subscription đó chuyển sang Ended ngay; nam không mua gói được cho tới khi admin đóng cờ đó (SPEC-9); mỗi cờ chargeback có PurchaseBlock riêng | SRC-1#L239, SRC-17#L25, SRC-17#L35, SRC-18#L22, SRC-18#L40, BRIEF-1/C-13, SRC-27#L22, SRC-27#L43 |
| R-09 | Chỉ khi Subscription Active nam mới đổi được thời hạn; thời hạn mới ghi vào nextTerm, lockedPrice chuyển sang giá của thời hạn mới tại lúc đổi, và có hiệu lực từ lần gia hạn tiếp theo; không tính chênh lệch giữa kỳ; đổi nhiều lần trước kỳ gia hạn thì lần đổi cuối cùng được dùng; đổi khi Cancelling hoặc PastDue thì từ chối (đang Cancelling phải bật lại tự gia hạn trước) | SRC-17#L26, SRC-17#L35, SRC-18#L29, SRC-18#L40, SRC-28#L31 |
| R-10 | Trên website, nam xem được gói đang dùng, thời hạn, periodEnd và ngày gia hạn tiếp theo, hủy hoặc bật lại tự gia hạn, đổi thời hạn, đổi thẻ thanh toán, xem và tải biên nhận của chính mình; trong app có nút mở trang tài khoản này trên website, và các thao tác trên chỉ làm trên website | SRC-1#L60, SRC-17#L28, SRC-17#L35, SRC-18#L37, SRC-18#L40, BRIEF-1/C-15 |
| R-11 | Mọi giá và khoản thu tính bằng USD; giá niêm yết chưa gồm thuế; thuế (nếu có) do bộ xử lý thanh toán tính khi thanh toán và ghi vào Payment | SRC-17#L29, SRC-17#L35 |
| R-12 | Không có dùng thử miễn phí và không có mã giảm giá | SRC-17#L30, SRC-17#L35 |
| R-13 | Sau khi Subscription Ended, nam mua lại được bất cứ lúc nào theo R-02, trừ khi đang có PurchaseBlock (R-08) | SRC-17#L31, SRC-17#L35 |
| R-14 | Hệ thống ghi audit log cho mỗi lần mua gói, gia hạn, hủy, bật lại, đổi thời hạn, kích hoạt lại (R-20), hoàn tiền, thanh toán thất bại, chargeback và kết thúc gói (do hết kỳ, hết thời gian thử lại, hoàn toàn phần, chargeback, hủy khi PastDue, tài khoản bị đình chỉ, cấm, hoặc admin xóa tài khoản thay); mỗi bản ghi có nam, sự kiện, số tiền nếu có, người thực hiện (nam, admin hoặc "hệ thống") và thời điểm UTC | SRC-1#L181, SRC-17#L32, SRC-17#L35, SRC-18#L35, SRC-18#L40, BRIEF-1/C-40, SRC-27#L23, SRC-27#L43 |
| R-15 | Sau mỗi lần thu tiền thành công (mua hoặc gia hạn) và mỗi lần gói được kích hoạt lại (R-20), nam nhận một email biên nhận ghi thời hạn, số tiền, thuế và kỳ | SRC-17#L32, SRC-17#L35, SRC-28#L37 |
| R-16 | Chỉ kết quả do bộ xử lý thanh toán báo về (thu tiền thành công, thất bại, hoàn tiền, chargeback) mới đổi trạng thái thanh toán; thành viên hay admin gửi các kết quả này trực tiếp thì bị từ chối; kết quả gửi trùng, hoặc gửi muộn khi Subscription không còn chờ kết quả đó, bị bỏ qua (không đổi trạng thái, không tạo thêm Payment), trừ kết quả thu tiền thành công đến muộn (R-07) và chargeback (R-08) | SRC-1#L192-L194, SRC-1#L239-L240, SRC-18#L21, SRC-18#L40 |
| R-17 | Khi tài khoản của nam bị đình chỉ hoặc bị cấm: Subscription Active chuyển sang Cancelling (tắt tự gia hạn), Subscription PastDue chuyển sang Ended; không tự động hoàn tiền | SRC-18#L31, SRC-18#L40 |
| R-18 | periodEnd và mốc 168 giờ của R-07 được coi là đã qua từ đúng thời điểm đó với mọi rule, bất kể hệ thống chuyển trạng thái lúc nào; việc chuyển trạng thái diễn ra theo N-02 | SRC-18#L33, SRC-18#L40, SRC-10#L26 |
| R-19 | Khi admin xóa tài khoản thay một nam (SPEC-1, SPEC-8), mọi Subscription còn hiệu lực của nam, kể cả Cancelling, chuyển sang Ended ngay; không tự động hoàn tiền; bản ghi audit kết thúc gói ghi người thực hiện là admin đã xóa; một thanh toán mua gói được bộ xử lý xác nhận sau khi tài khoản đã Deleted thì không tạo Subscription và được tự động hoàn tiền toàn phần | SRC-25#L20, SRC-25#L40, SRC-26#L29-L31, SRC-26#L34 |
| R-20 | Khi admin kích hoạt lại gói từ một cờ thu tiền muộn (SPEC-9), một Subscription mới được tạo ở Active với term là thời hạn mà Payment thu muộn đã trả (nextTerm nếu nam đã đổi thời hạn) và lockedPrice là giá đã dùng để thu Payment đó, periodStart là thời điểm admin kích hoạt; không thu thêm tiền; Payment thu muộn là Payment của kỳ đầu của Subscription mới (T-07); nam nhận email biên nhận ghi kỳ mới (R-15); bản ghi audit ghi người thực hiện là admin; nếu một lần mua của chính nam được bộ xử lý xác nhận trước lúc việc kích hoạt lại được ghi thì kích hoạt lại bị từ chối; nếu việc kích hoạt lại được ghi trước thì lần mua được xác nhận sau không tạo Subscription và được tự động hoàn tiền toàn phần | SRC-17#L24, SRC-18#L23, SRC-27#L23, SRC-27#L43, SRC-28#L28, SRC-28#L36-L37, SRC-28#L45 |

## 6. Permissions

<!-- Columns after Action are actors: BRIEF-n/A-nn. Cells: Y, N, or a rule code (R-nn) meaning "allowed when that rule holds". -->

| Code | Action | BRIEF-1/A-01 Nam Mỹ | BRIEF-1/A-02 Nữ Philippines | BRIEF-1/A-03 Admin | BRIEF-1/A-07 Bộ xử lý thanh toán |
| --- | --- | --- | --- | --- | --- |
| P-01 | Mua gói | R-02 | N | N | N |
| P-02 | Hủy hoặc bật lại tự gia hạn | R-05 | N | N | N |
| P-03 | Đổi thời hạn | R-09 | N | N | N |
| P-04 | Hoàn tiền | N | N | R-06 | N |
| P-05 | Báo kết quả thu tiền, hoàn tiền, chargeback | N | N | N | Y |
| P-06 | Xem, tải biên nhận và đổi thẻ của mình | R-10 | N | N | N |

## 7. Flows

### F-01 Mua gói

1. Nam có huy hiệu xanh, không có gói còn hiệu lực và không có PurchaseBlock, bấm "Mua gói" trong app; trình duyệt mở trang mua trên website (R-02, R-03).
2. Nam chọn thời hạn và thanh toán; bộ xử lý thanh toán tính thuế và thu tiền (R-01, R-11).
3. Bộ xử lý báo thành công → Subscription Active với lockedPrice; email biên nhận; audit (R-03, R-15, R-14).
4. Nam quay lại app; app nhận biết gói trong ≤ 60 giây (N-01).

Nhánh lỗi:

- 1a. Không có huy hiệu xanh, đang có gói còn hiệu lực, hoặc đang có PurchaseBlock → từ chối (R-02, R-08).
- 3a. Thu tiền thất bại → không tạo Subscription, hiện lỗi (R-03).
- 3b. Hai lần thanh toán đều được xác nhận → lần sau tự động hoàn tiền (R-02).

### F-02 Gia hạn, hủy và đổi thời hạn

1. Tới periodEnd, hệ thống thu tiền gia hạn theo lockedPrice cho thời hạn đang dùng hoặc nextTerm (R-04, R-09).
2. Thành công → kỳ mới, email biên nhận (R-04, R-15).

Nhánh lỗi và thay thế:

- 2a. Thất bại → PastDue, thử lại tối đa 3 lần trong 168 giờ (đổi thẻ thì thử ngay); thành công → Active; từ đúng mốc 168 giờ → Ended (X-04, X-05, X-06, R-07, R-18).
- 2b. Nam hủy trên website trước periodEnd → Cancelling; bật lại → Active; từ đúng periodEnd → Ended (X-01, X-02, X-03, R-05, R-18).
- 2c. Payment của kỳ hiện tại được hoàn toàn phần → Ended (R-06).
- 2d. Chargeback → cờ cho admin, PurchaseBlock, gói còn hiệu lực chuyển Ended (R-08).
- 2e. Tài khoản bị đình chỉ hoặc cấm → Cancelling hoặc Ended (R-17).

## 8. Acceptance criteria

Mọi thời điểm trong mục này là UTC. Giá dùng trong AC là giá mẫu admin đã đặt: 1 tháng 49,00 USD; 3 tháng 129,00 USD; 12 tháng 399,00 USD.

| Code | Given | When | Then | Covers |
| --- | --- | --- | --- | --- |
| AC-01 | Trang mua gói trên website | Nam có huy hiệu xanh john@example.com mở trang | Thấy đúng 3 lựa chọn 1 tháng 49,00 USD, 3 tháng 129,00 USD, 12 tháng 399,00 USD, cùng một danh sách quyền lợi | R-01, F-01 |
| AC-02 | john@example.com có huy hiệu xanh, không có gói | Chọn 1 tháng và thanh toán thành công lúc 2026-10-10 09:00:00 | Subscription Active, term 1 tháng, periodStart 2026-10-10 09:00:00, periodEnd 2026-11-10 09:00:00, lockedPrice 49,00 USD; hộp thư john nhận 1 email biên nhận | R-03, R-15, P-01, F-01 |
| AC-03 | john@example.com có Subscription Active | Mở trang mua gói và thanh toán gói 3 tháng | Bị từ chối; màn hình hướng tới đổi thời hạn; không có Payment mới | R-02, P-01 |
| AC-04 | Nữ maria@example.com | Mở trang mua gói trên website, rồi gửi yêu cầu mua trực tiếp | Không thấy trang mua; yêu cầu mua bị từ chối | R-02, P-01 |
| AC-05 | john@example.com có huy hiệu xanh | Thanh toán gói 1 tháng nhưng thẻ bị từ chối | Không có Subscription nào được tạo; màn hình hiện lỗi thanh toán | R-03 |
| AC-06 | john@example.com đang ở app | Bấm "Mua gói" | Trình duyệt của điện thoại mở trang mua gói trên website; app không có màn thanh toán in-app nào | R-03 |
| AC-07 | john@example.com chưa có hồ sơ hoàn chỉnh, thanh toán thành công trên website lúc 09:00:00 | Quay lại app lúc 09:01:00 | App hiện john có gói và mở được bước hoàn thiện hồ sơ (SPEC-3) | R-03, N-01, F-01 |
| AC-08 | Như AC-07 | Quay lại app lúc 09:00:59 sau khi xác nhận lúc 09:00:00 | App đã hiện john có gói | N-01 |
| AC-09 | john@example.com có huy hiệu xanh, không có gói | Mở 2 tab, thanh toán 1 tháng và 3 tháng; bộ xử lý xác nhận lần lượt lúc 09:00:10 và 09:00:12 | Chỉ có 1 Subscription term 1 tháng; khoản 129,00 USD được tự động hoàn toàn phần | R-02, F-01 |
| AC-10 | john@example.com có Subscription Active term 1 tháng, periodEnd 2026-11-10 09:00:00 | Tới 2026-11-10 09:00:00, thu tiền gia hạn 49,00 USD thành công | Subscription vẫn Active với kỳ mới 2026-11-10 09:00:00 tới 2026-12-10 09:00:00; có email biên nhận mới | R-04, R-15, F-02 |
| AC-11 | john@example.com mua 1 tháng lúc 2026-01-31 10:00:00 | Xem periodEnd | periodEnd là 2026-02-28 10:00:00 | R-04 |
| AC-12 | john@example.com có Subscription Active, lockedPrice 49,00 USD; ngày 2026-10-20 admin đổi giá 1 tháng thành 59,00 USD | Gia hạn ngày 2026-11-10 | Thu 49,00 USD; người mua mới sau 2026-10-20 trả 59,00 USD | R-04, R-01 |
| AC-13 | john@example.com có Subscription Active, periodEnd 2026-11-10 09:00:00 | Bấm "Hủy gói" trên website ngày 2026-10-20 | Subscription chuyển sang Cancelling; john vẫn có gói còn hiệu lực tới 2026-11-10 09:00:00; không có hoàn tiền | R-05, X-01, P-02, R-10 |
| AC-14 | Như AC-13 | Ngày 2026-11-01 bấm "Bật lại tự gia hạn" | Subscription về Active; sẽ gia hạn ngày 2026-11-10 | R-05, X-02, P-02 |
| AC-15 | Như AC-13, không bật lại | Bấm "Bật lại tự gia hạn" lúc 2026-11-10 09:00:00, hệ thống chưa chuyển trạng thái | Bị từ chối; Subscription chuyển sang Ended; không có khoản thu nào | R-05, R-18, X-03 |
| AC-16 | john@example.com có Subscription Cancelling | Bấm "Hủy gói" lần nữa | Bị từ chối kèm thông báo gói đã được hủy | R-05 |
| AC-17 | john@example.com có Subscription PastDue | Bấm "Hủy gói" | Subscription chuyển sang Ended ngay | R-05, X-13 |
| AC-18 | Nữ maria@example.com | Gửi yêu cầu hủy gói của john@example.com | Bị từ chối; gói của john không đổi | P-02 |
| AC-19 | john@example.com có Subscription Active | Trong app bấm "Quản lý gói" | Trình duyệt mở trang tài khoản trên website; app không có nút hủy riêng | R-10 |
| AC-20 | john@example.com có Subscription Active, periodEnd 2026-11-10 09:00:00 | Thu tiền gia hạn thất bại lúc 09:00:00 | Subscription chuyển sang PastDue; firstFailureAt = 2026-11-10 09:00:00; john vẫn có gói còn hiệu lực | R-07, X-04, F-02 |
| AC-21 | Như AC-20 | Lần thử lại thứ 2 thành công lúc 2026-11-12 09:00:00 | Subscription về Active; kỳ mới 2026-11-10 09:00:00 tới 2026-12-10 09:00:00; có email biên nhận | R-07, X-05, R-15 |
| AC-22 | Như AC-20, retryCount = 1 | john đổi thẻ lúc 2026-11-11 08:00:00 | Hệ thống thử thu ngay lúc 08:00:00; retryCount = 2 | R-07, P-06 |
| AC-23 | Như AC-20, cả 3 lần thử lại đều thất bại | Hệ thống kiểm tra lúc 2026-11-17 08:59:59, rồi lúc 2026-11-17 09:00:00 | Lúc 08:59:59 vẫn PastDue và còn hiệu lực; từ 09:00:00 john không còn gói, Subscription chuyển Ended trước 09:05:00 | R-07, R-18, X-06, N-02 |
| AC-24 | Như AC-23, Subscription đã Ended lúc 09:00:00 | Bộ xử lý báo một lần thử thu 49,00 USD thành công lúc 09:00:05 | Payment 49,00 USD được ghi; Subscription vẫn Ended; admin thấy 1 cờ "thu tiền muộn" cho john | R-07, R-16 |
| AC-25 | john@example.com có Subscription Active, Payment kỳ hiện tại 49,00 USD + thuế 4,04 USD | Admin admin1 hoàn 53,04 USD và bộ xử lý xác nhận | Payment được hoàn toàn phần; Subscription chuyển sang Ended ngay | R-06, X-07, P-04, F-02 |
| AC-26 | Như AC-25 | Admin admin1 hoàn 49,00 USD và bộ xử lý xác nhận | Hoàn một phần (còn 4,04 USD); Subscription vẫn Active | R-06 |
| AC-27 | Như AC-25 | Admin hoàn 20,00 USD, rồi 33,04 USD, cả hai được xác nhận | Sau lần thứ hai Payment được hoàn toàn phần; Subscription chuyển sang Ended | R-06 |
| AC-28 | Như AC-25, đã hoàn 20,00 USD | Admin hoàn thêm 40,00 USD | Bị từ chối vì vượt 33,04 USD còn lại | R-06 |
| AC-29 | Như AC-25 | admin1 và admin2 cùng bấm hoàn 53,04 USD, admin1 được ghi trước | Chỉ lần của admin1 được gửi tới bộ xử lý; lần của admin2 bị từ chối | R-06 |
| AC-30 | Như AC-25 | Admin bấm hoàn 53,04 USD nhưng bộ xử lý từ chối | Không có Refund; Subscription vẫn Active | R-06, R-16 |
| AC-31 | john@example.com có Subscription Active 12 tháng với Payment năm 2026 và Payment kỳ hiện tại năm 2027 | Admin hoàn toàn phần Payment năm 2026 | Subscription vẫn Active | R-06 |
| AC-32 | john@example.com có Subscription Cancelling | Payment kỳ hiện tại được hoàn toàn phần | Subscription chuyển sang Ended ngay | R-06, X-08 |
| AC-33 | john@example.com có Subscription PastDue | Payment của kỳ vừa hết được hoàn toàn phần | Subscription chuyển sang Ended ngay | R-06, X-09 |
| AC-34 | john@example.com có Subscription Active | john tự gửi yêu cầu hoàn tiền trên website | Bị từ chối; không có Refund nào; website hướng john tới trang Refund Policy | R-06, P-04 |
| AC-35 | john@example.com có Subscription Active | Bộ xử lý thanh toán báo chargeback cho Payment 49,00 USD | Subscription chuyển sang Ended ngay; admin thấy 1 cờ chargeback cho john; có PurchaseBlock | R-08, X-10, F-02 |
| AC-36 | Như AC-35, cờ chưa được xử lý | john mua lại gói 1 tháng | Bị từ chối; không có Payment mới | R-08, R-13, R-02 |
| AC-37 | Như AC-35, admin đã xử lý xong cờ | john mua lại gói 1 tháng thành công | Subscription mới ở Active | R-08, R-13 |
| AC-38 | john@example.com có Subscription Cancelling | Bộ xử lý thanh toán báo chargeback | Subscription chuyển sang Ended ngay; có PurchaseBlock | R-08, X-11 |
| AC-39 | john@example.com có Subscription PastDue | Bộ xử lý thanh toán báo chargeback | Subscription chuyển sang Ended ngay; có PurchaseBlock | R-08, X-12 |
| AC-40 | Subscription A của john Ended ngày 2026-11-10; john không có gói nào | Ngày 2026-12-20 bộ xử lý báo chargeback cho một Payment của A | Admin thấy 1 cờ chargeback; có PurchaseBlock | R-08, R-16 |
| AC-41 | john có Subscription B Active; Subscription A cũ đã Ended | Bộ xử lý báo chargeback cho một Payment của A | B chuyển sang Ended ngay; có cờ chargeback và PurchaseBlock | R-08 |
| AC-42 | john@example.com có Subscription Active term 1 tháng, periodEnd 2026-11-10 | Ngày 2026-10-20 đổi sang 12 tháng | nextTerm = 12 tháng; lockedPrice = 399,00 USD; không có khoản thu nào ngày 2026-10-20; ngày 2026-11-10 thu 399,00 USD cho kỳ 12 tháng | R-09, P-03, F-02 |
| AC-43 | Như AC-42 | Ngày 2026-10-25 đổi tiếp sang 3 tháng | nextTerm = 3 tháng; ngày 2026-11-10 thu 129,00 USD | R-09 |
| AC-44 | john@example.com không có gói | Đổi thời hạn | Bị từ chối | R-09, P-03 |
| AC-45 | john@example.com có Subscription Cancelling, rồi PastDue ở một lần khác | Đổi thời hạn mỗi lần | Cả hai lần bị từ chối; lần Cancelling kèm thông báo phải bật lại tự gia hạn trước | R-09 |
| AC-46 | john@example.com có Subscription Active và 2 biên nhận | Đăng nhập website, mở trang tài khoản | Thấy thời hạn, periodEnd, ngày gia hạn tiếp theo, nút hủy, nút đổi thời hạn, nút đổi thẻ và 2 biên nhận tải được | R-10, P-06 |
| AC-47 | john@example.com và peter@example.com đều có biên nhận | john tải biên nhận của peter qua link trực tiếp | Bị từ chối | R-10, P-06 |
| AC-48 | Giá 1 tháng 49,00 USD; bộ xử lý tính thuế 4,04 USD | john thanh toán | Payment ghi 49,00 USD, thuế 4,04 USD, tiền tệ USD; biên nhận ghi đủ ba giá trị | R-11, R-15 |
| AC-49 | Trang mua gói | john tìm ô nhập mã giảm giá, hoặc lựa chọn dùng thử | Không có ô nhập mã giảm giá và không có lựa chọn dùng thử | R-12 |
| AC-50 | Subscription của john Ended ngày 2026-11-10, không có PurchaseBlock, huy hiệu xanh còn | Ngày 2027-01-05 john mua gói 3 tháng | Subscription mới ở Active, term 3 tháng | R-13 |
| AC-51 | john mua lúc 09:00:00, đổi thời hạn lúc 10:00:00, hủy lúc 11:00:00 | Admin cấp cao nhất xem audit log | Có 3 bản ghi với đúng sự kiện, số tiền 49,00 USD cho lần mua, người thực hiện john và các thời điểm | R-14 |
| AC-52 | Như AC-23 | Admin cấp cao nhất xem audit log | Có bản ghi thanh toán thất bại lúc 2026-11-10 09:00:00 và bản ghi kết thúc gói lúc 2026-11-17 09:00:00 với người thực hiện "hệ thống" | R-14 |
| AC-53 | Như AC-25 và AC-35 ở hai tài khoản khác nhau | Admin cấp cao nhất xem audit log | Có bản ghi hoàn tiền với người thực hiện admin1 và bản ghi kết thúc gói; có bản ghi chargeback và bản ghi kết thúc gói với người thực hiện "hệ thống" | R-14 |
| AC-54 | john@example.com có Subscription Active | john gửi một thông báo "thu tiền thành công" giả tới hệ thống | Bị từ chối; không có Payment mới; trạng thái không đổi | R-16, P-05 |
| AC-55 | john@example.com có Subscription Active | Bộ xử lý thanh toán gửi lại thông báo thu tiền của lần mua đầu | Thông báo bị bỏ qua; không có Payment mới; trạng thái không đổi | R-16 |
| AC-56 | john@example.com có Subscription Active | Tài khoản john bị đình chỉ | Subscription chuyển sang Cancelling; không có hoàn tiền | R-17, X-14 |
| AC-57 | john@example.com có Subscription PastDue | Tài khoản john bị cấm | Subscription chuyển sang Ended; không có hoàn tiền | R-17, X-15 |
| AC-58 | Bộ xử lý báo chargeback cho john lúc 10:00:00 | Mở app lúc 10:00:59 | App không còn hiện john có gói; tìm kiếm (SPEC-3) bị từ chối | N-01, R-08 |
| AC-59 | john có Subscription Active, lần khác Cancelling, lần khác PastDue | Admin Cấp cao nhất top1 xóa tài khoản john thay john | Mỗi lần Subscription chuyển Ended ngay; không có Refund; audit có bản ghi kết thúc gói với người thực hiện top1 | R-19, R-14, X-16, X-17, X-18 |
| AC-60 | john mở trang thanh toán lúc 09:59:50; top1 xóa tài khoản john lúc 10:00:00 | Bộ xử lý thanh toán xác nhận thu 49,00 USD lúc 10:00:20 | Không có Subscription nào được tạo; khoản 49,00 USD được tự động hoàn toàn phần | R-19 |
| AC-61 | Payment 49,00 USD (thuế 0) của john; một lần hoàn 30,00 USD đang chờ bộ xử lý xác nhận | Admin Cấp cao nhất hoàn 20,00 USD với lý do "Theo Refund Policy" | Bị từ chối vì vượt phần còn lại 19,00 USD | R-06 |
| AC-62 | Tài khoản john đã Deleted; Payment 49,00 USD (thuế 0) của john | Admin Cấp cao nhất hoàn 49,00 USD với lý do "Khiếu nại qua email"; bộ xử lý xác nhận | Refund 49,00 USD được ghi với trạng thái đã xác nhận; Payment được hoàn toàn phần | R-06 |
| AC-63 | john có 2 cờ chargeback Open cho 2 Payment khác nhau, mỗi cờ có PurchaseBlock | Admin đóng cờ thứ nhất, rồi john mua gói; admin đóng cờ thứ hai, rồi john mua gói | Lần mua đầu bị từ chối; lần mua sau được | R-08, R-13 |
| AC-64 | Subscription cũ của john 3 tháng, lockedPrice 129,00 USD, Ended; cờ thu tiền muộn cho Payment 129,00 USD; giá 3 tháng hiện là 139,00 USD | Admin kích hoạt lại lúc 2026-11-01 10:00:00 | Subscription mới Active, 3 tháng, lockedPrice 129,00 USD, periodStart 2026-11-01 10:00:00, periodEnd 2027-02-01 10:00:00; không có Payment mới; john nhận email biên nhận ghi kỳ mới; audit có bản ghi kích hoạt lại với người thực hiện là admin | R-20, R-14, R-15 |
| AC-65 | Như AC-64, sau khi kích hoạt lại | Admin hoàn toàn phần Payment 129,00 USD thu muộn; bộ xử lý xác nhận | Subscription mới chuyển Ended ngay | R-20, R-06, X-07 |
| AC-66 | Giá 1 tháng 49,00 USD | john bấm thanh toán gói 1 tháng lúc 09:59:50; admin đặt giá 1 tháng 59,00 USD lúc 10:00:00; bộ xử lý xác nhận lúc 10:00:30 | john trả 49,00 USD; Subscription Active với lockedPrice 49,00 USD | R-03 |
| AC-67 | Payment 49,00 USD (thuế 0) của john; admin hoàn 49,00 USD lúc 10:00:00 | Bộ xử lý từ chối lần hoàn lúc 10:05:00; admin hoàn 49,00 USD lần nữa lúc 10:10:00 | Lần đầu được ghi là bị từ chối và Subscription không đổi; lần sau được gửi tới bộ xử lý | R-06 |
| AC-68 | Payment A 49,00 USD của john đã bị chargeback; Payment B 49,00 USD | Admin hoàn 10,00 USD cho A, rồi 10,005 USD cho B | Cả hai bị từ chối | R-06 |
| AC-69 | john có Subscription 1 tháng, đổi sang 12 tháng (nextTerm 12 tháng, lockedPrice 399,00 USD); gia hạn thất bại và Subscription Ended; Payment thu muộn 399,00 USD có cờ thu tiền muộn | Admin kích hoạt lại lúc 2026-11-01 10:00:00 | Subscription mới Active, 12 tháng, lockedPrice 399,00 USD, periodEnd 2027-11-01 10:00:00 | R-20 |
| AC-70 | Cờ thu tiền muộn của john đủ điều kiện kích hoạt lại | Lần mua của john được xác nhận lúc 10:00:00.050 và admin kích hoạt lại lúc 10:00:00.090; ở một trường hợp khác, admin kích hoạt lại lúc 10:00:00.050 và lần mua của john được xác nhận lúc 10:00:00.090 | Trường hợp đầu: kích hoạt lại bị từ chối, john có 1 Subscription từ lần mua; trường hợp sau: john có 1 Subscription từ việc kích hoạt lại, lần mua không tạo Subscription và được tự động hoàn toàn phần | R-20 |

## 9. Non-functional

| Code | Quality | Measure | Target | Source |
| --- | --- | --- | --- | --- |
| N-01 | Độ trễ nhận biết trạng thái gói | Thời gian từ khi gói bắt đầu (bộ xử lý xác nhận thu tiền) hoặc kết thúc (hoàn tiền, chargeback, hết thời gian thử lại, hết kỳ) đến khi app hiện đúng trạng thái | ≤ 60 giây | SRC-17#L27, SRC-17#L35, SRC-18#L32, SRC-18#L40 |
| N-02 | Độ trễ chuyển trạng thái theo mốc | Thời gian từ periodEnd hoặc mốc 168 giờ đến khi Subscription chuyển trạng thái | ≤ 5 phút | SRC-18#L33, SRC-18#L40 |

## 10. Assumptions

| Code | Assumption | Validate by |
| --- | --- | --- |
| ASM-01 | Khách cung cấp giá USD cho 1 tháng, 3 tháng và 12 tháng; admin Cấp cao nhất đặt giá theo SPEC-9 (SRC-17#L20, SRC-17#L36, SRC-27#L20) | Honda hỏi khách, trước khi viết DSN |
| ASM-02 | Apple và Google cho phép nút "Mua gói" trong app mở trang mua trên website (BRIEF-1/RISK-01, SRC-17#L27); nếu không, SPEC-5 được sửa qua change flow (SRC-18#L38) | Luật sư hoặc DSN xác nhận, trước khi viết DSN |
| ASM-03 | Bộ xử lý thanh toán hỗ trợ thu định kỳ, thử lại, hoàn tiền một phần, chargeback và webhook như SPEC này mô tả | Chọn bộ xử lý ở DSN |

## 11. Out of scope

- Điều kiện huy hiệu xanh để mua gói: SPEC-2/R-05.
- Màn hình admin xem gói, đặt giá, hoàn tiền, đóng cờ chargeback và xử lý cờ thu tiền muộn: SPEC-9 (BRIEF-1/C-33).
- Admin hủy, bật lại hoặc đổi thời hạn gói thay nam: không có trong MVP (SRC-18#L36, SRC-27#L24).
- Hủy gói trước khi xóa tài khoản: SPEC-1/R-08; SPEC-5 cung cấp việc hủy.
- Ảnh hưởng của gói tới Lobby, tìm kiếm và yêu cầu liên hệ: SPEC-3, SPEC-4.
- Thông báo push khi gia hạn thất bại hoặc gói sắp hết hạn: SPEC thông báo (BRIEF-1/C-23).
- Chọn bộ xử lý thanh toán: DSN.

## Change log

| Version | Date | By | Change |
| --- | --- | --- | --- |
| 0.1.0 | 2026-09-29 | Honda | Approved |
| 0.2.0 | 2026-09-30 | Honda | Approved revision of 0.1.0 (minor): Admin xóa tài khoản thay làm gói Ended ngay (SRC-25#L20, SPEC-8/R-05) |
| 0.3.0 | 2026-09-30 | Honda | Approved revision of 0.2.0 (minor): admin đặt giá, hoàn tiền, xử lý cờ chargeback và thu tiền muộn (SPEC-9; SRC-27) |
