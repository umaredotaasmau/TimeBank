;; Community Integration Contract

(define-data-var admin principal tx-sender)

(define-map community-projects
  { project-id: uint }
  {
    name: (string-ascii 64),
    description: (string-utf8 256),
    required-skills: (list 10 (string-ascii 64)),
    participants: (list 50 principal),
    status: (string-ascii 20)
  }
)

(define-data-var last-project-id uint u0)

(define-public (create-community-project (name (string-ascii 64)) (description (string-utf8 256)) (required-skills (list 10 (string-ascii 64))))
  (let
    (
      (project-id (+ (var-get last-project-id) u1))
    )
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (map-set community-projects
      { project-id: project-id }
      {
        name: name,
        description: description,
        required-skills: required-skills,
        participants: (list),
        status: "open"
      }
    )
    (var-set last-project-id project-id)
    (ok project-id)
  )
)

(define-public (join-community-project (project-id uint))
  (let
    (
      (project (unwrap! (map-get? community-projects { project-id: project-id }) (err u404)))
    )
    (asserts! (is-eq (get status project) "open") (err u400))
    (ok (map-set community-projects
      { project-id: project-id }
      (merge project {
        participants: (unwrap! (as-max-len? (append (get participants project) tx-sender) u50) (err u401))
      })
    ))
  )
)

(define-public (complete-community-project (project-id uint))
  (let
    (
      (project (unwrap! (map-get? community-projects { project-id: project-id }) (err u404)))
    )
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (asserts! (is-eq (get status project) "open") (err u400))
    (ok (map-set community-projects
      { project-id: project-id }
      (merge project { status: "completed" })
    ))
  )
)

(define-read-only (get-community-project (project-id uint))
  (ok (map-get? community-projects { project-id: project-id }))
)

(define-read-only (get-admin)
  (ok (var-get admin))
)

(define-public (set-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (ok (var-set admin new-admin))
  )
)

