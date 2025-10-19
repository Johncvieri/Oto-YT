CREATE OR REPLACE FUNCTION public.update_all_last_checked_conditional()
RETURNS void
LANGUAGE plpgsql
VOLATILE
SET search_path = public, pg_temp
AS $$
DECLARE
    tbl RECORD;
    sql TEXT;
BEGIN
    -- Loop semua tabel di schema public yang punya kolom last_checked
    FOR tbl IN
        SELECT table_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND column_name = 'last_checked'
    LOOP
        -- Build dynamic SQL dengan kondisi: hanya update jika last_checked IS NULL
        sql := format(
            'UPDATE public.%I SET last_checked = NOW() WHERE last_checked IS NULL',
            tbl.table_name
        );

        -- Jalankan query
        EXECUTE sql;
    END LOOP;
END;
$$;
