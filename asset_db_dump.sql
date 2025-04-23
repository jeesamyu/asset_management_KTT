--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

-- Started on 2025-04-23 16:04:28

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4966 (class 1262 OID 16399)
-- Name: asset_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE asset_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';


ALTER DATABASE asset_db OWNER TO postgres;

\connect asset_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16415)
-- Name: asset_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    remark text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.asset_categories OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16414)
-- Name: asset_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asset_categories_id_seq OWNER TO postgres;

--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 217
-- Name: asset_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_categories_id_seq OWNED BY public.asset_categories.id;


--
-- TOC entry 222 (class 1259 OID 16446)
-- Name: asset_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_history (
    id integer NOT NULL,
    user_id integer,
    asset_id integer,
    remark text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    issued_date date,
    returned_date date
);


ALTER TABLE public.asset_history OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16445)
-- Name: asset_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asset_history_id_seq OWNER TO postgres;

--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 221
-- Name: asset_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_history_id_seq OWNED BY public.asset_history.id;


--
-- TOC entry 224 (class 1259 OID 16478)
-- Name: asset_status_lookup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_status_lookup (
    code smallint NOT NULL,
    label character varying(50) NOT NULL
);


ALTER TABLE public.asset_status_lookup OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16426)
-- Name: assets_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets_list (
    id integer NOT NULL,
    brand character varying(100),
    model character varying(100),
    serial_no character varying(100),
    category_id integer,
    status smallint DEFAULT 1,
    remark text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    purchase_date date,
    obsolete_date date,
    CONSTRAINT assets_list_status_check CHECK ((status = ANY (ARRAY[1, 2, 3, 4])))
);


ALTER TABLE public.assets_list OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16425)
-- Name: assets_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assets_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assets_list_id_seq OWNER TO postgres;

--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 219
-- Name: assets_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assets_list_id_seq OWNED BY public.assets_list.id;


--
-- TOC entry 216 (class 1259 OID 16404)
-- Name: emp_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emp_list (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    emp_status smallint DEFAULT 1,
    salary bigint DEFAULT 0 NOT NULL,
    join_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    phone_no character varying(15),
    email character varying(100),
    address character varying(255),
    role_id integer,
    CONSTRAINT emp_list_emp_status_check CHECK ((emp_status = ANY (ARRAY[1, 2, 3])))
);


ALTER TABLE public.emp_list OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16403)
-- Name: emp_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emp_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emp_list_id_seq OWNER TO postgres;

--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 215
-- Name: emp_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emp_list_id_seq OWNED BY public.emp_list.id;


--
-- TOC entry 223 (class 1259 OID 16473)
-- Name: emp_status_lookup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emp_status_lookup (
    code smallint NOT NULL,
    label character varying(50) NOT NULL
);


ALTER TABLE public.emp_status_lookup OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16537)
-- Name: employee_role_lookup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_role_lookup (
    id integer NOT NULL,
    role_name character varying(100) NOT NULL
);


ALTER TABLE public.employee_role_lookup OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16536)
-- Name: employee_role_lookup_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_role_lookup_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_role_lookup_id_seq OWNER TO postgres;

--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 225
-- Name: employee_role_lookup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_role_lookup_id_seq OWNED BY public.employee_role_lookup.id;


--
-- TOC entry 4768 (class 2604 OID 16418)
-- Name: asset_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories ALTER COLUMN id SET DEFAULT nextval('public.asset_categories_id_seq'::regclass);


--
-- TOC entry 4775 (class 2604 OID 16449)
-- Name: asset_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_history ALTER COLUMN id SET DEFAULT nextval('public.asset_history_id_seq'::regclass);


--
-- TOC entry 4771 (class 2604 OID 16429)
-- Name: assets_list id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets_list ALTER COLUMN id SET DEFAULT nextval('public.assets_list_id_seq'::regclass);


--
-- TOC entry 4763 (class 2604 OID 16407)
-- Name: emp_list id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emp_list ALTER COLUMN id SET DEFAULT nextval('public.emp_list_id_seq'::regclass);


--
-- TOC entry 4778 (class 2604 OID 16540)
-- Name: employee_role_lookup id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_role_lookup ALTER COLUMN id SET DEFAULT nextval('public.employee_role_lookup_id_seq'::regclass);


