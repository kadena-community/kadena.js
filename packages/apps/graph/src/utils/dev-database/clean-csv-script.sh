# this postgres-log.csv can be created by setting the following values in postgresql.conf
# vim /opt/homebrew/var/postgres/postgresql.conf
# log_destination = 'csvlog'
# logging_collector = on
cat postgresql-log.csv |grep "statement:" |grep -vE "pga4dash|DECLARE|FETCH|CLOSE|SELECT|BEGIN ISOLATION LEVEL READ COMMITTED READ ONLY|SAVEPOINT" > postgresql-log-clean.csv
