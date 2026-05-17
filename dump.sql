--
-- PostgreSQL database dump
--

\restrict emdmkPR7XyWN6DIuXZVcylBUpLrZrJPK1c1r4TE8ninkyVwAhCa6l2UHAp6N4JI

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

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
-- Name: CampaignStatus; Type: TYPE; Schema: public; Owner: electromall
--

CREATE TYPE public."CampaignStatus" AS ENUM (
    'pending',
    'active',
    'completed',
    'rejected'
);


ALTER TYPE public."CampaignStatus" OWNER TO electromall;

--
-- Name: NotificationKind; Type: TYPE; Schema: public; Owner: electromall
--

CREATE TYPE public."NotificationKind" AS ENUM (
    'order',
    'campaign',
    'settlement',
    'stock',
    'system'
);


ALTER TYPE public."NotificationKind" OWNER TO electromall;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: electromall
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'new',
    'ready',
    'shipped',
    'delivered',
    'cancelled'
);


ALTER TYPE public."OrderStatus" OWNER TO electromall;

--
-- Name: ProductStatus; Type: TYPE; Schema: public; Owner: electromall
--

CREATE TYPE public."ProductStatus" AS ENUM (
    'published',
    'unpublished',
    'review'
);


ALTER TYPE public."ProductStatus" OWNER TO electromall;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: DeliveryPrice; Type: TABLE; Schema: public; Owner: electromall
--

