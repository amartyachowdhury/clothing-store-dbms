#!/bin/sh
# CPS510 - Assignment 5 launcher (Oracle 11g)

# Pick sqlplus (some labs provide sqlplus64)
if command -v sqlplus64 >/dev/null 2>&1; then
  SQLPLUS=sqlplus64
else
  SQLPLUS=sqlplus
fi
export SQLPLUS

printf "Oracle username: "
read ORA_USER
printf "Oracle password: "
stty -echo; read ORA_PASS; stty echo; printf "\n"

# Adjust Host/SID if your lab uses different values
ORA_CONN="$ORA_USER/$ORA_PASS@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=oracle.cs.torontomu.ca)(Port=1521))(CONNECT_DATA=(SID=orcl)))"

# Run the stand-alone SQL script (spools to a5_output.lst)
"$SQLPLUS" -s "$ORA_CONN" @"a5.sql"