--
-- TOC entry 4952 (class 0 OID 16415)
-- Dependencies: 218
-- Data for Name: asset_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (3, 'Mobile', 'Official communication device', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (5, 'Pen', 'Stationery item for writing', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (6, 'Monitor', 'External display for systems', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (7, 'Keyboard', 'Input device for computers', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (8, 'Mouse', 'Used for computer navigation', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (9, 'Printer', 'For printing official documents', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (10, 'Headset', 'Used for calls and online meetings', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (11, 'Chair', 'Office seating furniture', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (13, 'Projector', 'For presentations and meetings', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (14, 'WiFi Router', 'Network connectivity device', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (15, 'UPS', 'Uninterrupted power supply unit', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (16, 'Extension Box', 'Power extension board', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (17, 'Whiteboard', 'Used for meetings and planning', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (18, 'Server', 'Backend system for application hosting', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (19, 'Tablet', 'Portable smart device', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (20, 'HDMI Cable', 'Used to connect devices to displays', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (21, 'Webcam', 'External video device for meetings', '2025-04-20 14:51:42.233135+05:30', '2025-04-20 14:51:42.233135+05:30');
INSERT INTO public.asset_categories (id, name, remark, created_at, updated_at) VALUES (23, 'Laptop', 'Used for development and office work', '2025-04-21 13:36:47.541315+05:30', '2025-04-21 13:36:47.541315+05:30');


--
-- TOC entry 4956 (class 0 OID 16446)
-- Dependencies: 222
-- Data for Name: asset_history; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4958 (class 0 OID 16478)
-- Dependencies: 224
-- Data for Name: asset_status_lookup; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.asset_status_lookup (code, label) VALUES (1, 'Available');
INSERT INTO public.asset_status_lookup (code, label) VALUES (2, 'Unavailable');
INSERT INTO public.asset_status_lookup (code, label) VALUES (3, 'Obsolete');
INSERT INTO public.asset_status_lookup (code, label) VALUES (4, 'deleted');


--
-- TOC entry 4954 (class 0 OID 16426)
-- Dependencies: 220
-- Data for Name: assets_list; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4950 (class 0 OID 16404)
-- Dependencies: 216
-- Data for Name: emp_list; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4957 (class 0 OID 16473)
-- Dependencies: 223
-- Data for Name: emp_status_lookup; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.emp_status_lookup (code, label) VALUES (1, 'active');
INSERT INTO public.emp_status_lookup (code, label) VALUES (2, 'inactive');
INSERT INTO public.emp_status_lookup (code, label) VALUES (3, 'deleted');


--
-- TOC entry 4960 (class 0 OID 16537)
-- Dependencies: 226
-- Data for Name: employee_role_lookup; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.employee_role_lookup (id, role_name) VALUES (1, 'Frontend Developer');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (2, 'Backend Developer');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (3, 'QA');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (4, 'Full Stack Developer');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (5, 'UI/UX Designer');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (6, 'DevOps Engineer');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (7, 'Project Manager');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (8, 'Business Analyst');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (9, 'Product Owner');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (10, 'Technical Lead');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (11, 'Software Architect');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (12, 'Mobile App Developer');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (13, 'Database Administrator');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (14, 'System Analyst');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (15, 'Support Engineer');
INSERT INTO public.employee_role_lookup (id, role_name) VALUES (16, 'Intern');


--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 217
-- Name: asset_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_categories_id_seq', 23, true);


--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 221
-- Name: asset_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_history_id_seq', 13, true);


--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 219
-- Name: assets_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assets_list_id_seq', 19, true);


--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 215
-- Name: emp_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emp_list_id_seq', 30, true);


--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 225
-- Name: employee_role_lookup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_role_lookup_id_seq', 16, true);


--
-- TOC entry 4784 (class 2606 OID 16424)
-- Name: asset_categories asset_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT asset_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4792 (class 2606 OID 16457)
-- Name: asset_history asset_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_history
    ADD CONSTRAINT asset_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4796 (class 2606 OID 16577)
-- Name: asset_status_lookup asset_status_lookup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_status_lookup
    ADD CONSTRAINT asset_status_lookup_pkey PRIMARY KEY (code);


--
-- TOC entry 4788 (class 2606 OID 16437)
-- Name: assets_list assets_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets_list
    ADD CONSTRAINT assets_list_pkey PRIMARY KEY (id);


--
-- TOC entry 4790 (class 2606 OID 16439)
-- Name: assets_list assets_list_serial_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets_list
    ADD CONSTRAINT assets_list_serial_no_key UNIQUE (serial_no);


--
-- TOC entry 4782 (class 2606 OID 16413)
-- Name: emp_list emp_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emp_list
    ADD CONSTRAINT emp_list_pkey PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 16477)
-- Name: emp_status_lookup emp_status_lookup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emp_status_lookup
    ADD CONSTRAINT emp_status_lookup_pkey PRIMARY KEY (code);


--
-- TOC entry 4798 (class 2606 OID 16542)
-- Name: employee_role_lookup employee_role_lookup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_role_lookup
    ADD CONSTRAINT employee_role_lookup_pkey PRIMARY KEY (id);


--
-- TOC entry 4786 (class 2606 OID 24577)
-- Name: asset_categories unique_asset_category_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT unique_asset_category_name UNIQUE (name);


--
-- TOC entry 4803 (class 2606 OID 16531)
-- Name: asset_history asset_history_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_history
    ADD CONSTRAINT asset_history_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets_list(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4804 (class 2606 OID 24622)
-- Name: asset_history asset_history_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_history
    ADD CONSTRAINT asset_history_employee_id_fkey FOREIGN KEY (user_id) REFERENCES public.emp_list(id) ON DELETE SET NULL;


--
-- TOC entry 4805 (class 2606 OID 16521)
-- Name: asset_history asset_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_history
    ADD CONSTRAINT asset_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.emp_list(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4801 (class 2606 OID 24583)
-- Name: assets_list assets_list_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets_list
    ADD CONSTRAINT assets_list_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.asset_categories(id) ON DELETE SET NULL;


--
-- TOC entry 4802 (class 2606 OID 16578)
-- Name: assets_list fk_asset_status; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets_list
    ADD CONSTRAINT fk_asset_status FOREIGN KEY (status) REFERENCES public.asset_status_lookup(code);


--
-- TOC entry 4799 (class 2606 OID 16489)
-- Name: emp_list fk_emp_status; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emp_list
    ADD CONSTRAINT fk_emp_status FOREIGN KEY (emp_status) REFERENCES public.emp_status_lookup(code);


--
-- TOC entry 4800 (class 2606 OID 16543)
-- Name: emp_list fk_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emp_list
    ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public.employee_role_lookup(id) ON DELETE SET NULL;


-- Completed on 2025-04-23 16:04:28

--
-- PostgreSQL database dump complete
--

