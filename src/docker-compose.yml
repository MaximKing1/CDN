version: "3.9"

services:
  cdn:
    build: .
    network_mode: host
    deploy:
      mode: replicated
      replicas: 1
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 10
        window: 60s