CREATE TABLE public."DeliveryPrice" (
    id text NOT NULL,
    province text NOT NULL,
    small double precision NOT NULL,
    large double precision NOT NULL,
    "freeRule" text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."DeliveryPrice" OWNER TO electromall;

--
-- Name: DiscountPlan; Type: TABLE; Schema: public; Owner: electromall
--

CREATE TABLE public."DiscountPlan" (
    id text NOT NULL,
    "vendorId" text NOT NULL,
    name text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "productIds" text[],
    sales double precision DEFAULT 0 NOT NULL,
    "itemsSold" jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."DiscountPlan" OWNER TO electromall;

--
-- Name: MarketingCampaign; Type: TABLE; Schema: public; Owner: electromall
--

CREATE TABLE public."MarketingCampaign" (
    id text NOT NULL,
    "packageId" text NOT NULL,
    "vendorId" text NOT NULL,
    code text NOT NULL,
    status public."CampaignStatus" DEFAULT 'pending'::public."CampaignStatus" NOT NULL,
    "purchasedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "startsAt" timestamp(3) without time zone,
    "endsAt" timestamp(3) without time zone,
    views integer DEFAULT 0 NOT NULL,
    clicks integer DEFAULT 0 NOT NULL,
    sales double precision DEFAULT 0 NOT NULL,
    reach integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MarketingCampaign" OWNER TO electromall;

--
-- Name: MarketingPackage; Type: TABLE; Schema: public; Owner: electromall
--

CREATE TABLE public."MarketingPackage" (
    id text NOT NULL,
    name text NOT NULL,
    price double precision NOT NULL,
    "durationDays" integer NOT NULL,
    channels text[],
    details text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MarketingPackage" OWNER TO electromall;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: electromall
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "vendorId" text NOT NULL,
    kind public."NotificationKind" NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    href text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO electromall;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: electromall
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "vendorId" text NOT NULL,
    "productId" text NOT NULL,
    "dateTime" timestamp(3) without time zone NOT NULL,
    quantity integer NOT NULL,
    color text DEFAULT ''::text NOT NULL,
    size text DEFAULT ''::text NOT NULL,
    "priceWithoutCommission" double precision NOT NULL,
    "priceWithCommission" double precision NOT NULL,
    status public."OrderStatus" DEFAULT 'new'::public."OrderStatus" NOT NULL,
    city text NOT NULL,
    province text NOT NULL,
    "customerName" text NOT NULL,
    "customerPhone" text NOT NULL,
    "customerAddress" text NOT NULL,
    "deliveryStatus" text DEFAULT ''::text NOT NULL,
    "paymentMethod" text NOT NULL,
    "deliveryAgent" text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO electromall;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: electromall
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    "vendorId" text NOT NULL,
    "nameAr" text NOT NULL,
    "nameEn" text NOT NULL,
    highlights text DEFAULT ''::text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    keywords text[],
    "materialCode" text DEFAULT ''::text NOT NULL,
    sku text NOT NULL,
    barcode text DEFAULT ''::text NOT NULL,
    "vendorCode" text DEFAULT ''::text NOT NULL,
    brand text DEFAULT ''::text NOT NULL,
    "categoryLevel1" text DEFAULT ''::text NOT NULL,
    "categoryLevel2" text DEFAULT ''::text NOT NULL,
    "categoryLevel3" text DEFAULT ''::text NOT NULL,
    "categoryLevel4" text DEFAULT ''::text NOT NULL,
    "sellingPrice" double precision NOT NULL,
    "costPrice" double precision NOT NULL,
    "commissionPct" double precision NOT NULL,
    "lockedCommission" boolean DEFAULT false NOT NULL,
    "discountPlanStatus" text DEFAULT 'none'::text NOT NULL,
    "largeProduct" boolean DEFAULT false NOT NULL,
    status public."ProductStatus" DEFAULT 'review'::public."ProductStatus" NOT NULL,
    "imageTone" text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "nameKu" text DEFAULT ''::text NOT NULL,
    "descriptionAr" text DEFAULT ''::text NOT NULL,
    "descriptionKu" text DEFAULT ''::text NOT NULL,
    "warrantyEn" text DEFAULT ''::text NOT NULL,
    "warrantyAr" text DEFAULT ''::text NOT NULL,
    "warrantyKu" text DEFAULT ''::text NOT NULL,
    "giniCategory" text DEFAULT ''::text NOT NULL,
    "marketingCategory" text DEFAULT ''::text NOT NULL,
    "shippingCategory" text DEFAULT ''::text NOT NULL,
    "giftType" text DEFAULT ''::text NOT NULL,
    "purchaseLimitEnabled" boolean DEFAULT false NOT NULL,
    "purchaseLimitQty" integer DEFAULT 0 NOT NULL,
    "mainImage" text DEFAULT ''::text NOT NULL,
    "galleryImages" text[] DEFAULT ARRAY[]::text[] NOT NULL
);


ALTER TABLE public."Product" OWNER TO electromall;

--
-- Name: ProductColor; Type: TABLE; Schema: public; Owner: electromall
--

CREATE TABLE public."ProductColor" (
    id text NOT NULL,
    "productId" text NOT NULL,
    code text NOT NULL,
    "nameAr" text NOT NULL,
    "nameEn" text NOT NULL
);


ALTER TABLE public."ProductColor" OWNER TO electromall;

--
-- Name: ProductSize; Type: TABLE; Schema: public; Owner: electromall
--

CREATE TABLE public."ProductSize" (
    id text NOT NULL,
    "colorId" text NOT NULL,
    size text NOT NULL,
    quantity integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."ProductSize" OWNER TO electromall;

--
-- Name: Settlement; Type: TABLE; Schema: public; Owner: electromall
--

CREATE TABLE public."Settlement" (
    id text NOT NULL,
    "settlementNumber" text NOT NULL,
    "vendorId" text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "paymentMethod" text NOT NULL,
    status text NOT NULL,
    "itemIds" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Settlement" OWNER TO electromall;

--
-- Name: Vendor; Type: TABLE; Schema: public; Owner: electromall
--

CREATE TABLE public."Vendor" (
    id text NOT NULL,
    reference text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    "companyLocation" text NOT NULL,
    "joinedAt" timestamp(3) without time zone NOT NULL,
    "accountManager" text NOT NULL,
    "deliveryMechanism" text NOT NULL,
    "pointsEarned" integer DEFAULT 0 NOT NULL,
    "pointsRedeemed" integer DEFAULT 0 NOT NULL,
    "processingSpeedHours" double precision DEFAULT 0 NOT NULL,
    "cancellationRate" double precision DEFAULT 0 NOT NULL,
    "customerRating" double precision DEFAULT 0 NOT NULL,
    "uploadActivity" integer DEFAULT 0 NOT NULL,
    "passwordHash" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Vendor" OWNER TO electromall;

--
-- Name: Warehouse; Type: TABLE; Schema: public; Owner: electromall
--

CREATE TABLE public."Warehouse" (
    id text NOT NULL,
    "vendorId" text NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    phone text NOT NULL,
    "openingDays" text NOT NULL,
    "openingTime" text NOT NULL,
    "closingTime" text NOT NULL
);


ALTER TABLE public."Warehouse" OWNER TO electromall;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: electromall
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO electromall;

--
-- Data for Name: DeliveryPrice; Type: TABLE DATA; Schema: public; Owner: electromall
--

COPY public."DeliveryPrice" (id, province, small, large, "freeRule") FROM stdin;
\.


--
-- Data for Name: DiscountPlan; Type: TABLE DATA; Schema: public; Owner: electromall
--

COPY public."DiscountPlan" (id, "vendorId", name, "startDate", "endDate", "productIds", sales, "itemsSold", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: MarketingCampaign; Type: TABLE DATA; Schema: public; Owner: electromall
--

COPY public."MarketingCampaign" (id, "packageId", "vendorId", code, status, "purchasedAt", "startsAt", "endsAt", views, clicks, sales, reach, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: MarketingPackage; Type: TABLE DATA; Schema: public; Owner: electromall
--

COPY public."MarketingPackage" (id, name, price, "durationDays", channels, details, "createdAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: electromall
--

COPY public."Notification" (id, "vendorId", kind, title, body, read, href, "createdAt") FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: electromall
--

COPY public."Order" (id, "orderNumber", "vendorId", "productId", "dateTime", quantity, color, size, "priceWithoutCommission", "priceWithCommission", status, city, province, "customerName", "customerPhone", "customerAddress", "deliveryStatus", "paymentMethod", "deliveryAgent", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: electromall
--

COPY public."Product" (id, "vendorId", "nameAr", "nameEn", highlights, description, keywords, "materialCode", sku, barcode, "vendorCode", brand, "categoryLevel1", "categoryLevel2", "categoryLevel3", "categoryLevel4", "sellingPrice", "costPrice", "commissionPct", "lockedCommission", "discountPlanStatus", "largeProduct", status, "imageTone", "createdAt", "updatedAt", "nameKu", "descriptionAr", "descriptionKu", "warrantyEn", "warrantyAr", "warrantyKu", "giniCategory", "marketingCategory", "shippingCategory", "giftType", "purchaseLimitEnabled", "purchaseLimitQty", "mainImage", "galleryImages") FROM stdin;
\.


--
-- Data for Name: ProductColor; Type: TABLE DATA; Schema: public; Owner: electromall
--

COPY public."ProductColor" (id, "productId", code, "nameAr", "nameEn") FROM stdin;
\.


--
-- Data for Name: ProductSize; Type: TABLE DATA; Schema: public; Owner: electromall
--

COPY public."ProductSize" (id, "colorId", size, quantity) FROM stdin;
\.


--
-- Data for Name: Settlement; Type: TABLE DATA; Schema: public; Owner: electromall
--

COPY public."Settlement" (id, "settlementNumber", "vendorId", date, "paymentMethod", status, "itemIds", "createdAt") FROM stdin;
\.


--
-- Data for Name: Vendor; Type: TABLE DATA; Schema: public; Owner: electromall
--

COPY public."Vendor" (id, reference, name, email, phone, "companyLocation", "joinedAt", "accountManager", "deliveryMechanism", "pointsEarned", "pointsRedeemed", "processingSpeedHours", "cancellationRate", "customerRating", "uploadActivity", "passwordHash", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Warehouse; Type: TABLE DATA; Schema: public; Owner: electromall
--

COPY public."Warehouse" (id, "vendorId", name, address, phone, "openingDays", "openingTime", "closingTime") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: electromall
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
94e6f5e4-3e5c-455f-9cab-96921b228070	2af031dc2484b34969ba1cd041a4912bd1f60bb31308d79bfaca0c7160986839	2026-05-17 15:47:29.410965+00	20260505000000_init	\N	\N	2026-05-17 15:47:27.142388+00	1
00587634-acce-46f7-864f-293342d9da97	a68587a6d0374af55542a2582a76300ec2568d9e5f54001bb7add1f710927fac	2026-05-17 15:47:29.543569+00	20260517000000_add_product_extended_fields	\N	\N	2026-05-17 15:47:29.447206+00	1
\.


--
-- Name: DeliveryPrice DeliveryPrice_pkey; Type: CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."DeliveryPrice"
    ADD CONSTRAINT "DeliveryPrice_pkey" PRIMARY KEY (id);


--
-- Name: DiscountPlan DiscountPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."DiscountPlan"
    ADD CONSTRAINT "DiscountPlan_pkey" PRIMARY KEY (id);


--
-- Name: MarketingCampaign MarketingCampaign_pkey; Type: CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."MarketingCampaign"
    ADD CONSTRAINT "MarketingCampaign_pkey" PRIMARY KEY (id);


--
-- Name: MarketingPackage MarketingPackage_pkey; Type: CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."MarketingPackage"
    ADD CONSTRAINT "MarketingPackage_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: ProductColor ProductColor_pkey; Type: CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."ProductColor"
    ADD CONSTRAINT "ProductColor_pkey" PRIMARY KEY (id);


--
-- Name: ProductSize ProductSize_pkey; Type: CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."ProductSize"
    ADD CONSTRAINT "ProductSize_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Settlement Settlement_pkey; Type: CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."Settlement"
    ADD CONSTRAINT "Settlement_pkey" PRIMARY KEY (id);


--
-- Name: Vendor Vendor_pkey; Type: CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."Vendor"
    ADD CONSTRAINT "Vendor_pkey" PRIMARY KEY (id);


--
-- Name: Warehouse Warehouse_pkey; Type: CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."Warehouse"
    ADD CONSTRAINT "Warehouse_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: DeliveryPrice_province_key; Type: INDEX; Schema: public; Owner: electromall
--

CREATE UNIQUE INDEX "DeliveryPrice_province_key" ON public."DeliveryPrice" USING btree (province);


--
-- Name: MarketingCampaign_code_key; Type: INDEX; Schema: public; Owner: electromall
--

CREATE UNIQUE INDEX "MarketingCampaign_code_key" ON public."MarketingCampaign" USING btree (code);


--
-- Name: Order_orderNumber_key; Type: INDEX; Schema: public; Owner: electromall
--

CREATE UNIQUE INDEX "Order_orderNumber_key" ON public."Order" USING btree ("orderNumber");


--
-- Name: Product_sku_key; Type: INDEX; Schema: public; Owner: electromall
--

CREATE UNIQUE INDEX "Product_sku_key" ON public."Product" USING btree (sku);


--
-- Name: Settlement_settlementNumber_key; Type: INDEX; Schema: public; Owner: electromall
--

CREATE UNIQUE INDEX "Settlement_settlementNumber_key" ON public."Settlement" USING btree ("settlementNumber");


--
-- Name: Vendor_email_key; Type: INDEX; Schema: public; Owner: electromall
--

CREATE UNIQUE INDEX "Vendor_email_key" ON public."Vendor" USING btree (email);


--
-- Name: Vendor_reference_key; Type: INDEX; Schema: public; Owner: electromall
--

CREATE UNIQUE INDEX "Vendor_reference_key" ON public."Vendor" USING btree (reference);


--
-- Name: DiscountPlan DiscountPlan_vendorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."DiscountPlan"
    ADD CONSTRAINT "DiscountPlan_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public."Vendor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MarketingCampaign MarketingCampaign_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."MarketingCampaign"
    ADD CONSTRAINT "MarketingCampaign_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public."MarketingPackage"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MarketingCampaign MarketingCampaign_vendorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."MarketingCampaign"
    ADD CONSTRAINT "MarketingCampaign_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public."Vendor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_vendorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public."Vendor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Order Order_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_vendorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public."Vendor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductColor ProductColor_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."ProductColor"
    ADD CONSTRAINT "ProductColor_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductSize ProductSize_colorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."ProductSize"
    ADD CONSTRAINT "ProductSize_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES public."ProductColor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Product Product_vendorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public."Vendor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Settlement Settlement_vendorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."Settlement"
    ADD CONSTRAINT "Settlement_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public."Vendor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Warehouse Warehouse_vendorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: electromall
--

ALTER TABLE ONLY public."Warehouse"
    ADD CONSTRAINT "Warehouse_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public."Vendor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict emdmkPR7XyWN6DIuXZVcylBUpLrZrJPK1c1r4TE8ninkyVwAhCa6l2UHAp6N4JI

