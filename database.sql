CREATE DATABASE atelier;
-- Table: public.review

-- DROP TABLE public.review;

CREATE TABLE IF NOT EXISTS public.review
(
    id integer NOT NULL DEFAULT nextval('review_id_seq'::regclass),
    product_id integer,
    rating integer,
    recommend boolean,
    summary "char",
    body character varying(1000) COLLATE pg_catalog."default",
    reviewer_name "char",
    email "char",
    photos text[] COLLATE pg_catalog."default",
    helpfulness integer NOT NULL DEFAULT nextval('review_helpfulness_seq'::regclass),
    review_date date,
    response "char",
    characteristic_id integer,
    CONSTRAINT review_pkey PRIMARY KEY (id),
    CONSTRAINT review_characteristic_id_fkey FOREIGN KEY (characteristic_id)
        REFERENCES public.characteristic_id (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
-- Table: public.characteristic_id

-- DROP TABLE public.characteristic_id;

CREATE TABLE IF NOT EXISTS public.characteristic_id
(
    id integer NOT NULL DEFAULT nextval('characteristic_id_id_seq'::regclass),
    review_size integer,
    review_width integer,
    review_comfort integer,
    review_quality integer,
    review_length integer,
    review_fit integer,
    CONSTRAINT characteristic_id_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.review
    OWNER to postgres;