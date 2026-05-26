BEGIN
  -- Drop triggers (ignore if missing)
  FOR t IN (
    SELECT trigger_name FROM user_triggers
    WHERE table_name IN ('CUSTOMER','EMPLOYEE','PRODUCT','ORDER_','PAYMENT')
  ) LOOP
    BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER '||t.trigger_name; EXCEPTION WHEN OTHERS THEN NULL; END;
  END LOOP;

  -- Drop tables (children -> parents)
  FOR tb IN (
    SELECT table_name FROM user_tables
    WHERE table_name IN ('ORDERITEM','PAYMENT','ORDER_','PRODUCT','EMPLOYEE','CUSTOMER','CATEGORY_')
  ) LOOP
    BEGIN EXECUTE IMMEDIATE 'DROP TABLE '||tb.table_name||' CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
  END LOOP;

  -- Drop sequences (ignore if missing)
  FOR s IN (
    SELECT sequence_name FROM user_sequences
    WHERE sequence_name IN ('CUSTOMER_SEQ','EMPLOYEE_SEQ','PRODUCT_SEQ','ORDER_SEQ','PAYMENT_SEQ')
  ) LOOP
    BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE '||s.sequence_name; EXCEPTION WHEN OTHERS THEN NULL; END;
  END LOOP;
END;
/