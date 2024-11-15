INSERT INTO coin(code,description) values
('01','BOLIVARES'),
('02','DOLARES'),
('03','PESOS');

INSERT INTO public.type
(code ,description)
VALUES('01','CARROS'), ('02','MOTOS');

INSERT INTO public.prices
(price, coin_code, type_code)
VALUES( 50.45, '01', '01'),
(1, '02', '01'),
(5000, '03', '01'),
(30.7,'01', '02'),
(0.5,'02', '02'),
(3000, '03', '02');

