;; Reputation System Contract

(define-map user-reputation
  { user: principal }
  { score: int, total-services: uint }
)

(define-public (update-reputation (user principal) (rating int))
  (let
    (
      (current-rep (default-to { score: 0, total-services: u0 } (map-get? user-reputation { user: user })))
      (new-score (+ (get score current-rep) rating))
      (new-total (+ (get total-services current-rep) u1))
    )
    (ok (map-set user-reputation
      { user: user }
      {
        score: new-score,
        total-services: new-total
      }
    ))
  )
)

(define-read-only (get-reputation (user principal))
  (ok (default-to { score: 0, total-services: u0 } (map-get? user-reputation { user: user })))
)

(define-read-only (get-average-rating (user principal))
  (let
    (
      (rep (unwrap! (get-reputation user) (err u404)))
    )
    (ok (if (is-eq (get total-services rep) u0)
      0
      (/ (get score rep) (to-int (get total-services rep)))
    ))
  )
)

