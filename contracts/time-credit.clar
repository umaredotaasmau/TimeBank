;; Time Credit Management Contract

(define-fungible-token time-credit)

(define-data-var credit-exchange-rate uint u100)  ;; 1 hour = 100 credits

(define-public (mint-time-credits (amount uint))
  (ft-mint? time-credit amount tx-sender)
)

(define-public (transfer-time-credits (recipient principal) (amount uint))
  (ft-transfer? time-credit amount tx-sender recipient)
)

(define-read-only (get-balance (user principal))
  (ok (ft-get-balance time-credit user))
)

(define-read-only (get-credit-exchange-rate)
  (ok (var-get credit-exchange-rate))
)

(define-public (set-credit-exchange-rate (new-rate uint))
  (begin
    (ok (var-set credit-exchange-rate new-rate))
  )
)

