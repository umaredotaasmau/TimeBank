;; Service Exchange Contract

(define-data-var last-service-id uint u0)

(define-map services
  { service-id: uint }
  {
    provider: principal,
    seeker: principal,
    description: (string-utf8 256),
    duration: uint,
    status: (string-ascii 20)
  }
)

(define-public (offer-service (description (string-utf8 256)) (duration uint))
  (let
    (
      (service-id (+ (var-get last-service-id) u1))
    )
    (map-set services
      { service-id: service-id }
      {
        provider: tx-sender,
        seeker: tx-sender,
        description: description,
        duration: duration,
        status: "offered"
      }
    )
    (var-set last-service-id service-id)
    (ok service-id)
  )
)

(define-public (request-service (service-id uint))
  (let
    (
      (service (unwrap! (map-get? services { service-id: service-id }) (err u404)))
    )
    (asserts! (is-eq (get status service) "offered") (err u400))
    (asserts! (not (is-eq (get provider service) tx-sender)) (err u403))
    (ok (map-set services
      { service-id: service-id }
      (merge service {
        seeker: tx-sender,
        status: "requested"
      })
    ))
  )
)

(define-public (complete-service (service-id uint))
  (let
    (
      (service (unwrap! (map-get? services { service-id: service-id }) (err u404)))
    )
    (asserts! (is-eq (get status service) "requested") (err u400))
    (asserts! (is-eq (get provider service) tx-sender) (err u403))
    (ok (map-set services
      { service-id: service-id }
      (merge service { status: "completed" })
    ))
  )
)

(define-read-only (get-service (service-id uint))
  (ok (map-get? services { service-id: service-id }))
)

