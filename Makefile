start_db:
    docker compose up -d	

stop_db:
	docker compose down

restart_db:
	docker compose restart

.PHONY: start_db stop_db restart_db
